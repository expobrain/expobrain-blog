---
author: admin
comments: true
date: 2011-02-22 09:40:21+00:00
layout: post
slug: handling-win32-windows-handler-in-pyside
title: Handling Win32 window handler in PySide
wordpress_id: 593
categories:
- Troubleshooting
tags:
- c/c++
- pyqt
- pyside
- python
- windows
---

To pass a Win32 window handler from a PySide object to a `[win32gui.GetDC()](http://docs.activestate.com/activepython/2.7/pywin32/win32gui__GetDC_meth.html)` method is not so simple as with PyQt4 or wxPython.

<!-- more -->

I wrote a small test for a C function wich renders a bitmap to a Windows DC and I made a PyQt QMainWindow to show the result. My test window is quite simple, just a QMainWindow with a plain QWidget as the central widget, and the code to create it is not very interstring.
Focusing on the code which renders the bitmap, in PyQt was really simple, just passing the Win32 window handler and the size of the result bitmap to the C function:



    my_C_render_function( win32gui.GetDC( widget.winId() ), width, height )



The PyQt `QWidget.winId()` method retuns a `sip.voidptr` which is compatible with the `win32gui.GetDC()` function signature which accepts a `[PyHANDLE](http://docs.activestate.com/activepython/2.7/pywin32/PyHANDLE.html)`, which can be an integer or a void pointer to the handle object.
Replacing PyQt with PySide you will get a `[PyCObject](http://docs.python.org/release/2.7.1/c-api/cobject.html)` and `win32gui.GetDC()` seems to not now how handle it even can be treated as a void pointer. So we need to convert it to be usable by our purpuse.
As the Python C API documentation says, you can convert a `PyCObject` to a void poiter by the `AsVoidPtr` function. So, thanks to ctypes, I modified the code to convert the `QWidget.winId()` result before passing it to my C function:



    # Imports all we need
    from ctypes import pythonapi, c_void_pointer, py_object

    # Setup arguments and return types
    pythonapi.PyCObject_AsVoidPtr.restype = c_void_p
    pythonapi.PyCObject_AsVoidPtr.argtypes = [ py_object ]

    # Convert PyCObject to a void pointer
    hWnd = pythonapi.PyCObject_AsVoidPtr( view.winId() )

    # Call my C function
    my_C_render_function( win32gui.GetDC( hWnd ), width, height )



Now it's working as I expected. But this can be a bug in PySide because `PyCObject` is deprecated since Python 2.7, which obviously it's the Python version I'm using, so a new [ticket](http://bugs.openbossa.org/show_bug.cgi?id=695) was born.


### UPDATE:


The PySide behaviour is not a bug, read this [comment](http://bugs.openbossa.org/show_bug.cgi?id=695#c1) to know why.
