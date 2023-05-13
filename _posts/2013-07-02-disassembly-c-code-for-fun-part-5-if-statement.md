---
categories:
- Disassembly
- Guides
class: post-template
comments: true
cover: media/assembler.gif
current: post
date: 2013-07-02 20:38:27
layout: post
navigation: true
slug: disassembly-c-code-for-fun-part-5-if-statement
subclass: post
tags:
- asm
- c/c++
- gdb
- x86-64
title: 'Disassembly C code for fun – Part 5: if statement'
wordpress_id: 1414
---

Time to disassembly the `if..then` conditional statement. I'll say in this post will be not exciting like the previous ones (except when we'll disassembly the optimised code) but the `if..then` block is one of the base statements of every language so it's important to know how it's translate to assembly code.

<!-- more -->

## The sample code

Today we'll use a code who counts the number of new-line (\n) characters in a file:

    #include <stdio.h>

    /* count lines in input */
    int main()
    {
        int c, nl;

        nl = 0;

        while ((c = getchar()) != EOF) {
            if (c == '\n') {
                ++nl;
            }
        }

        printf("%d\n", nl);
    }

The usage and ouput of this code:

    $ cc -g main.c
    $ ./a.out < main.c
    16

## The disassembly

Let see the disassembly, as usual skipping the prologue, epilogue and `main()` function's return code:

    0x0000000100000ecf <main+15>:   movl   $0x0,-0xc(%rbp)
    0x0000000100000ed6 <main+22>:   callq  0x100000f2c <dyld_stub_getchar>
    0x0000000100000edb <main+27>:   mov    %eax,-0x8(%rbp)
    0x0000000100000ede <main+30>:   cmp    $0xffffffff,%eax
    0x0000000100000ee3 <main+35>:   je     0x100000f06 <main+70>
    0x0000000100000ee9 <main+41>:   cmpl   $0xa,-0x8(%rbp)
    0x0000000100000ef0 <main+48>:   jne    0x100000f01 <main+65>
    0x0000000100000ef6 <main+54>:   mov    -0xc(%rbp),%eax
    0x0000000100000ef9 <main+57>:   add    $0x1,%eax
    0x0000000100000efe <main+62>:   mov    %eax,-0xc(%rbp)
    0x0000000100000f01 <main+65>:   jmpq   0x100000ed6 <main+22>
    0x0000000100000f06 <main+70>:   lea    0x59(%rip),%rdi        # 0x100000f66
    0x0000000100000f0d <main+77>:   mov    -0xc(%rbp),%esi
    0x0000000100000f10 <main+80>:   mov    $0x0,%al
    0x0000000100000f12 <main+82>:   callq  0x100000f32 <dyld_stub_printf>
    0x0000000100000f17 <main+87>:   mov    -0x4(%rbp),%esi
    0x0000000100000f1a <main+90>:   mov    %eax,-0x10(%rbp)

As you already had noticed nothing new to worry about. Lets start with the initialisation and termination condition of the `while` loop:

    0x0000000100000ecf <main+15>:   movl   $0x0,-0xc(%rbp)
    0x0000000100000ed6 <main+22>:   callq  0x100000f2c <dyld_stub_getchar>
    0x0000000100000edb <main+27>:   mov    %eax,-0x8(%rbp)
    0x0000000100000ede <main+30>:   cmp    $0xffffffff,%eax
    0x0000000100000ee3 <main+35>:   je     0x100000f06 <main+70>

The location at RBP-12 is the value of the `nl` (our new-line counter) and it's initialised with 0 (zero). The next instructions calls the `getchar()` function, compare the result with EOF (0xffffffff) and jumps to the end of the `while` loop if it's equal (which means the code reached the end of the file).

    0x0000000100000ee9 <main+41>:   cmpl   $0xa,-0x8(%rbp)
    0x0000000100000ef0 <main+48>:   jne    0x100000f01 <main+65>
    0x0000000100000ef6 <main+54>:   mov    -0xc(%rbp),%eax
    0x0000000100000ef9 <main+57>:   add    $0x1,%eax
    0x0000000100000efe <main+62>:   mov    %eax,-0xc(%rbp)

