---
author: expobrain
comments: true
date: 2016-02-27
image: {url: /media/docker-logo.png}
layout: post
slug: cross-compile-python-packages-with-docker
tags: [docker, python, compilation, pip, wheel]
title: Cross-compile Python packages with Docker
---

Cross-compiling is the action of building a package or a binary for a different system thatn the current used for the compilation process; for example compiling ARM binaries on a x86 architecture. In this post I'm going to cross-compile Python packages for a specific Linux distribution using Docker as a virtualisation layer.


## Introduction


One day I found myself in need to install Python packages on a production's server. The server in question didn't have any compiler nor development packages installed so it wasn't possible to install by [pip](https://pip.pypa.io/en/stable/) packages like [Scipy](http://www.scipy.org/) which requires to be compiled on installation; also there are no precompiled [wheel](https://wheel.readthedocs.org/en/latest/)s for the specific platform as well.

The only solution was to replicate the server somewhere, compile the package into a `.whl` and deploy it into the target server. Using [Docker](https://www.docker.com) simplifies this process by providing a deterministic environment and the ability to threat the Docker container as a command line binary.


## Requirements

To be able to follow this post the only requirement is to have `Docker` installed and running on your machine. I'm using Docker 1.10 but any version will do it.


## Dockerfile

Lets start from the [Dockerfile](https://docs.docker.com/engine/reference/builder/), we need:

- to base our machine on the same system we want to target
- a compiler
- a Python interpreter and its development packages
- libraries linked by the Python's package we are gongi to compile
- a recent version of `pip`

Here all these requirements put together:

{% highlight dockerfile %}
FROM mstormo/suse:11.4

# Updating the system
RUN zypper --non-interactive --gpg-auto-import-keys refresh
RUN zypper --non-interactive install git gcc-c++

# Install libs to build Numpy/Scipy/Pandas
RUN zypper --non-interactive install gcc-fortran
RUN zypper --non-interactive install blas lapack

# Installing Python
RUN zypper --non-interactive install python python-devel

# Set working dir
WORKDIR /usr/src

# Upgrade pip with wheel support
ADD https://bootstrap.pypa.io/get-pip.py ./
RUN python ./get-pip.py
{% endhighlight %}

This is a classic `Dockerfile` from the book, the interesting part is at the end of it where we download and install the latest copy of `pip` straight from the official repository.

Before proceeding further lets test the build of our image:

{% highlight bash %}
$ docker build -t cross-compile .
....
....
.. some terminal output later ..
....
Successfully built d7f8b3f12d7c
{% endhighlight %}

Good, no errors, next step is to customise this image for cross-compile our packages.


## Setup of the command-line

The [`ENTRYPOINT`](https://docs.docker.com/engine/reference/builder/#entrypoint) allows you to execute the container like a command like binary, in fact it allow us to pass arbitrary arguments to the container when executing `docker run`.

What we want is a container with can write the compiled package into our local directory and accept the package name and version as a parameter, here is how we are going to run our container:

{% highlight bash %}
$ docker run \
    --rm \
    -v ./target:/usr/src/target \
    cross-compile "package_name==x.y.z"
{% endhighlight %}

By decomposing this command we have:

- `--rm` tells Docker to remove the container as soon as the process inside it exits, this will save disk space and live the container's list clean from stopped instances of our image;
- `-v <local_path>:<remote_path>` mounts the `local_path` as `remote_path` inside the container, it's where our  container will output the `wheel` package;
- `-w <working_dir` sets the current working dir in the container
- the last two arguments are the name of image and the name of the package to be compiled, the latter will be passed to the shell script defined by `ENTRYPOINT`;

We need now an `entrypoint.sh`, a shell script called by Docker during the instantiation of the container, which receive the package to be build as a first argument:

{% highlight bash %}
#!/bin/bash -e

WHEEL_DIR=/usr/src/target

pip wheel --wheel-dir=$WHEEL_DIR $@
{% endhighlight %}

Thi is a very simple which calls `pip wheel` which in turn will compile your package and generate the `.whl` file into `WHEEL_DIR`.

Now we update the `Dockerfile` by adding our `entrypoint.sh` (I'll show just the extra lines):

{% highlight dockerfile %}
# Define mount point and set it as working dir
VOLUME /usr/src/target
WORKDIR /usr/src/target

# Copy files
COPY ./entrypoint.sh /

# Start building process
ENTRYPOINT ["/entrypoint.sh"]
{% endhighlight %}

That's all, lets build again the image after this changes:

{% highlight bash %}
$ docker build -t cross-compile .
{% endhighlight %}

and try to build a simple `.whl`:

{% highlight bash %}
$ docker run --rm cross-compile pip==8.0.2
{% endhighlight %}

Done. We have now a `pip-8.0.2-py2.py3-none-any.whl` file in our `target` directory ready to be installed on the target server.


## Wrapping up

We are come so far to have a nice image replicating our target environment plus a build environment and a container which builds Python's `wheel`s at runtime, however we still need to type a lot and we are lazy, what about simplify our process by wrapping the creation of the image and the execution of the container into a single shell script called `crosscompile`:

{% highlight bash %}
#!/bin/bash -e

cd $(dirname $0)

docker build -t cross-compile .
docker run --rm -v ./target:/usr/src/target cross-compile "$@"
{% endhighlight %}

Now lets test it again by compiling our original Python dependancy, `scipy`:

{% highlight bash %}
$ ./crosscompile scipy==0.17.0
{% endhighlight %}

and after some time here we have the `scipy-0.17.0-cp27-cp27mu-linux_x86_64.whl` file ready for deploy.

And what about compiling multiple packages at once? Well, that's already supported, just pass the list of packages to be build in order on the command line:

{% highlight bash %}
$ ./crosscompile scipy==0.17.0 numpy==1.10.4
{% endhighlight %}


## Conclusion

Thanks to Docker it's possible to startup a very lightweight virtual environment which allow us to crosso-compile a Python package regardeless of the host environment. Also it allow us to expose a command line tool which can be easily integrated into CI scripts for automatic deployement.

All the code in this post is available on [GitHub](https://github.com/expobrain/cross-compile-docker) ready to be forked.
