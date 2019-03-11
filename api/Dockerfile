FROM ruby:2.4
RUN apt-get update && apt-get -y install nodejs

RUN mkdir /postfacto-api
WORKDIR /postfacto-api

COPY . /postfacto-api

RUN bundle install

EXPOSE 3000

CMD ["sh", "-c", "bundle exec rake db:migrate && bundle exec rails server -b 0.0.0.0 -p 3000 -e production"]
