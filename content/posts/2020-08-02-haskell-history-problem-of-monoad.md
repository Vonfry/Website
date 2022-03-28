---
categories: 
- develop
date: "2020-08-02T12:16:45Z"
tags: 
- haskell 
- code 
- monoad 
- traversable
title: haskell中fmap, liftM, mapM, traverse历史问题记录
---

## 问题

`fmap`与`liftM`看起来做了相同的事，只是类型约束不同，实现上也不一样，但结果是一样，且后者的实现，可以归约到前者。那为什么使用了两种不同的命名，分别实现？同样的还存在于`mapM`与`traverse`等地方。

## 资料

[so: traverse](https://stackoverflow.com/questions/7460809/can-someone-explain-the-traverse-function-in-haskell) [archive](https://web.archive.org/web/20200221083238/https://stackoverflow.com/questions/7460809/can-someone-explain-the-traverse-function-in-haskell)

[so: fmap](https://stackoverflow.com/questions/7463500/why-do-we-have-map-fmap-and-liftm) [archive](https://web.archive.org/web/20181103065411/https://stackoverflow.com/questions/7463500/why-do-we-have-map-fmap-and-liftm)

[wiki: amp](https://wiki.haskell.org/Functor-Applicative-Monad_Proposal) [archive](https://web.archive.org/web/20200512082736/https://wiki.haskell.org/Functor-Applicative-Monad_Proposal)

## 说明

简单来说就是历史问题，以前的Monad等并没有受Functor约束，在2010的Haskell中已经改正了，但因为历史因素没有删除这些多余的命名。在使用中，推荐使用约束最少的那一个，比如说fmap和liftM，使用fmap。虽然实现上会有点区别，但最后的结果应该是一致的。

<!--more-->
