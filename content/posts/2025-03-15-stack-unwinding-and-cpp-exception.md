+++ 
draft = false
date = 2025-03-15T20:20:29+08:00
title = "C++ 异常与 stack unwind"
description = ""
slug = ""
authors = []
tags = ["c++"]
categories = ["develop"]
externalLink = ""
series = []
+++

## Stack unwinding

`C++` 及一些编程语言的异常处理，需要涉及多个部分，比如待回收资源的信息、确定上层调用栈与处理回调位置等[^1]。通常他们通过 stack unwinding 的方式进行实现[^2]，这主要是由于程序的执行基本都基于调用栈设计[^3]。
在编译生成的产物，会产生额外数据信息与异常处理相关的外部函数调用。在执行期，会有额外的数据查找、call stack 切换、资源管理等。

本文仅放置一些用参考资料，并不会在此处进行详细的说明。

1. [Stack unwinding](https://maskray.me/blog/2020-11-08-stack-unwinding), [archive](https://web.archive.org/web/20250000000000*/https://maskray.me/blog/2020-11-08-stack-unwinding)
2. [C++ exception handling ABI](https://maskray.me/blog/2020-12-12-c++-exception-handling-abi), [archive](https://web.archive.org/web/20250204161948/https://maskray.me/blog/2020-12-12-c++-exception-handling-abi)
3. [Itanium C++ ABI: Exception Handling](https://itanium-cxx-abi.github.io/cxx-abi/abi-eh.html)

[^1]: 虽然异常处理可以使编程便得非常方便，但不应该在语言中大量使用。因为异常处理的过程涉相对复杂，且开发者较难以细致的控制具体流程。同时，异常处理也会增加阅读代码时，对执行流程理解上的困难，特别是多层级传递与逻辑分支控制。进一步异常处理流程中使用的类型与正常流程会有差异，它们是非显示的，涉及跨层级与交错调用处理时，会减小整体流程的可读性。在高性能场景中，不应通过异常处理来进行正常的流程控制，因为这会产生不可控的资源管理与大量敏感的额外调用开销。对于性能并不是特别重要、仅在最外层提供用户交互下使用、单独设计的基于异常处理的行为控制层等场景，则可以较容易的形成易于编写与理解的功能。对于性能非敏感的场景，通过定义异常行为与正常行为的处理差异，明确异常行的为处理流，分离异常行为的处理层与控制逻辑，这类良好的设计可以有效的提高对程序的理解、框架的使用等，例如 langchain 中对于 agent 调用通过异常来做处理、http 框架中，通过异常来提前返回认证错误等。

[^2]: stack unwinding 有多种实现方法，在此我们主要讨论的是 Hewlett-Packard 定义的一套 libunwind API。大部分语言一般会使用自己定义的 api 与 stack unwind 实现，如 common lisp 标准定义了异常处理的接口，以便于编写更符合其语言设计与实现方式的解决方案，而避免在通用 api 下完成较为复杂的功能，或是额外生成冗余的 CFI 信息。在 ffi 时，需要使用提供对应的结构信息与处理回调才能正确的截获异常。

[^3]: 主要是调用栈可以较为简单并轻量的实现 subroutines 管理。同时，栈帧也是手写汇编最方便的方案，也更易于兼容。但也有一些特例，比如 [befunge](https://en.m.wikipedia.org/wiki/Befunge)。或是 cuda、fpga 针对这类特定任务的设计。

## 其它的一些补充

像 rust 等语言本身不提供异常这一设计的语言，也可以通过直接使用 unwind 相关的 api 来完成异常。但通常，他们会使用其它的方案来处理这类问题，像 haskell 基于 monad 抽象的 `maybe/either/...` 来控制错误信息，rust 的 `Result/Option/...` 等。语言本身一般也设计了对应的语法糖。
这类方法基本等同于手动判断错误信息，它们需要开发者有明确类型信息才能完成流程控制，但同时弱化了运行时的额外依赖，让开发者对代码有更好的控制。像 monad 这样的抽象，又同时可以保证较好的可读性。当然，这种设计会增加对开发者的门槛，在不具有相应的知识的情况下，可能会完全错误得理解程序逻辑。

像 go 这类语言，则就需要人工的来完成流程控制，需要显式的编写与处理。这一过程始开发过程中不可避免要编写大量的重复代码，显得冗余。但保证了程序员只需要较少的预备知识就可以充分理解代码逻辑。

