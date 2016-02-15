---
author: admin
comments: true
date: 2010-07-10 22:34:07+00:00
layout: post
slug: compile-pyqt4-with-python-2-7-64-bit-under-mac-os-x
title: Compile PyQt4 with Python 2.7 64-bit under Mac OS X
wordpress_id: 328
categories:
- Guides
tags:
- '2.7'
- 64-bit
- mac os x
- nokia
- pyqt
- python
- qt
- snow leopard
---

![]({{ site.url }}/assets/2010/07/extra64bit.png)

A couple fo days ago Python 2.7 was release as a first stable release. Looking at the Mac OS X ports I found the new official 64-bit release and I installed it. But now the Qt Python bindings stops working because they are compiled as 32-bit binaries.

<!-- more -->The procedure to compile the 64-bit version of the Qt bindings is really simple and it's no much different than the procedure I describe in the post Install [PyQt4 in Snow Leopard]({{ site.url }}/2010/06/22/install-pyqt4-in-snow-leopard), the only difference is the package you must download from Qt official website and the architecture to use when run the configure.py scrit before make.

So, lets start with the download and install Qt for Cocoa which you can found [here](http://qt.nokia.com/downloads/qt-for-open-source-cpp-development-on-mac-os-x). Before install them I removed manually the content of the folder `/Developer/Application/Qt` because the 32-bit version of Qt was present in my system, just to be sure there will be no conflicts.

Now just follow same the instructions described here but change the `i386` with `x86_64`.

Done, nothing else to do.
