---
icon: edit 
title: Markdownlint校验Markdown内容
category: 开发工具 
headerDepth: 5
date: 2023-03-05 
tag:
- Markdownlint
---

使用 markdownlint 或 markdownlint-cli2 校验 markdown 内容

<!-- more -->

## markdownlint

[官方原文地址](https://github.com/DavidAnson/markdownlint/blob/main/doc/Rules.md)

```shell
pnpm install markdownlint-cli --save-dev
```

- 选项配置文件 `.markdownlint.json`
- 需要排除md文件 `.markdownlintignore`

```json
{
  "default": true,
  "MD001": false,
  ...
}
```

运行：

> markdownlint **/*.md --ignore node_modules


## markdownlint-cli2

[官方原文地址](https://github.com/DavidAnson/markdownlint-cli2)

```shell
pnpm install markdownlint-cli2 --save-dev
```

- 选项配置文件 `.markdownlint-cli2.mjs` (yaml,jsonc,cjs)，**ignores** 为需要排除文件

```mjs
export default {
  config: {
    default: true,
    MD001: false,
    ...
  },
  ignores: [
    "**/node_modules/**",
    ...
  ],
};
```

运行：

> markdownlint-cli2 **/*.md


## 相关规则

标记对相关规则进行分组，可用于启用一次禁用多个规则。

```shell
    accessibility - MD045
    atx - MD018, MD019
    atx_closed - MD020, MD021
    blank_lines - MD012, MD022, MD031, MD032, MD047
    blockquote - MD027, MD028
    bullet - MD004, MD005, MD007, MD032
    code - MD014, MD031, MD038, MD040, MD046, MD048
    emphasis - MD036, MD037, MD049, MD050
    hard_tab - MD010
    headings - MD001, MD003, MD018, MD019, MD020, MD021, MD022, MD023, MD024, MD025, MD026, MD036, MD041, MD043
    hr - MD035
    html - MD033
    images - MD045, MD052, MD053, MD054
    indentation - MD005, MD007, MD027
    language - MD040
    line_length - MD013
    links - MD011, MD034, MD039, MD042, MD051, MD052, MD053, MD054
    ol - MD029, MD030, MD032
    spaces - MD018, MD019, MD020, MD021, MD023
    spelling - MD044
    table - MD055, MD056
    ul - MD004, MD005, MD007, MD030, MD032
    url - MD034
    whitespace - MD009, MD010, MD012, MD027, MD028, MD030, MD037, MD038, MD039
```

- **MD001** 标题增量标题增量 - 标题级别一次只能递增一个级别
- **MD003** heading-style/header-style - 标题样式
- **MD004** ul-style - 无序列表样式
- **MD005** list-indent - 同一级别的列表项的缩进不一致
- **MD007** ul-indent - 无序列表缩进
- **MD009** no-trailing-spaces - 尾随空格
- **MD010** no-hard-tabs - 硬标签
- **MD011** no-reversed-links - 反向链接语法
- **MD012** no-multiple-blanks - 多个连续的空行
- **MD013** line-length - 线长
- **MD014** commands-show-output - 命令前使用的美元符号，不显示输出
- **MD018** no-missing-space-atx - atx 样式标题上的哈希后没有空格
- **MD019** no-multiple-space-atx - atx 样式标题上的哈希后有多个空格
- **MD020** no-missing-space-closed-atx - 闭合 atx 样式标题上的哈希内没有空格
- **MD021** no-multiple-space-closed-atx - 闭合 atx 样式标题上的哈希内有多个空格
- **MD022** blanks-around-headings/blanks-around-headers - 标题应用空行包围
- **MD023** heading-start-left/header-start-left - 标题必须从行首开始
- **MD024** no-duplicate-heading/no-duplicate-header - 具有相同内容的多个标题
- **MD025** single-title/single-h1 - 同一文档中的多个顶级标题
- **MD026** no-trailing-punctuation -  标题中的尾随标点符号
- **MD027** no-multiple-space-blockquote - 块引用符号后有多个空格
- **MD028** no-blanks-blockquote - 块引用内的空行
- **MD029** ol-prefix - 有序列表项前缀
- **MD030** list-marker-space - 列表标记后的空格
- **MD031** blanks-around-fences - 围栏代码块应用空行包围
- **MD032** blanks-around-lists - 列表应用空行包围
- **MD033** no-inline-html - 内嵌 HTML
- **MD034** no-bare-urls - 使用裸网址
- **MD035** hr-style - 水平标尺样式
- **MD036** no-emphasis-as-heading/no-emphasis-as-header - 使用强调代替标题
- **MD037** no-space-in-emphasis - 强调标记内的空格
- **MD038** no-space-in-code - 代码跨度元素内的空格
- **MD039** no-space-in-links - 链接文本内的空格
- **MD040** fenced-code-language - 受防护代码块应指定语言
- **MD041** first-line-heading/first-line-h1 - 文件中的第一行应为顶级标题
- **MD042** no-empty-links - 无空链接
- **MD043** required-headings/required-headers - 必需标题结构
- **MD044** proper-names - 专有名称应具有正确的大小写
- **MD045** no-alt-text - 图像应具有替代文本（替代文本）
- **MD046** code-block-style - 代码块样式
- **MD047** single-trailing-newline - 文件应以单个换行符结尾
- **MD048** code-fence-style - 代码围栏样式
- **MD049** emphasis-style - 强调风格应一致
- **MD050** strong-style - 强风格应保持一致
- **MD051** link-fragments - L链路片段应有效
- **MD052** reference-links-images - 引用链接和图像应使用定义的标签
- **MD053** link-image-reference-definitions - 需要链接和图像引用定义
- **MD054** link-image-style - 链接和图像样式
- **MD055** table-pipe-style - 表管道样式
- **MD056** table-column-count - 表列计数

