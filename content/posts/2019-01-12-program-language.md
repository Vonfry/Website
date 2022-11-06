---
categories: 
- develop
date: "2019-01-12T20:09:12Z"
tags: 
- lang
- lisp
- haskell
- type
- ocaml
title: 编程语言的思考
---
<!--more-->

## 工具？并不

编程语言不仅仅是一个工具，更多的是一种思考问题的方式、信仰和对使用者的自我满足。

编程语言是程序员编写程序的工具，把它们当成一种工具并没有什么问题。但是，考虑一下，为什么还有不同的语言呢？不同的语言有着不同的特性，写出的代码也有不同的风格。他们代表着不同的思考方式，不同的开发风格。用过越多不同的语言，这种感觉就会越来越强烈。各类语言虽然本质很类似，但其背后的韵味是完全不同的。

语言从开发范型上可以分成几种，过程式、面向对象式和函数式等。这也是现在最广泛使用的几种。而在这之后，又有静态类型、动态类型之分，又有弱类型、强类型之分。不同语言，又有不同的特点。我大体学过`C/C++ C# LISP Haksell Python Ruby Javascript`等，这些是使用过的，以及其它学过但从来没用过的，比如`Prel Typescript OCaml`等，以及读完`SICP`后，对`LISP`以及那种解释方式深深着迷。又了解到`Haskell`，对类型推导以及无负作用的纯函数式感到欣喜。由于还是学生，并没有特别针对工作用的主要语言，各类语言在各种小玩具以及外包工作中可以随意使用。但最近阅读各类资料后，又读了《黑客与画家》一书后，开始思考不同语言的选择。加之，最近又学习了`Rust`，对于`Rust`处理部分内容分配方面又开始困惑了起来。GC or not, 动态类型还是静态类型，自由还是受限的自由。

本文更多是对自我一种认知过程。自我的一种思考。内容大量主观，如果有人有幸读到了这篇文章，可以做做参考，但大可不必认真。

我喜欢的到底是什么？什么是适合我的？不，这种答案我已经有了，或者更多是一种确信，各类语言的区别，为什么我要选择这个。很多语言都有我喜欢的特性，但真要我选一个我认真深入、研究、使用的语言我会选择什么呢？领域特定相关必然没有什么好说的，比如写系统必然是`C`，现在`rust`的设计也相当出色，但如果要底层特性，恐怕还没有能与`C`相比的吧。再比如动态语言，动态语言加上扩展，现今也只有`LISP`吧。那宏扩展至今也没有语言一样的。对语言的任意扩展，是其它所不可拥有的。那么，我希望的，是什么样的一个语言呢？本文会主要以`LISP`与`Haskell`为主对比（说白了就 我想从这场战争中选择我想要的）。

## 指针？RAII or GC

C语言家族最大的特点就是指针了吧。指针很好的把底层暴露给了开发人员，目测就我所知，包含指针的语言非常稀少。其它语言都在指针上进行的一定的抽象，比如`Java`，从编译器方面引入了引用的概念，将这一过程隐藏了。带来了开发的便利，但也失去了对底层的操作性。毫无疑问，在操作系统这类性能优先的地方，指针的方案是最佳的。因为人为对特定问题的优化，必然是要高于编译器对大部分普适性的优化的。同时，指针也带来了大量方便的操作。

可是指针也带来了大量安全问题。这就是`Rust`的提出，不是引入运行时，而是在编译器自动加入了资源的申请与释放，通过语法和编译器进行各种限制，以保证安全，隐藏掉指针等底层特性同时，又有一个轻量的运行状态。这是我非常欣赏的一种设计。有GC的运行时，我们无法知道资源到底是何时被释放的。释放资源时，为了保证程序运行正常，必须暂停计算。从这一层面思考，似乎只有劣势。GC能存在也是有益的。不同与RAII，他可以更高效的对资源进行申请。同时可以把语言底层的一些结构隐藏起来，特别是针对`LISP`、`Ruby`、`Python`这类语言而言。对于动态类型语言而言，生存周期往往是不明确的。大部分动态类型语言的变量的生存周期，并不像静态类型有明确的周期。或者说他们的周期要更长。变动也会更大。编写期间，同样的命名可以用于完全不同的结构，这是RAII难以做到的，除非像`Rust`那样严格的限制程序员的行为。动态类型的本意就是减少对类型的关注，到高维度的自由。再加限制就有点说不过去了。

