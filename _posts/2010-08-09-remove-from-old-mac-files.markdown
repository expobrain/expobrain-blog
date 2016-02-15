---
author: admin
comments: true
date: 2010-08-09 20:45:19+00:00
layout: post
slug: remove-from-old-mac-files
title: Remove "(from old mac)" files
wordpress_id: 428
categories:
- Troubleshooting
tags:
- command line
- from old mac
- mac os x
- python
- time machine
---

![](http://www.expobrain.net/wp-content/uploads/2010/08/old_mac.png)

Time Machine is a powerful solution to backup, restore or move your Mac OS X installation to another machine or just after a full reinstall of the operating system. The restore system is smart enough to put all your applications, profile files, and all other stuff which belong to you.

For some files and folders (for example MacPorts installation and XCode folder) the restore process, to be safe, renames that files or folder appending a `(from old mac)` string, wasting hard drive space.

<!-- more -->**WARNING !! THE FOLLOWING CODE IS NOT TESTED DEEPLY AND COMES AS IS, WITHOUT WARRANTY. IT MAY CAN CAUSE PROBLEMS, DELETE IMPORTANT SYSTEM OR USER FILES. I DON'T HAVE RESPONSIBILITY FOR WHAT HAPPEN TO YOU AND YOUR SYSTEM. IT'S UP TO YOU TO TAKE A FULL BACKUP OF YOUR SYSTEM BEFORE DOING POTENTIAL DAMAGE TO IT.**

I found that when I wen low of free space and I discover about 4Gb of that files/folders wondering around my drive. First at all I built a list of files to see what really I need and what instead I can toss away using the command into the Terminal:

    
    sudo find / | grep "from old Mac" > ~/old_files.txt


After take a look of the file list and found nothing worth, I wrote a simple Python script called `delete.py` to clean-up all that files and folders:

    
    
    import os
    import sys
    import shutil
    
    entries = []
    
    for items in os.walk( "/" ):
    	entries.extend( [ os.path.join( items[0], dirname ) for dirname in items[1] ] )
    	entries.extend( [ os.path.join( items[0], filename ) for filename in items[2] ] )
    
    	while entries:
    		entry = entries.pop()
    
    		if "(from old Mac)" in entry:
    			if os.path.isfile( entry ) or os.path.islink( entry ):
    				print "delete file", entry
    				os.remove( entry )
    
    			elif os.path.isdir( entry ):
    				print "rm dir", entry
    				shutil.rmtree( entry )


So, before running it, I unmounted all other drives (external hard drive, Bootcamp partition, etc) and run it:

    
    $ python delete.py


This takes a lot of time (all the drive was scanned looking for the old stuff) but at last I freed up to 4Gb of space drive.

I know there are more smart ways to do the same thing and the code above it's a little mess but:



	
  1. takes only 1 minute of coding

	
  2. do the thinks I want to do


So, don't blame me :-)



* * *



UPDATE: After the cleanup, opening the Terminal I get this warning:


    
    dyld: shared cached file was build against a different libSystem.dylib, ignoring cach


The solution is simple: just rebuild the dyld cache:

    
    $ sudo update_dyld_shared_cache


and reboot the system. You can do the same thing holding the SHIFT key at boot.
