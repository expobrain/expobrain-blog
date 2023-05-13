---
categories:
- Troubleshooting
class: post-template
comments: true
cover: media/try_catch_fail.png
current: post
date: 2013-09-04 16:28:18
layout: post
navigation: true
slug: how-to-not-write-an-exception-handler
subclass: post
tags:
- bugs
- exceptions
- python
title: How to NOT write an exception handler
wordpress_id: 1643
---

Exception handlers are important but more important is to code them in the correct way. Today I'll show you an example of how to NOT write an exception handler. This example is taken from a real piece of code I found laying around in the code base, so "True story bro!" :-)

<!-- more -->

Suppose we have a function to calculate the average time to transfer a file over a network with a given bandwidth in bytes per seconds:

    import os

    def average(filename, speed):
        return os.stat(filename).st_size / float(speed)

Now, a lot of bad things can happen in this function (did I say `OSError` and/or `ZeroDivisionError`?) but that's not the point. The point, the source of the evil is this `try..except` block:

    try:
        avg = average(filename, speed)
    except:
        if speed == 0:
            raise ZeroDivisionError
        else:
            raise

Absolutely an anti-pattern and a source of potential bugs. An anti-pattern because if you are going to catch and handle a single type of exception you will use the `except ZeroDivisionError` statement instead of trying to guess the exception with the `if` statement.

It's a potential source of bugs because the author is guessing the exception by the value of the `speed` argument, but that doesn't mean the real exception raised inside the function is a `ZeroDivisionError`: it can be an `OSError` because the file doesn't exists or is not accessible or an `AttributeError` in case of a typo. Anyway guessing the exception's type is ***WRONG*** especially when it's absolutely easy to catch the correct one by the language's design. Also wrong exception raise by this code can be intercepted by another part of the code and halting the execution by the wrong reason.

Finally, that exception handler is useless because the `else` block of the `if` statement is raising the exception anyway. A correct refactor of that piece of code is to remove the exception handler completely!
