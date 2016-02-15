---
author: expobrain
comments: true
date: 2014-01-27 23:36:43+00:00
layout: post
slug: internet-explorer-9-and-console-bug
title: Internet Explorer 9 and console bug
wordpress_id: 1859
categories:
- Guides
- Troubleshooting
tags:
- debug
- internet explorer
- javascript
---

Writing JavaScript code that works seamlessly on every major browser and release is really challenging and can be a nightmare if you are not using any third-party library like [jQuery](http://jquery.com/) or [Lo-Dash](http://lodash.com/) which hides the different browser's capabilities and implementation under a single and common API.

Recently I came across an interesting problem: a piece of JavaScript code was not executed on Internet Explorer 9 until the Developer Tool has been open at least once. Before jumping to the solution lets start with a simple example to trigger the problem in the first place.





## The Problem



First, a simple page with button which when pressed logs the action in the console and shows a alert on the screen (at this point some JavaScript experts out there already knows where is the bug and why :-) ):


    
    
    <html>
        <head>
            <script type="text/javascript" language="javascript">
                function buttonPressed () {
                    console.log('button pressed');
                    window.alert('Ok');
                }
            </script>
        </head>
        <body>
            <button type="button" onclick="buttonPressed()">Press me</button>
        </body>
    </html>
    



Open the page in Internet Explorer 9 and press the button: nothing will happen. Opening the Developer Tools by pressing _F12_ and pressing the button again will show the console message and the alert. The button's `onclick()` will still work even after closing the Developer Tool.

That's happening for a simple reason: on Internet Explorer 9 the `window.console` symbol is _undefined_ until the Developer Tools panel is open so our script will fail at `console.log('button pressed')`. A naive approach to solve this problem is to check if the `window.console` symbol is _undefined_ and define a stub to keep our code working:


    
    
    if (!window.console) {
        window.console = {
            log: function () {}
        };
    }
    





## The generic approach



Obviously this code is not complete nor suitable for production but it demonstrate what approach you should follow when writing cross-browser JavaScript code.

_Don't assume a browser's feature is present but test it first and mock or implement it if necessary._

Another case is when your website is using HTML5 technologies which are not implemented on all browser in the same way. As example the `getUserMedia` API is available under different names on different browsers so you'll need to write code like this:


    
    
    if (navigator.getUserMedia || navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia || navigator.msGetUserMedia) {
        // ...your code here...
    }
    



but it's not robust enough, what's happen if a new browser or browser's release exposes the `getUserMedia` API under a different name? Keeping the code updated can be a nightmare (you need to remember where and what feature your are using in which project).

That's why you should prefer the usage of third-party libraries which expose or enhance the API for you instead of custom code; in the case of HTML5 features [Modernizr](http://modernizr.com/) can be a good candidate.  
