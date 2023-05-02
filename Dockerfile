FROM ruby:3.1

# RUN apt-get update -y \
#     && apt-get install -y \
#         ruby-dev \
#         rbenv \
#         build-essential

# RUN rbenv install 2.6.0

RUN gem update --system
RUN gem install jekyll bundler

WORKDIR /srv/jekyll

COPY Gemfile .
COPY Gemfile.lock .

RUN bundle install
