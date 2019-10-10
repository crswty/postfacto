FROM ruby:2.6.3-stretch
MAINTAINER pivotal

RUN apt-get update -qq

RUN apt-get install -y curl

RUN gem install bundler

COPY ./e2e /postfacto-e2e
COPY ./docker/e2e/entrypoint.sh /postfacto-e2e

WORKDIR /postfacto-e2e

RUN bundle install

ENV BASE_WEB_URL http://host.docker.internal:3000
ENV BASE_ADMIN_URL http://host.docker.internal:4000/admin

RUN apt-get install -y chromedriver
RUN apt-get install chromium

ENTRYPOINT ["./entrypoint.sh"]
