---
author: admin
comments: true
date: 2013-03-26 19:09:42+00:00
layout: post
slug: beware-of-keywords-default-values
title: Beware of keyword's default values
wordpress_id: 1250
categories:
- Troubleshooting
tags:
- bugs
- mutable types
- python
---

Look this class definition, do you see what's is wrong and potentially generate big problems in you code?

<!-- more -->


    
    
    class Foo(object):
        
        def __init__(self, bars=[]):
            self.bars = bars
            
    



<!--more--!>

Before jumping straight to the solution lets play with some instances of that class:


    
    
    >>> foo1=Foo([1, 2, 3])
    >>> foo2=Foo([3, 4, 5])
    >>> foo1.bars
    [1, 2, 3]
    >>> foo2.bars
    [3, 4, 5]
    >>> foo1.bars.append(10)
    >>> foo2.bars.append(20)
    >>> foo1.bars
    [1, 2, 3, 10]
    >>> foo2.bars
    [3, 4, 5, 20]
    



Nothing really interesting here: I created two instances of `Foo` class passing two different list of numbers and added a value to both `bars` attributes.

Boring and useless. 

I'll try now using the default value for `bars` attribute defined in the class' constructor:


    
    
    >>> foo3=Foo()
    >>> foo4=Foo()
    >>> foo3.bars
    []
    >>> foo4.bars
    []
    >>> foo3.bars.append(10)
    >>> foo4.bars.append(20)
    >>> foo3.bars
    [10, 20]
    >>> foo4.bars
    [10, 20]
    



Wait a sec! I've added a single number to each attribute to each class but why both of them have the same content?

Looking back at the definition of the constructor the `bar` keyword
is optional and has a empty list as default value; but the list instance is created only once when the class is parsed by the interpreter.

So both parameters in `foo3` and `foo4` instances are using the same `list` instance and not a copy, that's why modifying the attribute in one instance alters the attribute the other one.

As a rule of thumb when you are defining default values for methods/function keywords pay attention at the type of the default value. It's safe to use immutable types (strings, integers, floats, None) but mutable types can lead to bugs in your application difficult to track down.

Coming back to my example here a safer way to implement the class: 


    
    
    class Foo(object):
        
        def __init__(self, bars=None):
            self.bars = bars if bars is None else []
            
    



This way a new `list` instance will be created in case the `bars` keyword is null.

