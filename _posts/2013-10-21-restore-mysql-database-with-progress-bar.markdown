---
author: admin
comments: true
date: 2013-10-21 18:10:22+00:00
layout: post
slug: restore-mysql-database-with-progress-bar
title: Restore MySQL database with progress bar
wordpress_id: 1743
categories:
- Guides
- Troubleshooting
tags:
- command line
- mysql
- pipe
- unix
---

Restoring a copy of a medium/big database can be a boring task, it can be worse when the process takes some times (let's say more than 10 minutes) and you don't have any idea of the state of the restore process and/or it's ETA.

On Unix you can monitor the progress on the command line by using the `pv` utility.

<!-- more -->

The complete name of the utility is _Pipe Viewer_ and as the name suggest it's capable of display informations about a pipe. To install `pv`:


    
    
    $ sudo apt-get install pv
    



In this pecific case we want to know how much data has been read from the database's dump file into the `mysql` command:


    
    
    $ pv dump.sql | mysql -u<username> -D <database>
    2.6GB 0:00:23 [2.3MB/s] [>           ] 2% ETA 0:32:39
    



Thanks to `pv` now we know more or less how much time the restore will take, so we are sure there's enough time to have a hot coffe down to Starbucks :-).

If your database's dump is compressed for example with Bzip2 you can add the decompression stage in the pipe:


    
    
    $ pv dump.sql.bz2 | bunzip2 -c | | mysql -u<username> -D <database>
    425MB 0:00:25 [845KB/s] [>           ] 1% ETA 0:31:45
    



However this approach is not limited to this two examples, you can use `pv` in any situation where you can pipe the output of a command as an input of another command and you want to monitor the progress.
