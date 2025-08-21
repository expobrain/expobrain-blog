build:
	docker build -t expobrain_blog .

serve: build
	docker run \
		--rm \
		-it \
		--volume=".:/srv/jekyll" \
		-p 4000:4000 \
		--name expobrain_blog \
		expobrain_blog \
		bundle exec jekyll serve --incremental

bundle:
	docker run \
		--rm \
		-it \
		--volume=".:/srv/jekyll" \
		-w /srv/jekyll \
		expobrain_blog \
		bundle update --bundler

minify:
	npm run minify
