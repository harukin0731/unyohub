FROM php:8.3-fpm-bookworm

ENV DEBIAN_FRONTEND=noninteractive \
    UNYOHUB_ROOT=/var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libjpeg62-turbo-dev \
        libpng-dev \
        libwebp-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
    && docker-php-ext-install -j"$(nproc)" gd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY unyohub/ /var/www/html/

EXPOSE 9000

VOLUME ["/var/www/html/config", "/var/www/html/data", "/var/www/html/common_dbs", "/var/www/html/libs_data"]
