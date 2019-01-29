---
title: nixos使用与开发配置
date: 2019-01-29 12:14:27 +0800
categories: dev
tags: nix nixos
---

开始上手nixos，nix与nixpkgs其实相对还好，都没有什么问题。但这之间遇到了相当多问题。大体分为几点。一个是开发环境，nix-shell的沙盒并不能很方便的对lsp等开发过程中使用的工具提供支持（我们不可能在shell.nix中去添加开发开发用的工具），另外一个大问题是部分第三方包的安装。

<!-- more -->


# 从文档开始
这里要特别说明，nixos的文档与其它一些文档相比，有点乱。不像gentoo有一个handbook，但是有一个[pills](https://nixos.org/nixos/nix-pills)。这个pills是一开始被我忽略的东西，本来以为只是一个简单的教程，但其实不是。如果不读这个pills，直接读manual会发现很多东西对不上。或者说感觉文档相当缺少。manual分为几个，对于日常使用，主要是nixos，nix与nixpkgs。这三个是必需要读全的。与pills相比，反而是manual更像是教程。manual主要讲了一些非常基础的概念，比如系统安装，以及一些参数。但是很多细节是没有讲明的。比如overide是什么？callPackage是什么？这些全部都在pills中。

pills是以nix，一点点深入，到构建出一个简单的nixpkgs和nixos中的一些概念，换句话说，nixpkgs中的一些理念，要读pills才能明白。仅仅只读manual，用用系统问题还是不大的，但是如果要做大量工具配置就会出现各种问题了。

pills与manual要配着读，里面很多内容是交错的。只读manual虽然可以让你使用系统或者工具，但是会遗漏一些重要的想法或者对部分方面为什么要这样子做产生疑问（当然不影响使用，可是不理解原理就去使用，与理解了原理再去使用是有很大区别的）。

# 参考

- [using nix in my development workflow](https://medium.com/@ejpcmac/about-using-nix-in-my-development-workflow-12422a1f2f4c)

- [nixos.wiki: development environment with nix-shell](https://nixos.wiki/wiki/Development_environment_with_nix-shell)
