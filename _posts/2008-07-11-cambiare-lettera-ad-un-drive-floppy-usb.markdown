---
author: admin
comments: true
date: 2008-07-11 19:18:33+00:00
layout: post
slug: cambiare-lettera-ad-un-drive-floppy-usb
title: Cambiare lettera ad un drive floppy USB
wordpress_id: 119
categories:
- Guides
- Troubleshooting
---

![20080318171038-floppy-usb-1.jpg](http://www.expobrain.net/wp-content/uploads/2008/07/20080318171038-floppy-usb-1.jpg)

Nei nuovi PC e portatili il drive floppy non è più presente per ovvie ragioni ma, purtroppo, alcune applicazioni come Entratel dell'Agenzia Entrate ed alcune applicazioni INPS devono accedere a dati presenti obbligatoriamente sul drive A:.

<!-- more -->Purtroppo, utilizzando unità floppy USB, il sistema operativo gli assegna la lettera B: ma il software accede espressamente al drive A: poichè molte volte è un valore hardoded nel codice. Quindi, anche se disponiamo di un drive floppy USB, non risolviamo il problema.

Inoltre, per i drive floppy, non e possibile modificare la lettere di unità da Gestione Disco del Panello di controllo.

Ci torna in aiuto il documento Microsoft [KB836662](http://support.microsoft.com/kb/836662) che spiega come modificare la lettera di una unità o di una partizione manualmente intervenendo nel Registro di configurazione di Windows.

Brevemente:



	
  1. Assicuratevi di essere amministratori del sistema

	
  2. Andate su Start > Esegui scrivete regedit.exe e premete INVIO

	
  3. Andate alla chiave di registro HKEY_LOCAL_MACHINE\SYSTEM\MountedDevices

	
  4. Cercate il valore \DosDevice\X: dove X è la lettere assegnata dal sistema operativo al drive floppy USB

	
  5. Eliminate, se esiste, i valore \DosDevice\A: e rinominate il valore \DosDevice\X: in \DosDevice\A:

	
  6. Chiudete Regedit e riavviate il sistema

	
  7. Al riavvio l'unità floppy USB sarà A:


Questa procedura sembra sia valida per tutte le unità e partizioni e non solo per unità floppy USB quindi può tornare utile anche per altre ccasioni dove Gestione Disco non possa esserci d'aiuto.
