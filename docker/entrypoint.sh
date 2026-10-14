#!/bin/sh
set -eu
cd /var/www/unyohub
if [ "$(id -u)" = 0 ]; then
    for dir in config data libs_data common_dbs; do
        mkdir -p "$dir"
        chown www-data:www-data "$dir"
    done
    if [ ! -f config/main.ini ]; then
        cp -a /opt/unyohub-default-config/. config/
        sed -i 's/^email_enabled = true/email_enabled = false/' config/main.ini
        sed -i 's/^require_email_address = true/require_email_address = false/' config/main.ini
        chown -R www-data:www-data config
    fi
    if [ -d /backups ]; then
        chown www-data:www-data /backups
    fi
    if [ "${SMTP_HOST:-}" != "" ]; then
        umask 077
        cat > /tmp/unyohub-msmtp.conf <<EOF
account default
host ${SMTP_HOST}
port ${SMTP_PORT:-587}
tls ${SMTP_TLS:-on}
tls_starttls ${SMTP_STARTTLS:-on}
tls_trust_file /etc/ssl/certs/ca-certificates.crt
from ${SMTP_FROM:?SMTP_FROM is required}
EOF
        if [ "${SMTP_USER:-}" != "" ]; then
            printf 'auth on\nuser %s\npassword %s\n' "$SMTP_USER" "${SMTP_PASSWORD:?SMTP_PASSWORD is required}" >> /tmp/unyohub-msmtp.conf
        else
            printf 'auth off\n' >> /tmp/unyohub-msmtp.conf
        fi
        chown www-data:www-data /tmp/unyohub-msmtp.conf
    fi
    if [ "${1:-}" = php-fpm ]; then
        exec docker-php-entrypoint "$@"
    fi
    exec gosu www-data "$@"
fi
exec "$@"
