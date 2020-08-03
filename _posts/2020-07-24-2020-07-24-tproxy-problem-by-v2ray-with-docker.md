---
layout: post
title:  建立v2ray透明代理时遇到的问题记录
categories: os
tags: docker tproxy dns linux
date:   2020-07-24 20:22:34 +0800
---

记录几个小问题，主要内容请参考文档。

<!-- more -->

## dns回环
为了处理污染的问题，所以v2ray监听的53端口，但我的设置一直在导致回环。

### 原因
dns处理localhost是直接转发出去，然后又进iptables过滤再回来。由于是直接转发，不经过任何outbounds，所以自然也不会有tag。处理方法大概两种，使用显示的国内dns（内网dns的话就也只能手加，比较麻烦了。），第二种则是使用cgroup来处理。

cgroup的处理方式会比较友好，在v2的cgroup中，还可以使用目录进行match，也非常方便。

### 解决
方法很简单，像官方的教程那样加上dns的ip的路由就行（我一开始没这样做是因为觉得没这个必要，因为不路由匹配是会自动走第一个outbound的，而其实不会，原因如上）。

但这个方法并不好，因为你的dns可能有很多，比较好的方法是用dns配置里的tag然后在路由里把这个tag进行路由。

这时有几个注意点。最重要的就是路由的顺序。一定要把这个放在53拦截的前面。第二点是localhost这个路由，这个只能用ip来单独处理（如果使用了过滤ip，比如中国ip直连这样的设置，且路由在53端口路由的前面，那么可能你就不需要处理这个了）。

## docker网络

参考：[url](https://www.limstash.com/articles/202003/1568) [archive](https://web.archive.org/web/20200724123956/https://www.limstash.com/articles/202003/1568)

不过这里他的方法不是特别优，可以使用iptables的interface过滤来处理，比如`$iptables -t mangle -A $tproxy_chain_name -i docker0 -j RETURN`。至于interface的名字，基本上就是docker加一个数字，数字取决于你的docker服务数量。
