---
categories:
- develop
date: "2017-07-09T15:43:01Z"
tags:
- sicp
- lisp
- haskell
- python
- javascript
title: 求值环境模型
---
# 记录为主
本博文是以SICP第二版3.2节内容为主进行的记录。
<!--more-->

# 概述
在所有编程语言中，调用函数时，会有一个上下文，这个上下文中包含着我们的环境变量。这是没有任何疑惑的地方。比如说，用`C/C++`写了一个函数，调用其，实际参数会赋值给形参（形成一个拷贝，指针的情况，就是把这个地址进行了拷贝，不是地址的内容罢了），然后所有的操作，在这个拷贝的环境中实现。也就是局布环境框架。

# 思考
这是对于大部分主流的编程语言来说，没有问题。是的。看起来很美好。让我们思考一下，如果我们可以以函数人作为返回值，我们在这个返回值中，修改了外层环境的参数会怎么样呢？

# 详细
See more: [SICP Article](https://mitpress.mit.edu/sicp/full-text/book/book-Z-H-21.html#%_sec_3.2.3)

先拿lisp来说事，就以sicp上的scheme代码为例。

```scheme
(define (make-withdraw balance)
  (lambda (amount)
    (if (>= balance amount)
        (begin (set! balance (- balance amount))
               balance)
        "Insufficient funds")))

;; Let us describe the evaluation of

(define W1 (make-withdraw 100))

;; followed by

(W1 50)
50
```

![](https://mitpress.mit.edu/sicp/full-text/book/ch3-Z-G-7.gif)
![](https://mitpress.mit.edu/sicp/full-text/book/ch3-Z-G-8.gif)
![](https://mitpress.mit.edu/sicp/full-text/book/ch3-Z-G-9.gif)
![](https://mitpress.mit.edu/sicp/full-text/book/ch3-Z-G-10.gif)
![](https://mitpress.mit.edu/sicp/full-text/book/ch3-Z-G-11.gif)

过程可以像书的图那样理解。当调用内层过程后，环境就被改变了，这时，如果还使用W1进行调用的话，环境就被更改了，`balance`不再是100而是50了！如果我们再调用一个新的全局环境，这样子就会出现一个新的局布环境，这个环境，不同于W1,而是和一开始默任情况相同了。由于博主语文不太好，所以这里还是以看图和书为主，这个其实就是书上的内容。只是用博主不可描述的理解讲了一遍罢了。

引起这个的最根本原因就是赋值。因为同一环境内的同一名称，指向了同一地址。更改其值，也就改变了这个地址的值，那么，这个环境相关的环境，也全部被影响了。

这也是一种可恨的函数负作用。

## 其它语言
是的，博主想要细写，或者说记录的是其它语言。scheme，或者说lisp方言，如上所述，那么其它语言的实现会怎么样呢？

### Haskell
这个问题在haskell根本不存在。因为，它根本不存在赋值啊。这个语言本身就是无负作用的。我们根本写不出带有负作用的函数吧。在haskell中，我们怎么改变参数的值，不存在这样的方法的。能做的仅仅是给一个绑定罢了。但这个绑定又是一个新的环境了，不会影响到之前的环境。

### python
嗯。。python不允许这样做。在内层函数里，你可以引用，这个外层的参数，但是不能修改他。不然就会将这个参数，视为内层的局布变量从而报出未定义的错误。

### javascript
同lisp

## 其它
其它大概都没有这样的语法哦〜有也是自己实现，那就要看实现怎么写的了。比如`C++`用构造函数的方法来写伪函数式什么的。



