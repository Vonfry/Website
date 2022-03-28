---
layout: post
title:  "为什么 haskell 的 monad 定义使用 a -> m b 作为输入"
date:   2021-04-13 16:24:27 +0800
categories: develop
tags: haskell monad
---
## 问题说明
在理解 monad 时想到的部分，为什么 haskell 定义 monad 时要使用 `a -> m b` 作为输入函数？

## 什么是单子
自函子范畴的幺半群。

## Haskell 现有的定义
现在的 monad 定义无疑是符合单子的定义。`a -> m b` 是对象，`pure`（`return`）是幺元，多个 `>>=` 操作是可结合的。

## 其它定义
除现有定义外，还有其它合适的定义，比如通过 `join` 和 `pure`。

## 为什么对象是 `a -> m b`
如果对象是 `a -> b` 或 `m a -> m b` 时，在现有定义下也可以通过 `Functor` 来完成相应的行为，并有 `monoid` 的定义。但使用这种定义我们就无法对返回值进行更进一步的控制。考虑 `Either`，我们对返回的是用 `Left` 还是 `Right` 呢？这两者均属于 `Either` 这个范畴内，可是最终只有一个被使用了。换句说话，我们没办法 =look inside=，即除了值以外的信息被丢弃了。

## 参考

- [stackoverflow](https://stackoverflow.com/questions/11967645/why-cant-a-function-take-monadic-value-and-return-another-monadic-value)
- [previous link on archive.org](https://web.archive.org/web/20220328030116/https://stackoverflow.com/questions/11967645/why-cant-a-function-take-monadic-value-and-return-another-monadic-value)
