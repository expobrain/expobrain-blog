---
author: admin
comments: true
date: 2008-10-12 22:04:46+00:00
layout: post
slug: errore-%e2%80%9cmysql_config-not-found%e2%80%9d-nell%e2%80%99installazione-di-mysql_python-in-mac-os-x-64bit
title: Errore “mysql_config not found” nell’installazione di MySQL_python in Mac OS
  X 64bit
wordpress_id: 135
categories:
- Troubleshooting
---

![logomysql.gif](http://www.expobrain.net/wp-content/uploads/2008/04/logomysql.gif)

Questo post è un semplice aggiornamento del post [Errore “mysql_config not found” nell’installazione di MySQL_python in Mac OS X](http://www.expobrain.net/2008/04/17/errore-mysql_config-not-found-nellinstallazione-di-mysql_python-in-mac-os-x) in caso incontriate il problema su sistemi a 64bit.

<!-- more --> Appena avete scaricato e scompattato il pacchetto MySQL-python applicate questa patch:

36,38d35
< #ifndef uint
< #define uint unsigned int
< #endif
435,436c432,433
<       uint port = MYSQL_PORT;
<       uint client_flag = 0;
---
>       unsigned int port = MYSQL_PORT;
>       unsigned int client_flag = 0;

al file build/MySQL-python-1.2.0/_mysql.c e procedete come indicato nel mio post.