性能要求的情况下，指针、动态分配是最合适的。RAII可以用于中间情况，需要性能，但又不需要对内存过度的管理。而GC更多就是对程序员的一种解放。可是啊，为什么`Java`的设计是GC而不是RAII呢？我并不觉得对引用在编译期的追踪是很难实现的事情。为什么要把这类工作放在运行时，而不是编译期呢？

是的，主要困惑就在此，编译期还是运行期。不管什么语言，为了运行效率，不应该都将大量优化放于编译期呢？当然，本人对GC的了解也不是很深入，实际管理方式应该也有不同，编译期与运行期应该同时做了优化，不然`Java`的效率运行效率也不会相对其它一些语言而言那么高了。比如说，编译期做了一次处理，运行时为了效率，并不直接释放，而是内存先存着，等再申请时，不再是直接过系统，可以先用弃用的内存。亦或者等内存不足时，再统一释放、申请。但这么就不完全是GC了，其本质更接进RAII就是了。GC或许就类似操作系统任务管理机一样。最大的好处，这是不可否认的。从这类机械式的工作解放出来，关注到更高层次的开发。比如`Python`、`Ruby`这类解释类语言，用GC实现是必然的吧。比起用大量编译期解析，不如放到运行期一点点处理。可这是解释类语言哦！`Java`、`C#`、`Haskell`这类语言，为什么还要有GC的运行时呢？大概查询了一下，和之前所写很接近（方便内存管理，不用频繁去向系统申请）。当然这是很浅的思考。仅仅自我主观，并非真实的实现，等到日后，可以回来再做修改本文吧。

## 动态类型 静态类型

动态类型，无疑有着非常多的优势。它提供了非常高度自由的命令空间使用。`LISP`就是一个典型的代表。提到`LISP`，或许就要提提`Haskell`。而`Haskell`是一个静态类型。那么静态还是动态呢？

首先静态类型可以很好的自我表达。用类型对数据进行的约束，而动态类型更多的就是一种约定。把约定做到极致的就要说`Ruby on Rails`了吧。约定依靠的是程序员本身，约束依靠的是编译器以及语法描述。这是很矛盾的一件事。个人对二者都非常喜欢。但对一个程序而言，约定可能会出现大量问题，因为我们无法保证输入是合法的，总是要做大量的检测，但是对程序员的信任而言，约定是非常欢乐的一件事，他可以大量节约掉约束种种限制带来的烦恼。

`Haskell`就是一种静态类型，它附加了推导，这使得静态类型在一定程度上也可以让程序员从类型中解放出来。由于各种原因，现在`Haskell`是不可能完全依靠推导的，在一定程度上推导已经失效了。但是我认为静态类型还是一个有益的内容。他可以帮助开发者进一步认识数据。对不同数据做相同的操作，加以编译器的辅助，来帮忙程序员更早的发现问题。而这是动态类型做不到的。约定必需假定使用着所做的都是正确的。大量使用约定，与约束又有什么区别呢？只有合理使用约定，这才会使得使用者从繁多的类型中解放出来，但是这是很难的事。特别是对lisp这种类型可以随意处理的，而静态类型可以非常好的自述，针对`Haskell`，加上类型类的存在，便得这一描述更加充分。可以节约大量文档的说明。说真的，一个类型的说明，要比一大串文档描述来得轻松的多啊。

之前在stackoverflow还是reddit上看到一个帖子，大概就是动态语言实现一个操作，与静态语言实现。比如是一个加法函数add，对动态语言，可以直接返回参加相加，剩下的交给各类其它实现吧。而静态语言不能。当然，这在`Haskell`是不存在的。因为类型类的存在。而在`C`中这是完全难以做到的。除非对类型做高度的抽象，但这种抽象又带来了大量使用困难。当然，就算是对`LISP`而言，要对不同类型做加号（毕竟`LISP`没有重载的概念），所以也不能一概而论，还是要在函数内分情况处理，反而不如`Haskell`的类型类或者操作符重载这样优雅。

