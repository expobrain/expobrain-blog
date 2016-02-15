---
author: admin
comments: true
date: 2008-11-05 15:39:10+00:00
layout: post
slug: bug-dopo-upgrade-ad-ubuntu-810
title: Bug dopo upgrade ad Ubuntu 8.10
wordpress_id: 143
categories:
- Troubleshooting
---

![untitled.jpg](http://www.expobrain.net/wp-content/uploads/2008/11/untitled.jpg)

Ubunto 8.10 Interpid Ibex è appena uscita ma presenta alcuni noiosi bug e alcuni problemi presenti sia a chi ha effettuato una installazione da zero sia a chi ha fatto l'upgrade dalla versione precedente.

<!-- more -->Io personalmente ho effettuato l'upgrade ed ho rilevato una serie di minibug ed un rallentamento generale in X rispetto alla versione precendente.

Uno dei problemi più noiosi che ho avuto è che le unità di rete registrate nei Segnalibri mi venivano aperte con Rhythmbox  invece che con Nautilus. Cercando il problema su Ubuntu Forums ho visto che il bug è segnalato [qui](https://bugs.launchpad.net/ubuntu/+source/nautilus/+bug/260492) con il numero #26049.

Per risolvere il problema in maniera rapida senza attendere un update:



	
  1. Aprite Terminal

	
  2. Eseguite gedit _~/.local/share/applications/mimeapps.list_

	
  3. Cercate la riga che inizia con_ inode/directory=_ e sostituitela con_ inode/directory=nautilus-folder-handler.desktop;_

	
  4. Salvate, chiudete e provate


