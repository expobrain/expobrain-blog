---
author: admin
comments: true
date: 2008-09-09 22:47:17+00:00
layout: post
slug: installare-ubuntu-da-pen-drive-usb
title: Installare Ubuntu da pen drive USB
wordpress_id: 127
categories:
- Guides
- Troubleshooting
---

![ubuntu_usb.jpg](http://www.expobrain.net/wp-content/uploads/2008/09/ubuntu_usb.jpg)

Può capitare che sua alcune macchine dove vogliamo avviare e/o installare Ubuntu manchi il lettore CD-ROM, vuoi perchè sono sistemi embedded, vuoi perchè il lettore CD-ROM è fouri uso, o solo per avere un live CD più veloce all'avvio e nell'installazione.

<!-- more -->Per creare un Live CD Ubuntu avviabile da pen drive USB sono necessari:



	
  * un cd-live di Ubuntu, scaricabile dal [sito ufficiale](http://www.ubuntu-it.org/) (se possibile scaricatelo via Torrent)

	
  * una pen drive USB da almeno 1Gb

	
  * una macchina su cui preparare la pen drive USB

	
  * una connessione ad Internet

	
  * la macchina di destinazione deve poter fare il boot dadrive USB


Per questo ultimo requisito consultare il manuale del BIOS relativo alla vostra macchina, comunque tutti i BIOS recenti supportano il boot da drive USB.

Iniziamo:

	
  1. Per prima cosa scarichiamo l'immagine ISO di Ubuntu e masterizziamola

	
  2. Avviate la vostra macchina da cui preparerete la pen drive USB con l'Ubuntu Live CD appena preparato

	
  3. Avviato il desktop del Live CD aprite Firefox ed andate su [http://klik.atekon.de/liveusb](http://klik.atekon.de/liveusb/), entrate nella sezione Download e scaricate la versione [.deb](http://ppa.launchpad.net/probono/ubuntu/pool/main/l/liveusb/) del pacchetto di installazione di LiveUSB

	
  4. Aprite il file con l'applicazione di default di Ubuntu GDebi Pakcage Installer ed installate l'applicazione e, automaticamente, le librerie necessarie

	
  5. Ora andate in Sistema > Amministrazione > Intalla Live USB
[](http://www.expobrain.net/wp-content/uploads/2008/09/ubuntu_live_usb_creator.png) 


[![ubuntu_live_usb_creator.png](http://www.expobrain.net/wp-content/uploads/2008/09/ubuntu_live_usb_creator.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/09/ubuntu_live_usb_creator.png)




	
  6. Inserite la vostra pen drive USB, che verrà riconosciuta automaticamente, e premete Execute.
**ATTENZIONE !!! Questa procedura cancellerà l'intero contenuto della pen drive USB, quindi effettuate una copia dei file importanti prima di andare oltre nella procedura**

	
  7. La procedura di trasferimento del Live CD durare alcuni minuti. Ho notato che soprattutto nella parte iniziale di partizionamento e preparazione della pen drive, se avete un mouse USB muovetelo altrimenti LiveUSB rimane in freeze.

	
  8. Al termine della procedura etraete la pen drive eusatela per avviare la macchina di destinazione


La procedura è stata testata ed è confermata per Ubuntu 8.04.
