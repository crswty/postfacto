#!/bin/bash


pushd "api" >/dev/null
  echo 'Dropping test database...'
  bundle exec rake db:drop
  echo 'Migrating test database...'
  bundle exec rake db:create db:migrate db:test:prepare
  echo 'Seeding test data...'
  bundle exec rake db:seed
popd >/dev/null


cd /e2e
bundle exec rspec

