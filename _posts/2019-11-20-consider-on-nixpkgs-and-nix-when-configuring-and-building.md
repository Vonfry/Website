---
title: nixpkgs configre与build相关思考
date: 2019-11-20 14:12:57 +0800
categories: dev
tags: nixos os nix
---

问题主要在于nixpkgs的`mkDerivate`都干了些什么，为什么可以自动处理cmake等构建。以及在最近，nix使用`placeholder "out"`来代替了`$out`。不知道这里的原因。 

最近突然想到nix的包一些原理，有点好奇就去看文档，但nix一套的manual太过于简单了，同时部分内容编写有点混乱，或者说比较难查到想查的东西。比如override和callPackage需要看pill才能理解，而pills里写的内容又非常有限。而setup-hook的选项和和一些内建的setup-hook是分放在不同的两个章节且没有跳转或说明。

<!-- more -->

## mkDerivate

### setup-hook

首先，在nix里的derivate会使用`bulider`。在nixpkgs里，这个被自动设置为`<nixpkgs/pkgs/stdenv/generic/builder.sh>`内，这个文件主要使用了同目录下的`setup.sh`和`genericBuild`。这两处在nixpkgs文档里有提到，另外，文档里还提到的有setup-hook和一些内建的setup-hook。在`setup.sh`中，仅仅定义的hook的注册和运行，并没有具体的hook，这些具体的hook是什么时候从什么地方如何注册的呢？

我的第一个问题，如何处理cmake的configure，就是这里解决的。这些setup-hook分布在各种包内，然后`mkDerivate`有一个setup-hook的参数，这个参数就是用来说明将对应的hook进行注册到运行环境中(`nix-support`内)。所以当我们在`nativeBuildInput`中包含cmake后，在安装cmake过程中，这个hook就被自动安装了。对应其它的wrapper也是一样的。

### outputs

很多nixpkgs的包内有多个outputs，但没有显示给出对应outputs的install或者使用他们，这一过程被也被mkDerivate自动化了(`<nixpkgs/pkgs/build-support/setup-hooks/multiple-outputs.sh>`)。这一过程主要有对outputs相关shell变量的设置和configureFlags。当然，这只是针对默认configure的情况，而其它比如cmake，可以查看cmake下的setup-hook。会发现，同样也做了对应的支持。因为前者已经配置好shell变量了，后者只要直接用就可以了。

## placeholder

我最初的理解，这个是内建在nix内的，而`$out`依赖于bash变量。可以较好的分离开二者。

现在在[discourse](https://discourse.nixos.org/t/what-is-the-difference-between-placeholder-out-and-out/4862)上提问中，等等回复吧。

大概理解一下，主要就是提供了一种在shell外使用那个目录的方法。没有太大的区别。
