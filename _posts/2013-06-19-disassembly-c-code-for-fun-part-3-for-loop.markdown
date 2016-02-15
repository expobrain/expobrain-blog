---
author: admin
comments: true
date: 2013-06-19 22:41:16+00:00
layout: post
slug: disassembly-c-code-for-fun-part-3-for-loop
title: 'Disassembly C code for fun - Part 3: for loop'
wordpress_id: 1363
categories:
- Disassembly
- Guides
tags:
- asm
- c/c++
- gdb
- loop unwindig
---

...And it's already the third post about disassembly C code for fun. Today we disassembly a simple `for..loop` cycle

**Update:** Don't miss the next post [Disassembly C code for fun – Part 4: floats and SSE2](http://www.expobrain.net/2013/07/02/disassembly-c-code-for-fun-part-4-floats-and-sse2/)

<!-- more -->



### Disassembly time



First the C code:


    
    
    #include <stdio.h>
    
    int main()
    {
        for (int i = 0; i < 10; ++i) {
            printf("%d\n", i);
        }
        
        return 0;
    }
    



and now the disassembly:


    
    
    $ cc -g main.c
    $ gdb a.out
    (gdb) disas main
    Dump of assembler code for function main:
    0x0000000100000ee0 <main+0>:	push   %rbp
    0x0000000100000ee1 <main+1>:	mov    %rsp,%rbp
    0x0000000100000ee4 <main+4>:	sub    $0x10,%rsp
    0x0000000100000ee8 <main+8>:	movl   $0x0,-0x4(%rbp)
    0x0000000100000eef <main+15>:	movl   $0x0,-0x8(%rbp)
    0x0000000100000ef6 <main+22>:	cmpl   $0xa,-0x8(%rbp)
    0x0000000100000efd <main+29>:	jge    0x100000f27 <main+71>
    0x0000000100000f03 <main+35>:	lea    0x5a(%rip),%rdi        # 0x100000f64
    0x0000000100000f0a <main+42>:	mov    -0x8(%rbp),%esi
    0x0000000100000f0d <main+45>:	mov    $0x0,%al
    0x0000000100000f0f <main+47>:	callq  0x100000f38 <dyld_stub_printf>
    0x0000000100000f14 <main+52>:	mov    %eax,-0xc(%rbp)
    0x0000000100000f17 <main+55>:	mov    -0x8(%rbp),%eax
    0x0000000100000f1a <main+58>:	add    $0x1,%eax
    0x0000000100000f1f <main+63>:	mov    %eax,-0x8(%rbp)
    0x0000000100000f22 <main+66>:	jmpq   0x100000ef6 <main+22>
    0x0000000100000f27 <main+71>:	mov    $0x0,%eax
    0x0000000100000f2c <main+76>:	add    $0x10,%rsp
    0x0000000100000f30 <main+80>:	pop    %rbp
    0x0000000100000f31 <main+81>:	retq   
    End of assembler dump.
    



We skip the prologue (0x100000ee0-0x100000ee1) the frame stack allocation (0x100000ee4) and the set up of the `main()`'s return value (0x100000ee8).


    
    
    0x0000000100000eef <main+15>:	movl   $0x0,-0x8(%rbp)
    



This instruction initialise the variable `i` declared in the loop and stores it into RBP-8. 


    
    
    0x0000000100000ef6 <main+22>:	cmpl   $0xa,-0x8(%rbp)
    0x0000000100000efd <main+29>:	jge    0x100000f27 <main+71>
    



The `cmpl` (CoMPare Long) instruction compare the value 10(0xa) with the content of RBP-8. The `jge` (Jump Greater/Equal) set the instruction pointer to the location 0x100000f27 if the content of RBP-8 is greater or equal to 10(0xa). This means the exit of the loop; the loop's body is enclosed between 0x100000f03 to 0x100000f22. 


    
    
    0x0000000100000f03 <main+35>:	lea    0x5a(%rip),%rdi        # 0x100000f64
    0x0000000100000f0a <main+42>:	mov    -0x8(%rbp),%esi
    0x0000000100000f0d <main+45>:	mov    $0x0,%al
    0x0000000100000f0f <main+47>:	callq  0x100000f38 <dyld_stub_printf>
    0x0000000100000f14 <main+52>:	mov    %eax,-0xc(%rbp)
    



This calls the `printf` function passing the content of RBP-8 as the second argument and storing the result of the function call into RBP-12(0xc).


    
    
    0x0000000100000f17 <main+55>:	mov    -0x8(%rbp),%eax
    0x0000000100000f1a <main+58>:	add    $0x1,%eax
    0x0000000100000f1f <main+63>:	mov    %eax,-0x8(%rbp)
    0x0000000100000f22 <main+66>:	jmpq   0x100000ef6 <main+22>
    



