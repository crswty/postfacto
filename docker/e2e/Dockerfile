FROM ruby:2.6.3-stretch
MAINTAINER pivotal

RUN apt-get update -qq

RUN apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs

RUN apt-get install -y chromedriver
RUN apt-get install chromium

RUN gem install bundler

COPY ./e2e /e2e
COPY ./api /api

RUN cd /e2e && bundle install
RUN cd /api && bundle install

ENV BASE_WEB_URL http://host.docker.internal:3000
ENV BASE_ADMIN_URL http://host.docker.internal:4000/admin

COPY ./docker/e2e/entrypoint.sh /
ENTRYPOINT ["./entrypoint.sh"]
