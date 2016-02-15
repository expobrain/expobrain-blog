---
author: admin
comments: true
date: 2013-07-14 16:56:35+00:00
layout: post
slug: disassembly-c-code-for-fun-part-6-inlining-expansion
title: 'Disassembly C code for fun – Part 6: inlining expansion'
wordpress_id: 1515
categories:
- Disassembly
- Guides
tags:
- asm
- c/c++
- gdb
- inline expansion
- x86-64
---

Today we will talk about code inlining which means the ability of the compiler to replace a function call with the body of the called function.

<!-- more -->



## The sample code and disassembly



The code outputs the power of two between 0 to 9 by colling a `power()` function:


    
    
    #include <stdio.h>
    
    int power(int m, int n);
    
    int main() 
    {
        int r;
        
        for (int i = 0; i < 10; ++i) {
            r = power(2, i);
            
            printf("%d %d\n", i, r);
        }
        
        return 0;
    }
    
    int power(int base, int n) 
    {
        int i, p;
        
        p = 1;
        
        for (i = 1; i <= n; ++i) {
            p = p * base;
        }
        
        return p;
    }
    



The disassembly of this code is divided in two part, the `main()` function:


    
    
    0x0000000100000e54 <main+4>:	sub    $0x10,%rsp
    0x0000000100000e58 <main+8>:	movl   $0x0,-0x4(%rbp)
    0x0000000100000e5f <main+15>:	movl   $0x0,-0xc(%rbp)
    0x0000000100000e66 <main+22>:	cmpl   $0xa,-0xc(%rbp)
    0x0000000100000e6d <main+29>:	jge    0x100000eaa <main+90>
    0x0000000100000e73 <main+35>:	mov    $0x2,%edi
    0x0000000100000e78 <main+40>:	mov    -0xc(%rbp),%esi
    0x0000000100000e7b <main+43>:	callq  0x100000ec0 <power>
    0x0000000100000e80 <main+48>:	lea    0xad(%rip),%rdi        # 0x100000f34
    0x0000000100000e87 <main+55>:	mov    %eax,-0x8(%rbp)
    0x0000000100000e8a <main+58>:	mov    -0xc(%rbp),%esi
    0x0000000100000e8d <main+61>:	mov    -0x8(%rbp),%edx
    0x0000000100000e90 <main+64>:	mov    $0x0,%al
    0x0000000100000e92 <main+66>:	callq  0x100000f0a <dyld_stub_printf>
    0x0000000100000e97 <main+71>:	mov    %eax,-0x10(%rbp)
    0x0000000100000e9a <main+74>:	mov    -0xc(%rbp),%eax
    0x0000000100000e9d <main+77>:	add    $0x1,%eax
    0x0000000100000ea2 <main+82>:	mov    %eax,-0xc(%rbp)
    0x0000000100000ea5 <main+85>:	jmpq   0x100000e66 <main+22>
    0x0000000100000eaa <main+90>:	mov    $0x0,%eax
    0x0000000100000eaf <main+95>:	add    $0x10,%rsp
    



and the `power()` function:


    
    
    0x0000000100000ec0 <power+0>:	push   %rbp
    0x0000000100000ec1 <power+1>:	mov    %rsp,%rbp
    0x0000000100000ec4 <power+4>:	mov    %edi,-0x4(%rbp)
    0x0000000100000ec7 <power+7>:	mov    %esi,-0x8(%rbp)
    0x0000000100000eca <power+10>:	movl   $0x1,-0x10(%rbp)
    0x0000000100000ed1 <power+17>:	movl   $0x1,-0xc(%rbp)
    0x0000000100000ed8 <power+24>:	mov    -0xc(%rbp),%eax
    0x0000000100000edb <power+27>:	cmp    -0x8(%rbp),%eax
    0x0000000100000ede <power+30>:	jg     0x100000efe <power+62>
    0x0000000100000ee4 <power+36>:	mov    -0x10(%rbp),%eax
    0x0000000100000ee7 <power+39>:	imul   -0x4(%rbp),%eax
    0x0000000100000eeb <power+43>:	mov    %eax,-0x10(%rbp)
    0x0000000100000eee <power+46>:	mov    -0xc(%rbp),%eax
    0x0000000100000ef1 <power+49>:	add    $0x1,%eax
    0x0000000100000ef6 <power+54>:	mov    %eax,-0xc(%rbp)
    0x0000000100000ef9 <power+57>:	jmpq   0x100000ed8 <power+24>
    0x0000000100000efe <power+62>:	mov    -0x10(%rbp),%eax
    0x0000000100000f01 <power+65>:	pop    %rbp
    0x0000000100000f02 <power+66>:	retq  
    



