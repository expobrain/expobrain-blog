---
author: admin
categories: [Disassembly, Guides]
comments: true
date: 2013-08-24
image: {url: /media/assembler.gif}
layout: post
slug: disassembly-c-code-for-fun-part-8-strings
tags: [asm, c/c++, disassembly, hello world, x86-64]
title: "Disassembly C code for fun \u2013 Part 8: strings"
wordpress_id: 1583
---

Following the last post about the [buffer overflow protection]({{ site.url }}/2013/07/19/disassembly-c-code-for-fun-part-7-buffer-overflow-protection/), today we finally talk about strings.

<!-- more -->



## Strings



We'll start back from the last piece of code used in the previous post:




    #include <stdio.h>

    int main()
    {
        char text[] = "hello world";
        return 0;
    }




and its disassembly:




    0x0000000100000ed0 <main+0>:	push   %rbp
    0x0000000100000ed1 <main+1>:	mov    %rsp,%rbp
    0x0000000100000ed4 <main+4>:	sub    $0x20,%rsp
    0x0000000100000ed8 <main+8>:	mov    0x159(%rip),%rax        # 0x100001038
    0x0000000100000edf <main+15>:	mov    (%rax),%rax
    0x0000000100000ee2 <main+18>:	mov    %rax,-0x8(%rbp)
    0x0000000100000ee6 <main+22>:	movl   $0x0,-0xc(%rbp)
    0x0000000100000eed <main+29>:	mov    0x64(%rip),%rax        # 0x100000f58
    0x0000000100000ef4 <main+36>:	mov    %rax,-0x18(%rbp)
    0x0000000100000ef8 <main+40>:	mov    0x62(%rip),%ecx        # 0x100000f60
    0x0000000100000efe <main+46>:	mov    %ecx,-0x10(%rbp)
    0x0000000100000f01 <main+49>:	mov    0x130(%rip),%rax        # 0x100001038
    0x0000000100000f08 <main+56>:	mov    (%rax),%rax
    0x0000000100000f0b <main+59>:	mov    -0x8(%rbp),%rdx
    0x0000000100000f0f <main+63>:	cmp    %rdx,%rax
    0x0000000100000f12 <main+66>:	jne    0x100000f23 <main+83>
    0x0000000100000f18 <main+72>:	mov    $0x0,%eax
    0x0000000100000f1d <main+77>:	add    $0x20,%rsp
    0x0000000100000f21 <main+81>:	pop    %rbp
    0x0000000100000f22 <main+82>:	retq
    0x0000000100000f23 <main+83>:	callq  0x100000f28 <dyld_stub___stack_chk_fail>




I'll skip the explanation about the canary and as I promised in the previous post I'm going to explain how the string is stored in the memory and how it's copied into the stack. Removing the buffer overflow protection code, the interesting disassembly is this:




    0x0000000100000eed <main+29>:	mov    0x64(%rip),%rax        # 0x100000f58
    0x0000000100000ef4 <main+36>:	mov    %rax,-0x18(%rbp)
    0x0000000100000ef8 <main+40>:	mov    0x62(%rip),%ecx        # 0x100000f60
    0x0000000100000efe <main+46>:	mov    %ecx,-0x10(%rbp)




Our string is stored starting from the address 0x100000f58 which contains the first character _"h"_ of the string encoded with ASCII code 0x68. The next character _"e"_ (or 0x65 in ASCII) is stored in the location 0x100000f59 and so on until the last character _"d"_ in the location 0x100000f62. The MOV operation just copy 16 bytes, 8 bytes at time, from 0x100000f58 into RBP-24.

String are NULL-terminated, that is a 0x00 byte represent the end of the text so our string in memory is 12 bytes long: 11 bytes to store the ext and 1 byte to store the NULL. The compiler optimise the copy operation by copying blocks of memory multiples of 16 bytes, the size of the RAX register.

