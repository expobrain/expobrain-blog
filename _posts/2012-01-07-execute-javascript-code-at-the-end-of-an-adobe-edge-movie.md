---
categories:
- Guides
class: post-template
comments: true
current: post
date: 2012-01-07 11:23:03+00:00
layout: post
navigation: true
slug: execute-javascript-code-at-the-end-of-an-adobe-edge-movie
subclass: post
tags:
- adobe edge
- flash
- html5
- javascript
title: Execute JavaScript code at the end of an Adobe Edge movie
wordpress_id: 744
---

[Adobe Edge](http://labs.adobe.com/technologies/edge/) is the new product form Adobe which will aim to replicate the features of Flash using HTML5 technology. I'm using Adobe Edge to create an animated introduction for a small GWT project and I ended up with the need to execute code at the end of the movie.

<!-- more -->Let's start creating a test Edge project with a simple animation (an rotating Adobe logo):

[![]({{ site.url }}/media/edge_js_1-300x175.png)]({{ site.url }}/media/edge_js_1.png)

Now click on the small icon on the left of _Actions_ in the _Timeline:_

[![]({{ site.url }}/media/edge_js_2-300x266.png)]({{ site.url }}/media/edge_js_2.png)

Select _complete_ and insert the code to call your external JavaScript code:

[![]({{ site.url }}/media/edge_js_3-300x203.png)]({{ site.url }}/media/edge_js_3.png)Now the _myExternalFunction()_ function will be called at the end f the Edge movie but if you dispaly the page in the browser nothing will happend because we have not yet impemeted the function in the HTML page.

So, save the project, open the _test.html _file and implement your JavaScript function:




    <html>
    <head>
      <title>Untitled</title>

      <script src="edge_includes/jquery-1.6.2.min.js" type="text/javascript"></script>
      <script src="edge_includes/jquery.easing.1.3.js" type="text/javascript"></script>
      <script src="edge_includes/edge.0.1.3.min.js" type="text/javascript"></script>
      <script src="edge_includes/edge.symbol.0.1.3.min.js" type="text/javascript"></script>
      <script src="test_edge.js" charset="utf-8" type="text/javascript"></script>
      <script src="test_edgeActions.js" charset="utf-8" type="text/javascript"></script>
      <link href="test_edge.css" rel="stylesheet"></link>


    <script type="text/javascript">
      function myExternalFunction () {
        window.alert("It works!");
      }
    </script>

    </head><body style="margin:0;padding:0;">
      <div id="stage" class="EDGE-15894577">
      </div>
    </body>
    </html>



If you reload the page now at the and of the movie your JavaScript function will be called and the alert will be shown:

[![]({{ site.url }}/media/edge_js_4-300x272.png)]({{ site.url }}/media/edge_js_4.png)

This method can be applied for any case you need to call external JavaScript functions or run small portions of JavaScript code.