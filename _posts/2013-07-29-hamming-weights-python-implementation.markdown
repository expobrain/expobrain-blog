---
author: admin
categories: [Troubleshooting]
comments: true
date: 2013-07-29 18:45:31
image: {url: /media/2013/07/circuit.gif}
layout: post
slug: hamming-weights-python-implementation
tags: [hamming weight, popcount, python]
title: Hamming weight's Python implementation
wordpress_id: 1544
---

Counting the number of 1's in a binary representation of a number (aka [Hamming weight](https://en.wikipedia.org/wiki/Hamming_weight) aka _popcount_ when binary numbers are involved) with Python using different implementations (naive implementations are obviously excluded :-) ).

<!-- more -->



# Implementation and benchmarking



To compute the Hamming weight of a number in binary representation two implementations are available, the first one is the generic implementation:


    
    
    def popcount(x):
        x -= (x >> 1) & 0x5555555555555555
        x = (x & 0x3333333333333333) + ((x >> 2) & 0x3333333333333333)
        x = (x + (x >> 4)) & 0x0f0f0f0f0f0f0f0f
        return ((x * 0x0101010101010101) & 0xffffffffffffffff ) >> 56
    





<blockquote>I did a small modification to the original implementation of the algorithm; I'll explain it later in the post</blockquote>

 

and this second one is optimised for cases where the given number has most of the bits set to 0:  


    
    
    def popcount_zero(x):
        c = 0
        while x:
            x &= x - 1
            c += 1
            
        return c
    

  

These implementations are difficult to remember when you don't have access to the Internet, so an easy to remember Python implementation can be done in a couple of instructions:


    
    
    def popcount_py(x):
        return bin(x).count("1")
    



Which one of these is the fastest one?

Let's run some benchmarks over these three implementations. I'll use the number 0x5555555555555555 because it has an equal number of 1's and 0's:


    
    
    $ python -m timeit -s "import popcount" "popcount.popcount(0x5555555555555555)"
    1000000 loops, best of 3: 1.25 usec per loop
    $ python -m timeit -s "import popcount" "popcount.popcount_zero(0x5555555555555555)"
    100000 loops, best of 3: 5.71 usec per loop
    $ python -m timeit -s "import popcount" "popcount.popcount_py(0x5555555555555555)"
    100000 loops, best of 3: 2.45 usec per loop
    



As I expected the `popcount_py()` is a little slower compared to the `popcount()` function because the built-in function calls. However the `popcount_zero()` function is much slower because the complexity of the function is _O(n)_ where _n_ is the number of 1's.



# Conclusion



The original _popcount_ algorithm is still fast even when implemented in Python; but if you do not remember it my the solution which is easier to remember is only 2 times slower. The version of the algorithm optimised for number with lower percentage of 1's is a lot slower because of the increase big-o complexity.

About the small modification I've done in the original algorithm. The original implementation is designed to count the number of 1's of 64-bit integers, so the result of the multiplication in the `return` statement (`x * 0x0101010101010101`) is truncated to the first 64 bits but the Python interpreter promote the integer to a 128-bit long breaking the algorithm. The solution is to mask all the bits above 64 to 0 by a bitwise AND with 0xffffffffffffffff. 
