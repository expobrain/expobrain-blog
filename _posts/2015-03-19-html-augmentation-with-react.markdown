---
author: expobrain
comments: true
date: 2015-03-19 23:44:12+00:00
layout: post
slug: html-augmentation-with-react
title: HTML augmentation with React
wordpress_id: 1999
categories:
- Various things
tags:
- html
- javascript
- react
---

These days is all about [React](http://facebook.github.io/react/). Most of the people are leaving the bandwagon of AngularJS in favour of the React's bandwagon for a lot of different technical and not-technical reasons (_#TROLLING_ they switch because is the new JavaScript _Toy of the Year_). But today and here I'll not talk about that, however I'll talk about if it's possible to use React to augment a static or server-side rendered page; this is necessary to allow search engines to crawl and index your website (remember that crawlers doesn't run Javascript code). The long answer is [TL;RL](http://www.urbandictionary.com/define.php?term=tl%3Brl), the short answer is _"keep reading"_.


<!-- more -->




## The example code



Let's start with the example code taken directly form the react [documentation](http://facebook.github.io/react/):

[code lang="javascript"]
var Timer = React.createClass({
  getInitialState: function() {
    return {secondsElapsed: 0};
  },
  tick: function() {
    this.setState({secondsElapsed: this.state.secondsElapsed + 1});
  },
  componentDidMount: function() {
    this.interval = setInterval(this.tick, 1000);
  },
  componentWillUnmount: function() {
    clearInterval(this.interval);
  },
  render: function() {
    return (
      <div>Seconds Elapsed: {this.state.secondsElapsed}</div>
    );
  }
});

React.render(<Timer />, document.getElementById("timer"));
[/code]

this will tender client-side the number of seconds since the load of the page.

Now we prepare a simple static page with the same content as static HTML:

[code lang="html"]
<html>
    <head>
        <script src="build/react.js"></script>
        <script src="build/JSXTransformer.js"></script>
    </head>
    <body>
        <div id="timer">Seconds Elapsed: 0</div>
        <script src="build/Timer.js"></script>
    </body>
</html>
[/code]

Nothing exciting here but juts a small but important consideration: this page can be seen by a crawler (so indexed) and by any browser without Javascript.




## Server-side and client-side render



How this sample page is render by the browser and what the crawler can see?

Let's start with the content returned by the HTTP request:

[code lang="html"]
<html>
    <head>
        <script src="build/react.js"></script>
        <script src="build/JSXTransformer.js"></script>
    </head>
    <body>
        <div id="timer">Seconds Elapsed: 0</div>
        <script src="build/Timer.js"></script>
    </body>
</html>
[/code]

Now, if someone was expecting something else please got to review the basics about how the World Wide Web works :-)

So now lets see if or React code can augment this HTML without extra work form us:

[code lang="HTML"]
<html>
    <head>
        <script src="build/react.js"></script>
        <script src="build/JSXTransformer.js"></script>
    </head>
    <body>
        <div id="timer">
            <div data-reactid=".0">
                <span data-reactid=".0.0">Seconds Elapsed: </span>
                <span data-reactid=".0.1">4</span>
            </div>
        </div>
        <script src="build/Timer.js"></script>
    </body>
</html>
[/code]

Something happened to our HTML: the original content `div` element is replaced with a new `div` element and a couple of span elements and all of them has a `data-reactid` attribute. This attribute is used by react to keep track of the DOM and apply changes as a diff between the internal virtual representation and the current DOM in the browser.




## Conclusions



So yes, React can augment a server-side rendered page transparently without the need to drastically modify the page (except to add the HTML load the scripts) or to choose a specific technology on the backend to be compatible with React.

This will allow you to be able to be index by the search engines and have improve the UX of your website at the same time, also on browser not supported by React of with Javascript disabled your website will be still usable by the user as well.

