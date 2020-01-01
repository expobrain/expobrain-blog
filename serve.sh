#!/bin/sh -e

docker build -t expobrain_blog .
docker run \
  --rm \
  -it \
  --volume="$PWD:/srv/jekyll" \
  -p 4000:4000 \
  expobrain_blog \
  bundle exec jekyll serve
