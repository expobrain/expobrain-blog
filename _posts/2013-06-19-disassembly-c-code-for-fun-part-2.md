---
author: admin
categories: [Disassembly, Guides]
comments: true
date: 2013-06-19
image: {url: /media/assembler.gif}
layout: post
slug: disassembly-c-code-for-fun-part-2
tags: [asm, c/c++, clang, gdb, hello world, instruction pointer, x86-64]
title: 'Disassembly C code for fun: part 2'
wordpress_id: 1344
---

So, in the previous post [Disassembly C code for fun: part 1]({{ site.url }}/2013/06/16/disassembly-c-code-for-fun-part-1/) I didn't used as example the well known "Hello World!" code, but for a good reason: I need to explain some basics of the disassembly process (prologue, epilogue, stack, etc.) before proceed any further.

Anyway in this post I will use a standard "Hello World!" example to look at function calls.

**Update:** Don't miss the next post [Disassembly C code for fun – Part 3: for loop]({{ site.url }}/2013/06/20/disassembly-c-code-for-fun-part-3-for-loop/)

<!-- more -->



### Disassembly


The code for this post:




    #include <stdio.h>

    int main()
    {
        printf("Hello world!");
        return 0;
    }




Compile and disassembly:




    $ cc -g main.c
    $ gdb a.out
    Dump of assembler code for function main:
    0x0000000100000f00 <main+0>:	push   %rbp
    0x0000000100000f01 <main+1>:	mov    %rsp,%rbp
    0x0000000100000f04 <main+4>:	sub    $0x10,%rsp
    0x0000000100000f08 <main+8>:	lea    0x51(%rip),%rdi        # 0x100000f60
    0x0000000100000f0f <main+15>:	movl   $0x0,-0x4(%rbp)
    0x0000000100000f16 <main+22>:	mov    $0x0,%al
    0x0000000100000f18 <main+24>:	callq  0x100000f34 <dyld_stub_printf>
    0x0000000100000f1d <main+29>:	mov    $0x0,%ecx
    0x0000000100000f22 <main+34>:	mov    %eax,-0x8(%rbp)
    0x0000000100000f25 <main+37>:	mov    %ecx,%eax
    0x0000000100000f27 <main+39>:	add    $0x10,%rsp
    0x0000000100000f2b <main+43>:	pop    %rbp
    0x0000000100000f2c <main+44>:	retq
    End of assembler dump.






### Stack frame


Lets skip the prologue and we see in `<main+4>` it's allocating 16 (0x10) bytes on the stack:




    0x0000000100000f04 <main+4>:	sub    $0x10,%rsp




the first 4 bytes (RBP-4) will store the return value of the function, the next 4 bytes will store the return value of the `printf` function call (RBP-8). The remain 8 bytes are not used, they do no change during the code's execution.

In x86_64 calling conventions if a function call is involved the stack must be a multiple of 16-bytes, it's primary a [software requirement](http://software.intel.com/en-us/forums/topic/291241#comment-1541265) even as a side effect the CPU cache [can take advantage](http://software.intel.com/en-us/forums/topic/291241#comment-1541267) of the situation.



### Function call



Time to analyse the function call:




    0x0000000100000f08 <main+8>:	lea    0x51(%rip),%rdi        # 0x100000f60




This loads the address obtained by the sum of the instruction pointer register RIP plus an offset of 81 (0x51) bytes into the RDI register. The content of the RDI register is the first location of memory where the string "Hello World!" is stored and it's the first argument of the `printf()` function (remember that the first argument of the `printf()` is a pointer to the first element of the array of chars).

However if you put breakpoint at 0x100000f08 and do the math RIP+0x51 the result will be 0x100000f59 instead of 0x100000f60, one byte missing! The CPU had stopped the execution of the code before loading the instruction stored into the location 0x100000f08, so it's natural to have the value 0x100000f08 in the RIP register. When the instruction in 0x100000f08 will be loaded into the CPU the RIP register will advance by 1 byte and the result of the address calculation will be coherent.




    0x0000000100000f0f <main+15>:	movl   $0x0,-0x4(%rbp)
    0x0000000100000f16 <main+22>:	mov    $0x0,%al




The first instruction loads the return value of the `main()` function, we were expecting this instruction just after the stack frame setup (after `sub $0x10,%rsp`) so it looks like out of place.

The second instruction set the number of variable arguments to be passed to the function, in this case no values will be formatted by the `printf()` function so a zero will be stored into AL (which is the lower 8 bits of the RAX register).




    0x0000000100000f18 <main+24>:	callq  0x100000f34 <dyld_stub_printf>




Is the real call to `printf()` on the Mac OS X system.




    0x0000000100000f1d <main+29>:	mov    $0x0,%ecx
    0x0000000100000f22 <main+34>:	mov    %eax,-0x8(%rbp)
    0x0000000100000f25 <main+37>:	mov    %ecx,%eax




Well, here it's a little confusing. We know by the calling conventions that EAX contains the return value of the function (in this case 12 (0xc) which is the number of characters printed on the screen) and we <main+34> is storing it  into RBP-8 just after the return value of the `main()` function.

What I cannot understand is storing 0 (0x0) into ECX and moving it into EAX just before the epilogue. I was expecting something similar to `mov 0x0,%eax` like in the previous post's example. Also the content of ECX after the `printf()` function call is the same as EAX.

I wonder clang is cleaning up ECX after the function call and using it as the `main()` return value because it's faster than loading the value from RBP-4.



### Optimised and cleaned up disassembly



In this case compiling the code with the optimisations really improves the readability:




    $ cc -g -O3 main.c
    $ gdb a.out
    Dump of assembler code for function main:
    0x0000000100000f10 <main+0>:	push   %rbp
    0x0000000100000f11 <main+1>:	mov    %rsp,%rbp
    0x0000000100000f14 <main+4>:	lea    0x3d(%rip),%rdi        # 0x100000f58
    0x0000000100000f1b <main+11>:	xor    %al,%al
    0x0000000100000f1d <main+13>:	callq  0x100000f2c <dyld_stub_printf>
    0x0000000100000f22 <main+18>:	xor    %eax,%eax
    0x0000000100000f24 <main+20>:	pop    %rbp
    0x0000000100000f25 <main+21>:	retq
    End of assembler dump.




Much better code and still a one-to-one representation to the high-level C code. This optimised version doesn't allocate any space for the stack frame, loads the starting address of the "Hello world!" literal string and sets the number of variable arguments of the call (using the XOR optimisation to set AL to 0 (0x0)), and finally call the `printf()` function.

The last part is the setup of the return value of the `main()` function and the epilogue.
