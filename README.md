## blogres

- [🚀首页](https://blogres.github.io/)、[VTest首页](https://blogres.github.io/vtest/)
- [github](https://github.com/blogres/blogres)
- [gitee](https://gitee.com/blogres/blogres)
- [存放 build docs 仓库](https://github.com/blogres/blogres.github.io)
- vuepress-theme-hope：[文档](https://theme-hope.vuejs.press/zh/)、[github](https://github.com/vuepress-theme-hope/vuepress-theme-hope)
- [使用Java压缩md文件中使用到的图片](https://gitee.com/cps007/markdown-img)
- [参考 Mister-Hope.github.io](https://github.com/Mister-Hope/Mister-Hope.github.io)
- [更新文档监控同步](https://gitee.com/blogres/blogres/mirrors#/)

<!-- #region recent-home -->


## 提交规范

*注意* ：

- **测试** 时设置提交消息为 `test` 开头；

- **Build部署文档** 时设置提交消息为 `docs` 开头，如（`docs add linux`）等；

- **升级依赖版本** 时设置提交消息为 `new` 开头；

- **测试依赖最新版本** 时设置提交消息为 `up` 开头。

## md文件模板

```
---
title: 
icon: 
category: 
- H
headerDepth: 5
date: 2024-01-06
order: 1
tag:
  - H
---

摘要描述信息

<!-- more -->

```

## md文件设置frontmatter

```text
# 顶置，你可以将sticky设置为number来设置它们的顺序。数值大的文章会排列在前面。
sticky: true
# 收藏
star: true
# 是否是文章，或者 plugins.blog.filter 自定义哪些页面是文章。
article: false
# 是否显示在时间线
timeline: false
# 不希望页面被侧边栏收录
index: false
# 控制侧边栏的排序方式（当你设置为正数时，【MIN：1】越小的越靠前；当你设置为负数时，【MAX：-1】越大的越靠后:）
order: 1
```

## 配置侧边栏目录

自动读取md文件并配置侧边栏目录

> children: "structure",
> 
> sidebar -> `"/foo/": "structure",`


## 技术选型

- 技术版本列表

| 技术                  | 地址                                                                                   |
|---------------------|--------------------------------------------------------------------------------------|
| node                | <a href="https://www.npmjs.com/package/node" target="_blank">20.x</a>，<a href="https://npmmirror.com/package/node/versions?tags=all" target="_blank">npmmirror</a> |
| npm                 | <a href="https://www.npmjs.com/package/npm" target="_blank">9.x</a>，<a href="https://npmmirror.com/package/npm/versions?tags=all" target="_blank">npmmirror</a> |
| pnpm                | <a href="https://www.npmjs.com/package/pnpm" target="_blank">8.x</a>，<a href="https://npmmirror.com/package/pnpm/versions?tags=all" target="_blank">npmmirror</a> |
| vue                 | <a href="https://www.npmjs.com/package/vue" target="_blank">3.x</a>，<a href="https://npmmirror.com/package/vue/versions?tags=all" target="_blank">npmmirror</a> |
| vuepress-theme-hope | <a href="https://www.npmjs.com/package/vuepress-theme-hope" target="_blank">2.0.0-rc.x</a>，<a href="https://npmmirror.com/package/vuepress-theme-hope/versions?tags=all" target="_blank">npmmirror</a> |
| vuepress            | <a href="https://www.npmjs.com/package/vuepress" target="_blank">2.0.0-rc.x</a>，<a href="https://npmmirror.com/package/vuepress/versions?tags=all" target="_blank">npmmirror</a> |

<!-- #endregion recent-home -->
