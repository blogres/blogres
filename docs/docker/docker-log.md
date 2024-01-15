---
icon: docker1
title: docker容器日志占用磁盘空间过大问题
category: 
- Docker
headerDepth: 5
date: 2023-03-28
order: 8
tag:
- docker
- log
---

docker容器日志占用磁盘空间过大问题，查看docker容器日志大小，清理docker容器日志。

<!-- more -->

## 查询占用磁盘较大的文件-升序

```shell
du -d1 -h /var/lib/docker/containers | sort -h
```

## 查看docker容器日志大小脚本

```shell
#!/bin/bash

####################################
# @description 查看docker容器日志大小
# @params $? => 代表上一个命令执行后的退出状态: 0->成功,1->失败
# @example => sh docker_log_size_show.sh
# @author zhengqingya
# @date 2021/9/29 17:30
####################################

# 在执行过程中若遇到使用了未定义的变量或命令返回值为非零，将直接报错退出
set -eu

echo "================== ↓↓↓ 查询docker容器日志大小 ↓↓↓ ================"

logs=$(find /var/lib/docker/containers/ -name '*-json.log*')

for log in $logs
do
    ls -lh $log
done

echo "================================================================"
```

## 清理docker容器日志脚本

```shell
#!/bin/bash

####################################
# @description 清理docker容器日志
# @params $? => 代表上一个命令执行后的退出状态: 0->成功,1->失败
# @example => sh docker_log_clean.sh
# @author zhengqingya
# @date 2021/9/29 17:30
####################################

# 在执行过程中若遇到使用了未定义的变量或命令返回值为非零，将直接报错退出
set -eu

echo "================== ↓↓↓ 清理docker容器日志 ↓↓↓ =================="

logs=$(find /var/lib/docker/containers/ -name '*-json.log*')

for log in $logs
do
    echo "clean log: $log"
    cat /dev/null > $log
done

echo "=================================================================="
```

## 控制容器日志大小

### 法一：运行时控制

- docker

*max-size*：容器日志最大15M

*max-file*：最大日志数20个（ ex: `*-json.log, *-json.log.1, *-json.log.2` ）

```shell
docker run -it --log-opt max-size=15m --log-opt max-file=20 redis
```

日志目录 `/var/lib/docker/containers`

观察日志的增长，你会发现当`xxx.log`日志文件到达设置的最大日志量后，会变成`xxx.log.1，xxx.log.2`文件...

- docker-compose

```
version: '3'

services:
  test:
    image: xxx
    # 日志
    logging:
      driver: "json-file"   # 默认的文件日志驱动
      options:
        max-size: "15m"    # 单个日志文件大小为100m
        max-file: "20"       # 最多3个日志文件
```

### 法二：全局配置

*温馨小提示：新容器生效*

**创建或修改`daemon.json`文件**

`vim /etc/docker/daemon.json`

**新增如下配置**

```
{
    "log-driver": "json-file",
    "log-opts": {
        "max-size":"15m", 
        "max-file":"20"
    }
}
```

**重启docker服务**

```shell
systemctl daemon-reload
systemctl restart docker
```

以上内容来自：[zhengqingya/docker-compose](https://gitee.com/zhengqingya/docker-compose/tree/master/Docker/docker容器日志占用磁盘空间过大问题) 改编。
