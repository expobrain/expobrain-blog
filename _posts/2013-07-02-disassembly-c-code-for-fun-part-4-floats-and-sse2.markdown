---
author: admin
categories: [Disassembly, Guides]
comments: true
date: 2013-07-02
image: {url: /media/2013/09/assembler.gif}
layout: post
slug: disassembly-c-code-for-fun-part-4-floats-and-sse2
tags: [asm, c/c++, gdb, sse2, x86-64]
title: "Disassembly C code for fun \u2013 Part 4: floats and SSE2"
wordpress_id: 1394
---

Today we look at the disassembly of a functions involving floats and SSE2 instructions. As I stated in the first post [Disassembly C code for fun: part 1]({{ site.url }}/2013/06/16/disassembly-c-code-for-fun-part-1/) the C code is compiled for a x86-64 architecture which means the CPU has the SSE/SSE2 instructions sets by default.

<!-- more -->



## The code



The code used in this post (copied from [The C Programming Language](http://en.wikipedia.org/wiki/The_C_Programming_Language) 2dn Edition, Chapter 1, Section 1.4 Symbolic Constants) outputs the Fahrenheit's temperature range between 0° and 300° with a step of 20° into Celsius values:




    #include <stdio.h>

    #define LOWER 0 /* lower limit of table */
    #define UPPER 300 /* upper limit */
    #define STEP 20 /* step size */

    int main()
    {
        int fahr;
        float celsius;

        for (fahr = LOWER; fahr <= UPPER; fahr += STEP) {
            celsius = (5.0/9.0) * (fahr - 32);

            printf("%3d %6.1f\n", fahr, celsius);
        }

        return 0;
    }




Just for your information the output of the above code is this one:




      0  -17.8
     20   -6.7
     40    4.4
     60   15.6
     80   26.7
    100   37.8
    120   48.9
    140   60.0
    160   71.1
    180   82.2
    200   93.3
    220  104.4
    240  115.6
    260  126.7
    280  137.8
    300  148.9






## The disassembly



Lets look at the disassembly, but this time I'll skip the instructions to compile the code and I'll remove the prologue and epilogue form the disassembly output:




    0x0000000100000eb8 <main+8>:	movl   $0x0,-0x4(%rbp)
    0x0000000100000ebf <main+15>:	movl   $0x0,-0x8(%rbp)
    0x0000000100000ec6 <main+22>:	cmpl   $0x12c,-0x8(%rbp)
    0x0000000100000ecd <main+29>:	jg     0x100000f1d <main+109>
    0x0000000100000ed3 <main+35>:	lea    0x86(%rip),%rdi        # 0x100000f60
    0x0000000100000eda <main+42>:	movsd  0x76(%rip),%xmm0        # 0x100000f58
    0x0000000100000ee2 <main+50>:	mov    -0x8(%rbp),%eax
    0x0000000100000ee5 <main+53>:	sub    $0x20,%eax
    0x0000000100000eea <main+58>:	cvtsi2sd %eax,%xmm1
    0x0000000100000eee <main+62>:	mulsd  %xmm1,%xmm0
    0x0000000100000ef2 <main+66>:	cvtsd2ss %xmm0,%xmm0
    0x0000000100000ef6 <main+70>:	movss  %xmm0,-0xc(%rbp)
    0x0000000100000efb <main+75>:	mov    -0x8(%rbp),%esi
    0x0000000100000efe <main+78>:	cvtss2sd -0xc(%rbp),%xmm0
    0x0000000100000f03 <main+83>:	mov    $0x1,%al
    0x0000000100000f05 <main+85>:	callq  0x100000f2e <dyld_stub_printf>
    0x0000000100000f0a <main+90>:	mov    %eax,-0x10(%rbp)
    0x0000000100000f0d <main+93>:	mov    -0x8(%rbp),%eax
    0x0000000100000f10 <main+96>:	add    $0x14,%eax
    0x0000000100000f15 <main+101>:	mov    %eax,-0x8(%rbp)
    0x0000000100000f18 <main+104>:	jmpq   0x100000ec6 <main+22>
    0x0000000100000f1d <main+109>:	mov    $0x0,%eax




The first instructions from 0x100000eb8 to 0x100000ebf stores the return value of the `main()` function and the initial value and the initial value of the `fahr` variable (which is also the initialisation of the for-loop).




    0x0000000100000ec6 <main+22>:	cmpl   $0x12c,-0x8(%rbp)
    0x0000000100000ecd <main+29>:	jg     0x100000f19 <main+105>




This is the termination's condition of the loop, the current value of `fahr` (RBP-8) is compared with 0x12c (300 base 10) and if it's greater jump to the end of the main loop at 0x100000f19.




    0x0000000100000eda <main+42>:	movsd  0x76(%rip),%xmm0        # 0x100000f58
    0x0000000100000ee2 <main+50>:	mov    -0x8(%rbp),%eax
    0x0000000100000ee5 <main+53>:	sub    $0x20,%eax
    0x0000000100000eea <main+58>:	cvtsi2sd %eax,%xmm1
    0x0000000100000eee <main+62>:	mulsd  %xmm1,%xmm0
    0x0000000100000ef2 <main+66>:	cvtsd2ss %xmm0,%xmm0
    0x0000000100000ef6 <main+70>:	movss  %xmm0,-0xc(%rbp)




This is the Fahrenheit to Celsius conversion, first loads the pre-calculated result of the 5.0/9.0 division into XMM0 (0x100000eda) and the current value of the `fahr` variable into EAX (0x100000ee2), subtracting 0x20 (32 base 10) from EAX.

Now at 0x100000eea cast the content of EAX form a integer into a double-precision float storing it into XMM1, multiply XMM1 by XMM0 (0x100000eee), cast the result from a double- to a single-precision float (0x100000ef2) and store the result back into the memory location of the `celsius` variable at RBP-10 (0x100000ef6).

The whole expression in our test code has been rewritten by the compiler into this one:




    fahr = (fahr - 32) * 0.55555555555555558




So the compiler has pre-calculated the expression 5.0/9.0 and it's using the SSE2 instructions `cvtsi2sd` (Convert Dword Integer to Scalar Double-Precision FP Value), `cvtsd2ss` (Convert Scalar Double-Precision FP Value to Scalar Single-Precision FP Value), `mulsd` (Multiply Scalar Double-Precision Floating-Point Values) and `movsd` (Move Scalar Double-Precision Floating-Point Value) to compute the result of the expression.

The same code compiled without the SSE/SSE2 instruction set will be longer (and slower I reckon); if the current disassembly if 119-bytes long the one without SSE/SSE2 is 19-bytes longer. If you want to see the disassembly of the latter, pass the `-mno-sse` parameter to the compiler:




    $ cc -g -mno-sse main.c






## Final steps



Wee are at the end of the code. We skip the instructions between 0x100000efb and 0x100000f0a which are related to the `printf()` function call and we analyse the for-loop's increment statement:




    0x0000000100000f0d <main+93>:	mov    -0x8(%rbp),%eax
    0x0000000100000f10 <main+96>:	add    $0x14,%eax
    0x0000000100000f15 <main+101>:	mov    %eax,-0x8(%rbp)
    0x0000000100000f18 <main+104>:	jmpq   0x100000ec6 <main+22>




The content of the `fahr` variable is loaded form RBP-8 into EAX, incremented by 0x14 (20 base 10) and stored back into RBP-8; a unconditional jump to the for-loop's termination statement closes the circle.



## Final considerations



The usage of SSE2 instructions saves space in the assembly code and speed up the execution, but it can be improved a little by defining the `fahr` variable as a `double` instead as a `float`, saving the conversione from double- to single-precision float done at 0x100000ef2 and 0x100000efe (this one replaced by a `movsd` instruction, I reckon it's cheaper to move than to convert).

The `fahr` variable is a 32-byte integer so the EAX and not the RAX register is involved.
