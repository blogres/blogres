---
icon: github
title: Git配置
category: 
- 开发工具
date: 2021-01-15
order: 1
star: true
tag:
- Git
- Github
---

Git配置

<!-- more -->

## git配置

### 安装Git

```bash
sudo apt-get install git
git --version
```

### Git 全局设置

- name #这里随便取
- email #这里是邮箱，与git平台的邮箱匹配

```bash
git config --global user.name "aniuger"
git config --global user.email "aniuger@163.com"
```

查看config配置消息：

```shell
git config --list
```

如果有多个name值时执行：

```shell
git config --global --replace-all user.name "aniuger"
git config --global --replace-all user.email "aniuger@163.com"
```

### 创建并配置密钥

- **rsa** 适合老型设备。`-b 4096`
- **ed25519** 适合新型设备，更加安全高效。
- 如果后期还会生成其他的密钥，建议把 `save the key` 重新更名，如：`id_ed25519_git` `id_ed25519_linux`

```shell
ssh-keygen -t ed25519 -C "aniuger@163.com"

Generating public/private ed25519 key pair.
Enter file in which to save the key (C:\Users\Administrator/.ssh/id_ed25519): C:\Users\Administrator/.ssh/id_ed25519_git   ##保存秘钥的位置
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in id_ed25519_git
Your public key has been saved in id_ed25519_git.pub
The key fingerprint is:
SHA256:7wmryfbm/FxxxxxxxEid/z3B6Zxxxxxxxxq0 aniuger@163.com
The key's randomart image is:
+--[ED25519 256]--+

PS C:\Users\Administrator\.ssh> ls
    目录: C:\Users\Administrator\.ssh
Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----          2026/5/4     15:24            411 id_ed25519_git
-a----          2026/5/4     15:24             98 id_ed25519_git.pub
```

把 `id_ed25519_git.pub` 内容复制到：gitee --> 安全设置 --> SSH公钥 --> 添加公钥 --> 把 `id_ed25519_git.pub` 内容粘贴进来。

- [gitee ssh配置页](https://gitee.com/profile/sshkeys)
- [github ssh配置页](https://github.com/settings/keys)

**创建配置文件 C:\Users\Administrator\\.ssh\config**

```bash
Host github.com
HostName github.com
IdentityFile C:\Users\Administrator\.ssh\id_ed25519_git

Host gitee.com
HostName gitee.com
IdentityFile C:\Users\Administrator\.ssh\id_ed25519_git
```

**添加私钥(ed25519) 可选配置**

- 查看ssh服务：`Get-Service ssh-agent`

    ```bash
    Status   Name               DisplayName
    ------   ----               -----------
    Stopped  ssh-agent          OpenSSH Authentication Agent
    ```

- 设置ssh服务：`Set-Service -Name ssh-agent -StartupType Manual`
- 启动ssh服务：`Start-Service ssh-agent`
- 添加私钥：`ssh-add ~/.ssh/id_ed25519_git`，`ssh-agent -s`


**校验公钥应用是否生效**

```shell
ssh -T git@gitee.com

ssh -T git@github.com
```

提示输入yes，以后提交代码就不用输入账号密码

```shell
PS C:\Users\k> ssh -T git@gitee.com
Hi jin! You've successfully authenticated, but GITEE.COM does not provide shell access.'

PS C:\Users\k> ssh -T git@github.com
Hi top! You've successfully authenticated, but GitHub does not provide shell access.'
```

## 强制推送

[解决 Push rejected: Push to xxxx/master was rejected](https://blog.csdn.net/qq_42476834/article/details/108263267)

```shell
git pull origin develop –allow-unrelated-histories
git push -u origin develop -f
```

## Gitee 推送

创建 git 仓库:

```shell
mkdir xxx
cd xxx
git init 
touch README.md
git add -A
git commit -m "first commit"
git remote add origin https://gitee.com/xxx/xxx.git
或者
git remote set-url origin https://自己的token@gitee.com/用户（组织）名称/仓库名称.git


git push -u origin "master"
```

已有仓库:

```shell
git remote add origin https://gitee.com/xxx/xxx.git
或者
git remote set-url origin https://自己的token@gitee.com/用户（组织）名称/仓库名称.git

git push -u origin "master"

```

## GitHub 推送

未有仓库:

```shell
### 创建本地项目
mkdir blogres.github.io
cd blogres.github.io
git init
git add -A
### 提交本地代码
git commit -m '提交代码了丫'
### 创建分支
git branch -M main

### https与远程仓库关联
git remote add origin https://github.com/blogres/blogres.git
git remote set-url origin https://自己的token@github.com/blogres/blogres.git
### 使用ssh连接
git remote add origin git@github.com:blogres/blogres.git
git remote set-url origin git@github.com:blogres/blogres.git

### 推送
git push -f origin main

```

已有仓库:

```shell
git remote add origin git@github.com:blogres/blogres.git
git branch -M main
git push -u origin main
```
