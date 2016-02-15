---
author: admin
comments: true
date: 2008-08-06 22:36:08+00:00
layout: post
slug: geolog-spa
title: Geolog spa
wordpress_id: 125
categories:
- Main
---

![geolog.jpg](http://www.expobrain.net/wp-content/uploads/2008/08/geolog.jpg)

Realizzata per [Geolog spa](http://www.geolog.it/) un documenti di analisi per lo sviluppo di un softare di calibrazione, acquisizione e post-elaborazione dati da un sensore.

<!-- more -->L'analisi è iniziata con la compilazione delle specifiche del software richieste dal cliente in base alla tipologia del sensore e alle modifiche da implementare rispetto al software attuale.

Il documento finale ha spaziato tutti i livelli di realizzazione del software:



	
  * l'interfaccia grafica pensata per migliorare l'usabilità del software in generale e soprattutto della gestione delle calibrazioni del sensore

	
  * la separazione fisica dei componenti destinati all'uso in real-time da quelli per il post-processing ed il management

	
  * la struttura interna del software e l'applicazione dei design pattern adeguati per lo sviluppo e la manutenzione futuri nonchè le tecnologie adatte per lo scopo del software dal presentation layer al backend

	
  * la struttura del database contenente i dati raccolti in pre- e post-processing oltre alle calibrazioni del sensore


Tutte le tecnologie ed i design patterns sono stati pensati per il cross-platform e con struttura client-server per suddividere l'applicazione principale dal database e condividere quest'ultimo su una macchina dedicata.