大部分情况而言，静态类型还是有着非常明显的优势，而且他们并不是在单纯的限制程序员，也在帮助程序员去解释、抽象。动态类型优势在于可以放下对类型的各种困扰以及编译器的各种错误（但我认为，强类型下的动态类型，根本不能让程序员放下类型，类型还是得去思考的，只是不用像静态类型那样处处小心罢了。）

什么？你说弱类型，放弃那玩意吧。`PHP`等语言弱类型引起了大量的安全问题。而且从底层汇编方面来说，我认为也是相当不友好的。为什么字符和纯数字数据要用相同的编码啊？

上面的观点主要倾向了`Haskell`为主的静态类型。但是我也很喜欢`Ruby`的动态类型（`Python`什么的走开吧。不是很喜欢`Python`的其它设计风格）。当然类可以封装做到极点的情况下，很多类型限制也就自然消除了。因为，会到这里来的只有可能是这样的数据了。但是`LISP`不行。很多说`LISP`自由，他们的数据是由单独的函数进行创建的。哦，这样啊，请问这和C家族又有什么区别？还是没能逃离数据创建过程的限制，只是把这个过程从编译器转到了人工罢了。又何不像`Haskell`这样，用类型类带来更多的自由呢。约束与约定并不是绝对的。只有像`Ruby on Rails`这样，做到十分自然的约定时，约定才能让人舒适。这是有代价的，我们要在设计期间考虑大量的情景。`LISP`当然也能做到这样的事，在扁平化的函数式中引入这种约定，需要大量的宏。

动态类型需要考虑到输入的各种情况，需要应对非法的类型输入，这需要做大量的工作，或者来一个异常处理。而静态类型，这一工作就可以由编译器来完成了。同时也带来了文档上无需长文说明的好处。当然，毫无疑问，在编写效率以及编写方式上，动态类型要比静态类型更加有益。

## 简洁、自由、元编程

`LISP`以简洁自称，`C`也是一样的。但是这是完全不一样的。`LISP`全部依靠语法树，他的代码与解析过程中的AST没有太多区别。一个好处就是宏带来的大量自定性。可是他似乎有点简洁过头了。有很多明明可以由语言做的事情，却需要由程序员来处理，当然这也代表着程序员有着更多自由。`C`相对也是这样的，只是这种自由是对内存等更底层的操作，而不是语言工具本身。当然`C`的宏也很强大。只是还不如lisp那样，可以先计算再返回。什么？你说`C++`的模板？得了吧。那东西太过于丑陋。完全就是两种东西。当然，特例化也是一个很有意思的东西，他与类型类可以说是非常相似的。

简洁是好的。但是简洁不是代表着简单，简洁并不简单。在我看来`LISP`有点过于简单了。他并不像`C`那样，提供了非常优秀的底层操作。使用其它语言可能也会先建立一个很类似于`LISP`的宏，以做到很方便的扩展。这说明lisp还是有着足够的优点的。但同时，使用`lisp`，也需要建立大量其它语言自身所拥有的东西。haskell让我看到了这几种可能性的合并。那就是`haskell template`。他提供了一种类似于宏的扩展，也避免了过度简洁。只是，这个模板的使用，有点太过复杂了。他不如宏那样来得简单明了。这是语言复杂化后的结果，只能说利敝是同时存在啊。

`LISP`简洁，虽然带来了编程过程中的自由，但也引入了非常难看的代码布置。他不能像过程式那样以表达式为主，一层层嵌套以及各类非符号类的函数调用（是的，没有重载的`lisp`使得不同结构类型的操作必然要使用不同的函数，你可以再外面套一层抽象，但每次修改你就不得不在这层抽象中添加内容。或者像`C`那样，用函数指针，毕竟对`LISP`来说Lambda表达式是可赋值的）。这显得代码看起来就没那么舒适了。想要在`LISP`中同时达到是内在与外在的美是非常困难的。或者夸张点说是不太可能的。但我们不可否认，`LISP`前所未有的扩展能力，这是特别有吸引力的。

## Haskell LISP等

