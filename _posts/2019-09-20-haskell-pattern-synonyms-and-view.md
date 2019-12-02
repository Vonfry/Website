---
title: haskell pettern synonyms and view
date: 2019-09-20 20:05:59 +0800
categories: develop
tags: haskell pattern
---

最近需要写一个多项式相关的东西（代数课练习），而正好看到一个人用pattern做的方程解析，就有点好奇是怎么做到的，然后查找各种资料后得出了结论，主要是用到了ghc的扩展，这里小记一下。

<!-- more -->

## 主要扩展

`PatternSynonyms`和`ViewPattern`

文档：[PatternSynonyms](https://downloads.haskell.org/ghc/latest/docs/html/users_guide/glasgow_exts.html#pattern-synonyms)与[ViewPattern](https://downloads.haskell.org/ghc/latest/docs/html/users_guide/glasgow_exts.html#view-patterns)

## PatternSynonyms

这是主要实现自定pattern的扩展，语法格式查看ghc文档就行。大概分为单向、双向和显式双向。

- 单向即只用于pattern
- 双向就是可以用于正常表达式
- 显式双向就是单向和双向使用不同的操作。

### 主要语法

单向：

```haskell
pattern <pat_lhs> <- <pat>
```

双向：

```haskell
pattern <pat_lhs> = <pat>
```

显示双向：

```haskell
pattern <pat_lhs> <- <pat>
  where
    <pat_lhs> = <expr>
```

## 说明

这里先考虑一点（也是写本博的重点），**我们pattern时，是将某一个参数做pattern，可以看做pattern是一个函数，而第一个也是唯一个参数隐式的，即我们需要去匹配的那个data。**，正常使用就和一般函数相同了，左侧有几个参数就是几个参数，传给右侧进行计算。

注意本质，这里使用灵活，因为存在大量的隐式传入参数的可能。

对单向而言，就是将传入的值与其进行pattern（增加绑定，不然就是隐式将原值直接传入），然后传给左边。

而正常表达使用则是看作一个普通的函数，左面是绑定右面是实现。

大部分情况，只有左面的操作与正常data构建时的pattern相同时，可以使用非显式双向（相当于data的构造，可以封装部分参数）。

本质上来说，右式就是一我们对于这个pattern传入的原值。但使用上，`<pat>`经常使用view pattern，因为我们要对某一data构建pattern，自然我们需要将内部的数据取出，而取出这一过程基本上就伴随着pattern（注：这里和单子等无关，因为我们需要明确右式最终传入的是一个值）。但也可以只是一种很简单的匹配，比如Poly包里的`pattern X <- ((==) var -> True)`这种，通过类型约束来隐式的传递参数。
~~当然，右式不一定得是pattern（猜的），只要有办法把你要的参数给弄出来就行。但除了pattern没什么方法吧。因为我们是要将右式的参绑给左面，非pattern的情况没办法显式给出参数吧？不然哪来的下面的要写的东西，所以结论是，右式应该只能只是pattern。~~

## ViewPattern

这个扩展是查看containers这个包里Seq的pattern时发现的。

语法：`<exp> -> <pat>`

语义：它使用了这个进行pattern。主要功用是当pattern时，先将原参传入左面的表达式，返回值再进入右面pattern。如果pattern不匹配根据不同的上下文有不同的操作，比如官方wiki的例子是放在函数的参数pattern内，那么就是寻找其它可以匹配的情况。

这一方法与上面的扩展配合使用，就可以相对自由的设计自己的pattern了。通过一个typeView来把原来的type转换成另外一个data，用这个data的pattern来设计更加有好的、便利的pattern（其实就是加了一个中间层）。

## 其它

突然想到计算机网络里看到的一句话，

> 计算机科学领域的任何问题都可以通过增加一个间接的中间层来解决

Edit 2019-09-21 10:24:
修正了部分描述与误解。
