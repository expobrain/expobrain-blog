---
author: admin
comments: true
date: 2013-05-22 11:43:03+00:00
layout: post
slug: merge-sorted-arrays-the-fix
title: 'Merge sorted arrays: the fix'
wordpress_id: 1280
categories:
- Guides
- Troubleshooting
tags:
- iterators
- merge-sort
- python
- sort algorithm
- unit tests
---

Shame on me in the previous post [Merge sorted arrays](http://www.expobrain.net/2013/01/18/merge-sorted-arrays/) I made a stupid error in the code with prevents the iterator to return the correct merge array from the arrays in the input.

<!-- more -->

I used the `next()` built-in function without passing the `default` parameter, causing a `StopIteration` exception to be raised and exiting the merge sort algorithm earlier than expected.

I fixed the code and at the same time added a `key` optional keyword to be able to pass a callable used during comparisons:


    
    
    import itertools
    
    
    def merge_sort_with_key(a, b, key=None):
        # Set up iterators over the input sequences
        if key is None:
            a = itertools.izip(a, a)
            b = itertools.izip(b, b)
        else:
            k = lambda x: (key(x), x)
        
            a = itertools.imap(k, a)
            b = itertools.imap(k, b)
     
        # Fetch first elements from sequences
        a_next = next(a, StopIteration)
        b_next = next(b, StopIteration)
     
        # Consume the input's sequences
        while (a_next, b_next) != (StopIteration, StopIteration):
            if (a_next != StopIteration 
                and (b_next == StopIteration or a_next[0] < b_next[0])):
                
                yield a_next[1]
                a_next = next(a, StopIteration)
                
            elif b_next != StopIteration:
                yield b_next[1]
                b_next = next(b, StopIteration)
    



From [here](http://www.expobrain.net/wp-content/uploads/2013/05/mergesort.zip) you can download the file with the original merge sort iterator with fixes and the new version with the `key` keyword plus some unit tests to prove the correctness of the algorithm implementation.
