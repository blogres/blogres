---
icon: github
title: 校验Git提交及自动创建Gihub版本
category: 
- 开发工具
date: 2021-01-15
order: 3
tag:
- Github
- Release
---

校验Git提交及使用github工作流来自动创建release，
依赖于：commitlint、commitizen、cz-conventional-changelog

<!-- more -->

[项目源码](https://github.com/blogres/blogres)

## 使用流程

- 修改代码完成
- git add -A
- 执行 sh commit.sh | pnpm run commit 设置提交消息

```shell
#!bin/bash

set -e

tag=origin
branch=main

echo ==============
echo 提交到git仓库
echo

echo -e "\n======> 拉取新代码...\n"

git pull

echo -e "\n======> 查看本地状态...\n"

git status

echo -e "\n======> 添加更改到本地仓库缓存..."

git add -A

echo -e "\n======> 设置提交消息:\n"

pnpm run commit

echo -e "\n======> 提交到远程 ${branch} 分支\n"

git push -u $tag $branch

echo
echo ==============
echo commit ok!
echo ==============
```


## 提交消息适配器

依赖：`commitizen` + `cz-conventional-changelog`

```bash
pnpm install --save-dev commitizen

```

初始化规范适配器

```
pnpm install --save-dev cz-conventional-changelog
```

或者使用 commitizen 工具安装
commitizen 工具会自动在package.json中添加配置相应的配置

```shell
./node_modules/.bin/commitizen init cz-conventional-changelog --save-dev --save-exact

```

如果失败，就手动生成配置

```shell
npm pkg set config.commitizen.path="./node_modules/cz-conventional-changelog"
```

```json
    "config": {
        "commitizen": {
            "path": "./node_modules/cz-conventional-changelog"
        }
    },
```

上面介绍的适配器，只是其中一种，社区还提供了很多其它的适配器，可以去 [项目页面](https://github.com/commitizen/cz-cli#adapters) 查看。

```shell
npm pkg set scripts.commit="git-cz"

```

```json
  "scripts": {
    "commit": "git-cz",
  }
```

`echo "node_modules" > .gitignore`

接下来使用commitizen来生自动生成commit

```shell
git add -A

pnpm run commit

```

可选项如下：

- break change feature 发布会增加主版本号（如1.1.1 –> 2.0.0）**这个选择位于 feat 选项的：? Are there any breaking changes?**
- feat: 新的功能，发布版本会增加次版本号（如1.0.0 –> 1.1.0）
- fix: 修复bug，发布版本会增加修订版本号（如 1.0.0 –> 1.0.1）
- docs: 只修改文档
- style: 不影响代码含义的修改（比如：空格、格式化、添加缺少的分号等）
- refactor: 重构代码（既不修复错误，也不增加功能）
- perf: 性能优化
- test: 添加测试或纠正现有测试
- build: 影响构建系统或外部依赖的变化（如glup、npm等）
- ci: ci配置文件和脚本的改变 （如：Travis、Circle）
- chore: 其它不修改src或测试文件的改动
- revert: 回滚之前的提交

```shell
pnpm run commit

> changelog@1.0.0 commit
> cz

cz-cli@4.2.5, cz-conventional-changelog@3.3.0

? 选择更改的类型提交 Select the type of change that you're
committing: feat:     A new feature


? 这种变化的范围是什么（组件或文件名），可回车键跳过 What is the scope of this change (e.g.
component or file name): (press enter to skip)


? 写一个简短的祈使时态描述
更改(最多88个字符): Write a short, imperative tense description of
the change (max 88 chars):
一个简单的描述

 
? 提供详细的变更描述:
(按回车键跳过)Provide a longer description of the change:
(press enter to skip)


? 有什么突破性的变化吗?（有就yes，没有就no）Are there any breaking changes? Yes

? 突破性的变更提交需要一个主体。
请输入更长的提交描述本身: A BREAKING CHANGE commit requires a body.
Please enter a longer description of the commit itself:

? 描述突破性的变化: Describe the breaking changes:
 重大变更
 
 
? 这个变化是否影响到未解决的issues? （简单来说就是是否解决了issues里的问题，yes就指定被解决的问题）Does this change affect any open issues? Yes

? 添加被解决的issues引用 Add issue references (e.g. "fix #123", "re
#123".):
 完成 #1
 
 
[master (root-commit) ffc79a9] feat: 一个简单的描述
 3 files changed, 5805 insertions(+)
 create mode 100644 .gitignore
 create mode 100644 pnpm-lock.json
 create mode 100644 package.json
```

## commitlint 校验提交是否合规

[github地址](https://github.com/conventional-changelog/commitlint)

安装依赖

```shell
pnpm install --save-dev @commitlint/config-conventional @commitlint/cli

```

配置 [.commitlintrc.js 查看支持文件类型](https://github.com/conventional-changelog/commitlint#config)

```sh
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > .commitlintrc.js

```

安装 husky

```
pnpm install husky --save-dev

```

激活husky钩子hooks

```
npm pkg set scripts.prepare="husky install"

pnpm run prepare

```

Add a hook:

```sh
npx husky add .husky/commit-msg  'npx --no -- commitlint --edit ${1}'

npm pkg set scripts.test="echo ----demo test out!---- && exit"

npx husky add .husky/pre-commit "pnpm test"

```

测试

```
git add -A
git commit -m "这是一个新的改动"

-----> 提交不通过

```

成功示范：`git commit -m "fix: 更新一个bug"`


## conventional-changelog-cli 生成日志

安装依赖

```shell
pnpm install --save-dev conventional-changelog-cli
```

基本使用

```shell
npm pkg set scripts.changelog="conventional-changelog -p angular -i CHANGELOG.md -s"
```

> `-p angular` 用来指定使用的 commit message 标准，集成了包括 atom, codemirror, ember, eslint, express, jquery 等项目的标准。
>
> `-i CHANGELOG.md` 表示从 CHANGELOG.md 读取 changelog
>
> -s 表示读写 changelog 为同一文件。

需要注意的是，上面这条命令产生的 changelog 是基于上次 tag 版本之后的变更（Feature、Fix、Breaking Changes等等）所产生的。

所以如果你想生成之前所有 commit 信息产生的 changelog 则需要使用这条命令：

```sh
npm pkg set scripts.changelog="conventional-changelog -p angular -i CHANGELOG.md -s -r 0"
```

其中 -r 表示生成 changelog 所需要使用的 release 版本数量，默认为1，全部则是0。

`pnpm run changelog`



## standard-version 生成版本号

[github仓库](https://github.com/conventional-changelog/standard-version)

```shell
pnpm install --save-dev standard-version
```

执行

```shell
standard-version
```

选项

- --release-as, -r：指定版本号

> 默认情况下，工具会自动根据 主版本（major: 1.x.x）,次版本（minor: x.2.x） or 修订版（patch: x.x.3） 规则来生成版本号，1.2.3

```sh
standard-version -r minor
# output 1.1.0
```

- --prerelease, -p：预发版本命名

假如当期的版本号是 `2.0.0`，更新版本之后

```sh
standard-version --prerelease alpha
# output 2.0.0-alpha.0
```

- --tag-prefix, -t：版本 tag 前缀

用来给生成 tag 标签添加前缀，版本号为 2.0.0，则：

```sh
$ standard-version --tag-prefix "stable-"
# output tag: stable-v2.0.0
```


```
npm pkg set scripts.release="./scripts/release.sh"

```

pnpm run release




## release-it 生成版本号

```sh
pnpm install @release-it/conventional-changelog --save-dev

pnpm init release-it

```

一路回车，按照默认配置进行配置

不需要在npm进行发布，因此需要在.release-it.json中添加下面的配置，禁用npm发布：

```sh
"npm": {
  "publish": false
}
```

changelog生成规范

```
  "plugins": {
    "@release-it/conventional-changelog": {
      "infile": "CHANGELOG.md",
      "ignoreRecommendedBump": true,
      "strictSemVer": true,
      "preset": {
        "name": "conventionalcommits",
        "types": [
          {
            "type": "feat",
            "section": "✨新功能"
          },
          {
            "type": "fix",
            "section": "🐛问题修复"
          },
          {
            "type": "docs",
            "section": "📚文档"
          }
        ]
      }
    }
  }
```

插件会自动生成tag，我们需要自定义一下生成tag时的提交信

```
"git": {
  "commitMessage": "chore(tag): release v${version}"
}
```

测试

```
git add -A
pnpm run commit
pnpm run release
```

在这里选择patch (1.0.1)，一路默认回车。


