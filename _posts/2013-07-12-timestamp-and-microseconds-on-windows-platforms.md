---
categories:
- Troubleshooting
class: post-template
comments: true
cover: media/date_and_time.jpg
current: post
date: 2013-07-12 20:05:52
layout: post
navigation: true
slug: timestamp-and-microseconds-on-windows-platforms
subclass: post
tags:
- '2.7'
- python
- timestamp
title: Timestamp and microseconds on Windows platforms
wordpress_id: 1487
---

The [datetime.datetime](http://docs.python.org/2/library/datetime.html#datetime-objects) object can return the current date and time with a resolution up to [microseconds](http://docs.python.org/2/library/datetime.html#datetime.datetime) which is true on *nix platforms but not completely true on Windows platforms.

<!-- more -->


## The problem

On both platforms, and at least with Python 2.7, the minimum resolution reported by `datetime` is 1 microsecond:


{% highlight python %}
>>> import datetime
>>> datetime.datetime.resolution
datetime.timedelta(0, 0, 1)
>>> datetime.datetime.resolution.microseconds
1
{% endhighlight %}


but the `datetime` object returned by the [datetime.now()](http://docs.python.org/2/library/datetime.html#datetime.datetime.now) function has a little difference between *nixes and Windows systems. On *nixes consecutive calls to `datetime.now()` returns a sequence like this one:


{% highlight python %}
>>> datetime.now()
datetime.datetime(2013, 7, 12, 19, 23, 38, 628596)
>>> datetime.now()
datetime.datetime(2013, 7, 12, 19, 23, 39, 244587)
>>> datetime.now()
datetime.datetime(2013, 7, 12, 19, 23, 39, 788556)
{% endhighlight %}


where the last number is the microsecond part of the `datetime` object. On Windows however the result is slightly different:


{% highlight python %}
>>> datetime.now()
datetime.datetime(2013, 7, 12, 19, 25, 27, 741000)
>>> datetime.now()
datetime.datetime(2013, 7, 12, 19, 25, 28, 381000)
>>> datetime.now()
datetime.datetime(2013, 7, 12, 19, 25, 28, 956000)
{% endhighlight %}


we still have microseconds but something is not right: the microseconds are multiple of 1000 which means the actual minimum resolution for a `datetime` object returned by `datetime.now()` is 1 millisecond.


## The solution

This is not an issue if you are handling timestamps like the major of use cases where a timestamp is involved. In my case however I needed a timestamp which was unique and consecutive which is satisfied on *nix systems, the code is not fast enough to be run in less than 1 microsecond, but not in Windows systems where the code is obviously fast enough to be run in less than 1 millisecond, raising an exception because the timestamp wasn't unique and consecutive.

I made a workaround to simulate the microsecond resolution even on Windows system by using a microseconds generator:


{% highlight python %}
import datetime
import sys

class Event(object):

    if sys.platform == "win32":
        import itertools

        _usec_generator = itertools.cycle(xrange(1000))

    def __init__(self):
        self.timestamp = datetime.datetime.now()

        if sys.platform == "win32":
            self.timestamp = self.timestamp.replace(
                microsecond=self.timestamp.microsecond + self._usec_generator.next()
            )
{% endhighlight %}


The `_usec_generator` uses the [itertools.cycle](http://docs.python.org/2/library/itertools.html#itertools.cycle) iterator to return a number in the range 0..999 to be used as fake microsecond value for the `datetime` object. The generator will return an incremented number at every call adding the number to the current microsecond value.

Supposing I'm creating multiple Event instances in the same millisecond, the result will be:


{% highlight python %}
>>> Event().timestamp
>>> datetime.datetime(2013, 7, 12, 20, 58, 25, 266000)
>>> Event().timestamp
>>> datetime.datetime(2013, 7, 12, 20, 58, 26, 266001)
>>> Event().timestamp
>>> datetime.datetime(2013, 7, 12, 20, 58, 26, 266002)
{% endhighlight %}


As you can see now the microseconds starts with a 000 but increment at every `Event` creation satisfying the requirement of an unique and consecutive timestamp.