先说其它的语言吧。`C`没有争议，毕竟底层与抽象是难以兼得的。难道要再建一个`C++`那样的怪物么？`Rust`是一个好东西，他很好的在抽象与轻量上取得了一个平衡，但是轻量主要是基于底层的需求，一个unsafe的存在又打破了`Rust`带来的宁静，做为一种中间语言，这是一个不错的尝试吧。`Python`与`Ruby`一对比，结果很明显，那是后者。前者代码显得过于拘谨了。

函数式与面象对象杂交出了一个`OCaml`，说真的，由于是先学的`Haskell`再去看的这个。太不伦不类了。且不说语法怪异。对象与函数式的结合，想法是好的。但看到`Common LISP`对对象的实现我就感到恐怖，再看看你，虽然表面看起来好一点，但是太奇怪了吧。到底这是一个什么语言？毫无美感可言。

最后让我提提`LISP`与`haskell`。最后我选择了`Haskell`。为什么不是`LISP`。`Haskell`更加“函数式”一点。他更像一种数学。`LISP`更倾向多范式。同时`Haskell`可以随意的组合函数。当然`LISP`也能做，只是这一种行为会显示很难看。外表的难看。同样，内部或者也很难看。一个由语言特性提供的组合，和自我实现的组合，最后写出来的东西会截然不同。`Haskell`是不是有点像`Python`一样死板的感觉？这个问题不太好说。`Haskell`更加注重函数，也就是方法的建立。不同人对于不同的行为有不同的认知，是可以写出截然不同的代码的，他能体现出一个人理解抽象的层次。我认为这并不死板。代码的自由度其实很高。同样的事情，也有多种解决方法。这完全看每个人的思考方式了。

引自Reddit上的一句话：

> Put very coarsely, in Lisp you metaprogram with*expressions*, in Haskell you metaprogram with*meanings* 

以及知乎上一句评论：

> 这两门语言**从不同的角度去解决了一个共同的问题：如何减少重复代码，如何提高抽象**。
> 
> **LISP的思路基于语法结构**
> 
> 而**Haskell的思路是建立在类型类多态的基础上的**

其它一些相关对比：

[Reddit: Lisper of Haskell](https://www.reddit.com/r/haskell/comments/35bybo/lispers_of_haskell_whats_your_experience_using/)

[Reddit: Haskellers of Lisp](https://www.reddit.com/r/lisp/comments/35d2ut/haskellers_of_lisp_what_is_your_experience_using/)

[LISP与Haskell各有什么优缺点](https://www.zhihu.com/question/21667376)

[lisp a nd haskell](https://markkarpov.com/post/lisp-and-haskell.html)

[为什么lisp，或者说common lisp现在这么冷门呢？](https://emacs-china.org/t/lisp-common-lisp/6711)

`LISP`更加倾向于让程序员自己选择，他是一个多范型的语言，通过宏可以实现大量的特性，简单语法把程序员从各类语言特性中解放出来，而`Haskell`则倾向思考、思想的组合。毫无疑问。`LISP`倾向工程更多一点，而`Haskell`虽然宣传是应用，但其实更倾向数学多一点。前者给人各种选择，后者更加注重数学思考。同时`LISP`的宏，在惰性函数的`Haskel`中，已经变得不是必需品了，很多东西可以使用组合来代替，这样的表达更加的清晰。所谓的“可扩展”也并是必需品，宏反而成了`LISP`在某些方面缺陷的表现。

就学习而言，都学学肯定是必然的。可是使用呢？最后得出了一个结论，就像emacs与vim一样。我都在使用。只是看情况使用罢了。哪天心情好就用哪个就是了。人不能只按一种方式去思考问题。

不过`LISP`过于老旧了，少了很多现代特性，在一些方言中尝试加入了这类特性，但相对的，感觉也有点奇怪起来了。

但这不是终点，未来肯定还会有不同的想法吧。毕竟`LISP`的宏和简单的语言设计就是这么有吸引力呢。而`Haskell`的逻辑性和数学性，也是那么的美妙。

## 最后

写得有点胡言乱语，或者毫无逻辑，仅仅也就是个人思考的产物，其它人看了，就当玩笑吧。