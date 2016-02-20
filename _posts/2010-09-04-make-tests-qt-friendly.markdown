---
author: admin
comments: true
date: 2010-09-04 17:17:22+00:00
layout: post
slug: make-tests-qt-friendly
title: Make tests Qt-friendly
wordpress_id: 489
categories:
- Guides
- Troubleshooting
tags:
- pyqt
- python
- qt
- segmentation fault
- unittest
---

![]({{ site.url }}/media/2010/06/QT4Logo.jpg)

Testing Qt code with the Python `unittest` module is simple as ever.

<!-- more -->Take a look to this unittest code:



    from PyQt4 import QtGui
    import sys
    import unittest

    class TestQtWindow( unittest.TestCase ):

        app = QtGui.QApplication( sys.argv )

        def test_window1(self):
            window = QtGui.QMainWindow( None )

            window.show()

            self.assertTrue( isinstance( window, QtGui.QMainWindow ) )
            self.assertTrue( window.isVisible() )

        def test_window2(self):
            window = QtGui.QMainWindow( None )

            window.show()

            self.assertTrue( isinstance( window, QtGui.QMainWindow ) )
            self.assertTrue( window.isVisible() )

    if __name__ == '__main__':
        unittest.main()



This example just test the creation of two `QMainWindow` instances, not very useful, but it's enough for our purposes.

Only one note: remember to create the `QApplication` instance at class level and not at instance level or you'll get a `Segmentation fault` after all the test are ran.
