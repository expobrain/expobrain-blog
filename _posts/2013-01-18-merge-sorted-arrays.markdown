---
author: admin
comments: true
date: 2013-01-18 00:10:04+00:00
layout: post
slug: merge-sorted-arrays
title: Merge sorted arrays
wordpress_id: 1182
categories:
- Guides
tags:
- algorithms
- merge-sort
- python
---

Today I'll show how merge two different arrays of sorted elements into one single sorted array as a generator. I'll use a modification of the [merge-sort algorithm](http://en.wikipedia.org/wiki/Merge_sort) to merge the arrays.

<!-- more -->



<blockquote>**UPDATE: This code has a bug which explained in [Merge sorted arrays: the fix](http://www.expobrain.net/2013/05/22/merge-sorted-arrays-the-fix/) alongside an improved version of the algorithm implementation**</blockquote>



This is the implementation of the `merge_sort` modified algorithm:

    
    
    import collections
    
    def merge_sort(a, b):
        # Be sure the input sequences will be iterators
        if not isinstance(a, collections.Iterator):
            a = iter(a)
            
        if not isinstance(b, collections.Iterator):
            b = iter(b)
        
        # Fetch first elements from sequences
        a_next = next(a)
        b_next = next(b)
    
        # Consume the input's sequences
        while a_next != b_next != StopIteration:
            if a_next < b_next:
                yield a_next
                a_next = next(a)
            else:
                yield b_next
                b_next = next(b)
    


The main difference is the missing divide-and-conquer process because I'm interested not to sort a list of elements but to merge to sorted lists of elements into a single list using an iterator.

Suppose we have a sorted array _A_ of even numbers in the range 0..100 and the array _B_ of odd numbers in the range 0..100:

    
    
    A = xrange(0, 100, 2)
    B = xrange(1, 100, 2)
    


It's possible to return the single merge sorted array:

    
    
    >>> print([n for n in merge_sort(A, B)])
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98]
    




### How it works


The theory behind the `merge_sort()` is simple: because the input sequences are already sorted the generator will compare on element at time from both sequences and yield the lowest element and fetching the next element in the sequence.

In the case the lowest element is from the array _A_ the element will be returned and the next element will be fetched from the array _A_; otherwise the element from the array _B_ will be returned and the next element from the array _B_ will be fetched.

This will continue until both arrays will be consumed. If one of the arrays has already consumed the `merge_sort()` iterator will still returns values from the second array until it will be consumed as well.


### Complexity and memory usage


The complexity of the `merge_sort()` iterator is _O(n)_ where _n_ is the sum of the number of elements in both input arrays.

The memory usage is _O(2)_ because only 2 element will be stored in memory excluding the input sequences.
