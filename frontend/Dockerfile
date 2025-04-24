FROM httpd:2.4-alpine

RUN apk update && apk add --no-cache \
    bash

COPY dist/ /usr/local/apache2/htdocs/

RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf

RUN sed -i '/<Directory "\/usr\/local\/apache2\/htdocs">/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /usr/local/apache2/conf/httpd.conf

WORKDIR /usr/local/apache2/htdocs/

EXPOSE 80

CMD ["httpd-foreground"] 