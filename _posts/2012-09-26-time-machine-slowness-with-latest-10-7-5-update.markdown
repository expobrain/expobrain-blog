---
author: admin
comments: true
date: 2012-09-26 22:26:27+00:00
layout: post
slug: time-machine-slowness-with-latest-10-7-5-update
title: Time Machine slowness with latest 10.7.5 update
wordpress_id: 909
categories:
- Troubleshooting
tags:
- 10.7.5
- lion
- mac os x
- spotlight
- time machine
---

**UPDATE**: Apple released a [OS X Lion 10.7.5 Supplemental Update](http://support.apple.com/kb/DL1599) which fix the Time Machine slowness bug

* * *


After the installation of the latest 10.7.5 Lion update the Time Machine service had started to take ages even to make an easy backup. And when I'm talking about ages, I'm not joking:
![](http://www.expobrain.net/wp-content/uploads/2012/09/A3tGgxcCYAAaWY3.png)
<!-- more -->
Apparently a lot of complains relative to the Time Machine slowness had raised after Apple released the 10.7.5 update for Lion and it's caused by the Spotlight daemon.
Because we cannot live without a regular backup and there isn't any news about a fix from Apple yet, the only current available solution is to disable the Spotlight daemon by typing at the command line

    
    
    sudo launchctl unload -w /System/Library/LaunchDaemons/com.apple.metadata.mds.plist
    


This will disable Spotlight for all your drives (so it'll not possible to perform searches on your files) but Time Machine will works as normal speed.
Anyway, if you need for any reason to enable again Spotlight, just type:

    
    
    sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.metadata.mds.plist
    


And wait forever for the indexing to complete :-)
