---
author: admin
comments: true
date: 2012-03-01
layout: post
slug: open-urls-in-external-browser-by-javascript-in-webkit
title: Open URLs in external browser by Javascript in WebKit
wordpress_id: 774
categories:
- Troubleshooting
tags:
- c/c++
- javascript
- qt
- webkit
---

It's very simple with the QtWebKit APIs to open an link with your default browser from a QWebView (you can find some solutions like [this](http://stackoverflow.com/questions/6951199/qwebview-doesnt-open-links-in-new-window-and-not-start-external-application-for) in [StackOverflow](http://stackoverflow.com/) about that) but that works well only with `<a>` elements. If you are opening an external browser by a `window.open()` JavaScript function you need a whole different approach.

<!-- more -->



Let's start with a simple window with a WebKit view:



    MainWindow::MainWindow(QWidget *parent) :
    	QMainWindow(parent)
    {
    	browser = new QWebView(this);

    	browser->setHtml("<button onclick="window.open('http://www.google.com')">click me</button>");

    	setCentralWidget(browser);
    }



This is just a page with a button which should open Google's website into a new window. In our needs the new windows should be the default browser on our system.

QWebPage has a `createWindow()` called when navigating to a new link (`<a>` element or `window.open()` function) and returns the page instance to be used to load the new URL. Again, the QWebPage docs explain to us the `acceptNavigationRequest()` method will be called with the new URL and there is the place where we will plug our code to open the browser.

Before showing the code, lets recap the sequence when a `window.open()` function is called:




  1. The user clicks the button and the `onclick()` event's code will be executed


  2. QWebView calls `QWebPage::createWindow()` which returns a new QWebPage instance to be used to load the URL http://google.com


  3. QWebView calls `QWebPage::acceptNavigationRequest()` to proceed or abort the URL loading by the boolean value returned by the method


  4. If returns true it loads the URL else abort


We create a new `Page` class and override both `QWebPage::createWindow()` and `QWebPage::acceptNavigationRequest()`. The header file:



    #include <qwebpage>

    class Page : public QWebPage
    {
    	Q_OBJECT
    public:
    	explicit Page(QWidget *parent = 0);

    	bool acceptNavigationRequest(QWebFrame *frame, const QNetworkRequest &request;, NavigationType type);
    	QWebPage * createWindow(WebWindowType type);

    };



And the source file:



    #include <qnetworkrequest>
    #include <qdesktopservices>

    Page::Page(QWidget *parent) :
    	QWebPage(parent)
    {
    }

    bool Page::acceptNavigationRequest(QWebFrame *frame, const QNetworkRequest &request;, NavigationType type) {
    	if (type == NavigationTypeOther) {
    		QDesktopServices::openUrl(request.url());
    		return false;
    	} else {
    		return true;
    	}
    }

    QWebPage * Page::createWindow(WebWindowType type) {
    	return new Page();
    }



The `createWindow()` method simply returns a new `Page` instance.

In the `acceptNavigationRequest()` method instead we check if the type of the request is a `QWebPage::NavigationTypeOther` and then we open the URL in the external browser, returning False to stop WebKit loading the page.

That's all.
