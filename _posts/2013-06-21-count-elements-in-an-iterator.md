---
categories:
- Troubleshooting
class: post-template
comments: true
cover: media/algorithms_small_logo.png
current: post
date: 2013-06-21 14:36:19
layout: post
navigation: true
slug: count-elements-in-an-iterator
subclass: post
tags:
- iterators
- python
title: Count elements in an iterator
wordpress_id: 1373
---

Counting elements in a list, tuple or dictionary in Python is trivial, count the elements in a iterator is not. Because of the nature of a generator it's not possibile to know how many elements will be returned from the iterator, only one element is returned at time and the next element is not guarantee to exist.

<!-- more -->

As pointed out in [this](http://stackoverflow.com/questions/3345785/getting-number-of-elements-in-an-iterator-in-python) thread on StackOverflow the best efficient way to count the elements form an iterator is this:

    C = sum(1 for _ in <iterator>)

instead of:

    C = len(tuple(<iterator>))

which convert the original iterator into a tuple e counts the elements in the tuple. This is inefficient because the number of elements return by the iterator can be huge so we are allocating huge amount of memory in the stack and throw it away just after the execution of the `len()` function.

We are good law abiding developers and we don't like bad and/or poor solutions.

To understand how the first code works and why is so memory efficient we expand the code in two steps:

    A = (1 for _ in <iterator>)
    C = sum(A)

The first line creates a new iterator from the original one but for every element in the original iterator the number 1 will be returned by the A iterator. This means the original iterator is consumed but we allocate enough memory to store only one element at time and not all the elements returned by the iterator.

The second line simply apply the `sum()` function to the A iterator which returns 1 for every element returned by the original iterator. If N is the number of element returned by the original iterator C will be:

    C = N * 1 = N

which is the number of element in the original iterator.

Space used for every iteration: the size of the integer 1 and the size of the element returned by the original iterator. Talking about speed the bottleneck is the original iterator, our code will be executed at C speed.
