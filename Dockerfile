FROM debian:10-slim

RUN apt-get update -y \
    && apt-get install -y \
        ruby-dev \
        rbenv \
        build-essential

RUN rbenv install 2.4.1

RUN gem install jekyll bundler

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install
