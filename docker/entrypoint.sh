#!/bin/sh
set -eu

UNYOHUB_ROOT="${UNYOHUB_ROOT:-/var/www/html}"
DEFAULT_CONFIG_DIR="/opt/unyohub/config-defaults"
CONFIG_DIR="$UNYOHUB_ROOT/config"
DATA_DIR="$UNYOHUB_ROOT/data"
COMMON_DBS_DIR="$UNYOHUB_ROOT/common_dbs"
LIBS_DATA_DIR="$UNYOHUB_ROOT/libs_data"
PASSWORD_FILE="$LIBS_DATA_DIR/.initial_admin_password"
ADMIN_USER="${UNYOHUB_ADMIN_USER:-unyohub_admin}"

mkdir -p "$CONFIG_DIR" "$DATA_DIR" "$COMMON_DBS_DIR" "$LIBS_DATA_DIR"

if [ -z "$(ls -A "$CONFIG_DIR" 2>/dev/null)" ]; then
    cp -a "$DEFAULT_CONFIG_DIR"/. "$CONFIG_DIR"/
fi

chown -R www-data:www-data "$CONFIG_DIR" "$DATA_DIR" "$COMMON_DBS_DIR" "$LIBS_DATA_DIR"

if ! setup_output=$(su -s /bin/sh www-data -c "python3 $UNYOHUB_ROOT/commands/unyohub setup-libs $ADMIN_USER" 2>&1); then
    printf '%s\n' "$setup_output" >&2
    exit 1
fi

printf '%s\n' "$setup_output"

if [ ! -f "$PASSWORD_FILE" ]; then
    admin_password=$(printf '%s\n' "$setup_output" | sed -n 's/^パスワード: //p' | tail -n 1)
    if [ -n "$admin_password" ]; then
        printf '%s\n' "$admin_password" > "$PASSWORD_FILE"
        chown www-data:www-data "$PASSWORD_FILE"
        chmod 600 "$PASSWORD_FILE"
        printf 'Initial admin password saved to %s\n' "$PASSWORD_FILE"
    fi
fi

if ! init_output=$(su -s /bin/sh www-data -c "python3 $UNYOHUB_ROOT/commands/unyohub init-common-dbs" 2>&1); then
    printf '%s\n' "$init_output" >&2
    exit 1
fi

printf '%s\n' "$init_output"

php-fpm -D
exec nginx -g 'daemon off;'

