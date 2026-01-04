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

**pnpm to update run:** `corepack use pnpm@10.27.0`


## md文件模板

```
---
title: 
icon: 
category: 
- HarmonyOS
date: 2024-01-13
order: 1
tag:
  - HarmonyOS
  - 鸿蒙
```

## md文件设置frontmatter

```text
order: 0          # 侧边栏文章排序 0 > 1 > 2...
sticky: true      # 顶置，数值越大，排名越靠前。
star: true        # 收藏，数值越大，排名越靠前。
article: false    # 是否是文章，或者 plugins.blog.filter 自定义哪些页面是文章。
timeline: false   # 是否显示在时间线
index: false      # 不希望页面被侧边栏收录
```

## 配置侧边栏目录

自动读取md文件并配置侧边栏目录

> sidebar -> `"/foo/": "structure",`


## 技术选型

- 技术版本列表

| 技术                  | 地址                                                                                   |
|---------------------|--------------------------------------------------------------------------------------|
| node                | <a href="https://www.npmjs.com/package/node" target="_blank">22.x</a>，<a href="https://npmmirror.com/package/node/versions?tags=all" target="_blank">npmmirror</a> |
| npm                 | <a href="https://www.npmjs.com/package/npm" target="_blank">10.x</a>，<a href="https://npmmirror.com/package/npm/versions?tags=all" target="_blank">npmmirror</a> |
| pnpm                | <a href="https://www.npmjs.com/package/pnpm" target="_blank">10.x</a>，<a href="https://npmmirror.com/package/pnpm/versions?tags=all" target="_blank">npmmirror</a> |
| vue                 | <a href="https://www.npmjs.com/package/vue" target="_blank">3.x</a>，<a href="https://npmmirror.com/package/vue/versions?tags=all" target="_blank">npmmirror</a> |
| vuepress-theme-hope | <a href="https://www.npmjs.com/package/vuepress-theme-hope" target="_blank">2.0.0-rc.x</a>，<a href="https://npmmirror.com/package/vuepress-theme-hope/versions?tags=all" target="_blank">npmmirror</a> |
| vuepress            | <a href="https://www.npmjs.com/package/vuepress" target="_blank">2.0.0-rc.x</a>，<a href="https://npmmirror.com/package/vuepress/versions?tags=all" target="_blank">npmmirror</a> |

<!-- #endregion recent-home -->
