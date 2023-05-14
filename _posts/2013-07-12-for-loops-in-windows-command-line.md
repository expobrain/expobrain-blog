---
categories:
- Guides
class: post-template
comments: true
cover: media/batch-files-command.png
current: post
date: 2013-07-12 16:00:32
layout: post
navigation: true
slug: for-loops-in-windows-command-line
subclass: post
tags:
- batch files
- command line
- windows
title: For loops in Windows command line
wordpress_id: 1494
---

I'm working on a script on Windows to automatically install Python packages listed in a text file like [`pip`](http://www.pip-installer.org/en/latest/cookbook.html#requirements-files) does.

Because `easy_install` doesn't support a `requirements.txt` as a packages' list I made a small Batch file to simulate the `pip`'s behavior, and I discovered the for loop of Windows's command line.

<!-- more -->

The idea is to read the content of `requirements.txt` and execute `easy_install` for every line of the input file. The [for loop](http://www.microsoft.com/resources/documentation/windows/xp/all/proddocs/en-us/for.mspx?mfr=true) has a multitude of options not to only iterate on a list of values, but also to iterate on the content of a file (or list of files) using a set of parsing keywords to extract tokens from every line.

The final script looks like this:




    for /f "tokens=*" %%p in (requirements.txt) do (
        easy_install %%p

        if %errorlevel% gtr 1 (
            echo %errorlevel%
            exit /b 2
        )
    )




Really is looking different than any standard for loop you can find in any programming language but don't forget the for loop is a real built-in command line application which needs arguments and command line's options in order to work.