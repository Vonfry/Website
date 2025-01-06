---
categories: 
  - os
date: "2017-03-01T11:54:00Z"
tags:
  - GitLab
  - Fedora
  - server
title: gitlab安装问题记录
---

最近开始重新整理服务器，安装gitlab时，出现了不少问题在这里记录一下。

# useradd
官方上面，用户的useradd有一个`--disable-login`的参数，这个是只有debine包内才有有的参数，目的是禁用登陆，而在fedora中，或者更普遍些我们可以使用`-L`来锁定，注意不可能将shell设置为`nologin`，但则gitlab就无法使用了，因为其中有部分关联到gitlab-shell操作。

# nginx 403
这个问题主要是完成安装后，对目录访问各种403，也就是权限错误。在这里有一点很重要，因为gitlab会对你安装的目录进行读取，也就是gitlab所在的目录，在debine系的操作系统中，用户目录默认为755，而fedora中为700，这也是导致从源码安装引起这个问题的主要原因。在文档中，只针对子目录进行的权限修改，并没有对这个目录进行修改，我们需要跑一下`chmod 755 /home/git`才好。

# 重启服务
所有设置修改改要重新启动。除此之外更重要的一点，就是对assets的重新编译，安装过程中有针对node与yarn的步骤，如果gitlab更新了，这个文件也需要重新跑一下，否则gitlab网页会出现js错误。
