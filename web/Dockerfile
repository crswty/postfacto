FROM node:8

RUN mkdir /postfacto-web
WORKDIR /postfacto-web

COPY ./ /postfacto-web

RUN npm install


EXPOSE 3000

ENTRYPOINT /postfacto-web/docker-entrypoint.sh
