FROM nginx:1.27-alpine

WORKDIR /var/www/html

COPY unyohub/ /var/www/html/
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

