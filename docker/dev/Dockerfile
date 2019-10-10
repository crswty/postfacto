FROM ruby:2.6.3-stretch
MAINTAINER pivotal

RUN apt-get update -qq

RUN apt-get install -y curl
RUN apt-get install -y python

RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y tmux
RUN apt-get install -y zip
RUN apt-get install -y less
RUN apt-get install -y locales-all

RUN gem install bundler

COPY . /postfacto
RUN cd /postfacto && ./deps.sh
RUN rm -rf /postfacto

WORKDIR /postfacto

CMD ["/bin/bash"]

