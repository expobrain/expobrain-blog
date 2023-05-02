FROM ruby:3.1

RUN gem update --system
RUN gem install jekyll bundler

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install