This is the body of the loop, the current character is compared against the new-line (0xa) character and if it's equal increase the content of RBP-12 by 1 or skip the increment if the character is not a new-line.

The loop end swith an unconditional jump back to to the termination condition:

    0x0000000100000f01 <main+65>:   jmpq   0x100000ed6 <main+22>

I'll not explain again the next instructions which set up and call the `printf()` function because we already discussed that before; I'll also automatically skip that in the next posts as well.

Disassembly optimised code

Lets enable the higher level of optimisation and disassembly the output:

    0x0000000100000ef6 <main+6>:    xor    %ebx,%ebx
    0x0000000100000ef8 <main+8>:    jmp    0x100000f00 <main+16>
    0x0000000100000efa <main+10>:   inc    %ebx
    0x0000000100000efc <main+12>:   nopl   0x0(%rax)
    0x0000000100000f00 <main+16>:   callq  0x100000f30 <dyld_stub_getchar>
    0x0000000100000f05 <main+21>:   cmp    $0xffffffffffffffff,%eax
    0x0000000100000f08 <main+24>:   je     0x100000f11 <main+33>
    0x0000000100000f0a <main+26>:   cmp    $0xa,%eax
    0x0000000100000f0d <main+29>:   jne    0x100000f00 <main+16>
    0x0000000100000f0f <main+31>:   jmp    0x100000efa <main+10>

The function's body is now much shorter, the loop is still there but the incremet of the `nl` variable is now in a different place. No memory location is used in this version, the new-line counter is stored into the EBX register (faster than a memory location) and the character read from the tandard input is stored into EAX. The new-line counter is initialised to 0 (zero) by the XOR instruction and after that the execution jumps to the `getchar()` function's call.

    0x0000000100000f00 <main+16>:   callq  0x100000f30 <dyld_stub_getchar>
    0x0000000100000f05 <main+21>:   cmp    $0xffffffffffffffff,%eax
    0x0000000100000f08 <main+24>:   je     0x100000f11 <main+33>

Just a couple of instructions to compare the character returned by the function and jump outside the loop's body (0x100000f11) if it's equal to EOF.

    0x0000000100000f0a <main+26>:   cmp    $0xa,%eax
    0x0000000100000f0d <main+29>:   jne    0x100000f00 <main+16>
    0x0000000100000f0f <main+31>:   jmp    0x100000efa <main+10>

Compares the character with new-line, jumps to the `getchar()` function's call if not equal (0x100000f00) or jumps uncnditionally to the code to increment the new-line counter (0x100000efa).

    0x0000000100000efa <main+10>:   inc    %ebx
    0x0000000100000efc <main+12>:   nopl   0x0(%rax)

This is the new-line counter increment operation done by incrementing (INC) by 1 the EBX register (no memory access, 2-bytes instruction, pure speed).

The NOP instruction is the funny part of this block: it does absolutely nothing and lokks weird to find a no-op instruction in an optimised code. Aso that's is not a normal o-op instruction but a multi-byte no-op instruction which takes up to 4-byte of memory.

The only explanation I have until now is reated to the branch prediction and prefetching mechanism of the CPU: the cache stores block of 16-bytes of memory and to optimise the process the compiler ensure the memory location at the instruction in 0x100000ef8 is at the start of the next 16-bytes block.

The 0x100000f00 modulo 16 is zero, so it's 16-bytes aligned; 0x100000efa module 16 is 12 which means it's not aligned and needs at least 4-bytes to be so (the same number of bytes taken by the multi-byte no-op).

## Conclusion

As I said before in this post there's nothing new, nothing which we don't already know from the previous posts, except for the 16-bte alignement int the optimised assembly code.

Another interesting bit is how the loops and conditional statements are translated into more or less the same assembly: the termination statement of a loop and a conditional statement follows the same pattern (initialisation, compare and jump). The only idfference is in a loop the execution jumps back to the loop's termination statement; in a conditional statement instead the jumps just after the body of the statement.
