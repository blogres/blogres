---
icon: nodeJS
title: NodeJS配置
category: 
- 开发工具
# headerDepth: 5
date: 2020-01-06
tag:
- NodeJs
---

NodeJS配置

<!-- more -->

[Node.js 安装教程](https://blog.csdn.net/qq_42476834/article/details/110789382)

[node 官网下载](http://nodejs.cn/download/)

[官网各个版本下载](https://nodejs.org/download/release/)

[pnpm 官网安装教程](https://pnpm.io/zh/installation)

[github/nodejs/release](https://github.com/nodejs/release)


## NodeJS Release schedule

[具体参考](https://github.com/nodejs/release?tab=readme-ov-file)

| 版本  | 状态   | 代号     |开始时间 | 进入LTS时间 | 进入维护时间 |终止时间|
| :--:     | :---:               | :---:        | :---:          | :---:            | :---:             | :---:                     |
| [14.x](https://nodejs.org/download/release/latest-v14.x/) | **End-of-Life**     | Fermium  | 2020-04-21     | 2020-10-27       | 2021-10-19        | 2023-04-30                |
| [16.x](https://nodejs.org/download/release/latest-v16.x/) | **End-of-Life**     | Gallium  | 2021-04-20     | 2021-10-26       | 2022-10-18        | 2023-09-11                |
| [18.x](https://nodejs.org/download/release/latest-v18.x/) | **Maintenance**             | Hydrogen | 2022-04-19     | 2022-10-25       | 2023-10-18        | 2025-04-30                |
| [20.x](https://nodejs.org/download/release/latest-v20.x/)     | **Maintenance**         |   Iron   | 2023-04-18     | 2023-10-24       | 2024-10-22        | 2026-04-30                |
| [22.x](https://nodejs.org/download/release/latest-v22.x/)     | **LTS**         |              | 2024-04-23     | 2024-10-29       | 2025-10-21        | 2027-04-30               |
| [24.x](https://nodejs.org/download/release/latest-v24.x/)     | **Pending**         |              | 2025-04-22     | 2025-10-28       | 2026-10-20        | 2028-04-30               |


状态说明：

- **Pending**：等待研发。
- **Current**：当前正在研发。
- **LTS**：长期支持稳定版本。
- **Maintenance** 维护：关键错误修复和安全更新。
- **End-of-Life**：终止时间。

## Linux 配置

### 使用安装包安装NodeJS

```shell
tar -zxvf 下载的tar包路径 -C 存放目标路劲

sudo ln -s /soft/nodejs/bin/node /usr/local/bin/ && sudo ln -s /soft/nodejs/bin/npm /usr/local/bin/ && ls /usr/local/bin/

## sudo rm -rf /usr/local/bin/node && sudo rm -rf /usr/local/bin/npm && sudo rm -rf /usr/local/bin/cnpm

node -v && npm -v

```

### 使用PPA安装NodeJS

[参考地址](https://github.com/nodesource/distributions#debinstall)

> 使用 NodeSource 维护的 PPA 安装最新版本的 NodeJS，该公司为不同的 Linux 发行版构建和维护各种包。PPA 是软件包的替代存储库。它提供了官方 Debian 存储库中没有的软件。

- Node.js v19.x:

*Using Ubuntu*

```shell
curl -fsSL https://deb.nodesource.com/setup_19.x | sudo -E bash - && sudo apt update -y && sudo apt-get install -y nodejs
```

*Using Debian, as root*

```shell
curl -fsSL https://deb.nodesource.com/setup_19.x | bash - && apt update -y && apt-get install -y nodejs
```

- Node.js v18.x:

*Using Ubuntu*

```shell
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt update -y && sudo apt-get install -y nodejs
```

*Using Debian, as root*

```shell
curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && apt update -y && apt-get install -y nodejs
```

- Node.js v16.x:

*Using Ubuntu*

```shell
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash - && sudo apt update -y && sudo apt-get install -y nodejs
```

*Using Debian, as root*

```shell
curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt update -y && apt-get install -y nodejs
```

### 使用 NVM 安装 NodeJS

[官网文档](https://github.com/nvm-sh/nvm#intro)

1、安装脚本

```shell
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

或者

```shell
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
```

2、运行 `source ~/.profile` 命令将环境变量重新加载到当前会话中。

```shell
source ~/.profile
```

3、列出 NodeJS 的可用版本。

```shell
nvm ls-remote
```

4、下载并安装

```shell
$ nvm use 16
Now using node v16.9.1 (npm v7.21.1)
$ node -v
v16.9.1

$ nvm use 14
Now using node v14.18.0 (npm v6.14.15)
$ node -v
v14.18.0

$ nvm install 12
Now using node v12.22.6 (npm v6.14.5)
$ node -v
v12.22.6

```

5、查看与更改默认使用版本

```shell
$ nvm ls
v16.9.1
v18.15.0
default -> 16.9 (-> v16.9.1)

$ nvm alias default 18.15
default -> 18.15 (-> v18.15.0)

```

### 使用 corepack 安装 pnpm

- 安装

```bash
sudo ln -s /soft/nodejs/bin/corepack /usr/local/bin/ && corepack -v

corepack enable
corepack prepare pnpm@latest --activate

sudo ln -s /soft/nodejs/lib/node_modules/corepack/dist/pnpm.js /soft/nodejs/bin/pnpm
sudo ln -s /soft/nodejs/bin/pnpm /usr/local/bin/ && pnpm -v
```

- 卸载：`corepack disable pnpm`

### 安装 cnpm

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
sudo ln -s /soft/nodejs/bin/cnpm /usr/local/bin/ && ls /usr/local/bin/

cnpm -v
```

> "user" config from /home/jf123/.npmrc

### 构建node npm cnpm corepack pnpm快捷方式

```bash
#!/bin/bash

echo "-----------构建node npm cnpm corepack pnpm快捷方式-------------"
echo "--------------------------------------"
echo
# nodejs包默认有
sudo ln -s /data/home/yus/data/rj/nodejs/bin/node /usr/local/bin/ && node -v
echo "link “node” to [/usr/local/bin/]"
echo "查看："
ls -all /usr/local/bin/
sleep 3
echo
echo
# nodejs包默认有
sudo ln -s /data/home/yus/data/rj/nodejs/bin/npm /usr/local/bin/ && npm -v
echo "link ”npm“ to [/usr/local/bin/]"
echo
echo "查看："
ls -all /usr/local/bin/
echo
echo
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm -v
sudo ln -s /data/home/yus/data/rj/nodejs/bin/cnpm /usr/local/bin/ && cnpm -v
echo "link “cnpm” to [/usr/local/bin/]"
echo "查看："
ls -all /usr/local/bin/
sleep 3
echo
echo
# nodejs包默认有
sudo ln -s /data/home/yus/data/rj/nodejs/bin/corepack /usr/local/bin/ && corepack -v
echo "link “corepack” to [/usr/local/bin/]"
echo "查看："
ls -all /usr/local/bin/
corepack enable
corepack prepare pnpm@latest --activate
sudo ln -s /data/home/yus/data/rj/nodejs/lib/node_modules/corepack/dist/pnpm.js /data/home/yus/data/rj/nodejs/bin/pnpm
sudo ln -s /data/home/yus/data/rj/nodejs/bin/pnpm /usr/local/bin/ && pnpm -v
echo "link ”pnpm“ to [/usr/local/bin/]"
echo "查看："
ls -all /usr/local/bin/
echo
echo
echo "---------------------------------------"
sleep 9
```

### 全局模块存储设置

创建文件夹：`node_global`、`node_cache`

npm config -help -s

参数

```shell
npm config set
npm config get
npm config delete cache && npm config delete prefix

npm config list
npm config edit
```

```shell
npm config set prefix "/rj/nodejs/node_global" 

npm config set cache "/rj/nodejs/node_cache"

npm config list
```

### 配置环境变量

`sudo vim /etc/profile`

```bash
export NODE_PATH=/rj/nodejs/
export PATH=$PATH:${NODE_PATH}/bin
```

- 刷新配置生效：`source /etc/profile`

- 查看：`node -v && npm -v`

```
npm install -g webpack && npm install -D webpack-cli -g
```

> `npm install -g vue-cli` 会存放在`/rj/nodejs/node_global/{bin,lib}`目录下


## 设置淘宝镜像源

```shell
npm config set registry https://registry.npm.taobao.org
```

需要换回时改为官方的镜像源

```shell
npm config set registry https://registry.npmjs.org
```

## 查看配置

```
npm config list
```

## window 配置

[下载地址](https://nodejs.org/download/release/)，选择 `latest-v20.x` 版本

双击运行 `node-v20.10.0-x64.msi`文件进行安装。

安装后，安装其他组件的默认安装存放位置：`C:\Users\{username}\AppData\Roaming\npm\node_modules` 里面。

**如：**

`npm i -g element-ui` 存放在 `AppData\Roaming\npm\node_modules` 目录下-> `element-ui`;

`npm i -g pnpm@latest` 存放在 `AppData\Roaming\npm\node_modules` 目录下-> `pnpm`


### 全局模块存储设置

创建文件夹：`node_global`、`node_cache`

*最好赋予nodejs文件权限，不然系统自动创建文件时报错*

```shell
npm config set prefix "D:\nodejs\node_global"

npm config set cache "D:\nodejs\node_cache"
```

### 配置环境变量

NODE_HOME: `D:\nodejs\`

系统变量.Path：`%NODE_HOME%`

### 全局安装测试

引入 elementui：`npm i -g element-ui -S`

### 使用 corepack 安装 pnpm

```sh
corepack enable
corepack prepare pnpm@latest --activate
```

存放在 `C:\Users\{username}\AppData\Local\node\corepack` 目录下-> `pnpm`

> 卸载：`corepack disable pnpm`


### 使用 npm 安装 pnpm

安装：`npm install -g pnpm@latest`

### 使用 PowerShell 安装 pnpm

[installation#windows](https://pnpm.io/zh/installation#windows)

```shell
PS C:\Users\k> iwr https://get.pnpm.io/install.ps1 -useb | iex                                                          

Downloading '@pnpm/win-x64' from 'npmjs.com' registry...

Extracting downloaded '7.30.0' archive...

Running setup...

Copying pnpm CLI from C:\Users\k\AppData\Local\Temp\tmpE1F.tmp.extracted\package\pnpm.exe to C:\Users\k\AppData\Local\pnpm\pnpm.exe

Next configuration changes were made:
PNPM_HOME=C:\Users\k\AppData\Local\pnpm
Path=%PNPM_HOME%;%USERPROFILE%\AppData\Local\Microsoft\WindowsApps;%IntelliJ IDEA%;C:\Users\k\AppData\Roaming\npm;%PyCharm%;D:\Microsoft VS Code\bin;

Setup complete. Open a new terminal to start using pnpm.
```

重启计算机后查看：`pnpm -v`

```
PS C:\Users\k> pnpm -v
7.30.0
```
