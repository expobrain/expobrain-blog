---
author: admin
comments: true
date: 2008-03-12 00:21:58+00:00
layout: post
slug: installare-ubuntu-710-gutsy-gibbon-in-parallels
title: Installare Ubuntu 7.10 (Gutsy Gibbon) in Parallels
wordpress_id: 71
categories:
- Guides
---

[![parallels_ubuntu02.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/parallels_ubuntu02.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/parallels_ubuntu02.jpg)

Questo articolo è un sunto tradotto dell'articolo ogirinale pubblicato su [SimpleHelp.net](http://www.simplehelp.net) [Hot to install Ubuntu 7.10 (Gutsy Gibbon) in Parallels Desktop for OS X](http://www.simplehelp.net/2007/11/01/how-to-install-ubuntu-710-gutsy-gibbon-in-parallels-desktop-for-os-x/).

L'how-to ha funzionato per me, quindi vi ripropongo la versione tradotta.

<!-- more -->

Nella mia installazione è stata utilizzata l'ultima versione di Paralles (versione 3.0 build 5584 del 5 febbraio 2008) su Mac OS X 10.5 aggiornato al 7 marzo 2008.

Se già avete una VM con Ubuntu 7.04, passate direttamente al punt 13, altrimenti partite dal punto 1:



	
  1. Prima di iniziare scaricate Ubuntu 7.04 dal [sito ufficiale](http://releases.ubuntu.com/7.04/). Vi consiglio di utilizzare il Torrent per scaricare le ISO pochè in genere è possibilie reperirle ad una velocità superiore.

	
  2. Terminato il download aprite Parallels, andate su File > Nuovo, scegliete Personalizzato come modalità di installazione e premete Avanti
[](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_01.png)


[![gusty_parallels_01.png](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_01.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_01.png)




	
  3. Come sistema operativo scegliente Linux e come Versione scegliete Ubuntu Linux
[](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_02.png)


[![gusty_parallels_02.png](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_02.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_02.png)




	
  4. Scegliate la quantità di RAM da assegnare alla vostra VM in base all'uso che ne farete della vostra installazione. Per un uso desktop consiglio 512Mb di RAM, per un uso server 256Mb sono sufficienti per un uso standard.
[](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_03.png)


[![gusty_parallels_03.png](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_03.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_03.png)




	
  5. Anche qua scegliete, nei prossimi due passi, delle impostazioni consone alle vostre esigenze. Nel primo caso in genere utilizzerete l'opzione Crea una nuova immagine disco, però potreste avere anche un'immagine disco da riutilizzare con Usa immagine di un disco rigido esistente.
[](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_04.png)


[![gusty_parallels_04.png](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_04.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_04.png)




	
  6. Nel secondo passo impostate la dimensione del disco. Se utilizzate la modalità Espansione lo spazio su disco utilizzato dalla VM verrà allocato quando necessario mentre nella modalità Semplice verrà allocato l'intero disco fisso virtuale. Il vantaggio nell'uso dell'Esmansione è di ridurre al minimo lo spazio su disco a discapito delle prestazioni a causa della frammentazione del file immagine, utilizzando la modalità Semplice si evita la frammentazione ma si spreca spazio.
[](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_05.png)


[![gusty_parallels_05.png](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_05.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gusty_parallels_05.png)




	
  7. Lasciate selezionato Collegamento di rete condiviso e premete Avanti
[](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_06.png)


[![gutsy_parallels_06.png](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_06.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_06.png)




	
  8. Assegnate un nome alla vostra VM e lasciate attivata l'opzione Crea icona sul Desktop in modo da avere la vostra VM a portata di mano
[](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_07.png)


[![gutsy_parallels_07.png](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_07.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_07.png)




	
  9. Lasciate selezionato Virtual machine per avere delle performance adeguate
[](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_08.png)


[![gutsy_parallels_08.png](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_08.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_08.png)




	
  10. Al termine della procedura premete Altre opzioni, selezionate Immagine ISO e con il bttone Scegliere selezionate la ISO i Ubuntu 7.04 precedentemente scaricata. Attivate l'opzione Avvia l'installazione di Ubuntu Linux per avviare l'installazione al primo avvio della VM.
[](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_09.png)


[![gutsy_parallels_09.png](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_09.thumbnail.png)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_09.png)




	
  11. Abbiamo terminato a preparazione della nostra macchina virtuale, ora procediamo al primo avvio.
[](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_10.jpg)


[![gutsy_parallels_10.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_10.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_10.jpg)




	
  12. Procedete nell'installazione di Uuntu 7.04 nel modo che preferite. I passi successivi si riferiscono alla versione Desktop.

	
  13. Terminata l'installazione, o avviata la VM con la vostra installazione precedente, ed effettuato il login al sistema appena installato, verificate che la rete sia attiva, poi andate su Sistema > Amministrazione > Gestione aggiornamenti e procedete ad aggiornare la vostra distribuzione agli ultimi aggiornamenti disponibili, dopodichè riavviate il sistema


[![gutsy_parallels_11.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_11.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_11.jpg)




	
  14. Dopo il riavvio e il login, tornate in Sistema > Amministrazione Gestione aggiornamenti e ora troverete la possibilità di procedere all'upgrade dell'intera distribuzione alla versione 7.10.
Poichè l'uprade dura crca un'ora in base alla velocità della vostra connessione ad Internet e non è possibile interrompere l'aggiornamento, vi consiglio di creare uno snapshot della VM dal menù Azioni > Crea snapshot di Parallels
[](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_12.jpg)


[![gutsy_parallels_12.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_12.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_12.jpg)




	
  15. aaOra procedete all'upgrade in sicurezza a Ubuntu 7.10, nel caso qualcosa andasse storto potete sempre ricaricare lo snapshot precedente e riprovare sempre dal manù Azioni > Torna a istantanea di Parallels


[![gutsy_parallels_13.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_13.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_13.jpg)




	
  16. Ad un certo punto della procedura vi verrà segnalata l'intenzione di rimuovere nelle fasi successive dei pacchetti non più supportati nella prossima versione della distribuzione e che quindi verranno rimossi alla fine dell'upgrade


[![gutsy_parallels_14.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_14.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_14.jpg)




	
  17. Al termine dell'istallazione confermiamo l'eliminazione dei pacchetti non piùnecessari


[![gutsy_parallels_15.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_15.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_15.jpg)




	
  18. Ora riavviamo il sistema come suggerito e, se non ci sno stati problemi, avremo la nostra Ubunto 7.10 Gutsy Gibbon pronta per l'uso. L'unica cosa che manca ora è l'installazione dei Parallels Tools per migliorare l'integrazione del sistema operativo con la virtual machine


[![gutsy_parallels_16.jpg](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_16.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/03/gutsy_parallels_16.jpg)





