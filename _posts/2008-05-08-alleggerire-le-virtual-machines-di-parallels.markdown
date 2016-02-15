---
author: admin
comments: true
date: 2008-05-08 12:03:09+00:00
layout: post
slug: alleggerire-le-virtual-machines-di-parallels
title: Alleggerire le Virtual Machines di Parallels
wordpress_id: 95
categories:
- Guides
- Troubleshooting
---

![](http://www.expobrain.net/wp-content/uploads/2008/05/parallels-logo.jpg)

L'esecuzione di una Virtual Machine con Parallels comporta un certo dispendio di risorse, principalmente disco, memoria e una piccola parte di cicli di clock del processore. L'uso della memoria però, con le impostazioni di base, risulta eccessivo e limita il numero di VM che possono essere eseguite contemporaneamente e/o rallentano le applicazioni nel sistema host causando swapping su disco.

E' possibile ovviare a questo problema cambiando il modo in cui viene gestita la memoria da parte di Parallels.

<!-- more -->Di default Parallels ottimizza la memoria per migliorare le prestazioni della VM assegnando una parte della memoria di sistema alla cache del disco virtuale della VM. Questa impostazione è poco furba perchè già il sistema operativo host si occupa della cache relativa al file del disco virtuale, quindi alla fine si tratta di uno spreco di memoria.

[](http://www.expobrain.net/wp-content/uploads/2008/05/untitled.png)


[![untitled.png](http://www.expobrain.net/wp-content/uploads/2008/05/untitled.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/05/untitled.png)


Per modificare questo comportamento aprite la VM ed effettuate lo shutdown. Poi andate in Modifica > Virtual machine andate su Opzioni > Avanzate e cambiate l'opzione "Ottimizza per le migliori prestazioni" in "Applicazioni Mac OS X".

Premete OK e avviate la VM. Con la nuova impotazione la cache del disco virtuale sarà gestita completamente dal  sistema operativo host riducendo visibilmente l'uso della memoria e permettendo l'apertura di altre applicazioni o altre VM riducendo lo swapping.

Come esempio, su un MacBook Pro 15" con configurazione standard e Mac OS X Leopard, ho eseguito l'aggiornamento della VM con Ubuntu 7.10 alla Ubuntu 8.04 e contemporaneamente una VM con Windows XP dove testavo un'applicativo sviluppato con Eclipse sotto Mac, il tutto senza rallentamenti eccessivi.
