---
categories: 
- os
date: "2017-09-03T15:43:07Z"
tags: 
- linux
- gentoo
- portage
- server
title: gentoo USE 注意点
---

# Use flag注意点

大部分在文档里都写了，但是有一些内容，并没有在文档中详细说明，可是如果不这样做，会经常出现问题的！！！

## 不要包含在global flag内

1. doc ( 这个非常重要。特别是对于ruby以及python等语言来说，会引起大量的循环依赖）
2. test / debug ( 这个应该没有什么太多要说的必要 )
4. source / examples ( 并没有什么太大问题，就是有点浪费空间，还是请针对性的使用 )


