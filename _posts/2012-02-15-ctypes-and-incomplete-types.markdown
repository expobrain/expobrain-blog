---
author: admin
comments: true
date: 2012-02-15 23:29:45+00:00
layout: post
slug: ctypes-and-incomplete-types
title: CTypes and Incomplete Types
wordpress_id: 770
categories:
- Guides
- Troubleshooting
tags:
- c/c++
- ctypes
- incomplete types
- python
---

Some days ago I was writing a DLL's wrapper in [ctypes](http://docs.python.org/library/ctypes.html) and I came across of this typedef in the header file:

    
    
    typedef struct _FILEHandle *FILEHandle;
    


To translate this definition into ctypes is pretty straight-forward (if you already know the solution :-) ).
<!-- more -->
First of all, `_FILEHandle` is a forward declaration and the definition of the struct's fields are not exposed in the header file. So this is obviously an [Incomplete Type](http://docs.python.org/library/ctypes.html#incomplete-types) and we can declare a ctype's like this:

    
    
    class _FILEHandle(Structure): 
        pass
    


Finally, `FILEHandle` is pointer to an instance of `_FILEHandle` so it will be declared like that:

    
    
    FILEHandle = POINTER(_FILEHandle)
    
