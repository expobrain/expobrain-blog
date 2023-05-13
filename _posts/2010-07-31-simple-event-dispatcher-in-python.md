---
categories:
- Guides
class: post-template
comments: true
current: post
date: 2010-07-31 13:54:38+00:00
layout: post
navigation: true
slug: simple-event-dispatcher-in-python
subclass: post
tags:
- dispatcher
- event
- example
- listener
- pubsub
- pyqt
- pyside
- python
- wxpython
title: Simple event dispatcher in Python
wordpress_id: 375
---

In this post I'll show you a simple event dispatcher implementation in Python. Every big UI frameworks can play with events an listener without reinvent the wheel but sometimes you need a very simple way to dispatch and receive events in you application without involve in megabytes of an external framework.

<!-- more -->

This code is a simple example and I'm sure it's not a complete implementation. Instead, I think this example is a good starting point to implement your custom event-dispatcher mini-framework.

### The event

Let's start from the basic unit of work: the Event class. Here the code:

    class Event( object ):
        """
        Generic event to use with EventDispatcher.
        """

        def __init__(self, event_type, data=None):
            """
            The constructor accepts an event type as string and a custom data
            """
            self._type = event_type
            self._data = data

        @property
        def type(self):
            """
            Returns the event type
            """
            return self._type

        @property
        def data(self):
            """
            Returns the data associated to the event
            """
            return self._data

As you can see this class is really straight-forward. The Event class as the purpose to carry on the type of the event and, optionally, the data associated to the event. The type property and the data property are read-only so they cannot be changed by error by the listeners.

### The event dispatcher

Now is the time to take a look to the EventDispatcher class. This class is a little bit bigger but is really simple:

    class EventDispatcher( object ):
        """
        Generic event dispatcher which listen and dispatch events
        """

        def __init__(self):
            self._events = dict()

        def __del__(self):
            """
            Remove all listener references at destruction time
            """
            self._events = None

        def has_listener(self, event_type, listener):
            """
            Return true if listener is register to event_type
            """
            # Check for event type and for the listener
            if event_type in self._events.keys():
                return listener in self._events[ event_type ]
            else:
                return False

        def dispatch_event(self, event):
            """
            Dispatch an instance of Event class
            """
            # Dispatch the event to all the associated listeners
            if event.type in self._events.keys():
                listeners = self._events[ event.type ]

                for listener in listeners:
                    listener( event )

        def add_event_listener(self, event_type, listener):
            """
            Add an event listener for an event type
            """
            # Add listener to the event type
            if not self.has_listener( event_type, listener ):
                listeners = self._events.get( event_type, [] )

                listeners.append( listener )

                self._events[ event_type ] = listeners

        def remove_event_listener(self, event_type, listener):
            """
            Remove event listener.
            """
            # Remove the listener from the event type
            if self.has_listener( event_type, listener ):
                listeners = self._events[ event_type ]

                if len( listeners ) == 1:
                    # Only this listener remains so remove the key
                    del self._events[ event_type ]

                else:
                    # Update listeners chain
                    listeners.remove( listener )

                    self._events[ event_type ] = listeners

The constructor of the EventDispatcher class simply create an empty "protected" dictionary of event->listeners and set to None it when __del__() method is called. Because __del__() method is called when the class is about to be destroyed we are sure no reference to listeners are left in memory.

### The example

In this example we create a simple event, MyEvent, and two classes: a class who send events. WhoAsk, and a class who listen for events and send a response back to the sender through another event, WhoRespond.

    class MyEvent( Event ):
        """
        When subclassing Event class the only thing you must do is to define
        a list of class level constants which defines the event types and the
        string associated to them
        """

        ASK     = "askMyEvent"
        RESPOND = "respondMyEvent"

The method is very simple, only two events are implemented, ASK and RESPOND.

    class WhoAsk( object ):
        """
        First class which ask who is listening to it
        """
        def __init__(self, event_dispatcher):
            # Save a reference to the event dispatch
            self.event_dispatcher = event_dispatcher

            # Listen for the RESPOND event type
            self.event_dispatcher.add_event_listener(
                MyEvent.RESPOND, self.on_answer_event
            )

        def ask(self):
            """
            Dispatch the ask event
            """
            print ">>> I'm instance {0}. Who are listening to me ?".format( self )

            self.event_dispatcher.dispatch_event(
                MyEvent( MyEvent.ASK, self )
            )

        def on_answer_event(self, event):
            """
            Event handler for the RESPOND event type
            """
            print "<<< Thank you instance {0}".format( event.data )

The WhoAsk class adds an event listener for the MyEvent.RESPOND event and implement and ask() method which dispatch and MyEvent.ASK.

    class WhoRespond( object ):
        """
        Second class who respond to ASK events
        """
        def __init__(self, event_dispatcher):
            # Save event dispatcher reference
            self.event_dispatcher = event_dispatcher

            # Listen for ASK event type
            self.event_dispatcher.add_event_listener(
                MyEvent.ASK, self.on_ask_event
            )

        def on_ask_event(self, event):
            """
            Event handler for ASK event type
            """
            self.event_dispatcher.dispatch_event(
                MyEvent ( MyEvent.RESPOND, self )
            )

WhoResponde class is similar to WhoAsk class except it has only the listener for the MyEvent.ASK event.
Both WhoAsk and WhoRepsond classes accepts the instance of EventDispatcher class as a parameter for their constructors.
Finally we test our example:

    # Create and instance of event dispatcher
    dispatcher = EventDispatcher()

    # Create an instance of WhoAsk class and two instance of WhoRespond class
    who_ask = WhoAsk( dispatcher )
    who_responde1 = WhoRespond( dispatcher )
    who_responde2 = WhoRespond( dispatcher )

    # WhoAsk ask :-)
    who_ask.ask()

We create an instance of EventDispatcher class, and instance of WhoAsk class and two instance of WhoRespond class, then we call the ask() method of WhoAsk class.

    $ python eventdispatcher.py
    >>> I`m instance <__main__.WhoAsk object at 0x100491ad0>. Who are listening to me ?
    <<< Thank you instance <__main__.WhoRespond object at 0x100491b10>
    <<< Thank you instance <__main__.WhoRespond object at 0x100491b50>

As you can see we get two MyEvent.RESPOND events for the MyEvent.ASK event because we have two classes which listen to it.

### Conclusion

Develop a simple event dispatcher mini-framework is really straight forward, and is some situations is more simple to use a custom event dispatcher system than try to adapt a third-party one.
If you want to learn more about event driven system, take a look at PubSub, [Qt Signals and Slots](http://doc.trolltech.com/4.6/signalsandslots.html) and [wxPython](http://www.wxpython.org/tut-part1.php). The documentation for Qt Signals and Slots reports examples in C++ but if you use [PyQt](http://www.riverbankcomputing.co.uk) or [PySide](http://www.pyside.org/) the classes, methods and logic is the same.
[Here]({{ site.url }}/media/eventdispatcher.py.zip) you can download the source code for the Event and EventDisatcher classes with also the example code.
