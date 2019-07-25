FROM ruby:2.6.3-alpine
MAINTAINER pivotal

RUN apk update && apk add --no-cache build-base mariadb-dev postgresql-dev nodejs nginx tzdata

COPY assets postfacto
COPY nginx.conf postfacto
COPY run.sh postfacto

RUN mkdir /postfacto/logs
RUN mkdir /run/nginx
RUN chmod 766 /postfacto/logs

WORKDIR /postfacto/api

ENV RAILS_ENV production
RUN ls
RUN gem install bundler
RUN bundle install --without development test
RUN chmod 766 /postfacto/run.sh

CMD ["/postfacto/run.sh"]

EXPOSE 80
