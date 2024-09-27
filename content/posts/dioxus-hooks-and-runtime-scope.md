+++ 
draft = false
date = 2024-09-27T12:07:02+08:00
title = "dioxus中的hooks与runtime的scope"
description = ""
slug = ""
authors = []
tags = ["rust", "web"]
categories = ["develop"]
externalLink = ""
series = []
+++

# 版本信息
由于写此文时 dioxus 还在快速开发中，内部实现和功能相对不那么稳定。本文所述此针对 `0.5` 版本而言。

# 前言
dioxus 是一个类似于 react 的响应式框架。其中 hooks 主要用于状态的处理。在官方文档中提及 hook 的声名必需是有序的，框架会依这个顺序完成一些事情，并区分 hook。但并没有说为什么得是有序的。再加之给出的例子说明均是 signal 等，而这些本身又是智能针对（或者说是基于引用计数的共享指针），就会让人困惑：已经使用共享指针了，为什么还需要使用这个 hook 的顺序呢？这一指针不已经保证了唯一性了么？

# Scope
通过阅读源码，可以发现 `use_hook` 本身是对 runtime 的一个包装，里面核心的点在于 `scope` 与其中的 hook。

首先，我们要明白什么是 scope。这也是文档中未详细提及的。简单来说，就是每个 vnode 与 component 创建时，都会创建一个 scope。而 scope 就像栈与树一样会进行层级嵌套。每个 scope 会管理自己内部的 hook 及各种状态的生命周期。

# 什么是 hook
hook 其实就是一个初始化的块，会在第一次声名时加入到对应的 scope 中，并进行执行。执行后返回的必定是一个 `State`，而这个本身就是一个引用计算的智能指针。说白就是通过 scope 与 hook 来保证某一对象在相联的结点的生命周期内一定存活。

hook 设计的目的是针对 rerender 的。在 rerender 时，hook 并不会被重置执行，但由 hook 所产生的状态还存活，因此重新渲染时对应的数值就会被新的值所替换。

# 顺序
那么为什么 hook 要保证顺序呢？源码在 `dioxus_core::scope_context::use_hook`。很简单，hook 创建时，为了避免重新加入，是通过当前 hooks 的数量与计算索引来判断的，只要当前索引小于计数就不会重新初始化。因此如果在条件分支等不确定因素下使用了 hooks，那么再重渲染时，就会破坏 hook 的次序，产生不可预计的结果，且有可能 hook 并没有被压入保存。同样，在取 hook 与使用时，也会受 scope 的层级、hook 数量产生影响。

# 异步、事件
拓展一下，这也是为什么官方例子中，所有的 `use_resource` 等都没有在事件触发的 closure 中，因为这些里面有 hook，要避免他们被不可控的初始化数量，与后续的行为。
