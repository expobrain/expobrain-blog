---
author: admin
comments: true
date: 2010-08-29 22:23:12+00:00
layout: post
slug: watch-out-for-the-data-traffic
title: Watch out for the data traffic
wordpress_id: 470
categories:
- Troubleshooting
tags:
- android
- apndroid
- data traffic
- roaming
- samsung galaxy s
---

![](http://www.expobrain.net/wp-content/uploads/2010/08/samsung-galaxy-s-international.jpg)

[](http://www.expobrain.net/wp-content/uploads/2010/08/samsung-galaxy-s-international.jpg)One month ago I bought the new Samsung Galaxy S with a UK SIM card and a flat mobile Internet plan, which it's a very good deal for who has an Android smartphone device. Unfortunately, when I come back to Italy and I switched the UK SIM with the italian one, I completely forgot to disable the data traffic and because of that I got a charge of €5 in a single day :-(

<!-- more -->I was really careless (but, man, it's so easy to forget about the data traffic if you have a flat plan) but how I can tell Android to not use the Internet traffic?

Android is capable to cut off the data traffic but only if you are roaming on another operator (in example, if I'm using my italian SIM in UK).

![](http://www.expobrain.net/wp-content/uploads/2010/08/settings1.png)
![](http://www.expobrain.net/wp-content/uploads/2010/08/settings2.png)
![](http://www.expobrain.net/wp-content/uploads/2010/08/settings3.png)

(Just FYI you can disable the the data roaming by Settings > Wireless and network > Mobile networks > Data roaming)

So I checked on Google for a solution and I found [APNdroid](http://code.google.com/p/apndroid/).

Basically all data traffic goes through an APN server so changing it to an unresolvable name just stops the Internet connections and the fees too.

![](http://www.expobrain.net/wp-content/uploads/2010/08/apndroid.png)

APNdroid do it for you in a easy way: just download the application, tick the options and press the 3G/EDGE/GPRS button on the upper half on the screen to disable the APN servers.

To enable the APN servers again just open APNdroid and press the 3G/EDGE/GPRS.

Very simple, don't you ?
