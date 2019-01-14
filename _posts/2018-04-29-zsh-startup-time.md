---
title: zsh启动时间优化
date: 2018-04-29 15:28:21 +0800
categories: develop
tags: zsh shell startup
---

<!-- more -->
## 查找问题

添加`zmodload zsh/zprof`到zsh读取的第一个配置文件最上方，一般是zshrc。然后跑`zprof`就可能看到详细的加载时间了。然后分析吧。

然后可以使用`time zsh -i -c exit;`来测试总时间。

## 主要原因

主要引起加载慢的原因有几点。

`compinit`，特别是`oh-my-zsh`，很多插件会反复使用此指令，从而导致运行效率低下，而`prezpto`则相对好一点。但对于`bashcompinit`是需要自己执行的。

`thefuck`等使用命令后`eval`的，首先这类工具已经相对成熟，不会存在经常变更的情况，所以我们可以把这部分生成需要`eval`的生成到文件内，然后直接`source`，而不是每次启动去调用一遍。

`ssh-agent`与`gpg-agent`等。特别是`ssh-agent`，在macOS，如果要使用`keychain`（此指macOS内置的钥匙串），写`ssh-add -K`会非常消耗时间，其实这个指令是不用每次执行的，只要每次系统更新后跑一下就行了，然后在config里加上`UseKeychain yes`就行了。而至于agent可以使用`keychain`来管理（funtoo子项目），会比直接跑来得方便，但是消耗时间会比较大，而`prezpto`的gpg就模块比较好用。同时再用gpg去管理ssh-agent，简直完美。

插件管理工具，推荐使用`antigen`，之前笔者用过`zplug`，太慢了！静太加载似乎是需要人工设置的。而`antigen`会自动处理静态加载。只有每次修改后的第一次加载会比较慢。

## 结果

经过一大部分优化，从`oh-my-zsh`的`7s+`优化到使用`antigen prezpto`的`1.2s`，最后至`0.5s`。如果把`keychain`取消，只需要`0.2s`呢！只要不觉得慢就可以了。

不过fish的速度还是要优于zsh呢。应该是整个过程中还是存在可以优化的问题呢。不过不太想搞了。google查到一个人，fork了一个`oh-my-zsh`，优化不要的插件和`compinit`，启动时间仅要`0.2s`左右，也是相当出色呢。
