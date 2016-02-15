---
author: admin
comments: true
date: 2008-04-17 12:03:15+00:00
layout: post
slug: errore-mysql_config-not-found-nellinstallazione-di-mysql_python-in-mac-os-x
title: Errore "mysql_config not found" nell'installazione di MySQL_python in Mac OS
  X
wordpress_id: 93
categories:
- Troubleshooting
---

![logomysql.gif](http://www.expobrain.net/wp-content/uploads/2008/04/logomysql.gif)

Durante l'installazione del package MySQL_python in Mac OS X, sia con [easy_install](http://peak.telecommunity.com/DevCenter/EasyInstall) che tramite i sorgenti, viene generata un eccezione:

<!-- more -->

`sh: mysql_config: command not found
Traceback (most recent call last):
File "setup.py", line 16, in <module>
metadata, options = get_config()
File "/Users/expo/Desktop/MySQL-python-1.2.2/setup_posix.py", line 43, in get_config
libs = mysql_config("libs_r")
File "/Users/expo/Desktop/MySQL-python-1.2.2/setup_posix.py", line 24, in mysql_config
raise EnvironmentError, "%s not found" % mysql_config.path
EnvironmentError: mysql_config not found
`<!-- more -->

Per risolvere questo problema in maniera diretta e brutale:



	
  1. scaricate e scompattate i sorgenti di MySQ_python da [SourceForge](http://sourceforge.net/projects/mysql-python)

	
  2. aprite il file `setup_posix.py` e alla riga 17 sostituite la chiamata `mysql_config.path` con il percorso completo del file mysql_config, nel mio caso `/usr/local/mysql/bin/mysql_config`

	
  3. salvate il file ed installate il package con il comando `python setup.py install`


