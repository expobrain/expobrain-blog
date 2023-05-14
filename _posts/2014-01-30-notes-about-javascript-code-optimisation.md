---
author: expobrain
categories: [Guides]
comments: true
date: 2014-01-30 18:55:47
image: {url: /media/javascript_code.jpg}
layout: post
slug: notes-about-javascript-code-optimisation
tags: [garbage collector, google chrome, javascript, performances, talk]
title: Notes about JavaScript code optimisation
wordpress_id: 1894
---

A couple of days ago YouTube suggested me this video about optimising JavaScript games on Google Chrome. The video is a talk from the GDC 2012 so it's pretty old (2 years in IT's time is really a lot) but the content of the talk is still valid today and in the near future.



The talk is about game's code optimisation but some of the techniques and good practices should be used also in everyday's JavaScript code:

{% include youtubePlayer.html id="XAqIpGU8ZZk" %}

By the way here my personal list of some of the topics I considered interesting:





  * [Integers](http://youtu.be/XAqIpGU8ZZk?t=14m13s): differences in storage and performances between 31-bit (or 32-bit n x64 architectures) integers and 64-bit integers; usually this is not an issue but it's good to know just in case your code is handling very big natural numbers


  * [Arrays](http://youtu.be/XAqIpGU8ZZk?t=16m25s): differences between typed and JavaScript arrays and about the latter differences in storage size and access speed


  * [Object model](http://youtu.be/XAqIpGU8ZZk?t=19m34s): JavaScript optimise the access to attributes and functions of a class by compiling the class' code into machine code; this means if you alter the class by adding or removing attributes outside the constructor the JavaScript engine will throw away the optimised code reducing the performances


  * [Garbage collection](http://youtu.be/XAqIpGU8ZZk?t=33m49s): short story use short lived or long lived objects, long story watch the video :-)


  * [RequestAnimationFrame (RAF)](http://youtu.be/XAqIpGU8ZZk?t=48m03s): on animations avoid the usage of `setTimeout()` and use `requestAnimationFrame()` instead
