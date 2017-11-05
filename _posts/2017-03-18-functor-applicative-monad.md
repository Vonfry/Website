---
title: 函子，应用函子，单子
date:  2017-03-18 12:38:47 +0800
categories: code
tags: haskell functor applicative monad
---

# Haskell
嗯，继续写函数式。之前有比较过，也提及过关于类型类相关的事。这次主要写写单子吧。主要是这个东西学起来快，但是真的理解有点麻烦啊。

# 函子(Functor)
```haskell
class Functor f where
    fmap :: (a -> b) -> f a -> f b
```
这是函子的定义，函子的主体就是范畴论。通过这种方式来完成类型之间操作（函数）实现推导。这是非常有意思的一个东西。因为通过这个方式，我们可以只针对底层类型进行实现，然后通过一个函子，完成高级类型的推导。不兴奋么？

不过这里自然有很多疑问了，最困扰博主的问题是，这个函子的概念，一定要用Functor这个类型类么？因为我完全可以通过自已写个类型类实现。最后去stackflow上请教了一下 [URL](http://stackoverflow.com/questions/42747681/functor-and-type-classes?noredirect=1#comment72612247_42747681)。最后得到了一个非常不错的答案哦。

> Sure you can do this. It's just kinda reinventing the wheel. The advantage of standard classes is that everybody will make their types instances of them if appropriate, so if you write a function that can operate on a generic Functor f then it'll work with a huge number of different type constructors f from hundreds of libraries. If you change the function to require MyDataFunctor f instead, it'll do exactly the same thing, but only with your own type MyData.

> The only sensible reason you might want to write your own class is if you want different behaviour

# 应用函子(Applicative)
在考虑应用函子之前，我们先想一下`fmap`的原型。它只接收一个参数返回一个值的函数！虽然`(->) a`可以看成一个函数，但是如果我们需要对参数进行检测呢？比如`Just a | Nothing`，在函子的情况下，我们需要对每一种情况写一种匹配，3个参数就有大概8种可能。也就是$ 2^n $种情况。

这样就出现了应用函子。
```haskell
class Functor f =>  Applicative f where
    pure :: a -> f a
    (<*>) :: f (a -> b) -> f a -> f b
```

应用函子是在函子上的一层封装，使得函数也放入盒子内。

如果我们有一个多参数的函数，而这些个参数是Maybe类型，我们无法确定这个类型是否合法，那么自然要检测，但如果对不同参数个数都写一种非法匹配这个过程机械乏味。只要通过对`<*>)`进行pattern，那么这一个函数所有参数的非法情况就算匹配完成了。这就是应用函子的目的之一。引起另外一点就是多参数传递的灵活性。

应用函子通过把函数也放到一个盒子中，这样，每次操作，只会传递一个参数，换句话说，单次应用函子操作只有两个参数，盒子中的函数，和一个函数参数，通过这种方式，带来的好处就是我们只要写出对后者参数的非法检测，就等于有了所有参数的类型检测。正是因为把函数也放入盒子了，才能使得可以连续传递参数，并做同样的检测。如果是单纯的函子，我们没法用出这样连续二元操作传递。而pure又提供了将一个参数放入盒子的便利操作。

应用函子中，另外一个重要的概念就是升格，通过这个方式，将一般函数，升格成`f (a -> b)`类型。这就是上文提到使得应用函子可以传递调用的最主要原因。将一个多参数函数，看成`a -> (b -> c)...`这样的类型。而又因为这个函数在盒子内，才保证了完好的通用性。

# 单子(Monad)
这是一个比较难理解的类型类，但如果理解，会惊叹其功能强大。而且这个也是Haskell用得最多的类型类。

```haskell
class Applicative f => Manad f where
    join :: m (m a) -> m a

    return :: a -> m a
    return = pure
```

初看之下，理解就是把一个函数返回值是`(m a)`的，通过应用函子中的升格后变成`m (m a)`后，再取回`(m a)`。必然会有疑问？有这个必要么？ 为什么我们要写一个返回(m a)类型的函数啊！！

嗯，这时我们看回应用函子，应用函子有一个缺陷，或者说一般函子都存在的问题，那就是，我们这个函子，比如`fmap`，他的返回类型是`f b`，而我们函数的返回类型是`b`，不论是函子还是应用函子，我们都是先调用函数，然后把函数的返回值给包装后再返回。这样带来一定的非通用性。比如我们一个`Maybe Int -> Int -> Maybe [Int]`的函数，最后升格后成了`Maybe Maybe Int -> Maybe Int -> Maybe Maybe [Int]`。这样多余的嵌套使得我们函数的编写和返回会出现问题，当然可以人为了去避免，但是这样不累么？

如果我们将函数的返回值也写成了`m b`这样一来，我们传入函数的返回，就是我们这个函子的返回值，带来了更高的通用性。

同时，这样也带来了一个好处，在函数式的世界中实现了顺序执行。有兴趣的可以去试一下，用函子或者应用函子都是做不到的。

假如，我们用`fmap`来尝试这样的一个操作：

```haskell
-- 假设：a <$> f = fmap f a，注意：这里是和实际相反的。仅仅为了说明才这样写。
Just a <$> \a -> Just b <$> \b -> ...
```

由于 `<$>`最后返回的类型是`Maybe b`，则在第二段`Just b <$> \b -> ...`的返回值也就是`Maybe b`，而对于lambda的要求是`a -> b`，类型是不匹配的。应用函子也差不多如此。因为只是相比于函子多处理了多参数的适配。

同时，应用函子虽然多参数的传递，但是这个多参数没有办法在后面的参数中使用前面参数列举出来的值。

但单子可以做到这一点。正是因为`a -> m b`这样的类型。

当然，不可否认的是，单子确实可能存在相当多的限制以及返回出入盒子引起的效率问题。但在一个纯函数，纯数学的世界里，这有所谓么？而且return的函数，也使得这个语法和现代大部分编程语言类似，没有理解或者认清单子，也能很片面或者错误性的去理解这么个东西，至少，能用起来这个语言了。

# 函数式
真是美好的世界啊。自从学了函数式，从LISP到Haskell，整世界都觉得不一样了。


