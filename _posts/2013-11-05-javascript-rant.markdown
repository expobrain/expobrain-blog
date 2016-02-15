---
author: admin
comments: true
date: 2013-11-05 21:33:36+00:00
layout: post
slug: javascript-rant
title: Javascript rant
wordpress_id: 1755
categories:
- Various things
tags:
- javascript
- 'null'
---

I'm working with Javascript since a couple of month now and I'm still trying to accommodate myself with the "quirks" of this language. For example what value do you expect from this two operations:


    
    
    null + null = ?
    
    10 / null = ?
    



<!-- more -->

If you don't know Javascript your answer will be 99% wrong. The result of those operation in Javascript are:


    
    
    null + null = 0
    
    10 / null = Infinity
    



Now, how someone can keep his sanity after this? 
