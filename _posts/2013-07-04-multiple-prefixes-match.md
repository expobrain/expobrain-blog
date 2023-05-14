---
categories:
- Troubleshooting
class: post-template
comments: true
cover: media/regula_exp.jpg
current: post
date: 2013-07-04 20:51:15
layout: post
navigation: true
slug: multiple-prefixes-match
subclass: post
tags:
- python
- string manipulation
title: Multiple prefixes match
wordpress_id: 1429
---

I'm not using often string manipulation (I usually handle SQLAlchemy's queries and sometime XML/XHTML manipulation with the `lxml` library) but sometimes I need to analyse some paths expressed with a dotted notation comparing every path with a predefined list of path prefixes. The obvious solution is to compare in a for cycle every input path against the predefined prefix list returning at the first positive match.

This solution looked too naive, I was sure a better and faster solution was available in the Python built-ins, and looking at the Python documentation I was right.

<!-- more -->

Suppose you want to match the string:



    foo.user.add



with the prefixes:




    foor.user
    bar.user




a naive implementation can be:




    prefixes = ("foo.user", "bar.user")
    path = "foo.user.add"

    for prefix in prefixes:
        if path.startswith(prefix):
            return True

    return False



Bad solution, verbose and slow because involves a for loop executed by the Python VM.

I'll never be tired to say RTFM is the way to go, i this case [startswith()](http://docs.python.org/2/library/stdtypes.html#str.startswith) and related method [endswith()](http://docs.python.org/2/library/stdtypes.html#str.endswith) doesn't accept only the prefix to match, but can accept also a tuple of prefixes and returns True if at least one prefix matches.

The code above can be rewritten in a single line:




    return path.startswith(prefixes)




Concise, clean, faster because executed as C code instead interpreted by the Python VM.