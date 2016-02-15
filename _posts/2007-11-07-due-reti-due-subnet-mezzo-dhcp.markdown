---
author: admin
comments: true
date: 2007-11-07 15:45:32+00:00
layout: post
slug: due-reti-due-subnet-mezzo-dhcp
title: Due reti, due subnet, mezzo DHCP
wordpress_id: 31
categories:
- Troubleshooting
---

![dhcp00.jpg](http://www.expobrain.net/wp-content/uploads/2007/11/dhcp00.jpg)
Per inaugurare questa sezione in cui publicherò la possibile soluzione a problemi tecnici particolari inziamo con questo strano problemi nel DHCP di Windows:

<!-- more -->

Il problema si è presentato con un cliente che usa il suo portatile in due reti differenti ma con lo stesso modello di router, due Zyxel della serie 660-H, con due subnet differenti, 192.168.0.0/24 e 192.168.1.0/24.

Portando in sospensione il protatile nella prima rete e riattivandolo nella seconda rete Windows XP ha accettato il nuovo indirizzo IP ma ha mantenuto il vecchio gateway dell'altra subnet.

Premettendo che il portatile in questione non ha nessun tipo di firewall o antivirus o altro software che possa interagire con le connessioni di rete, neppure la procedura di disattivazione/abilitazione o ripristino della scheda di rete ha ottenuto effetti.

La soluzione è stata usando il comando `ipconfig` dal prompt di Windows XP:

`ipconfig /release`

per rilasciare tutte le configurazioni assegnate da server DHCP tra cui quella incriminata.

`ipconfig /renew`

per forzare una nuova richiesta DHCP al nostro server, così magicamente otteniamo la giusta configurazione di indirizzo IP e gateway.
