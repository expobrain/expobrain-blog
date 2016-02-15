---
author: admin
comments: true
date: 2010-07-24 17:35:17+00:00
layout: post
slug: new-stable-version-for-wxscheduler-1-3-0
title: New stable version for wxScheduler 1.3.0
wordpress_id: 372
categories:
- Main
tags:
- google code
- jerome laheurte
- open source
- project
- python
- wxpython
- wxscheduler
---

![](http://www.expobrain.net/wp-content/uploads/2010/01/code_logo.png)

Thanks to the work from Jérôme Laheurte, a new stable release of wxScheduler is available in Google Code project website.

<!-- more -->Here the changes from the 1.2.4 release:

- Schedule can have a font attribute and foreground color
- Fix drawing problems under Linux and Windows and more drawing optimizations
- Workaround for a wxPython bug: march has 31 days
- Small fix in sorting
- Fix invalid date bug
- Fix double-click outside schedule
- Fix printing.
- Add Freeze/Thaw methods to wxScheduler
- Support for multiple icons
- Highlight whole current day/month
- Heavy refactoring: better handling of scrollbars, support for variable-height views and all drawing code moved to wxDrawer.wxFancyDrawer for eye candy.
- Add right click event
- Horizontal view for daily, weekly and montly modes
- Fixed demo and add some more events

The latest tarball is available [here](http://code.google.com/p/wxscheduler/).
