---
categories:
- Guides
class: post-template
comments: true
current: post
date: 2011-03-06 18:01:08+00:00
layout: post
navigation: true
slug: compile-pyside-under-mac-os-x
subclass: post
tags:
- 64-bit
- git
- mac os x
- pyside
- python
- qt
- xcode
title: Compile PySide under Mac OS X
wordpress_id: 605
---

How to setup and compile the latest source code of [PySide](http://www.pyside.org) under Mac OS X
<!-- more -->

### Prerequisites

Before starting to download and compile, PySide sources you must have some things installed on your system:

* [XCode](http://developer.apple.com/technologies/tools/xcode.html)

* [Python](http://python.org/download/) for Mac OS X. In this how-to I will use the 64-bit version

* [Qt](http://qt.nokia.com/downloads) toolkit

* [Git](http://git-scm.com/)

### The primer

PySide has a useful collections of scripts to be used as a primer to compile the whole project. Start from cloning the scripts folder:

    git clone git://gitorious.org/pyside/buildscripts.git pyside-sources

Now move inside the new `pyside-sources` folder and clone all the PySide sub-projects:

    cd pyside_sources
    git clone git://gitorious.org/pyside/apiextractor.git
    git clone git://gitorious.org/pyside/generatorrunner.git
    git clone git://gitorious.org/pyside/shiboken.git
    git clone git://gitorious.org/pyside/pyside.git
    git clone git://gitorious.org/pyside/pyside-tools.git

If you want to leave all the source code folders up to date with the repository head you can copy&paste; this script, saving it as `pull_all.sh` and making it executable:

    #!/usr/bin/env bash

    alldirs=("apiextractor" "generatorrunner" "shiboken" "pyside" "pyside-tools")

    for d in "${alldirs[@]}" ; do
        cd $d
        git pull
        cd ..
    done

### Install dependencies

To install the PySide project dependencies under Mac OS X you have two options.
The first one is to use the `dependencies.osx.sh` script which needs [Brew](https://github.com/mxcl/homebrew/wiki/installation) to be installed in the system; in this case just run this command to automatically install all you need:

    ./dependencies.osx.sh

The other option is to use [MacPorts](http://www.macports.org/) to install the PySide needs:

    sudo port -v install libxml2
    sudo port -v install libxslt
    sudo port -v install cmake

Anyway, if you are going to compile PySide against Python 2.7 run `cmake --help` and check if you are using the 2.8.4+ version of CMake which is the first release which can detect the 2.7 version of Python.

### Setup environment variables

Open the `environment.sh` file and setup the path of your Python installation as the `PYSIDESANDBOXPATH` environment variable, also change all references from Python 2.6 to 2.7.

### Compile source code

I did a little changes in the standard PySide build script to match my needs. In details, I commented the `rm -rf "$d/build"` and added `sudo` to the `make install` command. The script looks like that at the end of my changes:

    #!/usr/bin/env bash

    alldirs=("apiextractor" "generatorrunner" "shiboken" "pyside" "pyside-tools")

    if [ $# == 0 ] ; then
        dirs=("${alldirs[@]}")
    else
        dirs=("$@")
    fi

    for d in "${dirs[@]}" ; do
        mkdir -p "$d/build"
        (
            source environment.sh

            if [ "`uname -s`" == "Darwin" ]; then
                # When running on Mac OS X, we need to specify the
                # Qt include dir for the header files to be found.
                echo "$0: Mac OS X detected (uname -s gave 'Darwin')."
                PYSIDE_BS_CMAKE_FLAGS="-DALTERNATIVE_QT_INCLUDE_DIR=/Library/Frameworks/"
            else
                # On Non-OS X builds, we enable this to fix a gcc bug
                PYSIDE_BS_CMAKE_FLAGS="-DENABLE_GCC_OPTIMIZATION=On"
            fi

            cd "$d/build"
            cmake .. -DCMAKE_INSTALL_PREFIX=$PYSIDESANDBOXPATH \
                     -DCMAKE_BUILD_TYPE=$BUILD_TYPE \
                     -DENABLE_ICECC=0 \
                     $PYSIDE_BS_CMAKE_FLAGS \
                && make && sudo make install || exit 1
        ) || exit 1

        # If you are experiencing problems on OS X, uncomment the
        # following line to update the run-time linker cache:
        # sudo ldconfig
    done

Now you can run it and take a long long break :-)

### The end

Now you are ready to import the PySide module. Add the Python `lib` folder to the system library path:

    export DYLD_LIBRARY_PATH=/Library/Frameworks/Python.framework/Versions/2.7/lib

Now open the Python console end try to import the PySize module:

    $ python

    Python 2.7.1 (r271:86882M, Nov 30 2010, 10:35:34)
    [GCC 4.2.1 (Apple Inc. build 5664)] on darwin
    Type "help", "copyright", "credits" or "license" for more information.
    >>> import PySide
    >>> PySide.__version__
    '1.0.1'
