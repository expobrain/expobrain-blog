---
author: admin
comments: true
date: 2008-09-18 12:08:26+00:00
layout: post
slug: warning-spyware-detected-on-your-computer
title: Warning! Spyware detected on your computer!
wordpress_id: 134
categories:
- Guides
---

![warning.png](http://www.expobrain.net/wp-content/uploads/2008/09/warning.png)

Ultimamente mi sono incappato in questo fastitioso malware facilmente rilevabile dalla presenza di una immagine di sfondo che avvisa della presenza di due malware.

<!-- more -->Questo è lo screenshot del desktop di una macchina infetta:

[](http://www.expobrain.net/wp-content/uploads/2008/09/screenshot.jpg)


[![screenshot.jpg](http://www.expobrain.net/wp-content/uploads/2008/09/screenshot.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/09/screenshot.jpg)


Le istruzioni per la rimozione sono abbastanza semplici e disponibili in inglese sul sito [My Anti Spyware](http://www.myantispyware.com/2008/03/15/how-to-remove-braviaxexecru629-malware/).

Qua di seguito vi riporto le istruzioni principali riassunte e tradotte:



	
  1. Scaricate ed installate SDFix da [qui](http://www.myantispyware.com/2007/11/09/sdfix-free-trojan-remover-tool/)

	
  2. Scaricate ComboFix da [qui](http://www.myantispyware.com/2007/10/08/combofix-another-free-anti-spyware-tool/)

	
  3. Riavviate il sistema operativo in modalità provvisoria: riavviate il sistema e tenete premuto F8, quando appare il menu di avvio di Windows scegliete Modalità provvisoria

	
  4. Una volta in modalità provvisoria andate nela cartella C:\SDFix ed eseguite RunThis.bat

	
  5. Seguite le istruzioni a video ed aspettate il termine della scansione, al termine il sistema verrà riavviato e SDFix proseguerànella seconda fase di scansione

	
  6. Al termine del lavoro di SDFix lanciate ComboFix e seguite le istruzioni a video


Terminata la scansione il sistema è stato per la maggior parte ripristinato, ora vi rimane solo da effettuare una scansione completa con il vostro antivirus ed il vostro antimalware.

**Errata:**

Dimenticavo di dire che alla fine ComboFix va disinstallato.

Per disinstallarlo andare in Start > Esegui, scrivete combofix /u ed premete Esegui
