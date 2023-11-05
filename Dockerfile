# docker build -t ketang-manage .
# docker run -d -it --name ketang-manage -p 8080:80 ketang-manage
# docker ps -a
# docker images
# docker attach ketang-manage

FROM nginx

ENV TIMEZONE=${timezone:-"Asia/Shanghai"}

WORKDIR /var/www/html

COPY ./dist /var/www/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf 
RUN echo "${TIMEZONE}" > /etc/timezone
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
