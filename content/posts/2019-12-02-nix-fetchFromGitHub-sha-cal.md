---
categories: develop
date: "2019-12-02T18:38:56Z"
tags: nix
title: nix计算目录sha值访方法
---

nixpkgs有一个fetchFromGitHub的方法，里面需要计算sha值，但是但是是但是文档里没有说这个值是怎么算出来的，不同于一般的文件是很容易计算的，这里是一个目录啊，文档上还写着”extracted directory“。很是迷惑。
<!--more-->

解决思路，读源码。

主要源码为`pkgs/build-support/fetchgit/nix-prefetch-git`中。通过阅读可以发现，他在计算时是删掉了`.git`文件的后使用`nix-hash`计算的。而`nix-hash`计算也很简单，就是把所有文件拼起来，然后计算。可以读一下文档。当然除了拼接外还增加了两行信息，但问题不大。对于单个文件，加上`--flat`参数就行了。基本上来说，`nix-hash`大致等于`find <path> -type f | xargs cat | sha256sum`这样，实际上是`nix-store --dump <path> | sha256sum`，其实dump这个过程和cat差不多，只不过增加了些信息，以及进行封装确保文件列出顺序相同，以及二进制文件相关的处理。当然，还有一些使用了base32的转换就是了。理解完这一点后就轻松了，剩下的自己打几个命令试试就明白了。

