FROM node:20 AS builder 

WORKDIR /builder

COPY . /builder

RUN npm install \
    && npm run build 


FROM lipanski/docker-static-website:2.4.0

WORKDIR /home/static

COPY  --from=builder /builder/dist/apps/web/  /home/static

EXPOSE 80

CMD ["/busybox-httpd", "-f", "-v", "-p", "80", "-c", "httpd.conf"]