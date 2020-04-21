---
title: foldl,foldr,foldl'
date: 2020-04-21 22:12:22 +0800
categories: develop
tags: haskell fold
---

fold是合并列表等重要的操作，其中主要有foldr和foldl，也即从右向左和从左向右。一般来说，后者会优于前者。但在haskell中，并不是这样。

<!-- more -->

[haskell wiki](https://wiki.haskell.org/Foldr_Foldl_Foldl%27)

主要内容都写在上面的wiki里了，这里仅做一个简单的小结。

1. 由于惰性求值的关系，在haskell中foldl并不比foldr性能更好。
2. `foldl'`是立即求值版本，效率效高，但没有惰性的关系无法配合haskell的部分特性，如无穷列表。
3. `foldr`在haskell中也意义着right method。
4. `foldr`相较于`foldl`可以更好的适用于惰性特性，如无穷列表。特别地，其可以应用短路求值，而`foldl`不可。

关于第四条的短路求值，是默认使用`foldr`的一个主要理由。

比如：

```
[a, b, c]

forall x. c * x = stop

(a * (b * (c * d)))

(((a * b) * c) * d)
```

显然，后者可以提前停止计算，特别应用在haskell的类型匹配方面。
