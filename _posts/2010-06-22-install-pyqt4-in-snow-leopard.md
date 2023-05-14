---
categories:
- Guides
class: post-template
comments: true
current: post
date: 2010-06-22 19:41:12+00:00
layout: post
navigation: true
slug: install-pyqt4-in-snow-leopard
subclass: post
tags:
- mac os x
- pyqt
- python
- qt
- snow leopard
title: Install PyQt4 in Snow Leopard
wordpress_id: 307
---

New country, new life style, new spoken language and new GUI toolkit ! After 5 years of wxPython toolkit now it's the time to move to PyQt4. Let's see how install this GUI toolkit under Mac OS X Snow Leopard.

<!-- more -->

First, donwload th QT4 SDK from QT official site, from [here](http://qt.nokia.com/products/) you can choose between LGPL and Commercial version. If you want just the LGPL version you can go directly [here](http://qt.nokia.com/downloads/downloads#lgpl). The .dmg it's about 500Mb so if you have a slow connection it will take some minutes.

In the meanwhile donwload the SIP and PyQt4 sources from the Riverbank website, [here](http://www.riverbankcomputing.co.uk/software/sip/download) for SIP package and [here](http://www.riverbankcomputing.co.uk/software/pyqt/download) for PyQt4 package. These files are small (about 10Mb) so they will take one minute or two.

When the download of the Qt4 package is done, open the .dmg file and install the package as usual. Extract the SIP and PyQt4 .tar.gz files as well.

Starting from the installation of SIP package, open the Terminal, move into the folder where the SIP's sources reside and type:




    $ export MACOSX_DEPLOYMENT_TARGET=10.6
    $ python configure.py -n  --arch=i386 -s MacOSX10.6.sdk
    $ make
    $ sudo make install



Now move into the PyQt4 folder and type:




    $ export QTDIR=/Developer/Applications/Qt
    $ python configure.py --use-arch=i386
    $ make
    $ sudo make install



After the long compilation and installation phase, just for testing if the PyQt4 package is installed correctly, from the Terminal type:




    $ python
    Python 2.6.5 (r265:79359, Mar 24 2010, 01:32:55)
    [GCC 4.0.1 (Apple Inc. build 5493)] on darwin
    Type "help", "copyright", "credits" or "license" for more information.
    >>> import PyQt4
    >>>



No errors after `import` command means the PyQt4 package is installed.

And now good work with PyQt !