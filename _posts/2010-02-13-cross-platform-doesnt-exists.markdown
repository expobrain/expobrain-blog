---
author: admin
comments: true
date: 2010-02-13 00:18:33+00:00
layout: post
slug: cross-platform-doesnt-exists
title: Cross platform doesn't exists
wordpress_id: 299
categories:
- Troubleshooting
tags:
- bsddb
- open source
- python
- traceback
---

![](http://www.expobrain.net/wp-content/uploads/2010/02/cross_platform.jpg)

[](http://www.expobrain.net/wp-content/uploads/2010/02/cross_platform.jpg)When you write code in Python you can be almost sure your code will run on different operating systems. I say almost sure, not completely sure, because some of the libraries and packages you are using can have different behaviors on different systems.

<!-- more -->But here I found a full incompatibility in the bsddb package on the same Python release but on different operating systems.

First, install Python 2.6.2 on a Windows machine and on a OpenSuse machine.

Next take a look at this code:

    
    
    import shelve
    
    f = shelve.open( "test.bin" )
    f["test"] = "test"
    f.sync()
    f.close()
    



As you can see I've created a bsddb file with a pair of key/value. I can read this file with this code:

    
    
    import shelve
    
    f = shelve.open( "test.bin" )
    print f["test"]
    



If you run those two codes on the same machine all things runs fine, you can print the value "test" without problems. The same if you run the first piece of code in the OpenSuse machine and read the file test.bin using the second piece of code from the Windows machine.

Now the nice part: create the file in the Windows machine and read the file on the OpenSuse. Result: BOOM :-)

    
    
    Traceback (most recent call last):
    File "<stdin>", line 1, in <module>
    File "/usr/lib/python2.6/shelve.py", line 234, in open
    return DbfilenameShelf(filename, flag, protocol, writeback)
    File "/usr/lib/python2.6/shelve.py", line 218, in __init__
    Shelf.__init__(self, anydbm.open(filename, flag), protocol, writeback)
    File "/usr/lib/python2.6/anydbm.py", line 83, in open
    return mod.open(file, flag, mode)
    File "/usr/lib/python2.6/dbhash.py", line 19, in open
    return bsddb.hashopen(file, flag, mode)
    File "/usr/lib/python2.6/bsddb/__init__.py", line 361, in hashopen
    d.open(file, db.DB_HASH, flags, mode)
    bsddb.db.DBInvalidArgError: (22, 'Invalid argument -- ./test.bin: unsupported hash version: 9')
    


What's happened here ?! Am I wrong to suppose Python was using the same bsddb library version in both platform ?

No. Both Python installations are using the same bsddb library revision (as import _bsddb; _bsddb.__version__ says) but the file create from the Python on Windows system is still unreadable on Linux system.

I'm doing some further investigations, in the meanwhile my client will not be happy to hear that :-(


