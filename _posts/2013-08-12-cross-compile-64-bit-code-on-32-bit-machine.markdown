---
author: admin
comments: true
date: 2013-08-12 18:29:02+00:00
layout: post
slug: cross-compile-64-bit-code-on-32-bit-machine
title: Cross-compile 64-bit code on 32-bit machine
wordpress_id: 1571
categories:
- Troubleshooting
tags:
- 32-bit
- 64-bit
- c/c++
- disassembly
- gcc
- gdb
---

Now that I have a spare machine where I can do all my experiments, I can start again to write posts about [Disassembly C code for fun](http://www.expobrain.net/category/disassembly/) but, wait, my current hardware is a 32-bit Pentium-M CPU and I want to build and disassembly 64-bit code!

Let's set up my Ubuntu for 64-bit cross-compilation.

<!--more-->

The trick is to install the `gcc` and `gdb` packages to do cross-compilation. On an Ubuntu system you can just issue:

{% highlight bash %}
$ sudo apt-get install gcc-multilib gdb-multiarch
{% endhighlight %}

After the installation of the packages you can build an disassembly your 64-bit even on a 32-bit hardware. For example this code:

{% highlight c %}
int main {
    return 0;
}
{% endhighlight %}

will be compiled and disassembled with this:

{% highlight bash %}
$ cc -g -m64 main.c
$ gdb-multiarch a.out
GNU gdb (Ubuntu/Linaro 7.4-2012.04-0ubuntu2.1) 7.4-2012.04
Copyright (C) 2012 Free Software Foundation, Inc.
License GPLv3+: GNU GPL version 3 or later <http://gnu.org/licenses/gpl.html>
This is free software: you are free to change and redistribute it.
There is NO WARRANTY, to the extent permitted by law.  Type "show copying"
and "show warranty" for details.
This GDB was configured as "i686-linux-gnu".
For bug reporting instructions, please see:
<http://bugs.launchpad.net/gdb-linaro/>...
Reading symbols from /home/expo/a.out...done.
(gdb) disas main
Dump of assembler code for function main:
   0x00000000004004b4 <+0>: push   %rbp
   0x00000000004004b5 <+1>: mov    %rsp,%rbp
   0x00000000004004b8 <+4>: mov    $0x0,%eax
   0x00000000004004bd <+9>: pop    %rbp
   0x00000000004004be <+10>:    retq
End of assembler dump.

{% endhighlight %}

Note the extra `-m64` argument of `cc` which tells the compiler to produce 64-bit code and the use of `gdb-multiarch` instead of the plain `gdb` to be able to interpreter the 64-bit debug symbols.
