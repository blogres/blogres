---
icon: /icons/k8s/k8s_16x16.png
title: k8s开启ssh远程登录
category: 
- kubernetes
headerDepth: 5
date: 2020-04-20
order: 2
tag:
- Linux
- k8s
- ssh
---

k8s开启ssh远程登录

<!-- more -->

```shell
（1）检查是否开启SSH服务 
　　命令：ps -e|grep ssh  查看SSH服务是否开启，
　　或者通过命令：service sshd status 可以查看某个服务的状态。

（2）安装SSH服务,有就跳过 嘿嘿嘿
 　  通过 yum 安装，命令：yum install ssh
 > 客户端   yum install -y openssh-client	  yum -y install openssh-client
 > 服务器   yum install -y openssh-server	  yum -y install openssh-server
	
（3）修改SSH配置文件
 　命令：  vim /etc/ssh/sshd_config，找到 PermitRootLogin without-password 修改为 PermitRootLogin yes
 　或者：sed -i 's/#PermitRootLogin yes/PermitRootLogin yes/g' /etc/ssh/sshd_config

（4）登录 master、node1、node2、node3，每个节点都执行。
    ssh-keygen -t rsa	（ssh-keygen这里一路回车就行）
    
    ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.101.120 && \
    ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.101.121 && \
    ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.101.122 && \
    ssh-copy-id -i ~/.ssh/id_rsa.pub root@192.168.101.123 && \
    ssh-copy-id -i ~/.ssh/id_rsa.pub a@192.168.101.120 && \
    ssh-copy-id -i ~/.ssh/id_rsa.pub a@192.168.101.121 && \
    ssh-copy-id -i ~/.ssh/id_rsa.pub a@192.168.101.122 && \
    ssh-copy-id -i ~/.ssh/id_rsa.pub a@192.168.101.123

（5）重启SSH服务
　命令：  systemctl restart sshd 或   service ssh restart
　
（6）免密登录测试
	ssh 192.168.101.120 ssh 192.168.101.121
	ssh 192.168.101.122 ssh 192.168.101.123
```

master

![master](./ssh.assets/d10c357be7044003aebaf7355e8e1aca.png)

node1

![node1](./ssh.assets/22fc1c3113014095a2d21c3d8a912359.png)


node2

![node2](./ssh.assets/8cf73152a78f4f75aeefa52df0a101b3.png)

node3

![node3](./ssh.assets/723c5657a5bb4f9cbbf1adf1434fc759.png)