Strings are stored without duplicates, if two variables are initialised from the same string the string will be copied from the same location. This code:




    #include <stdio.h>

    int main()
    {
        char text1[] = "hello world";
        char text2[] = "hello world";
        return 0;
    }




disassembled:




    0x0000000100000edd <main+29>:	mov    0x78(%rip),%rax        # 0x100000f5c
    0x0000000100000ee4 <main+36>:	mov    %rax,-0x18(%rbp)
    0x0000000100000ee8 <main+40>:	mov    0x76(%rip),%ecx        # 0x100000f64
    0x0000000100000eee <main+46>:	mov    %ecx,-0x10(%rbp)
    0x0000000100000ef1 <main+49>:	mov    0x64(%rip),%rax        # 0x100000f5c
    0x0000000100000ef8 <main+56>:	mov    %rax,-0x24(%rbp)
    0x0000000100000efc <main+60>:	mov    0x62(%rip),%ecx        # 0x100000f64




Prove that the string _"hello world"_ is stored once starting from 0x100000f5c and copied twice into RBP-24 and RBP-36.



## Optimisation



The optimised assembly of the code below doesn't show any surprise (I added the `printf` function call to stop the compiler to remove completely the string's allocation):




    #include <stdio.h>

    int main() {
        char text[] = "hello world";

        printf("%s\n", text);

        return 0;
    }







    0x0000000100000ed0 <main+0>:	push   %rbp
    0x0000000100000ed1 <main+1>:	mov    %rsp,%rbp
    0x0000000100000ed4 <main+4>:	push   %rbx
    0x0000000100000ed5 <main+5>:	sub    $0x18,%rsp
    0x0000000100000ed9 <main+9>:	mov    0x158(%rip),%rbx        # 0x100001038
    0x0000000100000ee0 <main+16>:	mov    (%rbx),%rax
    0x0000000100000ee3 <main+19>:	mov    %rax,-0x10(%rbp)
    0x0000000100000ee7 <main+23>:	mov    $0x6f77206f6c6c6568,%rax
    0x0000000100000ef1 <main+33>:	mov    %rax,-0x20(%rbp)
    0x0000000100000ef5 <main+37>:	movl   $0x646c72,-0x18(%rbp)
    0x0000000100000efc <main+44>:	lea    -0x20(%rbp),%rdi
    0x0000000100000f00 <main+48>:	callq  0x100000f28 <dyld_stub_puts>
    0x0000000100000f05 <main+53>:	mov    (%rbx),%rax
    0x0000000100000f08 <main+56>:	cmp    -0x10(%rbp),%rax
    0x0000000100000f0c <main+60>:	jne    0x100000f17 <main+71>
    0x0000000100000f0e <main+62>:	xor    %eax,%eax
    0x0000000100000f10 <main+64>:	add    $0x18,%rsp
    0x0000000100000f14 <main+68>:	pop    %rbx
    0x0000000100000f15 <main+69>:	pop    %rbp
    0x0000000100000f16 <main+70>:	retq
    0x0000000100000f17 <main+71>:	callq  0x100000f1c <dyld_stub___stack_chk_fail>




The compiler inlined the string into the MOVs instructions, our string is now the concatenation of 0x6f77206f6c6c6568 and 0x646c72. Note that the string is allocated starting at RBP-32 as _"hello world"_ but the content of RAX in 0x0000000100000ee7 and 0x0000000100000ef5 is _"ow olleh"_ and _"dlr"_ respectively.

How the inverted string in the CPU registers is stored in the correct order in the memory? The content of the RAX register is a 64-bit integer and because the x86-64 paltform is little-endian the LSB is stored in RBP-32 and the MSB in RBP-24 ending up with the correct partial _"hello wo"_ string.

The `dyld_stub_puts` aAt the address 0x0000000100000f00 looks like a surrogate of the `printf` function (I didn't found any information about that function 'till now) which prints the string allocated starting at the address in RDI until a NULL is reached.
