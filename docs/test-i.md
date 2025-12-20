---
sidebar: false
article: false
timeline: false
index: false
---

## 导入文件测试

使用 `<!-- @include: filename -->` 导入文件。

如果要部分导入文件，你可以指定导入的行数

- `<!-- @include: filename{start-end} -->`
- `<!-- @include: filename{start-} -->`
- `<!-- @include: filename{-end}-->`

同时你也可以导入文件区域:

`<!-- @include: filename#snippet-data -->`

域内容被 `#region` 和 `#endregion` 注释包围。

```md

## Hello world

<!-- #region snippet-data -->

Lorem ipsum dolor sit amet consectetur adipisicing 

<!-- #endregion snippet-data -->

Veniam harum illum 

```

能让你热闹热闹如

能让你热闹热闹如
