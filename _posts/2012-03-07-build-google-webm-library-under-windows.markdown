---
author: admin
categories: [Troubleshooting]
comments: true
date: 2012-03-07 19:03:28
image: {url: /media/2012/03/webm.png}
layout: post
slug: build-google-webm-library-under-windows
tags: [visual studio 2008, webm]
title: Build Google WebM library under Windows
wordpress_id: 781
---

Google [WebM](http://www.webmproject.org/) is the new lossy encoder for images (and videos) which promise a better compression than the old and well known JPEG format. The source code is available anche can be build on Linux, Mac OS X and Windows as well.

Anyway, on Windows if you follow the instructions in the README you'll ended up with this error message:

    
    
    cwebp.obj : error LNK2019: unresolved external symbol _GUID_WICPixelFormat32bppRGBA referenced in function _ReadPictureWithWIC
    output\release-static\x86\bin\cwebp.exe : fatal error LNK1120: 1 unresolved externalsNMAKE : fatal error U1077: '"C:\Program Files\Microsoft Visual Studio 9.0\VC\BIN\link.exe"' : return code '0x460'
    Stop.
    


<!-- more -->That's happen because Windows SDK 7.0 is missing on your system.

Just download the web installer from [here](http://www.microsoft.com/download/en/details.aspx?id=3138), take a cup of the during the long install procedure and at the end build WebM again, now it will work without problems.
