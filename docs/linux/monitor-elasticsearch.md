---
icon: linux
title: 监控ElasticSearch进程异常的脚本
category: 
- Linux
headerDepth: 5
date: 2023-04-25
tag:
- Linux
- ElasticSearch
---

写了个监控 ElasticSearch 进程异常的脚本！

<!-- more -->

[以下文章来自公众号：杰哥的IT之旅 ，作者JackTian](https://mp.weixin.qq.com/s/BQknL20q4P6K2zJJuYi9xg)


## 服务器配置免密钥环境准备

### 配置hosts映射

配置免密钥前，需要在服务器的 hosts 文件中配置目标主机名称与 IP 对应关系。

`vim /etc/hosts`

```shell
IP1 hostname1
IP2 hostname2
......
```

将 *mianmiyaojiaoben.zip* 安装包解压在当前目录下

```shell
cd /usr/local/jiaoben
unzip mianmiyaojiaoben.zip
```

修改 *mianmiyao_config* 配置文件，添加目标主机名称与目标主机密码，通过用免密钥的脚本来调用。

`vim mianmiyao_config`

```
AllHosts=hostname1,hostname2
Passwd='test23!\@Test^&*','test23!\@Test^&*'
```

配置文件中，需注意：

- **AllHosts**：可配置当前主机通往目标主机的主机名，可以免秘钥自身，数量不限。多台目标主机需以英文逗号隔开

- **Passwd**：主机所对应的密码，顺序需要与主机顺序对应

- 如果原密码为：test23!@Test^&*，则密码字符带有特殊符号可以用 \ 符转义

### mianmiyao.sh 脚本文件内容

`vim mianmiyao.sh`

```shell
#!/bin/bash -x
source mianmiyao_config
yum -y install expect expect-devel
#rm -rf /root/.ssh/*
/usr/bin/expect -d <<-EOF
set timeout 100
spawn ssh-keygen -t rsa
expect {
"*id_rsa):" { send "\r"; exp_continue }
"*(y/n)?" { send "y\r"; exp_continue }
"*passphrase)*" { send "\r"; exp_continue }
"*again:" { send "\r"; exp_continue }
"*-------+" { send "\r"}
}
expect eof
EOF

hostsarr=(${hosts//,/ })
passwdarr=(${passwd//,/ })
num=${#hostsarr[@]}  
for((i=0;i<num;i++));  
do  
    /usr/bin/expect <<-EOF
    set timeout 100
    spawn ssh-copy-id ${hostsarr[i]}
    expect {
    "*(yes/no)?" { send "yes\r"; exp_continue }
    "*password:" { send "${passwdarr[i]}\r"; exp_continue }
    "*authorized_keys*" { send "\r"}
    }
    expect eof
    exit
EOF
done 
```

将 `mianmiyao.sh` 文件添加执行权限并执行此脚本

```shell
chmod +x mianmiyao.sh
./mianmiyao.sh
```

脚本执行完毕后，可以先手动执行如下命令，如无需输入密码跳转到对应的目标服务器时，则表示成功。

```shell
ssh hostname2
```

## 服务器部署监测 ElasticSearch 环境准备

将 cpufreedisk_config 配置文件添加对应 ES 集群主机名、ES 端口、ES 主节点服务器主机名。

`vim cpufreedisk_config`

```shell
# 所有 ES 集群的主机名，用英文逗号分隔，需要在免密钥机器上执行
EsHosts=hostname1,hostname2

# ES 端口
EsPort=9200

# ES 主节点服务器的主机名
EsMaster=hostname1
```

将 *cpufreedisk.sh* 脚本文件放入 `ElasticSearch` 服务器的 */usr/local/jiaoben/* 目录下

```shell
#!/bin/bash
# @Time    : 2023/02/01
# @Author  : JackTian
# @File    : cpufreedisk.sh
# @Desc    : 使用该脚本监控 ES 系统程序假死、挂掉、异常及服务器断网、宕机服务器恢复后，程序做判断恢复/检测服务器cpu内存磁盘。
# 使用前提：ES 集群服务器配置免密钥
# 使用方法：将 cpufreedisk.sh 脚本放置 ES 服务器的 /usr/local/jiaoben/ 目录下、在 cpufreedisk_config 中配置 ES 集群的主机名、端口、ES 主节点服务器的主机名
# 设置定时任务（可以事先手动执行）
# 0 6 * * * source /etc/profile && cd /usr/local/jiaoben && ./cpufreedisk.sh
source /usr/local/jiaoben/cpufreedisk_config

function esStatus
{
curl --connect-timeout 30 -m 60 $1:$esport > resultEsCurl.log
echo "`cat resultEsCurl.log | grep cluster_name`"
}

function esLost
{
iptemp=`cat /etc/hosts | grep -w $1 | grep '^[^#]' | awk '{print $1}'`
curl --connect-timeout 30 -m 60 $esMaster:$esport/_cat/nodes?v | grep $iptemp > resultEsCurl1.log
echo "`cat resultEsCurl1.log`"
}

function esDie
{
ssh $1 "source /etc/profile && jps | grep Elasticsearch | awk '{print \$1}' | xargs"
}

function restart
{
ssh $1 <<EOF
echo "请手动启动 ES 进程"
exit
EOF
}


today=$(date +"%Y-%m-%d")
todaytime=`date`
#针对 ES 做假死、宕机、挂掉，做日志记录和处理
serverroothostname=(${esHosts//,/ })
for rootHost in ${serverroothostname[*]}
do
    esStatusResult=`esStatus $rootHost`
    echo "$rootHost 的状态为: $esStatusResult"
    if [ -n "$esStatusResult" ];then
        esLostResult=`esLost $rootHost`
        echo "$rootHost 的状态为: $esLostResult"
        if [ -n "$esLostResult" ];then
            echo "ES 运行状态正常。"
        else
            echo "$rootHost 脱离集群。"
            echo "${todaytime}ES的${rootHost}节点脱离集群。请人工排查" >> /usr/local/jiaoben/ESmanager.log
                        restart $rootHost
        fi
    else
        echo "${todaytime}xxx系统$rootHost 的 ES 进程运行状态异常，启动重启中..." >> /usr/local/jiaoben/ESmanager.log
        echo "${todaytime}xxx系统$rootHost 重启" >> /usr/local/jiaoben/ESmanager.log

ssh $rootHost <<EOF >>/usr/local/jiaoben/ESmanager.log
        mkdir -p /usr/local/jiaoben/
        cd /usr/local/jiaoben/
        echo "--------------------------------------服务器分割线-------------------------------------------"
        echo "$rootHost磁盘信息"
        df -h
        echo "$rootHost内存信息（单位为：G）"
        free -h
        echo "$rootHost的CPU信息"
        vmstat
        exit
EOF
        if [ $? -eq 0 ];then
                        esDieResult=`esDie $rootHost`
                        if [ -n "$esDieResult" ];then
                        echo "${todaytime}xxx系统 ES 出现假死，已执行重启临时解决，详情参看日志" >> /usr/local/jiaoben/ESmanager.log
                        else
            echo "${todaytime}xxx系统 ES 未启动，已执行重启临时解决，详情参看日志" >> /usr/local/jiaoben/ESmanager.log
                        fi
        else
            echo "${todaytime}xxx系统 ES 服务器疑似宕机：无法 ssh 登录" >> /usr/local/jiaoben/ESmanager.log
        fi
        restart $rootHost
    fi

done

```

将 `cpufreedisk.sh` 脚本文件添加可执行权限并执行

```shell
chmod +x cpufreedisk.sh
./cpufreedisk.sh
```

设定周期性定时任务，每天定时执行。

> 使用该脚本监控 ES 系统程序假死、挂掉、异常及服务器断网、宕机服务器恢复后，程序做判断恢复/检测服务器cpu内存磁盘。

```shell
crontab -e
0 6 * * * source /etc/profile && cd /usr/local/jiaoben && ./cpufreedisk.sh
```


