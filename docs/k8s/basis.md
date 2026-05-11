---
icon: /icons/k8s/k8s_16x16.png
title: K8s 集群配置安装
category: 
- kubernetes
date: 2020-04-20
order: 5
tag:
- Linux
- k8s
---

k8s 集群配置安装

<!-- more -->

中文社区: <https://www.kubernetes.org.cn/>

官方文档: <https://kubernetes.io/zh/docs/home/>

社区文档: <http://docs.kubernetes.org.cn/>

[历史版本 Release History](https://kubernetes.io/releases/)

[客户端下载 github](https://github.com/kubernetes/kubernetes/tree/master/CHANGELOG)


# k8s集群配置安装


## kubectl 快捷键（alias）

具体命令请看：[k8s-alias](./alias.md)


## 部署步骤

```ABAP
0.k8s模板系统环境配置（环境准备k8s-init），完成后开始克隆主机。
1.在所有节点上安装 containerd 和 kubeadm。
2.部署init Kubernetes Master。
3.部署容器网络插件（Cilium、Calico、Flannel）。
4.部署join Kubernetes Node，将节点加入 Kubernetes集群中。
5.部署可视化管理工具-(KubeSphere、Rancher、Kuboard)。
6.部署程序、插件。
```

**对于集群相同的环境配置，可以使用 ansible 来统一配置机器**

![](./basis.assets/true-image-20211119155506746.png)

## 环境准备k8s-init

![](./basis.assets/true-image-20211212160128007.png)

### 配置网络

配置网络 [networkubuntu](../linux/networkubuntu.md)


**安装 net-tools 工具**

```shell
apt-get install net-tools
```

本机添加hosts：`C:\Windows\System32\drivers\etc`

```yacas
192.168.0.130 tomcat.k8s.com
192.168.0.130 nginx.k8s.com
# k8s-可视化管理工具-KubeSphere
192.168.0.130 ks.k8s.com
# k8s-可视化管理工具-Rancher
192.168.0.130 rc.k8s.com
# k8s-可视化管理工具-Kuboard
192.168.0.130 ka.k8s.com
# k8s-可视化管理工具-KubeOperator
192.168.0.130 ko.k8s.com
192.168.0.130 master
192.168.0.131 node1
192.168.0.132 node2
```

在每个主机上添加：`nano /etc/hosts`

centos

```yacas
127.0.0.1   localhost localhost.localdomain localhost4 localhost4.localdomain4
::1         localhost localhost.localdomain localhost6 localhost6.localdomain6

192.168.0.130 master
192.168.0.131 node1
192.168.0.132 node2
```

重启网络服务：`service network restart`

Ubuntu：

```yaml
127.0.0.1 localhost
127.0.1.1 ubuntu24
192.168.0.130 master
192.168.0.131 node1
192.168.0.132 node2

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

重启网络服务：`netplan apply`

`ping -c 3 master && ping -c 3 node1 && ping -c 3 node2`

用户：`ubuntu`，密码：`123456a`， 设置主机名称：`hostnamectl set-hostname`


### 关闭防火墙

centos：

```bash
systemctl stop firewalld
systemctl disable firewalld
```

ubuntu:

```bash
ufw disable
ufw status
```


### 禁用selinux

centos：

```shell
setenforce 0

sed -i 's/^SELINUX=enforcing$/SELINUX=permissive/' /etc/selinux/config
```


### 禁用swap分区

为了保证kubelet正常工作，k8s强制要求禁用，否则集群初始化失败。

**临时关闭**：`swapoff -a`

**永久关闭**：`sed -ri 's/.*swap.*/#&/' /etc/fstab`

查看：`grep "*.swap.*" /etc/fstab`

Centos：

```shell
[root@master ~]# cat /etc/fstab
/dev/mapper/centos-root /                       xfs     defaults        0 0
UUID=6e78f73f-f9c1-47ff-8a2e-27042e0cfaaf /boot                   xfs     defaults        0 0
/dev/mapper/centos-home /home                   xfs     defaults        0 0
/dev/mapper/centos-swap swap                    swap    defaults        0 0
```

把*/dev/mapper/centos-swap swap* 改为 *#/dev/mapper/centos-swap swap*，用**#**注释掉

Ubuntu：

```bash
swapoff -a
sed -i 's|^/swap.img|#/swap.img|' /etc/fstab
rm -f /swap.img
```


### 加载内核模块（IPVS+桥接）

**Centos：**

`nano /etc/sysconfig/modules/ipvs.modules`

```shell
cat -s <<EOF > /etc/sysconfig/modules/ipvs.modules
#!/bin/bash
ipvs_modules="ip_vs ip_vs_lc ip_vs_wlc ip_vs_rr ip_vs_wrr ip_vs_lblc ip_vs_lblcr ip_vs_dh ip_vs_sh ip_vs_fo ip_vs_nq ip_vs_sed ip_vs_ftp nf_conntrack"
for kernel_module in ${ipvs_modules}; do
  /sbin/modinfo -F filename ${kernel_module} > /dev/null 2>&1
  if [ $? -eq 0 ]; then
    /sbin/modprobe ${kernel_module}
  fi
done
EOF
```

> - chmod +x /etc/sysconfig/modules/ipvs.modules
> - sh /etc/sysconfig/modules/ipvs.modules
> - lsmod | grep ip_vs

**Ubuntu**：

**apt-get install -y ipvsadm ipset**

```shell
cat > /etc/modules-load.d/ipvs.conf <<EOF
#!/bin/bash
modprobe ip_vs
modprobe ip_vs_rr
modprobe ip_vs_wrr
modprobe ip_vs_sh
modprobe nf_conntrack
EOF

cat > /etc/modules-load.d/k8s.conf <<EOF
#!/bin/bash
modprobe overlay
modprobe br_netfilter
EOF
```

- **br_netfilter**: 启用网桥流量过滤，允许 iptables 处理桥接流量。
- **ip_vs\***: IP Virtual Server 内核模块，用于 kube-proxy 的 IPVS 模式。
- **nf_conntrack**: 连接跟踪模块，是 ip_vs 的依赖。

将桥接的IPv4流量传递到iptables的链

```shell
# centos:::/usr/lib/sysctl.d/00-system.conf 与之相同↓
cat -s <<EOF > /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1
vm.swappiness=0
EOF

--------------------------
--------------------------
# /etc/sysctl.conf，这里推荐在企业正式环境里配置
net.core.somaxconn = 32768
net.ipv4.tcp_tw_reuse = 1
fs.file-max = 2097152
```

- **bridge-nf-call-\***: 确保 iptables 能够对桥接的流量进行过滤。
- **ip_forward = 1**: 启用 IPv4 路由转发，是 Pod 跨节点通信的基础。


**校验：**

```bash
systemctl restart systemd-modules-load
sysctl -p /etc/sysctl.d/k8s.conf
sysctl --system

lsmod | grep -e ip_vs -e nf_conntrack
lsmod | grep overlay
lsmod | grep br_netfilter
sysctl net.bridge.bridge-nf-call-iptables net.bridge.bridge-nf-call-ip6tables net.ipv4.ip_forward
```

### 磁盘I/O优化

```bash
# 使用deadline调度器 nvme硬盘（/sys/block/nvme0n1/queue/scheduler）
echo deadline > /sys/block/sda/queue/scheduler
# 调整预读缓存
blockdev --setra 4096 /dev/sda
```

### network-security开启网络安全

```shell
#修改/etc/sysctl.d/10-network-security.conf
#与 /usr/lib/sysctl.d/50-default.conf 类似
cat -s <<EOF > /etc/sysctl.d/10-network-security.conf
net.ipv4.conf.default.rp_filter=1
net.ipv4.conf.all.rp_filter=1
EOF

#然后使之生效
sysctl --system
```

### 生产环境必装工具包

```bash
apt-get install -y \
  conntrack \    # kube-proxy依赖
  socat \        # kubectl port-forward需要
  ebtables \     # 网络策略支持
  chrony        # 时间同步
```

> 查验安装是否成功：systemctl list-units --type=service | grep chrony


### 设置时间同步

centos：

```shell
rm -rf /var/run/yum.pid
yum install -y chrony | apt-get install -y chrony
systemctl start chrony
systemctl enable chrony
timedatectl set-ntp true
timedatectl set-timezone Asia/Shanghai
echo "----> 时区状态：timedatectl status"
timedatectl status
echo "----> 检测：chronyc activity -v"
chronyc activity -v
yum -y install ntpdate | apt-get install -y ntpdate
yum install -y ntpsec-ntpdate | apt-get install -y ntpsec-ntpdate
ntpdate time.windows.com
```

### 配置软件源

- [sources-ubuntu](../linux/sources-ubuntu.md)
- [sources-centos](../linux/sources-centos.md)

### 所有节点安装containerd

[官方原文地址](https://kubernetes.io/zh-cn/docs/setup/production-environment/container-runtimes/#containerd)

**安装containerd，有可能默认已经安装**

```shell
yum install -y yum-utils
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum -y install containerd.io
```

ubuntu:

```bash
apt-get install -y containerd
```

**生成config.toml配置：**

```shell
mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml
systemctl restart containerd
systemctl enable containerd
```


**配置 systemd cgroup 驱动 在 /etc/containerd/config.toml 中设置**

使用 systemd 作为 cgroup 驱动（必须和 kubelet 保持一致）

```shell
sed -i 's/SystemdCgroup = false/SystemdCgroup = true/g' /etc/containerd/config.toml

或手动修改

[plugins]
  [plugins.'io.containerd.cri.v1.runtime'.containerd.runtimes.runc]
    ......
    [plugins."io.containerd.cri.v1.runtime".containerd.runtimes.runc.options]
      SystemdCgroup = true
```


**将 sandbox 下载地址改为阿里云地址**，替换 pause 镜像（国内必须改，否则 kubeadm init 大概率卡死）

```shell
sed -i "s/sandbox = 'registry.k8s.io\/pause:3.10.1'/sandbox = 'registry.aliyuncs.com\/google_containers\/pause:3.10.1'/g" /etc/containerd/config.toml

或手动修改
    [plugins.'io.containerd.cri.v1.images'.pinned_images]
      sandbox = 'registry.aliyuncs.com/google_containers/pause:3.10.1'
    [plugins.'io.containerd.cri.v1.images'.registry]
      config_path = '/etc/containerd/certs.d'  
```

```bash
mkdir -p /etc/containerd/certs.d/registry.k8s.io
mkdir -p /etc/containerd/certs.d/k8s.gcr.io

cat > /etc/containerd/certs.d/registry.k8s.io/hosts.toml <<'EOF'
server = "https://registry.k8s.io"

[host."https://registry.aliyuncs.com"]
  capabilities = ["pull", "resolve"]
  override_path = true
EOF

cat > /etc/containerd/certs.d/k8s.gcr.io/hosts.toml <<'EOF'
server = "https://k8s.gcr.io"

[host."https://registry.aliyuncs.com"]
  capabilities = ["pull", "resolve"]
  override_path = true
EOF
```

> systemctl restart containerd


### containerd和docker操作差异

| 操作                | Docker            | Containerd (ctr)     | Crictl (K8s)      |
| ------------------- | ----------------- | -------------------- | ----------------- |
| 查看运行的容器      | docker ps         | ctr task ls          | crictl ps         |
| 查看镜像            | docker images     | ctr image ls         | crictl images     |
| 查看容器日志        | docker logs       | 无                   | crictl logs       |
| 查看容器数据信息    | docker inspect    | ctr container info   | crictl inspect    |
| 查看容器资源        | docker stats      | 无                   | crictl stats      |
| 启动/关闭已有的容器 | docker start/stop | ctr task start/kill  | crictl start/stop |
| 运行一个新的容器    | docker run        | ctr run              | 无                |
| 修改镜像标签        | docker tag        | ctr image tag        | 无                |
| 创建一个新的容器    | docker create     | ctr container create | crictl create     |
| 导入镜像            | docker load       | ctr image import     | 无                |
| 导出镜像            | docker save       | ctr image export     | 无                |
| 删除容器            | docker rm         | ctr container rm     | crictl rm         |
| 删除镜像            | docker rmi        | ctr image rm         | crictl rmi        |
| 拉取镜像            | docker pull       | ctr image pull       | crictl pull       |
| 推送镜像            | docker push       | ctr image push       | 无                |
| 在容器内部执行命令  | docker exec       | 无                   | crictl exec       |


## 完成后开始克隆主机

完成以上基础环境依赖配置后开始克隆集群主机。

## 开启 ssh 远程登录

[开启 ssh 远程登录文档](./ssh.md)


## A、在所有节点上安装k8s

kubeadm管理、kukelet代理、kubectl命令行

### K8s抛弃Docker的原因

![](./basis.assets/true-udocker.jpg)

Kubernetes 1.24+ 版本虽然已经不使用原始docker，k8s使用了containerd替代，但如果不想用它，也可以使用docker推出的 cri-dockerd。

**...安装docker...忽略...；Kubernetes 1.24+ 版本已经去除了对Docker的直接接口支持,需要通过containerd + docker CRI使用Docker。**

卸载的旧版本

```bash
yum remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
```

```shell
# step 1: 安装必要的一些系统工具
  yum install -y yum-utils device-mapper-persistent-data lvm2
# Step 2: 添加软件源信息
  yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# Step 3
  sed -i 's+download.docker.com+mirrors.aliyun.com/docker-ce+' /etc/yum.repos.d/docker-ce.repo
# Step 4: 更新并安装Docker-CE
  yum clean all &&   yum makecache fast
  yum list docker-ce.x86_64 --showduplicates | sort -r
  yum -y install docker-ce-[VERSION]
# Step 4: 开启Docker服务
  service docker start

```

```shell
systemctl docker
systemctl restart docker | stop | enable | disable | status
usermod -aG docker a #非root用户
```

设置加速

```bash
cat -su <<EOF > /etc/docker/daemon.json
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "registry-mirrors": [
    "https://04eo9xup.mirror.aliyuncs.com"
  ],
}
EOF
```

> `"https://098cc8006500f4db0f2fc01937bbce40.mirror.swr.myhuaweicloud.com"`

```shell
  systemctl daemon-reload
  systemctl restart docker
```

**docker配置http代理（可选）**

首先, 使用`systemctl status docker`命令查询`docker.service`文件的路径, 在我的环境中它的文件路径是`/lib/systemd/system/docker.service`; 然后编辑这个文件, 添加如下内容:

`vim /lib/systemd/system/docker.service`

```shell
[Service]
Environment="HTTP_PROXY=http://127.0.0.1:10809"
Environment="HTTPS_PROXY=http://127.0.0.1:10809" 
Environment="NO_PROXY=localhost,127.0.0.0/8,192.168.0.0/16,10.0.0.0/8"
```

---
---

### 添加kubernetes仓库源

centos：

```shell
# 新版配置v1.24-v1.29
cat <<EOF | tee /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.28/rpm/
enabled=1
gpgcheck=1
gpgkey=https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.28/rpm/repodata/repomd.xml.key
EOF
```

**更新索引文件并查看 kubernetes版本列表**

```shell
yum clean all && yum makecache && yum -y update && yum repolist

yum list kube*
```

`failure: repodata/repomd.xml from kubernetes: [Errno 256] No more mirrors to try.`

暂时禁用存储库：`yum --disablerepo=kubernetes`

永久禁用存储库：`yum-config-manager --disable kubernetes or subscription-manager repos --disable=kubernetes`

如果不可用，则跳过：`yum-config-manager --save --setopt=kubernetes.skip_if_unavailable=true`


Ubuntu：

```bash
mkdir -p /etc/apt/keyrings

apt-get update && apt-get install -y apt-transport-https ca-certificates curl gnupg

curl -fsSL https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.34/deb/Release.key |
    gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg

echo "deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://mirrors.aliyun.com/kubernetes-new/core/stable/v1.34/deb/ /" |
    tee /etc/apt/sources.list.d/kubernetes.list

apt-get update
```

### 安装kubernetes

**升级0，新安装0，降级3，删除0，未升级25**

```bash
apt search kube*
apt-get install -y kubelet=1.34.7-* kubeadm=1.34.7-* kubectl=1.34.7-*

华为：
yum install kubelet-1.34.7-0 kubeadm-1.34.7-0 kubectl-1.34.7-0 --disableexcludes=kubernetes
阿里：
yum install kubelet-1.34.7 kubeadm-1.34.7 kubectl-1.34.7 --disableexcludes=kubernetes
yum install --nogpgcheck kubelet-1.34.7 kubeadm-1.34.7 kubectl-1.34.7 --disableexcludes=kubernetes
```

- 设置 `disableexcludes` 运行 yum update 时不会升级kubernetes。

### 锁版本（防止系统突然"帮你升级"）

`apt-mark hold kubelet kubeadm kubectl`

- auto：将指定软件包标记为自动安装。
- manual：将指定软件包标记为手动安装。
- minimize-manual：将 meta 包的所有依赖项标记为自动安装。
- hold：将指定软件包标记为保留，阻止其自动更新。
- unhold：取消指定软件包的保留标记，允许其自动更新。
- showauto：列出所有自动安装的软件包。
- showmanual：列出所有手动安装的软件包。
- showhold：列出所有标记为保留的软件包。

### 配置kubelet

配置cgroup管理

```
nano /etc/default/kubelet
KUBELET_EXTRA_ARGS="--cgroup-driver=systemd"
```

### 启动 k8s

```shell
systemctl start kubelet | disable | enable | stop | status
```

发现：`kubelet.service - kubelet: The Kubernetes Node Agent`，属于正常，k8s还没有配置


## B、Master部署K8s

```shell
> swr.myhuaweicloud.com/iivey
> registry.k8s.io
> registry.aliyuncs.com/google_containers
```

- 查询需要的镜像：

`kubeadm config images list --kubernetes-version=v1.34.7 --image-repository registry.aliyuncs.com/google_containers`

```bash
registry.aliyuncs.com/google_containers/kube-apiserver:v1.34.7
registry.aliyuncs.com/google_containers/kube-controller-manager:v1.34.7
registry.aliyuncs.com/google_containers/kube-scheduler:v1.34.7
registry.aliyuncs.com/google_containers/kube-proxy:v1.34.7
registry.aliyuncs.com/google_containers/coredns:v1.12.1
registry.aliyuncs.com/google_containers/pause:3.10.1
registry.aliyuncs.com/google_containers/etcd:3.6.5-0
```

- 提前拉取kubernetes镜像

```bash
kubeadm config images pull \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.34.7
```

通过 `crictl images` 查验是否下载成功。

### master-kubeadm初始化

- 生成k8s默认配置文件信息：

`kubeadm config print init-defaults --component-configs KubeProxyConfiguration > kubeadm.yaml`

修改配置：

```bash
sed -i 's/advertiseAddress: .*/advertiseAddress: 192.168.0.130/' kubeadm.yaml
sed -i 's#imageRepository: .*#imageRepository: registry.aliyuncs.com/google_containers#' kubeadm.yaml
sed -i 's/^\s*name: .*$/  name: master/' kubeadm.yaml
sed -i 's/kubernetesVersion: .*/kubernetesVersion: v1.34.7/' kubeadm.yaml
sed -i '/serviceSubnet/a\  podSubnet: 10.244.0.0/16' kubeadm.yaml

---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
---
apiVersion: kubeproxy.config.k8s.io/v1alpha1
kind: KubeProxyConfiguration
mode: "ipvs"
ipvs:
  excludeCIDRs: null
  minSyncPeriod: 0s
  scheduler: ""
  strictARP: false
  syncPeriod: 30s
  tcpFinTimeout: 30s
  tcpTimeout: 30s
  udpTimeout: 0s
```

配置 crictl 工具，方便调试。

```bash
cat <<EOF | sudo tee /etc/crictl.yaml
runtime-endpoint: unix:///var/run/containerd/containerd.sock
image-endpoint: unix:///var/run/containerd/containerd.sock
timeout: 2
debug: false
EOF
```

执行初始化：`kubeadm init --config kubeadm.yaml`

或者通过命令初始化：

**Centos例子**：

```shell
kubeadm init \
--apiserver-advertise-address=192.168.0.130 \
--control-plane-endpoint=192.168.0.130 \
--image-repository registry.aliyuncs.com/google_containers \
--kubernetes-version v1.34.7 \
--service-cidr=10.96.0.0/12 \
--pod-network-cidr=10.244.0.0/16
```

于定义服务和 Pod 网络：

- `serviceSubnet`=`service-cidr`
- `podSubnet`=`pod-network-cidr`

### 得到 kubeadm join

```shell
Your Kubernetes control-plane has initialized successfully!
要开始使用群集，您需要以普通用户身份运行以下命令：
    mkdir -p $HOME/.kube
    sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
    sudo chown $(id -u):$(id -g) $HOME/.kube/config
    echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bashrc
    source ~/.bashrc

或者，如果您是root用户，则可以运行：
    echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bashrc
    source ~/.bashrc
  
您现在应该在集群上部署一个pod网络。
使用下列选项之一运行“kubectl apply -f [podnetwork].yaml”：
https://kubernetes.io/docs/concepts/cluster-administration/addons/

#### master
现在，您可以通过复制证书颁发机构来加入任意数量的控制平面节点
和每个节点上的服务帐户密钥，然后以root用户身份运行以下操作：
kubeadm join 192.168.0.130:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:0d270a0f1f942050a584a35abd42284fffc5d52d88d37af9382731743f40c393 \
        --control-plane

然后，在每个节点上以root身份运行以下操作，可以加入任意数量的工作节点：
##### node
su root
kubeadm join 192.168.0.130:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:0d270a0f1f942050a584a35abd42284fffc5d52d88d37af9382731743f40c393
```

### 验证 kube-proxy 模式

```bash
root@master:~# kubectl get configmap kube-proxy -n kube-system -o yaml | grep mode
打印    mode: ipvs
```


## 网络与存储设计

**网络方案**：

- **CNI插件选择**：Calico(策略丰富)、Cilium(eBPF高性能)或Flannel(简单场景)
- **多网段隔离**：建议分离K8s集群网络(如192.168.9.0/24)与存储网络(如192.168.10.0/24)
- **Ingress控制器**：推荐Ingress-Nginx(企业级)或Traefik(功能强大)

**存储方案**：

- **本地存储**：OpenEBS LocalPV适合高性能需求
- **共享存储**：Ceph或云厂商块存储(如AWS EBS、阿里云ESSD)
- **动态供给**：通过StorageClass定义多种存储类型

## C、Master部署网络策略插件

![](./basis.assets/true-image-20220827152630437.png)

参考：<https://kubernetes.io/zh/docs/concepts/cluster-administration/addons/>

下表总结了不同的 GitHub 指标，让你了解每个项目的受欢迎程度和活动。数据收集于 2026 年 5 月。

| 提供商  | 项目                                                         | Stars | Forks | Contributors贡献者 |
| ------- | ------------------------------------------------------------ | ----- | ----- | ------------------ |
| **Cilium**  | [cilium/cilium](https://github.com/cilium/cilium)            | 24.3k | 3.8k  | 1079                |
| **Calico**  | [projectcalico/calico](https://github.com/projectcalico/calico) | 7.2k  | 1.6k  | 412                |
| Flannel | [flannel-io/flannel](https://github.com/flannel-io/flannel)  | 9.4k  | 2.9k  | 249                |
| Weave   | [weaveworks/weave](https://github.com/weaveworks/weave/)     | 6.6k  | 660   | 82                 |
| Canal   | [projectcalico/canal](https://github.com/projectcalico/canal) | 723   | 97   | 20                 |


|提供商 | 网络模型  |  路线分发  |  网络策略 |   网格    |外部数据存储  |  加密    | Ingress/Egress策略|
| ------- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
|Cilium|封装 (VXLAN)|✓|✓|✓|Etcd 和 K8s API|✓|✓|
|Calico|封装（VXLAN，IPIP）或未封装|✓|✓|✓|Etcd 和 K8s API|✓|✓|
|Flannel |封装 (VXLAN)|✗|✗|✗|K8s API|✓|✗|
|Weave|封装|✓|✓|✓|✗|✓|✓|
|Canal  | 封装 (VXLAN)|✗|✓|✗|K8s API|✓|✓|


- **路由分发**：一种外部网关协议，用于在互联网上交换路由和可达性信息。BGP 可以帮助进行跨集群 pod 之间的网络。此功能对于未封装的 CNI 网络插件是必须的，并且通常由 BGP 完成。如果你想构建跨网段拆分的集群，路由分发是一个很好的功能。
- **网络策略**：Kubernetes 提供了强制执行规则的功能，这些规则决定了哪些 service 可以使用网络策略进行相互通信。这是从 Kubernetes 1.7 起稳定的功能，可以与某些网络插件一起使用。
- **网格**：允许在不同的 Kubernetes 集群间进行 service 之间的网络通信。
- **外部数据存储**：具有此功能的 CNI 网络插件需要一个外部数据存储来存储数据。
- **加密**：允许加密和安全的网络控制和数据平面。
- **Ingress/Egress** 策略：允许你管理 Kubernetes 和非 Kubernetes 通信的路由控制。


**Flannel** 的缺点之一是缺乏高级功能，例如配置网络策略和防火墙的能力，是一个很好的入门级选择；如需高级网络功能 **Cilium** 和 **Calico** 。


### 配置网络策略 Flannel

root用户：

```shell
wget https://github.com/flannel-io/flannel/releases/download/v0.28.4/kube-flannel.yml

kubectl apply -f kube-flannel.yml

kubectl delete -f kube-flannel.yml
```

获取pods所有名称空间

```shell
[root@master ~]# kubectl get pods --all-namespaces -o wide
NAMESPACE      NAME                             READY   STATUS    RESTARTS   AGE    IP                NODE     NOMINATED NODE   READINESS GATES
kube-flannel   kube-flannel-ds-2vkzl            1/1     Running   0          2m7s   192.168.0.130   master   <none>           <none>
kube-flannel   kube-flannel-ds-f5jkp            1/1     Running   0          2m7s   192.168.0.131   node1    <none>           <none>
kube-flannel   kube-flannel-ds-tlh6w            1/1     Running   0          2m7s   192.168.0.132   node2    <none>           <none>
kube-system    coredns-66f779496c-7qfs6         1/1     Running   0          42m    10.244.2.2      node1    <none>           <none>
kube-system    coredns-66f779496c-bhx66         1/1     Running   0          42m    10.244.2.3      node1    <none>           <none>
kube-system    etcd-master                      1/1     Running   0          42m    192.168.0.130   master   <none>           <none>
kube-system    kube-apiserver-master            1/1     Running   0          42m    192.168.0.130   master   <none>           <none>
kube-system    kube-controller-manager-master   1/1     Running   0          42m    192.168.0.130   master   <none>           <none>
kube-system    kube-proxy-2wq4b                 1/1     Running   0          35m    192.168.0.131   node1    <none>           <none>
kube-system    kube-proxy-69rng                 1/1     Running   0          42m    192.168.0.130   master   <none>           <none>
kube-system    kube-proxy-q4tj8                 1/1     Running   0          35m    192.168.0.132   node2    <none>           <none>
kube-system    kube-scheduler-master            1/1     Running   0          42m    192.168.0.130   master   <none>           <none>
```


### 配置网络策略 Calico

[官网快速入门部署](https://docs.tigera.io/calico/latest/getting-started/kubernetes/quickstart)

```bash
#自定义资源定义
wget https://raw.githubusercontent.com/projectcalico/calico/v3.32.0/manifests/v1_crd_projectcalico_org.yaml
#Tigera操作符：
wget https://raw.githubusercontent.com/projectcalico/calico/v3.32.0/manifests/tigera-operator.yaml
#创建必要的自定义资源来安装 Calico
wget https://raw.githubusercontent.com/projectcalico/calico/v3.32.0/manifests/custom-resources.yaml
```

修改：`custom-resources-bpf.yaml`

- **cidr** 与 **podSubnet** 网段一样: *10.244.0.0/16*
- **registry**：`docker.m.daocloud.io`，`registry.aliyuncs.com/google_containers/` `04eo9xup.mirror.aliyuncs.com`，`registry.docker-cn.com`，`hub-mirror.c.163.com`
- [配置参数清单]( https://docs.tigera.io/calico/latest/reference/installation/api#operator.tigera.io/v1.Installation)

```yaml :collapsed-lines=15
apiVersion: operator.tigera.io/v1
kind: Installation
metadata:
  name: default
spec:
  # Configures Calico networking.
  # registry: docker.m.daocloud.io
  calicoNetwork:
    ipPools:
      - name: default-ipv4-ippool
        blockSize: 26         # 26 (IPv4), 122 (IPv6)
        cidr: 10.244.0.0/16   # 与podSubnet网段一样
        encapsulation: VXLANCrossSubnet
        natOutgoing: Enabled
        nodeSelector: all()
```

**部署calico**：

```bash
kubectl create -f v1_crd_projectcalico_org.yaml
kubectl create -f tigera-operator.yaml
kubectl create -f custom-resources-bpf.yaml

这里只需要等待他们全部running即可：预计10分钟左右
kgpodsnw-calico | kubectl get pod -n kube-system -o wide

NAME                                       READY   STATUS     AGE     IP
calico-apiserver-5ff967c559-8vhz6          1/1     Running    10m     10.244.219.69
calico-apiserver-5ff967c559-wnfkj          1/1     Running    10m     10.244.219.67
calico-kube-controllers-669bd6b99c-kz98c   1/1     Running    10m     10.244.219.70
calico-node-tjmqq                          1/1     Running    10m     192.168.0.130
calico-typha-5f4ccb7764-bggrw              1/1     Running    10m     192.168.0.130
csi-node-driver-8xkh6                      2/2     Running    10m     10.244.219.65
goldmane-784dbb4c44-qzs7v                  1/1     Running    10m     10.244.219.68
whisker-d79945844-99lhz                    2/2     Running    12m     10.244.219.73
```

默认使用的镜像：*crictl images*

```bash
quay.io/calico/apiserver                        v3.32.0       c6246c3f0b5d8       50.9MB
quay.io/calico/cni                              v3.32.0       d456a937d6e74       69.5MB
quay.io/calico/csi                              v3.32.0       a665cad044872       11.5MB
quay.io/calico/goldmane                         v3.32.0       8b5156bd00aba       52.5MB
quay.io/calico/kube-controllers                 v3.32.0       e67ce8d034ec5       61MB
quay.io/calico/node-driver-registrar            v3.32.0       ec9c47a649284       16.5MB
quay.io/calico/node                             v3.32.0       6bc9fa4dc2b10       120MB
quay.io/calico/pod2daemon-flexvol               v3.32.0       2a07a5ef4d7ba       7.56MB
quay.io/calico/typha                            v3.32.0       a4433ba6d0851       41.1MB
quay.io/calico/whisker-backend                  v3.32.0       5f531f3cb4757       25.1MB
quay.io/calico/whisker                          v3.32.0       b4638c5ba691c       9.05MB
quay.io/tigera/operator                         v1.42.0       2d636341e3971       45.6MB
```

### 监控 Calico Whisker 的网络流量

Whisker 网页控制台会自动部署，但默认情况下无法从集群外部访问。要查看网页控制台，你需要允许访问：

- 设置端口转发： 这允许你从浏览器访问 Whisker 网页控制台.
- 打开胡须网页控制台： 实时查看网络流量日志。

```bash
kubectl port-forward -n calico-system service/whisker 8081:8081
```

打开浏览器，访问 <http://master:8081/>


## D、将从node节点加入主Master集群中

su root 在每个根节点上运行以下操作：

[查看 kubeadm init](#master-kubeadm初始化)

```shell
[root@node-121 ~]# kubeadm join 192.168.0.130:6443 --token abcdef.0123456789abcdef \
        --discovery-token-ca-cert-hash sha256:0d270a0f1f942050a584a35abd42284fffc5d52d88d37af9382731743f40c393

[preflight] 进行飞行前检查
[preflight] 从集群中读取配置...
[preflight] 仅供参考：您可以查看此配置文件'kubectl -n kube-system get cm kubeadm-config -o yaml'
[kubelet-start] 将 kubelet 配置写入文件 "/var/lib/kubelet/config.yaml"
[kubelet-start] 将带有标志的 kubelet 环境文件写入文件 "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] 启动 kubelet
[kubelet-start] 等待 kubelet 执行 TLS Bootstrap...

此节点已加入集群：
* 证书签名请求已发送到 apiserver 并收到响应。
* Kubelet  被告知新的安全连接细节。

master Run 'kubectl get nodes' 在控制平面上查看该节点加入集群。
```

### 重启后出现localhost:8080-was-refused

`The connection to the server localhost:8080 was refused - did you specify the right host or port?` 请看↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓

### Node节点运行kubectl命令

将主节点（master）中的“/etc/kubernetes/admin.conf”文件拷贝到从节点（node）相同目录下

```shell
scp /etc/kubernetes/admin.conf root@node1:/etc/kubernetes/admin.conf && \
scp /etc/kubernetes/admin.conf root@node2:/etc/kubernetes/admin.conf
```

解决 *did you specify the right host or port?*

```bash
echo "export KUBECONFIG=/etc/kubernetes/admin.conf" >> ~/.bashrc
source ~/.bashrc
```

### 解决端口占用：kubeadm reset

### token过期，重新设置

> kubeadm token list
>
> kubeadm token create --print-join-command
>
> kubeadm token create --ttl 0 --print-join-command


## E、部署路由负载均衡

- [Ingress](./ingress.md) **于2026.3已退休，使用Gateway API代替**
- [Gateway API](./gateway-api.md)

## F、可视化管理工具

### 1、dashboard（不推荐）

文档：<https://kuboard.cn/install/install-k8s-dashboard.html>

<https://github.com/kubernetes/dashboard/releases/tag/v2.4.0>

`kubectl apply -f https://gitee.com/k8s_s/dashboard1/blob/v2.4.0/aio/deploy/recommended.yaml -o yaml > dashboard.yaml`

### 2、KubeSphere（推荐1）

- [跳转-本站文档](./kubesphere.md)
- [Github KubeSphere](https://github.com/kubesphere/kubesphere)，star: 14.1+K

### 3、Rancher（推荐2）

- [跳转-本站文档](./rancher.md)
- [Github Rancher](https://github.com/rancher/rancher)，star: 22.4+K

### 4、Kuboard（推荐3）

- [跳转-本站文档](./kuboard.md)
- [Github Kuboard](https://github.com/eip-work/kuboard-press) stars 20.7+K

### 5、KubeOperator

- [跳转-本站文档](./kubeoperator.md)
- [Github KubeOperator](https://github.com/eip-work/kuboard-press) stars 4.9+K


## Kubernetes 日常巡检脚本

[脚本参考](https://www.cnblogs.com/leojazz/p/18675721)

k8s_inspection.sh

```bash　:collapsed-lines=15
#!/bin/bash
 
# Kubernetes 日常巡检脚本
# 需要预先配置好 kubectl 并确保脚本运行的环境具有访问集群的权限
 
# 设置日志文件
LOG_DIR="/var/log/k8s_inspection"
LOG_FILE="$LOG_DIR/inspection_$(date +%F).log"
mkdir -p "$LOG_DIR"
 
# 函数：记录日志
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}
 
# 函数：检查节点状态
check_nodes() {
    log "开始检查节点状态..."
    NODE_STATUS=$(kubectl get nodes --no-headers | awk '{print $2}' | sort | uniq)
    if [[ "$NODE_STATUS" != *"Ready"* ]]; then
        log "警告：存在非 Ready 状态的节点！当前节点状态：$NODE_STATUS"
    else
        log "所有节点状态正常。"
    fi
}
 
# 函数：检查所有 Pod 状态
check_pods() {
    log "开始检查 Pod 状态..."
    NON_RUNNING_PODS=$(kubectl get pods --all-namespaces --field-selector=status.phase!=Running,status.phase!=Succeeded,status.phase!=Failed -o json | jq '.items[] | {namespace: .metadata.namespace, name: .metadata.name, status: .status.phase}')
 
    if [[ -n "$NON_RUNNING_PODS" ]]; then
        log "警告：存在非 Running、Succeeded 或 Failed 状态的 Pod："
        echo "$NON_RUNNING_PODS" | tee -a "$LOG_FILE"
    else
        log "所有 Pod 状态正常。"
    fi
}
 
# 函数：检查资源使用情况
check_resources() {
    log "开始检查节点资源使用情况（CPU 和内存）..."
    kubectl top nodes --no-headers | awk '{print $1, $2, $3}' | while read -r NODE_NAME CPU_USAGE MEMORY_USAGE; do
        # 检查 CPU 和内存使用值是否有效数字
        if [[ ! "$CPU_USAGE" =~ ^[0-9]+$ ]] || [[ ! "$MEMORY_USAGE" =~ ^[0-9]+(Mi|Gi|%)$ ]]; then
            log "节点 $NODE_NAME ：CPU=$CPU_USAGE，内存=$MEMORY_USAGE"
            continue
        fi
 
        # 直接保留内存百分比，而不进行转换
        if [[ "$MEMORY_USAGE" =~ ^[0-9]+%$ ]]; then
            log "警告：节点 $NODE_NAME 的内存使用率是百分比：${MEMORY_USAGE}"
        else
            # 移除单位并转换内存单位（如果需要）
            MEMORY_USAGE_NUM=$(echo "$MEMORY_USAGE" | sed 's/Mi//;s/Gi/*1024/' | bc)
        fi
 
        # 移除单位并转换 CPU 使用率
        CPU_USAGE_NUM=$(echo "$CPU_USAGE" | sed 's/m//')
 
        # 设置阈值（毫核和 Mi）
        CPU_LIMIT=8000   # 8000m = 8核
        MEMORY_LIMIT=16000 # 16000Mi = 16Gi
 
        # 检查 CPU 使用率
        if [ "$CPU_USAGE_NUM" -gt "$CPU_LIMIT" ]; then
            log "警告：节点 $NODE_NAME 的 CPU 使用率超过阈值：${CPU_USAGE}"
        fi
 
        # 检查内存使用率
        if [[ "$MEMORY_USAGE" != *% && "$MEMORY_USAGE_NUM" -gt "$MEMORY_LIMIT" ]]; then
            log "警告：节点 $NODE_NAME 的内存使用率超过阈值：${MEMORY_USAGE}"
        fi
    done
}
 
# 函数：检查事件
check_events() {
    log "开始检查最近 24 小时的集群事件..."
    # 获取24小时前的时间戳
    SINCE_TIME=$(date -u -d "24 hours ago" +"%Y-%m-%dT%H:%M:%SZ")
    
    # 检查 kubectl 是否支持 --since-time
    if kubectl get events --help | grep -- "--since-time" &>/dev/null; then
        RECENT_EVENTS=$(kubectl get events --all-namespaces --since-time="$SINCE_TIME" --sort-by='.lastTimestamp')
    else
        # 如果不支持 --since-time，获取所有事件并在脚本中筛选
        RECENT_EVENTS=$(kubectl get events --all-namespaces -o json | jq --arg SINCE_TIME "$SINCE_TIME" '
            .items[] | select(.lastTimestamp >= $SINCE_TIME) | 
            {namespace: .metadata.namespace, name: .metadata.name, lastTimestamp: .lastTimestamp, type: .type, reason: .reason, message: .message}')
    fi
 
    # 判断是否有事件
    if [[ -n "$RECENT_EVENTS" && "$RECENT_EVENTS" != "[]" ]]; then
        log "最近 24 小时内的集群事件："
        echo "$RECENT_EVENTS" | tee -a "$LOG_FILE"
    else
        log "过去 24 小时内没有新的集群事件。"
    fi
}
 
# 函数：检查命名空间状态
check_namespaces() {
    log "开始检查命名空间状态..."
    NON_ACTIVE_NS=$(kubectl get namespaces --no-headers | awk '$2!="Active" {print $1 " - " $2}')
    if [[ -n "$NON_ACTIVE_NS" ]]; then
        log "警告：存在非 Active 状态的命名空间："
        echo "$NON_ACTIVE_NS" | tee -a "$LOG_FILE"
    else
        log "所有命名空间状态正常。"
    fi
}
 
# 函数：汇总巡检
run_inspection() {
    log "==================== 开始 Kubernetes 集群日常巡检 ===================="
    check_nodes
    check_pods
    check_resources
    check_namespaces
    check_events
    log "==================== Kubernetes 集群日常巡检完成 ===================="
}
 
# 执行巡检
run_inspection
 
# 可选：发送邮件或通知（需要配置邮件服务器或通知服务）
# 例如，使用 mail 命令发送日志
# mail -s "K8s 日常巡检报告 - $(date +%F)" admin@example.com < "$LOG_FILE"
 
exit 0
```
