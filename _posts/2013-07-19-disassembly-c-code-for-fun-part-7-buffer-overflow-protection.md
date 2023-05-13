---
categories:
- Disassembly
- Guides
class: post-template
comments: true
cover: media/assembler.gif
current: post
date: 2013-07-19
layout: post
navigation: true
slug: disassembly-c-code-for-fun-part-7-buffer-overflow-protection
subclass: post
tags:
- asm
- buffer overflow protection
- c/c++
- gdb
title: 'Disassembly C code for fun – Part 7: buffer overflow protection'
wordpress_id: 1534
---

Originally this article was about strings but as soon as I disassembled the first C test code I saw an interesting bit of assembly code so I switched the topic: today we will talk about buffer overflow protection and the canary (obviously I'm not talking about the little bird but about [this](http://en.wikipedia.org/wiki/Buffer_overflow_protection#Random_canaries) canary).

A [Buffer Overflow](http://en.wikipedia.org/wiki/Buffer_overflow) happens when a piece of code operating over a range of memory addresses writes outside the range to alter or corrupt the surrounding data.

<!-- more -->

## The test code and his disassembly

The test code is very simple, it allocates a string in the stack and returns:

    #include <stdio.h>

    int main()
    {
        char text[] = "hello world";
        return 0;
    }

The disassembly is pretty interesting for a couple of reasons:

    0x0000000100000ed0 <main+0>:    push   %rbp
    0x0000000100000ed1 <main+1>:    mov    %rsp,%rbp
    0x0000000100000ed4 <main+4>:    sub    $0x20,%rsp
    0x0000000100000ed8 <main+8>:    mov    0x159(%rip),%rax        # 0x100001038
    0x0000000100000edf <main+15>:   mov    (%rax),%rax
    0x0000000100000ee2 <main+18>:   mov    %rax,-0x8(%rbp)
    0x0000000100000ee6 <main+22>:   movl   $0x0,-0xc(%rbp)
    0x0000000100000eed <main+29>:   mov    0x64(%rip),%rax        # 0x100000f58
    0x0000000100000ef4 <main+36>:   mov    %rax,-0x18(%rbp)
    0x0000000100000ef8 <main+40>:   mov    0x62(%rip),%ecx        # 0x100000f60
    0x0000000100000efe <main+46>:   mov    %ecx,-0x10(%rbp)
    0x0000000100000f01 <main+49>:   mov    0x130(%rip),%rax        # 0x100001038
    0x0000000100000f08 <main+56>:   mov    (%rax),%rax
    0x0000000100000f0b <main+59>:   mov    -0x8(%rbp),%rdx
    0x0000000100000f0f <main+63>:   cmp    %rdx,%rax
    0x0000000100000f12 <main+66>:   jne    0x100000f23 <main+83>
    0x0000000100000f18 <main+72>:   mov    $0x0,%eax
    0x0000000100000f1d <main+77>:   add    $0x20,%rsp
    0x0000000100000f21 <main+81>:   pop    %rbp
    0x0000000100000f22 <main+82>:   retq
    0x0000000100000f23 <main+83>:   callq  0x100000f28 <dyld_stub___stack_chk_fail>

The first interesting bit is at 0x100000f0f and 0x100000f12: is a compare and jump but in our code there is no trace of conditionals so where this jump is coming from?

The second interesting part is the code which copy the string into the stack (instructions between 0x100000eed to 0x100000efe), but we will talk about that and about strings in general in the next post.

## Don't let the canary die

Lets remove all the code except the stack's setup and the canary:

    0x0000000100000ed4 <main+4>:    sub    $0x20,%rsp
    0x0000000100000ed8 <main+8>:    mov    0x159(%rip),%rax        # 0x100001038
    0x0000000100000edf <main+15>:   mov    (%rax),%rax
    0x0000000100000ee2 <main+18>:   mov    %rax,-0x8(%rbp)
    ...code...
    0x0000000100000f01 <main+49>:   mov    0x130(%rip),%rax        # 0x100001038
    0x0000000100000f08 <main+56>:   mov    (%rax),%rax
    0x0000000100000f0b <main+59>:   mov    -0x8(%rbp),%rdx
    0x0000000100000f0f <main+63>:   cmp    %rdx,%rax
    0x0000000100000f12 <main+66>:   jne    0x100000f23 <main+83>

The first part of the disassembly code (just after the prologue) allocs 32(0x20) bytes on the stack, then loads into RBP-8 the content of the memory location addressed by 0x100001038. The final state of the stack frame can be represent in this way:

    +----------------+
    | return address |  <--  RBP+8
    +----------------+  <--  RBP
    | 8-bytes canary |  <--  RBP-8
    +----------------+
    |                |
    |                |
    |     local      |
    |                |
    |   variables    |
    |                |
    |                |
    |                |
    +----------------+  <--  RBP-32

The instructions between 0x100000ee6 to 0x100000efe included initialise the stack with the local variable `char text[]`. At 0x100000f01 the canary is loaded again into RAX from the memory location addressed by 0x100001038, the canary from RBP-8 is loaded into RDX and a compare is executed.

If during the execution of the function's body the canary get overwritten by a buffer overflow the code at 0x100000f12 ensure the application will stop before returning from the function.

But why it's so important to check the canary just before the epilogue?

Simple, an attacker can use a buffer overflow to write data after RBP modifying the return address of the function to jump back not to the caller fo `main()` but to another address in memory containing different code (virus, malware, etc.).

Without the canary it's impossible to know if the return address is still the original one of has benn tampered.

## Conclusion

For the first time we encountered a security measure during code's disassembly.
The scope of the canary is complementary to other security measures ([PaX](http://en.wikipedia.org/wiki/PaX), [Address Space Layout Randomization](http://en.wikipedia.org/wiki/Address_space_layout_randomization), etc.) to prevent an attacker to alter the execution of the code.

The buffer overflow protection's code is still present event when all the compiler optimisations are enabled; the only way to disable it is to pass the  `-fno-stack-protector` option to the compiler.
