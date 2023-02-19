+++ 
date = 2023-02-19T10:38:46+08:00
title = "C++ 模板参数逐个处理"
tags = [ "cpp", "lang" ]
categories = [ "develop" ]
+++

## 起因

想把 tuple 封装进一个自己的子类里，在构建函数时候传入我想要的参数，直接 move 进
tuple 容器。

## 问题

模板参数的展开与 fold expression 只是对每一个参数做同样的操作，但我现在希望把里
面的值取出 move 进另外一个 tuple 里，这个过程无法直接用上述方案处理，因为 tuple
里的索引是编译期传入的，没有办法通过循环等方式处理。

## 解决方法

思路很简单，template 的编程与函数式编程相似，那么我用递归不就好了。最终封出来的
类大致如下：

```c++
template <class... T>
class Foo {
public:
    Foo(std::vector<T>&&... args)
        : tpl(std::forward<std::vector<T>>(args)...)
    {}

    Foo(std::pair<T*, std::size_t>&&... args) {
        init_tpl<0>(std::make_tuple(
            std::forward<std::pair<T*, size_t>>(args)...
        ));
    }

    std::tuple<std::vector<T>...> tpl;

    template <size_t I>
    void init_tpl(std::tuple<std::pair<T*, std::size_t>...>&& args) {
        using std::get, std::back_inserter, std::copy_n;
        auto& p = get<I>(args).first;
        auto& n = get<I>(args).second;
        auto& v = get<I>(tpl);
        copy_n(p, n, std::back_inserter(v));
        if constexpr (I + 1 != sizeof... (T)) {
            init_tpl<I + 1>(
              std::forward<std::tuple<std::pair<T*, std::size_t>...>>(args)
            );
        }
    }
};
```

如果希望把每个 tuple 的元素做为参数传入某个函数，正常使用 expansion 和 comma operator 就好。
```c++
std::apply([&](auto &...element) { (f(element), ...); }, m_relations);
```
