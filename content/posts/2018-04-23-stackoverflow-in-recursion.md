---
categories: 
- develop
date: "2018-04-23T18:42:56Z"
tags: 
- haskell
- ruby
- stackoverflow
- recursion
title: 递归中的栈溢出
---

## 起因

起因是一道大数计算的题目，[题目在此](https://oeis.org/A002977)，我们需要计算第10000000（具体是有多少个零没印象了）。有一个同学，用py写，直接跑不出来了。我觉得应该是递归溢出了，就试着用haskell写了，但是也报溢出了。这下就麻烦了，因为我记得haskell是不会栈溢出的才对！

## 资料

先来上haskell的wiki，[stackoverflow](https://wiki.haskell.org/Stackoverflow)。

## 理解

wiki面写的很清楚，haskell没有传统C一类的`call stack`，所以自然不会出现溢出，但是这是针对调用而言的，可是，haskell会出现另外一种溢出的可能，那就是对于列表等类型的`pattern`，如果过多的匹配就会出现溢出了。

所以我这里出现了溢出的原因是在于使用`list`导致的。解决方案也很简单，按上面写的换成其它类型就好了。比如`set`什么的都可以吧。

## 思考

### 递归

突然让我引起了一个思考，如果对于大量数据计算，如何保证递归的稳定性？

查找资料，只查到了尾递归一种优化。这次算是有了一定认识，然后我们再转回haskell。对于hs，由于一切都是函数，而且没有传统意义上的命令式的顺序结构，所以尾递归无处不在（会写hs的，应该都不会去写递归除了函数以外的返回值吧），而hs对于使用grand形式的条件返回，配合尾递归有非常优秀的优化能力。

对于非hs这类语言使用递归需要特别注意尾递归等问题，需要保证程序运行的正确性。

而对于hs，更多需要考虑的是其它方面的一些意外。

那么是否存在某种优化，可以处理这种方式呢？除了hs这种从根本上处理掉调用栈外，就目前似乎没有什么优化方法。而hs的调用栈是高度依赖于其语言本身特性的，并不适用于其它命令式的语言。

### 大数计算

问题本质是大数计算，但过多精力放在了处理溢出上，后来才想到，对于大数如何处理？而目前而言，除了`C/C++`的基本类型外，大部分语言都已经自动处理掉越界问题了。但在编码的时候，需要了解这一点，不需要关心不代表不需要理解。
