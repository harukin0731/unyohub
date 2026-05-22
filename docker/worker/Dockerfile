FROM php:8.3-cli-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    UNYOHUB_ROOT=/var/www/html \
    UNYOHUB_ADMIN_USER=unyohub_admin \
    PATH=/var/www/html/commands:$PATH

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libwebp-dev \
        python3 \
        sqlite3 \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" gd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY unyohub/ /var/www/html/

RUN mkdir -p /opt/unyohub \
    && cp -a /var/www/html/config /opt/unyohub/config-defaults

COPY docker/entrypoint.sh /usr/local/bin/unyohub-init
COPY docker/worker/entrypoint.sh /usr/local/bin/unyohub-worker

VOLUME ["/var/www/html/config", "/var/www/html/data", "/var/www/html/common_dbs", "/var/www/html/libs_data"]

