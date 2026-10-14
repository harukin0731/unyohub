FROM php:8.4-fpm-bookworm AS app
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 python3-venv gosu msmtp ca-certificates tzdata \
    libsqlite3-dev libonig-dev libfreetype6-dev libjpeg62-turbo-dev libpng-dev libwebp-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" gd \
    && if ! php -r 'exit(extension_loaded("mbstring") ? 0 : 1);'; then docker-php-ext-install -j"$(nproc)" mbstring; fi \
    && if ! php -r 'exit(extension_loaded("Zend OPcache") ? 0 : 1);'; then docker-php-ext-install -j"$(nproc)" opcache; fi \
    && php -r 'foreach (["sqlite3", "pdo_sqlite", "mbstring", "gd", "Zend OPcache"] as $ext) { if (!extension_loaded($ext)) { fwrite(STDERR, "Missing extension: $ext\n"); exit(1); } }' \
    && python3 -m venv /opt/python \
    && /opt/python/bin/pip install --no-cache-dir gtfs-realtime-bindings==1.0.0 \
    && rm -rf /var/lib/apt/lists/*
ENV TZ=Asia/Tokyo PATH="/opt/python/bin:/var/www/unyohub/commands:${PATH}"
WORKDIR /var/www/unyohub
COPY unyohub/ ./
RUN mv config /opt/unyohub-default-config && mkdir config data libs_data common_dbs \
    && chmod +x commands/unyohub
COPY docker/php.ini /usr/local/etc/php/conf.d/unyohub.ini
COPY docker/entrypoint.sh docker/mail-send.sh /usr/local/bin/
COPY docker/manage.py docker/scheduler.py docker/test_smoke.py /opt/unyohub/
RUN chmod +x /usr/local/bin/entrypoint.sh /usr/local/bin/mail-send.sh
ENTRYPOINT ["entrypoint.sh"]
CMD ["php-fpm"]

FROM nginx:1.28-bookworm AS web
COPY unyohub/ /var/www/unyohub/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
