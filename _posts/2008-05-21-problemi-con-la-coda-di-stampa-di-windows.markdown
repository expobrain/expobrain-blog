---
author: admin
comments: true
date: 2008-05-21 17:30:44+00:00
layout: post
slug: problemi-con-la-coda-di-stampa-di-windows
title: Problemi con la coda di stampa di Windows
wordpress_id: 100
categories:
- Troubleshooting
---

![printer_1720.jpg](http://www.expobrain.net/wp-content/uploads/2008/05/printer_1720.jpg)

Talvolta, e soprattuto con stampanti USB, capita che, anche se eliminate un documento dalla coda di stampa o svuotate l'intera coda di stampa, il documento rimane in stato "Eliminazione".

<!-- more -->

In questi casi la soluzione più ovvia è quella di riavviare il sistema o provare a ricollegare e/o riaccendere la stampante, ma purtroppo alcune volte questa soluzione non sblocca il documento.

Per qualche ragione lo stato dello spooler di stampa quindi rimane bloccato e sopravvive anche al riavvio della macchina.

Esiste però una soluzione, riavviare il servizio dello spooler.

Per fare ciò andate nel Pannello di controllo.

[](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_1.jpg)


[![spooler_1.jpg](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_1.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_1.jpg)


Da qui entrate in Strumenti di amministrazione.

[](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_2.jpg)


[![spooler_2.jpg](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_2.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_2.jpg)


Ora entrate in Servizi e cercate il servizio Spooler di stampa, cliccate con il tasto destro su Riavvia.

[](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_3.jpg)


[![spooler_3.jpg](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_3.thumbnail.jpg)](http://www.expobrain.net/wp-content/uploads/2008/05/spooler_3.jpg)


A questo punto la coda di stampa dovrebbe essere vuota ed il documento eliminato.
