+++ 
draft = true
date = 2024-09-21T16:17:20+08:00
title = "C++ 中结构体成员名的反射"
description = ""
slug = ""
authors = []
tags = ["c++", "reflection"]
categories = ["devlop"]
externalLink = ""
series = []
+++

## 起因

[glaze](https://github.com/stephenberry/glaze) 库可以实现 

>Read/write aggregate initializable structs without writing any metadata or macros!

是怎么做到的呢？

## 编译器的魔法宏与特殊处理

最开始我以为这是完全由语言自身特性实现的，但其实不是。这里面包含了编译器一些特殊处理。关键点在于 `__func__`、`__PRETTY_FUNC__` 和 `__FUNCSIG__`。这些宏放在函数内会被编译器替换为函数名。如果函数是模板的话，实例化的类型信息会带进来。这样我们再加以配合 `constexpr`、`consteval` 可以拿到类名了。这样就能静态得完成类型名的反射。

但这样并不解决成员名。对于可以使用 aggregate initialization 的 POD 结构，我们可以通过模板的一些 trick 拿到初始化列表参数的长度。思路就是通过模板迭代配合 `decltype` 来检查是否可以初始化来得到最终的长度。有了成员数量后，就可以将结构体转为序列后使用变为 tuple 并使用 `get` 来取得对应的成员，当然就也可以取得这个成员的地址。把这个地址扔给上面那样特殊包装后的函数，就可以得到对应的名称了。当然，这个实现是受编译器具体实现影响。

## 阅读参考

- glaze 源代码中 `include/glaze/reflection/get_name.hpp`
- [一篇如果用 aggregate 方式反射成员的博客](https://rodusek.com/posts/2021/03/21/reflecting-over-members-of-an-aggregate/)，[这是archive 链接](https://web.archive.org/web/20240921083124/https://rodusek.com/posts/2021/03/21/reflecting-over-members-of-an-aggregate/)。
- [一篇使用上述特殊宏完成类型名反射的博客](https://rodusek.com/posts/2021/03/09/getting-an-unmangled-type-name-at-compile-time/)，[这是 archive 链接](https://web.archive.org/web/20240921083240/https://rodusek.com/posts/2021/03/09/getting-an-unmangled-type-name-at-compile-time/)。

## 未来
现在的标准里有一个实验的 reflection TS，通过 `reflexpr` 与相关的模板函数可以方便的直接拿到成员信息，就不再需要这样绕圈了。
