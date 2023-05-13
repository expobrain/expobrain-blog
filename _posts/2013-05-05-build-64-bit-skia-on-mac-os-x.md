---
categories:
- Various things
class: post-template
comments: true
cover: media/32-bit_64-bit.jpg
current: post
date: 2013-05-05 19:14:24
layout: post
navigation: true
slug: build-64-bit-skia-on-mac-os-x
subclass: post
tags:
- 64-bit
- mac os x
- skia
title: Build 64-bit Skia on Mac OS X
wordpress_id: 1263
---

It takes me a while to discover how to do it, so I'll leave this post as a note to myself and to anyone which will have the same need.
<!-- more -->
By default [Skia](https://code.google.com/p/skia/) will be build as 32-bit static library under Mac OS X but for who needs to have it as a 64-bit library, here the steps:

    export GYP_DEFINES="skia_arch_width=64"
    ./gyp_skia
    make BUILDTYPE=Release

If you need a debug release just change the `BUILDTYPE` options from `Release` to `Debug`