Whit what we learned in the previous posts anyone at this point should be able to understand this disassemblies; they are pretty straigh-forward.



## Optimisation and inlining



Now I'll compile this source code enabling all the optimisation and disassembly the `main()` function:


    
    
    0x0000000100000e94 <main+4>:	push   %r14
    0x0000000100000e96 <main+6>:	push   %rbx
    0x0000000100000e97 <main+7>:	xor    %ebx,%ebx
    0x0000000100000e99 <main+9>:	lea    0x8c(%rip),%r14        # 0x100000f2c
    0x0000000100000ea0 <main+16>:	mov    $0x1,%edx
    0x0000000100000ea5 <power+0>:	test   %ebx,%ebx
    0x0000000100000ea7 <power+2>:	mov    $0x0,%eax
    0x0000000100000eac <power+7>:	jle    0x100000eb8 <main+40>
    0x0000000100000eae <power+9>:	xchg   %ax,%ax
    0x0000000100000eb0 <power+11>:	add    %edx,%edx
    0x0000000100000eb2 <power+13>:	inc    %eax
    0x0000000100000eb4 <power+15>:	cmp    %eax,%ebx
    0x0000000100000eb6 <power+17>:	jne    0x100000eb0 <power+11>
    0x0000000100000eb8 <main+40>:	mov    %r14,%rdi
    0x0000000100000ebb <main+43>:	mov    %ebx,%esi
    0x0000000100000ebd <main+45>:	lea    0x1(%rbx),%ebx
    0x0000000100000ec0 <main+48>:	xor    %al,%al
    0x0000000100000ec2 <main+50>:	callq  0x100000f00 <dyld_stub_printf>
    0x0000000100000ec7 <main+55>:	cmp    $0xa,%ebx
    0x0000000100000eca <main+58>:	jne    0x100000ea0 <main+16>
    0x0000000100000ecc <main+60>:	xor    %eax,%eax
    0x0000000100000ece <main+62>:	pop    %rbx
    0x0000000100000ecf <main+63>:	pop    %r14
    



The assembly code is still near to an one-to-one representation of the original code pus some optimisations. The most visible optimisation done by the compiler is inlining the body of the `power()` into the loop in the `main()` function to save 10 function calls. 

The inline expansion optimisations is completely automatically managed by the compiler thus the developer doesn't have any controlo over it. You can politely ask the compiler to inline a function by putting the `inline` specifier; for example we can ask the compiler to inline our `power()` function:


    
    
    inline int power(int m, int n);
    



However the `inline` specifier doesn't force the compiler to inline the function; the compiler can completely ignore our inline request. Also, inlining is not always a good idea, ins some conditions inlining is a good choice for speed and code's size but in another conditions this is not a good choice. The compiler has all the necessary informations to know when to inline and when not.

Inlining expansion is not the only optimisation done by the compiler, another optimisations where applied for example to avoid storing the local variables on the stack (the variables  `i` of the `power()` loop, `i` of the `main()` loop and `p` are stored in EAX, EBX and EDX respectively) and to align the address used by jumps to be multiple of 16-bytes (the destination address of the jumps at 0x100000eb6 and 0x100000eca are multiple of 16, the destination address of the jump at 0x100000eac is not a multiple of 16 but it's inside the 16-bytes stride starting at 0x100000eb0).

Some point of interests:


    
    
    0x0000000100000ebd <main+45>:	lea    0x1(%rbx),%ebx
    



which is just incrementing the content of EBX by 1 using a LEA (Load Effective Address) instruction to use 3 bytes of memory instead of 2 bytes of INC to align the next instruction to a memory address multiple of 16.

Same think for:


    
    
    0x0000000100000eae <+30>:	xchg   %ax,%ax
    



which in is in fact a 2-bytes no-op; the byte sequence generated by XCHG EAX EAX and 66 NOP (2-bytes no-op) is the same `66 90h`.



## Conclusion



We saw for the first time the compiler can alter our code until a point where it physically copying function's bodies to avoid the overhead of a function call and to further optimise the resulting code. This operation is called inline expansion and it's completely automatic when the compiler optimisations are enabled; the developer cannot really force the compile to inline or to no inline a function. 

Inlining expansion is a good idea and it's not a good idea at the same time but depends by a lot of factors (code size of the inlined function, how many time and where the function is called, if the function calls another function, etc.), a good list of explanation can be found [here](http://www.parashift.com/c++-faq/inline-and-perf.html). 

The compiler is always honouring the 16-bytes alignment for jump's destination addresses for CPU cache performances and to achieve that sometimes uses a not straight-forward approach.
