---
categories: 
- develop
date: "2021-04-13T16:24:27Z"
tags: 
- haskell
- fix_point
- lambda_calcus
title: 'haskell: fix point'
---

## 问题说明

`fix` 函数是基于 Y 子、定点理论等原理进行设计及使用的。

<!--more-->

Ref. [3] 为例，

```haskell
fibMemo = fix (memoize . fib)
        = let x = (memoize . fib) x in x
        = (memoize . fib) fibMemo
        = memoize (fib fibMemo)
```

这里最后一个等号是定点理论的结论/推论，如果没有这一步，程序只会是无限的对函数进行展开，那么编译器是如何做到的？

## 推测

首先，haskell 得益于惰性与函数式，编译过程可以将一个个函数全部转换为 lambda 表达。根据 [1] 可知，定点理论 `f (fix f) = fix f` 是通过 Y 子等方式得到的产物，而这一产物是通过 beta 归约完成的。那么，只要编译器会做这些归约就行了。 [4] 中说明了 beta 规约的过程，因此推测 ghc 在编译过程中会对表达式进行规约。而根据 ghc 的文档，似乎确实会做规约 [5]。

## 参考

1. [wikipedia: fix point combinator](https://en.wikipedia.org/wiki/Fixed-point_combinator)
2. [wikibook/haskell: fix and recursion](https://en.wikibooks.org/wiki/Haskell/Fix_and_recursion)
3. [Memoizing fix point operator](https://wiki.haskell.org/Memoization#Memoizing_fix_point_operator)
4. [wiki/ghc/beta\_reduction](https://wiki.haskell.org/Beta_reduction)
5. [ghc/wiki/finding-the-needle](https://gitlab.haskell.org/ghc/ghc/-/wikis/explicit-call-stack/finding-the-needle)
