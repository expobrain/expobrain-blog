---
author: admin
comments: true
date: 2012-03-07 22:43:49+00:00
layout: post
slug: python-webm-is-now-public
title: Python-WebM is now public
wordpress_id: 795
categories:
- Main
tags:
- ctypes
- python-webm
- webm
---

So, my little Python-WebM project is now public (it was already public but not publicised :-) ) and anyone can start reading and writing the Google WebM format for images.

<!-- more -->The usage for the encoding if fairly simple:

    
    
    from webm import encode
    from webm.handlers import BitmapHandler
    
    image_data = file("vancouver2.png", "rb").read()
    image_hnd = BitmapHandler(image_data, BitmapHandler.RGB, 644, 484, 644*484*3)
    image_webp = encode.EncodeRGB(image_hnd)
    


This simple example encode a bytearray containing the raw bitmap in RGB format into a WebM image.

And the other way around:

    
    
    from webm import decode
    
    image_webp = file("vancouver2.webp", "rb").read()
    image_hnd = decode.DencodeRGB(image_wepb)
    


Which decode a WebP image into a raw bitmap in RGB format.

Anyway, have a look at the project's [home page](http://code.google.com/p/python-webm/) and at the source code to discover all the other available options.
