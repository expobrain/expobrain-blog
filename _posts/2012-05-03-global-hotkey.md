---
categories:
- Troubleshooting
class: post-template
comments: true
current: post
date: 2012-05-03 00:06:30+00:00
layout: post
navigation: true
slug: global-hotkey
subclass: post
tags:
- c/c++
- qt
title: Global hotkey
wordpress_id: 826
---

Let start by explaining the goal: we want to send a custom signal when the user press a combination of keys. Sound pretty easy, your are already thinking to override the `keyPressEvent()` and `keyReleaseEvent()` virtual methods of your `QMainWindow` with your custom code.

It's a fair solution, but not the so elegant, and what's happen if you have more than one `QMainWindow` instances or none at all?

<!--more-->

To solve the problem once for all I'll use a custom `QApplication` instance to catch the key press and release and to emit the signal. `QApplication` is a singleton and easy to retrieve its instance's pointer anywhere in your application; also it process all the events, including keyboard events, so we can plug our event filter to catch the hotkey.

I'll start by defining a subclass of `QApplication` with our custom signal:

```cpp
// ** myapplication.h **

#ifndef MYAPPLICATION_H
#define MYAPPLICATION_H

#include <qapplication>

class MyApplication : public QApplication
{
    Q_OBJECT

public:
    MyApplication(int& argc, char** argv);
    void notifyHotkeyStatus(bool value);

signals:
    void hotkey(bool);
};

#endif // MYAPPLICATION_H
```

```cpp
// ** myapplication.cpp **

#include "myapplication.h"


MyApplication::MyApplication(int& argc, char** argv):
    QApplication(argc, argv)
{
}


void MyApplication::notifyHotkeyStatus(bool value) {
    emit hotkey(value);
}
```

The `notifyHotkeyStatus()` method will emit a `hotkey(bool)` signal once when the hotkey is pressed (with a `true` value) and once when the hotkey is released (passing a `false` value).

Now I create a lame `QMainWindow` subclass which changes its background color when the hotkey is pressed. I'll show only the relevant parts, the rest of the code is the default stuff generated by Qt Creator:

```cpp
// ** mainwindow.h **

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    explicit MainWindow(QWidget *parent = 0);
    ~MainWindow();

public slots:
    void onHotkey(bool state);

private:
    Ui::MainWindow *ui;
};
```

```cpp
// ** mainwindow.cpp **

#include "mainwindow.h"


MainWindow::MainWindow(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainWindow)
{
    // Setup UI
    ui->setupUi(this);

    // Connect signals
    connect(qApp, SIGNAL(hotkey(bool)), this, SLOT(onHotkey(bool)));
}

MainWindow::~MainWindow()
{
    delete ui;
}

void MainWindow::onHotkey(bool state) {
    if (state) {
        setStyleSheet("background-color: green");
    } else {
        setStyleSheet("");
    }
}
```

As you see I'm retrieving a pointer to the `QApplication` by using the qApp macro and connecting the `onHotkey()` slot at the `hotkey(bool)` signal. That's all.

And now the interesting part: our event filter which will catch the hotkey press and release events. The header is pretty simple:

```cpp
#ifndef GLOBALEVENTFILTER_H
#define GLOBALEVENTFILTER_H

#include <qobject>


const Qt::KeyboardModifiers HOTKEY = Qt::ShiftModifier | Qt::ControlModifier;


class GlobalEventFilter : public QObject
{
    Q_OBJECT

public:
    GlobalEventFilter(QObject* parent);
    bool eventFilter(QObject* object, QEvent* event);

private:
    bool hotkey;
};

#endif // GLOBALEVENTFILTER_H
```

The implementation instead needs to be explained step. The constructor just initialise the `hotkey` private flag, I'll explain its purpose later.

```cpp
GlobalEventFilter::GlobalEventFilter(QObject* parent):
    QObject(parent)
{
    hotkey = false;
}
```

The first part of the `eventFilter()` method implementation just casts the parent and exits if it's not a instance of `MyApplication`

```cpp
bool GlobalEventFilter::eventFilter(QObject* object, QEvent* event) {
    // Skip if parent is not a custom application
    MyApplication* app = dynamic_cast<myapplication *>(parent());

    if (app == NULL) {
        return false;
    }
```

Now I check if the event is a `KeyPressEvent` and if the current modifiers flags matches our hotkey.

```cpp
    // Check key press event
    if (event->type() == QEvent::KeyPress) {
        if (!hotkey && static_cast<qkeyevent *>(event)->modifiers() == HOTKEY) {
            // Emit signal
            app->notifyHotkeyStatus(true);

            // Store highlight status
            hotkey = true;

            // Stop propagation
            return true;
        }
    }
```

I'm using the value of the `hotkey` flag to emit the `hotkey(bool)` signal only once on key press; no more `hotkey(bool)` signals will be emitted until the hotkey will be release.

```cpp
    // Check key release event
    if (event->type() == QEvent::KeyRelease) {
        // Emit highlightHelp(false) if hotkey's combination is not pressed
        // and they where active before
        if (hotkey && static_cast<qkeyevent *>(event)->modifiers() != HOTKEY) {
            // Emit signal
            app->notifyHotkeyStatus(false);

            // Reset highlight status
            hotkey = false;

            // Stop propagation
            return true;
        }
    }
```

The key release event check its specular to the key press event check: I check if the hotkey was pressed before and, if the current modifiers doesn't matches the hotkey, we emit the `hotkey(bool)` signal and reset the flag.

The last line of code of the `eventFilter()` is trivial:

```cpp
    // Propagate event
    return false;
}
```

Now it's time to put al together and run a small test. I'll create a `MyApplication` instance with my custom event filter, and two main windows instances as demonstration:

```cpp
// ** main.cpp **

int main(int argc, char *argv[])
{
    MyApplication a(argc, argv);
    a.installEventFilter(new GlobalEventFilter(a.instance()));

    MainWindow w1, w2;

    w1.show();
    w2.show();

    return a.exec();
}
```

Run the code and when you will press the hotkey combination (SHIFT+CTRL or SHIFT+CMD on macOS) the windows' background will change to green.

Well, anyway I didn't all this work just to change a window's backgrounds :-)!

[Here](https://github.com/expobrain/global-hotkey-qt) you can download the source code of this article. Have fun with it!
