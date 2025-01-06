---
categories: 
- develop
date: "2020-05-19T14:54:36Z"
tags: 
- haskell
title: haskell caf
---

haskell中，会对特定的`form`进行缓存。从而产生出了一些使用无穷列表等方案的技巧，用于缓存运行结果。避免重复计算。最典型的例子就是斐波那契数。


几个参考：[wiki: memoising](https://wiki.haskell.org/Memoization) 
[Constant Applicative Form(caf)](https://wiki.haskell.org/Constant_applicative_form)
[The Fibonacci Sequence](https://wiki.haskell.org/The_Fibonacci_sequence)
[let and where](https://wiki.haskell.org/Let_vs._Where#Problems_with_where)
[eta conversion](https://wiki.haskell.org/Eta_conversion)
[fix and recursion](https://en.wikibooks.org/wiki/Haskell/Fix_and_recursion)

简单来说，就是符合caf的形式，在其执行时，会根本不同的情况对其值进行缓存。比如无穷列表的map会对列表进行缓存，这里主要是使用一个叫Float bindings outwards的东西，这是什么我也没查一，只知道ghc里面有一个FloatOut模块是用来做这个的。

如果不依赖caf，可以参考上面wiki的方法，使用各种trick进行缓存记录。
