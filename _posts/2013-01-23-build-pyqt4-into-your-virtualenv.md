---
categories:
- Guides
class: post-template
comments: true
current: post
date: 2013-01-23 21:10:43+00:00
layout: post
navigation: true
slug: build-pyqt4-into-your-virtualenv
subclass: post
tags:
- linux
- mac os x
- pyqt
- python
- qt
- virtualenv
title: 'Build PyQt4 into your virtualenv '
wordpress_id: 1202
---

Here I'll show the steps to build and install PyQt4 inside a virtualenv.

These instructions are related to Mac OS X and Linux systems only.

<!-- more -->

### SIP

First build and install the SIP binaries:

    cd sip
    python configure.py --incdir=${VIRTUAL_ENV}/include
    make -j2
    make install

The `${VIRTUAL_ENV}` environmental variable will automatically point to the path of your virtualenv installation.

The `-j` option tells `make` to spawn up to 2 processes to do the job. This number should be equal to the number of physical CPU cores available on your machine; `-j` option can be omitted, in this case only one core will be used.

### PyQt4

Now it's time to build the PyQt4 bindings (it will take a little time):

    cd PyQt4
    python configure.py [-q <qmake_path>]
    make -j2
    make install

The `<qmake_path>` is the full path of the `qmake` program of the Qt toolkit. Passing the `-q` parameter is optional and useful only if the `configure.py` script cannot find the Qt library automatically.

### The End

Last step before trying to load the bindings; exporting the path of the virtualenv's dynamic libraries:

    export DYLD_LIBRARY_PATH=${VIRTUAL_ENV}/lib

<blockquote>Can be a good idea to export the `DYLD_LIBRARY_PATH` automatically when entering your virtualenv</blockquote>

To finally test if the build and installation of SIP an PyQt4 are successful start the virtualenv's Python interpreter and type:

    >>> import sip; print sip.SIP_VERSION_STR
    4.14.2
    >>> from PyQt4 import QtCore; print QtCore.PYQT_VERSION_STR
    4.9.6

If no error or warning is raised and the release numbers of SIP and PyQt4 are displayed your installation is successful.