Time to increment the `i` variable by loading the content of RBP-8 into EAX, add 1 and move back the result into RBP-8. The `jmp` instruction is a unconditional jump back to the top of the loop.



### Enabling optimisations



Compile the code with the maximum optimisations will generate a very interesting assembly: 


    
    
    $ cc -g -O3 main.c
    $ gdb a.out
    (gdb) disas main
    Dump of assembler code for function main:
    0x0000000100000e90 <main+0>:	push   %rbp
    0x0000000100000e91 <main+1>:	mov    %rsp,%rbp
    0x0000000100000e94 <main+4>:	push   %rbx
    0x0000000100000e95 <main+5>:	push   %rax
    0x0000000100000e96 <main+6>:	lea    0xcf(%rip),%rbx        # 0x100000f6c
    0x0000000100000e9d <main+13>:	mov    %rbx,%rdi
    0x0000000100000ea0 <main+16>:	xor    %esi,%esi
    0x0000000100000ea2 <main+18>:	xor    %al,%al
    0x0000000100000ea4 <main+20>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000ea9 <main+25>:	mov    %rbx,%rdi
    0x0000000100000eac <main+28>:	mov    $0x1,%esi
    0x0000000100000eb1 <main+33>:	xor    %al,%al
    0x0000000100000eb3 <main+35>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000eb8 <main+40>:	mov    %rbx,%rdi
    0x0000000100000ebb <main+43>:	mov    $0x2,%esi
    0x0000000100000ec0 <main+48>:	xor    %al,%al
    0x0000000100000ec2 <main+50>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000ec7 <main+55>:	mov    %rbx,%rdi
    0x0000000100000eca <main+58>:	mov    $0x3,%esi
    0x0000000100000ecf <main+63>:	xor    %al,%al
    0x0000000100000ed1 <main+65>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000ed6 <main+70>:	mov    %rbx,%rdi
    0x0000000100000ed9 <main+73>:	mov    $0x4,%esi
    0x0000000100000ede <main+78>:	xor    %al,%al
    0x0000000100000ee0 <main+80>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000ee5 <main+85>:	mov    %rbx,%rdi
    0x0000000100000ee8 <main+88>:	mov    $0x5,%esi
    0x0000000100000eed <main+93>:	xor    %al,%al
    0x0000000100000eef <main+95>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000ef4 <main+100>:	mov    %rbx,%rdi
    0x0000000100000ef7 <main+103>:	mov    $0x6,%esi
    0x0000000100000efc <main+108>:	xor    %al,%al
    0x0000000100000efe <main+110>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000f03 <main+115>:	mov    %rbx,%rdi
    0x0000000100000f06 <main+118>:	mov    $0x7,%esi
    0x0000000100000f0b <main+123>:	xor    %al,%al
    0x0000000100000f0d <main+125>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000f12 <main+130>:	mov    %rbx,%rdi
    0x0000000100000f15 <main+133>:	mov    $0x8,%esi
    0x0000000100000f1a <main+138>:	xor    %al,%al
    0x0000000100000f1c <main+140>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000f21 <main+145>:	mov    %rbx,%rdi
    0x0000000100000f24 <main+148>:	mov    $0x9,%esi
    0x0000000100000f29 <main+153>:	xor    %al,%al
    0x0000000100000f2b <main+155>:	callq  0x100000f40 <dyld_stub_printf>
    0x0000000100000f30 <main+160>:	xor    %eax,%eax
    0x0000000100000f32 <main+162>:	add    $0x8,%rsp
    0x0000000100000f36 <main+166>:	pop    %rbx
    0x0000000100000f37 <main+167>:	pop    %rbp
    0x0000000100000f38 <main+168>:	retq   
    End of assembler dump.
    



Wait a second, where are the loop conditions and jumps and why the code is much longer than before? The compiler had just [unrolled](http://en.wikipedia.org/wiki/Loop_unwinding) the `for..loop` by copying the body of the loop by 10 times and pre-computing the value to be passed to the `printf()` function. This increase the performances because the jump and compare instruction are completely removed.

In modern CPUs with [branch prediction](http://en.wikipedia.org/wiki/Branch_predictor) this type of optimisation doesn't gain you much speed but don't forget your code is not alone, another application are running at the same time sharing the same CPU L1 and L2 cache, flushing the part of your code referenced by the loop's jumps.

Generally speaking a unrolled loop will smooth the job for branch prediction algorithm. Another type of loop's optimisation which involved loop unwinding is the [Duff's device](http://en.wikipedia.org/wiki/Duff%27s_device).



### Conclusion



Short post today put a very interesting optimisation done by the compiler when a loop is involved.
