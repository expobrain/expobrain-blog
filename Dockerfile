FROM ruby:3.2

RUN gem update --system
RUN gem install jekyll bundler

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install
