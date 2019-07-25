#!/bin/ash
set -e

bundle exec rake db:migrate
bundle exec rails assets:precompile
bundle exec rails server -b 0.0.0.0 -p 3000 &

nginx -p /postfacto -c nginx.conf -g  "daemon off;"
