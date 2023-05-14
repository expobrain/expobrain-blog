---
categories:
- Guides
class: post-template
comments: true
current: post
date: 2011-01-23
layout: post
navigation: true
slug: swig-tutorial-for-mac-os-x
subclass: post
tags:
- c/c++
- mac os x
- python
- swig
- tutorial
title: SWIG tutorial for Mac OS X
wordpress_id: 571
---

In this post I'll show an updated version of the  [SWIG tutorial](http://www.swig.org/tutorial.html) to build a Python module on top of a C library which works under Mac OS X.

<!-- more -->

My test environment:




  * Mac OS X 10.6.6


  * Python 2.7.1 32bit


  * SWIG 2.0.1


  * XCode 3.2.5


Here a copy&paste of the original tutorial example:



    /* File : example.c */

    #include
    double My_variable = 3.0;

    int fact(int n) {
        if (n <= 1) return 1;
        else return n*fact(n-1);
    }

    int my_mod(int x, int y) {
        return (x%y);
    }

    char *get_time()
    {
        time_t ltime;
        time(&ltime);
        return ctime(&ltime);
    }



And this is the interface file of our `example.c` file:



    /* example.i */
    %module example
    %{
        /* Put header files here or function declarations like below */
        extern double My_variable;
        extern int fact(int n);
        extern int my_mod(int x, int y);
        extern char *get_time();
    %}

    extern double My_variable;
    extern int fact(int n);
    extern int my_mod(int x, int y);
    extern char *get_time();



The creation of the `example.c` wrapper is the same from the original tutorial


    $ swig -python -o example_wrap.c example.i


From now on the original tutorial steps to compile and link the example and example's wrapper source codes doesn't work as is in Mac OS X. We need to change the `gcc` in order to work. Let's start to compile the `example.c` file


    $ gcc -c -arch i386 -fPIC example.c -o example.o


Now it's the time to compile the example's wrapper: a big difference from the original tutorial is the presence of the `-arch i386` (because I'm using the 32-bit version of the Python interpreted) and the `-I` and `-L` to tell gcc where the headers and libraries are on the file system.


    gcc -c -arch i386 -fPIC example_wrap.c -o example_wrap.o \
      -I/Library/Frameworks/Python.framework/Versions/2.7/include/python2.7 \
      -L/Library/Frameworks/Python.framework/Versions/2.7/lib/python2.7


It's time to link both `example.o` and `example_wrap.o` together


    $ ld -bundle -flat_namespace -undefined suppress -o _example.so *.o


At this point our python module to interface our C code is ready as the `_example.so`. Let's try if this module works in the Python interpreter



    >>> import example
    >>> example.fact(10)
    3628800
    >>> example.my_mod(14,4)
    2
    >>> example.get_time()
    'Sat Jan 22 22:09:32 2011\n'



Ok, no problems at all!