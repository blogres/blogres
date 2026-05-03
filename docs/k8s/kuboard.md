---
icon: /icons/k8s/k8s_16x16.png
title: K8s 可视化管理工具-Kuboard
category: 
- kubernetes
date: 2022-08-24
order: 13
tag:
- Linux
- k8s
---

k8s 可视化管理工具-Kuboard

<!-- more -->

- [https://kuboard.cn/](https://kuboard.cn/)
- [https://github.com/eip-work/kuboard-press](https://github.com/eip-work/kuboard-press)  **star:20.7+K**
- [https://gitee.com/k8s_s/kuboard-press](https://gitee.com/k8s_s/kuboard-press)

## 兼容性

| Kubernetes 版本 | Kuboard 版本 | 兼容性 | 说明   |
| --------------- | ------------ | ------ | ------ |
| v1.28           | v3.5.2.x     | 😄      | 已验证 |
| v1.27           | v3.x         | 😄      | 已验证 |
| v1.26           | v3.x         | 😄      | 已验证 |
| v1.25           | v3.x         | 😄      | 已验证 |
| v1.24           | v3.x         | 😄      | 已验证 |
| v1.23           | v3.x         | 😄      | 已验证 |
| v1.22           | v3.x         | 😄      | 已验证 |
| v1.21           | v3.x         | 😄      | 已验证 |
| v1.20           | v3.x         | 😄      | 已验证 |
| v1.19           | v3.x         | 😄      | 已验证 |
| v1.18           | v3.x         | 😄      | 已验证 |



## 安装

```shell
docker run -d \
  --restart=unless-stopped \
  --name=kuboard \
  -p 80:80/tcp \
  -p 10081:10081/tcp \
  -e KUBOARD_ENDPOINT="http://192.168.100.130:80" \
  -e KUBOARD_AGENT_SERVER_TCP_PORT="10081" \
  -v /root/kuboard-data:/data \
  swr.cn-east-2.myhuaweicloud.com/kuboard/kuboard:v3
```

也可以使用镜像 **swr.cn-east-2.myhuaweicloud.com/kuboard/kuboard:v3** ，可以更快地完成镜像下载。

请不要使用 127.0.0.1 或者 localhost 作为内网 IP \

Kuboard 不需要和 K8S 在同一个网段，Kuboard Agent 甚至可以通过代理访问 Kuboard Server \



<http://192.168.100.130:80>

- 用户名： `admin`
- 密 码： `Kuboard123`

