FROM php:8.3-fpm-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    UNYOHUB_ROOT=/var/www/html \
    UNYOHUB_ADMIN_USER=unyohub_admin \
    PATH=/var/www/html/commands:$PATH

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libwebp-dev \
        nginx \
        python3 \
        sqlite3 \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" gd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY unyohub/ /var/www/html/

RUN mkdir -p /opt/unyohub \
    && cp -a /var/www/html/config /opt/unyohub/config-defaults \
    && rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY docker/entrypoint.sh /usr/local/bin/unyohub-entrypoint

EXPOSE 80

VOLUME ["/var/www/html/config", "/var/www/html/data", "/var/www/html/common_dbs", "/var/www/html/libs_data"]

ENTRYPOINT ["sh", "/usr/local/bin/unyohub-entrypoint"]
