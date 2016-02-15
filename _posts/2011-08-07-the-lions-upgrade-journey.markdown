---
author: admin
comments: true
date: 2011-08-07 14:35:58+00:00
layout: post
slug: the-lions-upgrade-journey
title: The Lion's upgrade journey
wordpress_id: 685
categories:
- Guides
- Troubleshooting
tags:
- lion
- mac os x
- snow leopard
- time machine
- transmac
- upgrade
---

With the new Mac OS X Lion out since a week I decided to upgrade my Mac Book Pro but at that time I didn't know it will be a little long journey.

<!-- more -->


### Prologue


As a good Apple customer I purchased a my copy of Mac OS X Lion from the App Store and waited for the app to be downloaded on my hard drive (this took a couple of hours because the download speed was limited at 300Kb/s by Apple servers).

When the download was done I did a Time Machine backup of the system (always do a backup of the system before install big OS updates or upgrade to the next OS version) and launched the Lion app. And that was the time where my journey started.

After the first reboot Lion complains about the integrity of my hard drive file system suggesting me to boot from the Snow Leopard DVD-ROM and use Disk Utility to repair the damage.


### The precious Lion app


Because we are carefully people it's a good thing to copy the Lion app into an external hard drive to avoid to download it again wasting another hours waiting for the download to finish.

The Lion installer app can be found into the _Applications_ folder as _Install Mac OS X Lion_. Because it's a Mac application (Mac application are special folders with .app extension) I copied it into the external hard drive formatted with HFS+ (in my case the same drive I use as the Time Machine backup)

Later I discovered that saving a copy of the Lion installer was a clever thing to do.


### Broken Superdrive


My Mac Book Pro superdrive is broken since ages so the only way to boot from an USB stick with Snow Leopard. To make a Snow Leopard USB Stick you need a 8Gb USB, Disk Utility and the Snow Leopard DVD-ROM; but my Superdrive is broken :-( .

This is a classic chicken & egg problem.

I did the USB bootable stick with [TransMac](http://www.acutesystems.com/scrtm.htm) and the Windows 7 machine. TransMac is an application to read and write various formats including HFS+ and .dmg files; a 15-day trial fits the needs. Here the steps I did:



	
  1. Insert the Snow Leopard DVD-ROM, plug the USB stick and start TransMac. The Snow Leopard DVD-ROM is the E: drive and the target USB stick is the D: drive
[![](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_1-150x150.jpg)](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_1.jpg)

	
  2. Save the content of the E: drive as a .dmg by right-click on the E: drive > _Save Image of Disk_
[![](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_2-150x150.png)](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_2.png)

	
  3. Now format the target USB with HFS+ file system by right-clicking on the D: drive > _Format Disk _> _Format for Mac_ and chose HFS+ file system
[![](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_3-150x150.png)](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_3.png)

	
  4. Restore the Snow Leopard .dmg content into the USB stick by right-click on the D: drive > _Format Disk_ > _Format with Disk Image_ and use the previously saved image of Snow Leopard. This process will take some time (half an hour with my USB stick).
[![](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_4-150x150.png)](http://www.expobrain.net/wp-content/uploads/2011/08/transmac_4.png)

	
  5. When the process is done eject the USB stick


**Repair what ?**

Time to boot up in Snow Leopard from the fresh USB stick and repair the hard drive file system with Disk Utility but I was not in on of the lucky days and Disk Utility was sorry about it can't fix the damage on the file system (I wonder how long it was broken :-/ ).

Nothing to worry about, just install Snow Leopard from scratch (do you remember I have done a backup before this journey? ), upgrade Snow Leopard up to 10.6.8 and start again the Lion installation. Because I saved the Lion app into my external hard drive I could start the Lion upgrade without downloading it again from the App Store.

That took about another 3 hours but the good thing is now I have a clean Mac OS X Lion without any trace of crap left behind.



### Final step



Finally I restored my stuff from the Time Machine backup and upgraded XCode to 4.1 (which it's free if you purchase a copy of Mac OS X Lion).

The whole upgrade took about a couple of evenings to be done; it was a little boring but not complex to be done. And also, because I made a Time Machine backup just before the upgrade, it was completely painless.



<blockquote>P.S. [Ars Techinca](http://arstechnica.com/) wrote a [post](http://arstechnica.com/apple/guides/2011/07/ask-ars-do-i-have-to-use-the-mac-app-store-to-install-lion.ars) about creating a bootable USB stick with Lion to skip the need to install Snow Leopard first. That didn't worked for me</blockquote>
