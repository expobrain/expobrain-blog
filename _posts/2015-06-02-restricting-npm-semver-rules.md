---
categories:
- Troubleshooting
class: post-template
comments: true
cover: media/wombat-by-night.png
current: post
date: 2015-06-02 18:28:51
layout: post
navigation: true
slug: restricting-npm-semver-rules
subclass: post
tags:
- javascript
- npm
- semver
title: Restricting npm semver rules
wordpress_id: 2023
---

The `npm` package manager uses `semver` to declare the version of the external dependancies of your package in a more flexible way. Unfortunately the current version of `npm` by default uses the _caret ^_ as a default prefix for package's versions which means the required package must have the same MAJOR version but can have a different MINOR and HOTFIX versions; this can lead to a broken code if a change in the MINOR version of the dependancy introduce an incompatibility with your code. Replacing manually all the carets with the _tilde ~_ is tedious and error prone so we need a way to set `npm` to use the tilde by default.

<!-- more -->

To do that open the terminal and execute:

{% highlight bash %}
npm config set save-prefix '~' --save
{% endhighlight %}

This will set permanently the default package's version prefix to the tilde in all the future executions of `npm`, keeping us safe from potential code failure caused by wrong versions of the dependancies.

Note that this doesn't mean that you should not use the caret in you dependancy's declarations, but you need to use it keeping in mind what are the cons. If you want to still use the caret in you project at least be sure that your code pass the tests with all the available minor versions of the dependancy declared with the caret prefix.