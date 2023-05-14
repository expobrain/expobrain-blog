---
categories:
- Guides
- Troubleshooting
class: post-template
comments: true
current: post
date: 2012-06-24 11:17:24+00:00
layout: post
navigation: true
slug: use-macbook-air-superdrive-with-a-macbook-pro
subclass: post
tags:
- macbook
- superdrive
title: Use MacBook Air SuperDrive with a MacBook Pro
wordpress_id: 899
---

Apple inconsistency strikes again: if you have a MacBook Air USB SuperDrive you cannot use it with a normal MacBook Pro. Why, damn Apple, why?
<!-- more -->
There's no any technical reason except for marketing and profit I suppose. Anyway, googling around a bit I found a workaround to be able to use the USB SuperDrive.
Open the file `/Library/Preferences/SystemConfiguration/com.apple.Boot.plist` as superuser and change the `Kernel Flags` value adding the parameter `mbasd=1` as shown below:

    
    
    
    
    <plist version="1.0">
    <dict>
    	<key>Kernel</key>
    	<string>mach_kernel</string>
    	<key>Kernel Flags</key>
    	<string>mbasd=1</string>
    </dict>
    </plist>
    


Save the changes and reboot the system, now the SuperDrive will be recognised and can be used.