---
author: admin
categories: [Troubleshooting, Various things]
comments: true
date: 2013-08-15 11:43:45
image: {url: /media/power_of_2.jpg}
layout: post
slug: detect-if-a-number-is-power-of-2
tags: [algorithm, c/c++, complexity]
title: Detect if a number is power of 2
wordpress_id: 1557
---

Easy post today: simple method to detect if a number is a power of 2 in O(1) complexity.

Yes, O(1), no naive loops involved :-).

<!-- more -->

The code is very simple:




    bool powerof2(unsigned int n) {
        return n > 0 & !(n & (n - 1));
    }




The code looks cryptic, the core of the algorithm is the `n & (n - 1)` part. To understand why and how it's working lets see what's happen at binary level. Suppose the easy case where we want to test if 4 is a power of 2:




    n    4  00000100  &
    n-1  3  00000011
    ---  -  --------
         0  00000000




Subtracting 1 from a power of 2's number equals to inverting all the bits below the only set bit, applying a bitwise AND with the original number returns a 0. What's happen in case of a number which is NOT a power of 2, for example 6:




    n    6  00000110  &
    n-1  5  00000101
    ---  -  --------
         0  00000100




Subtracting 1 from the original number changes only the less significant bits but the most significant bit set to 1 is unchanged, the result is different than 0 so the given number is not a power of 2.

Now that we know how the core of the algorithm works the other parts of the boolean expression are easy to understand: the NOT invert the result of the `n & (n - 1)` operation to be true when the result is zero and the block `n > 0` ensures the given number is not zero (zero is not a power of 2).
