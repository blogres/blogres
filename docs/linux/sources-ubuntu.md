---
icon: linux
title: 软件源配置 Ubuntu
category: 
- Linux
- Ubuntu
date: 2021-08-14
tag:
- Linux
---

阿里云、清华大学、中科大等软件源

<!-- more -->

# 软件源配置 Ubuntu

## 老版本配置方法

<https://developer.aliyun.com/mirror/ubuntu>

**查看系统的版本：**`cat /etc/redhat-release`

1、备份配置文件：

`sudo cp -a /etc/apt/sources.list /etc/apt/sources.list.bak`

2、修改sources.list文件，将`http://archive.ubuntu.com`和`http://security.ubuntu.com`替换成`https://mirrors.aliyun.com/`，可以参考如下命令：

```bash
sudo sed -i "s@http://.*archive.ubuntu.com@https://mirrors.aliyun.com/@g" /etc/apt/sources.list
sudo sed -i "s@http://.*security.ubuntu.com@https://mirrors.aliyun.com/@g" /etc/apt/sources.list
```

```yaml
deb https://mirrors.aliyun.com/ubuntu/ noble main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ noble main restricted universe multiverse

deb https://mirrors.aliyun.com/ubuntu/ noble-security main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ noble-security main restricted universe multiverse

deb https://mirrors.aliyun.com/ubuntu/ noble-updates main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ noble-updates main restricted universe multiverse

# deb https://mirrors.aliyun.com/ubuntu/ noble-proposed main restricted universe multiverse
# deb-src https://mirrors.aliyun.com/ubuntu/ noble-proposed main restricted universe multiverse

deb https://mirrors.aliyun.com/ubuntu/ noble-backports main restricted universe multiverse
deb-src https://mirrors.aliyun.com/ubuntu/ noble-backports main restricted universe multiverse

```

3、执行`apt-get update`更新索引


## 24版本以上DEB822配置方法

```
https://mirrors.aliyun.com/ubuntu/
清华大学 https://mirrors.tuna.tsinghua.edu.cn/ubuntu/
中科大 https://mirrors.ustc.edu.cn/ubuntu/
https://mirrors.huaweicloud.com/ubuntu/
```

ubuntu24.04 以上版本已经弃用 */etc/apt/sources.list*。改为 **/etc/apt/sources.list.d/ubuntu.sources**

**ubuntu 24.04 (noble) 配置如下**

```yaml
Types: deb
URIs: https://mirrors.aliyun.com/ubuntu
Suites: noble noble-updates noble-backports
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: https://mirrors.aliyun.com/ubuntu
Suites: noble-security
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```

**ubuntu 26.04 (resolute) 配置如下**

```yaml
Types: deb
URIs: https://mirrors.aliyun.com/ubuntu
Suites: resolute resolute-updates resolute-backports
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg

Types: deb
URIs: https://mirrors.aliyun.com/ubuntu
Suites: resolute-security
Components: main universe restricted multiverse
Signed-By: /usr/share/keyrings/ubuntu-archive-keyring.gpg
```





