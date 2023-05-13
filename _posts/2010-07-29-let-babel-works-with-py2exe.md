---
categories:
- Troubleshooting
class: post-template
comments: true
current: post
date: 2010-07-29 13:01:52+00:00
layout: post
navigation: true
slug: let-babel-works-with-py2exe
subclass: post
tags:
- babel
- bug
- patch
- py2exe
- python
title: Let Babel works with py2exe
wordpress_id: 399
---

[Babel](http://babel.edgewall.org/) is a framework to translate date, times, numbers and currency in all the languages of the world. Unfortunately the package is not py2exe-friendly but with a little patch we can let Babel works when is embedded with py2exe.

<!-- more -->

When you build a Windows executable with py2exe all goes fine but when you run the application and you use Babel's method you will get an UnknownLocaleError.

Digging in the code i found the source of the problem in `localedata.py` file at line 33:

    _dirname = os.path.join(os.path.dirname(__file__), 'localedata')

As you can see Babel use the `__file__` module attribute to get the path of the `localedata` folder but obviously it doesn't return the correct path when Babel is embed inside an exe file by py2exe.

A simple and fast solution is to check if Babel is running in a frozen environment and thus return a different path using `sys.executable` value:

    import sys

    if hasattr( sys, 'frozen' ):
        _dirname = os.path.join(os.path.dirname(sys.executable), 'localedata')
    else:
        _dirname = os.path.join(os.path.dirname(__file__), 'localedata')

Now the only thing left is to add the `localedata` folder to the `data_files` collection in the py2exe' setup script:

    data_files = [
        ...your data files...
        ( "localedata",
            glob.glob( os.path.join( os.path.dirname( babel.__file__ ), "localedata" )
        )
    ]

This fix is working well with Babel 0.9.5 and py2exe under Windows environment. I think it's working wirth PyInstaller and py2app as well but I didn't tried yet.
