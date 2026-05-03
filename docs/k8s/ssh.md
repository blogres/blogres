---
icon: /icons/k8s/k8s_16x16.png
title: K8s ssh通过密钥登录
category: 
- Linux
- kubernetes
date: 2020-04-20
order: 3
tag:
- ssh
---

k8s 设置ssh通过密钥登录，拒绝密码方式登录，保证服务器安全。

<!-- more -->

## ssh通过密钥登录

**密钥形式登录的原理是**：利用**密钥生成器制作一对密钥**——**[公钥id_rsa.pub]和[私钥id_rsa]**。将**公钥添加到服务器的某个账户上**，然后在**客户端利用私钥即可完成认证并登录**。

A 端创建密钥-->上传公钥-->B 端-->A 通过ssh免密登录 B-->

### 启用root用户登录

启用root用户：`sudo passwd root`

root用户能登录：`PermitRootLogin yes`

命令：`vim /etc/ssh/sshd_config`，找到 `#PermitRootLogin prohibit-password` 或 `#PermitRootLogin without-password` 修改为 `PermitRootLogin yes`

或者：`sed -i 's/^#PermitRootLogin.*/PermitRootLogin yes/g' /etc/ssh/sshd_config`


### 检查是否开启SSH服务

命令：`ps -e|grep ssh`  查看SSH服务是否开启，或者通过命令：`systemctl sshd status` 可以查看某个服务的状态。

### 安装SSH服务,有就跳过

搜索：`apt search openssh`

客户端：`yum install -y openssh-client` | `apt-get install -y openssh-client`

服务器：`yum install -y openssh-server` | `apt-get install -y openssh-server`

### 生成ssh密钥，所以主机都执行

ssh-keygen -t rsa -b 4096（ssh-keygen这里一路回车，生成更高强度的 4096 位 RSA|ed25519 密钥）

> *RSA* 与 *Ed25519* 是两种完全不同的公钥加密体系。Ed25519 它更现代、更安全，而且性能；RSA 适合一些非常古老的系统。

```bash
root@ubuntu24:~/.ssh# ssh-keygen -t ed25519
Generating public/private ed25519 key pair.
Enter file in which to save the key (/root/.ssh/id_ed25519):    ##保存秘钥的位置
/root/.ssh/id_ed25519 already exists.
Overwrite (y/n)? y
Enter passphrase (empty for no passphrase):   ##为秘钥设置密码，即使被人有你的秘钥没有你的密码也是无法登录aniuge
Enter same passphrase again:    ##确认密码
Your identification has been saved in /root/.ssh/id_ed25519
Your public key has been saved in /root/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:8XZObMP0G.... root@ubuntu24
The key's randomart image is:
+--[ED25519 256]--+
```

设置密码短语 **Passphrase** : 强烈建议设置。给私钥文件上额外保险。即使电脑被黑，私钥文件被偷了，黑客没有这个密码短语也无法使用它。每次连接需要多输入一次，后面会用 `ssh-agent` 来解决。

查看：`cat ~/.ssh/id_rsa.pub` | `cat ~/.ssh/id_ed25519.pub`

### 将公钥部署到服务器

把公钥复制到需要的主机上：

```bash
su root
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@192.168.0.130
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@192.168.0.131
ssh-copy-id -i ~/.ssh/id_ed25519.pub root@192.168.0.132

su ubuntu
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@192.168.0.130
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@192.168.0.131
ssh-copy-id -i ~/.ssh/id_ed25519.pub ubuntu@192.168.0.132
```

将公钥内容追加到 `~/.ssh/authorized_keys` 文件中：`cat id_ed25519.pub >> authorized_keys`，注意 `>>` 是追加，不要写成 `>`。

```bash
root@ubuntu24:~/.ssh# cat authorized_keys
ssh-ed25519 AAAAC3N......xuh administrator@xxx
ssh-ed25519 AAAAC3N......KR4 root@ubuntu24
```

### 禁用密码登录

`nano /etc/ssh/sshd_config`，最好也禁止 root 用户直接通过 SSH 登录

```bash
# 开启root登录
PermitRootLogin yes
# 公钥认证
PubkeyAuthentication yes
# Expect .ssh/authorized_keys2 to be disregarded by default in future.
AuthorizedKeysFile      .ssh/authorized_keys .ssh/authorized_keys2
# 禁用密码认证
PasswordAuthentication no
```


### 重启SSH服务

命令：  `systemctl restart ssh`

### 免密登录测试

> ssh root@192.168.0.130 ssh root@192.168.0.131 ssh ubuntu@192.168.0.132

如果设置了密码短语，系统会提示你输入它。如果没有设置，你应该能直接登录成功，不需要输入任何密码。


master


node1



node2


### ssh-agent

启动 agent：

> eval "$(ssh-agent -s)"

将你的私钥添加到 agent（只需要在每次开机后做一次）

> ssh-add ~/.ssh/id_ed25519

管理多台服务器，每次都输入 ssh user@ip 也很低效。可以在电脑的 ~/.ssh/ 目录下创建一个 config 文件来管理所有连接。

- touch ~/.ssh/config
- nano ~/.ssh/config

```
# 服务器1
Host server1
    HostName 192.168.0.129
    User sammy
    IdentityFile ~/.ssh/id_ed25519

# 服务器2
Host server2
    HostName 192.168.0.130
    User myuser
    IdentityFile ~/.ssh/work_key
```

只需要输入：`ssh dev-server`

### 在同一设备使用多种密钥

若需同时使用 RSA 与 Ed25519，可在 `~/.ssh/config` 中指定：

```yaml
Host github.com
HostName github.com
User git
IdentityFile ~/.ssh/id_ed25519

Host old-server
HostName old.example.com
User git
IdentityFile ~/.ssh/id_rsa
```

验证配置

[添加公钥](../tools/git/git-setting.md) 到 GitHub/GitLab 后测试：

`ssh -T git@github.com`

出现 "Hi username! You’ve successfully authenticated" 即表示成功。


### 注意

- 如果必须兼容老旧系统，选择 RSA；否则建议直接使用 Ed25519。
- 私钥务必妥善保管，并设置合适权限：

SSH 对权限要求很严格。请在服务器上运行 `chmod 700 ~/.ssh` 和 `chmod 600 ~/.ssh/authorized_keys` 来修复。

```bash
chmod 600 ~/.ssh/id_*
chmod 700 ~/.ssh
```

**ssh -v** -vv -vvv它会打印出详细的连接过程

