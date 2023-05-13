build:
	docker build -t expobrain_blog .

serve: build
	docker run \
		--rm \
		-it \
		--volume=".:/srv/jekyll" \
		-p 4000:4000 \
		expobrain_blog \
		bundle exec jekyll serve

bundle:
	docker run \
		--rm \
		-it \
		--volume=".:/srv/jekyll" \
		-w /srv/jekyll \
		ruby \
		bundle update --bundler
