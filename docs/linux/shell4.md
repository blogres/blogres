---
icon: linux
title: Shell脚本编程-实用脚本
category: 
- Linux
headerDepth: 5
date: 2022-09-12
star: true
tag:
- Linux
- Shell
---

会写好的脚本不仅能提高工作效率，还能有更多的时间做自己的事。最近在网上冲浪的时候，也注意收集一些大佬写过的脚本，汇总整理一下，欢迎收藏，与君共勉！

<!-- more -->

部分内容来自：[CSDN ，作者：鮀城小帅](https://blog.csdn.net/weixin_42405670/article/details/89818462)

# 实用脚本

## 归档

```shell
cat Files_To_Backup
/home/Christine/Project
/home/Christine/Downloads
/home/Does_not_exist
/home/Christine/Documents


useradd Christine



mkdir -p /archive/hourly



cp Files_To_Backup /archive/
cp Files_To_Backup /archive/hourly/


groupadd Archivers

chgrp Archivers /archive


usermod -aG Archivers Christine


chmod 775 /archive


ls -l /archive


mkdir -p /home/Christine/{Project,Downloads,Documents}

mkdir /home/Does_not_exist

```

### 创建按日归档的脚本

Daily_Archive.sh 脚本内容如下

```shell
#!/bin/bash
#
# Daily_Archive - 归档指定文件和目录
########################################################
# 收集当前日期
DATE=$(date +%Y%m%d)
# 设置存档文件名
FILE=archive-$DATE.tar.gz
# 设置配置和目标文件
CONFIG_FILE=/archive/Files_To_Backup
DESTINATION=/archive/$FILE
######### Main Script #########################
# 检查备份配置文件是否存在
if [ -f $CONFIG_FILE ]; then # 确保配置文件仍然存在
  # 如果它存在，什么也不做，继续。
  echo
else # 如果不存在，则发出错误并退出脚本。
  echo
  echo "$CONFIG_FILE 不存在."
  echo "由于缺少配置文件，备份未完成"
  echo
  exit
fi
# 建立所有要备份的文件的名称
FILE_NO=1              # 从配置文件的第 1 行开始。
exec <$CONFIG_FILE     # 将标准输入重定向到配置文件的名称
read FILE_NAME         # 读取第一条记录
while [ $? -eq 0 ]; do # 创建要备份的文件列表
  # 确保文件或目录存在
  if [ -f $FILE_NAME -o -d $FILE_NAME ]; then
    # 如果文件存在，则将其名称添加到列表中。
    FILE_LIST="$FILE_LIST $FILE_NAME"
  else
    # 如果文件不存在，发出警告
    echo
    echo "$FILE_NAME, 不存在."
    echo "显然，我不会将其包含在此存档中."
    echo "它在网上列出 $FILE_NO 配置文件的."
    echo "继续建立存档列表..."
    echo
  fi
  FILE_NO=$(($FILE_NO + 1)) # 将 LineFile 编号加一。
  read FILE_NAME            # 阅读下一条记录
done
#######################################
# 备份文件并压缩存档
echo "开始存档..."
echo
tar -czf $DESTINATION $FILE_LIST 2>/dev/null
echo "存档完成"
echo "生成的存档文件是: $DESTINATION"
echo
exit

```

```shell
[root@admin ~]# sh Daily_Archive.sh

开始存档...

存档完成
生成的存档文件是: /archive/archive-20220922.tar.gz

```

### 创建按小时归档的脚本

Hourly_Archive.sh 脚本

```shell
#!/bin/bash
# 设置配置文件
CONFIG_FILE=/archive/hourly/Files_To_Backup
# 设置基本存档目标位置
BASEDEST=/archive/hourly
# 收集当前日期、月份和时间
YERS=$(date +%Y)
MONTH=$(date +%m)
DAY=$(date +%d)
TIME=$(date +%k%M)
# 创建存档目标目录
mkdir -p $BASEDEST/$YERS/$MONTH/$DAY
# 构建存档目标文件名
DESTINATION=$BASEDEST/$YERS/$MONTH/$DAY/archive-$TIME.tar.gz
########## Main Script ####################
# 检查备份配置文件是否存在
if [ -f $CONFIG_FILE ]; then # 确保配置文件仍然存在
  # 如果它存在，什么也不做，继续。
  echo
else # 如果不存在，则发出错误并退出脚本。
  echo
  echo "$CONFIG_FILE 不存在."
  echo "由于缺少配置文件，备份未完成"
  echo
  exit
fi
# 建立所有要备份的文件的名称
FILE_NO=1              # 从配置文件的第 1 行开始。
exec <$CONFIG_FILE     # 将标准输入重定向到配置文件的名称
read FILE_NAME         # 读取第一条记录
while [ $? -eq 0 ]; do # 创建要备份的文件列表
  # 确保文件或目录存在
  if [ -f $FILE_NAME -o -d $FILE_NAME ]; then
    # 如果文件存在，则将其名称添加到列表中。
    FILE_LIST="$FILE_LIST $FILE_NAME"
  else
    # 如果文件不存在，发出警告
    echo
    echo "$FILE_NAME, 不存在."
    echo "显然，我不会将其包含在此存档中."
    echo "它在网上列出 $FILE_NO 配置文件的."
    echo "继续建立存档列表..."
    echo
  fi
  FILE_NO=$(($FILE_NO + 1)) # 将 LineFile 编号加一。
  read FILE_NAME            # 阅读下一条记录
done
#######################################
# 备份文件并压缩存档
echo "开始存档..."
echo
tar -czf $DESTINATION $FILE_LIST 2>/dev/null
echo "存档完成"
echo "生成的存档文件是: $DESTINATION"
echo
exit

```

```shell
[root@admin ~]# sh Hourly_Archive.sh

开始存档...

存档完成
生成的存档文件是: /archive/hourly/2022/09/22/archive-1825.tar.gz

```

## 管理用户账户

### 需要的功能

删除账户在管理账户工作中比较复杂。在删除账户时，至少需要4个步骤：

- (1) 获得正确的待删除用户账户名；
- (2) 杀死正在系统上运行的属于该账户的进程；
- (3) 确认系统中属于该账户的所有文件；
- (4) 删除该用户账户。

### 创建脚本

完整的 delete-user.sh 脚本

```shell
#!/bin/bash
#Delete_User - 自动执行删除帐户的 4 个步骤
###############################################################
# 定义函数
#####################################################
function get_answer {
  unset ANSWER
  ASK_COUNT=0
  while [ -z "$ANSWER" ]; do #虽然没有给出答案，但请继续询问。
    ASK_COUNT=$(($ASK_COUNT + 1))
    case $ASK_COUNT in #如果用户在分配的时间内没有给出答案
    2)
      echo
      echo "请回答问题"
      echo
      ;;
    3)
      echo
      echo "最后一次尝试...请回答问题"
      echo
      ;;
    4)
      echo
      echo "既然你拒绝回答这个问题..."
      echo "退出程序."
      echo
      exit
      ;;
    esac
    echo
    if [ -n "$LINE2" ]; then #打印 2 行
      echo $LINE1
      echo -e $LINE2" \c"
    else #打印 1 行
      echo -e $LINE1" \c"
    fi
    # 在超时前允许 60 秒回答
    read -t 60 ANSWER
  done
  # 做一些变量清理
  unset LINE1
  unset LINE2
}

#####################################################
function process_answer {
  case $ANSWER in
  y | Y | YES | yes | Yes | yEs | yeS | YEs | yES)
    # 如果用户回答“是”，则什么也不做。
    ;;
  *)
    # 如果用户回答“是”以外的任何内容，则退出脚本
    echo
    echo $EXIT_LINE1
    echo $EXIT_LINE2
    echo
    exit
    ;;
  esac
  # 做一些变量清理
  unset EXIT_LINE1
  unset EXIT_LINE2
}

##############################################
############# Main Script ####################
# 获取要检查的用户帐户名称
echo "第 1 步 - 确定要删除的用户帐户名称"
echo
LINE1="请输入用户的用户名 "
LINE2="您希望从系统中删除的帐户:"
get_answer
USER_ACCOUNT=$ANSWER
# 与脚本用户仔细检查这是正确的用户帐户
LINE1=" $USER_ACCOUNT 是用户帐户 "
LINE2="你想从系统中删除? [y/n]"
get_answer
# 调用过程应答函数：如果用户回答“是”以外的任何内容，则退出脚本
EXIT_LINE1="因为 $USER_ACCOUNT 不是账户 "
EXIT_LINE2="您要删除的，我们将离开脚本..."
 
################################################################
# 检查 USER_ACCOUNT 是否真的是系统上的帐户
USER_ACCOUNT_RECORD=$(cat /etc/passwd | grep -w $USER_ACCOUNT)
if [ $? -eq 1 ]; then # 如果没有找到账号，退出脚本
  echo
  echo "账户, $USER_ACCOUNT, 未找到. "
  echo "Leaving the script..."
  echo
  exit
fi
echo
echo "我找到了这个记录:"
echo $USER_ACCOUNT_RECORD
LINE1="这是正确的用户帐户吗? [y/n]"
get_answer
# 调用 process_answer 函数：如果用户回答“是”以外的任何内容，则退出脚本
EXIT_LINE1="因为帐户 , $USER_ACCOU      NT, 未找到. "
EXIT_LINE2="您要删除的，我们将离开脚本..."
process_answer
##################################################################
##################################################################
##################################################################
# 搜索属于用户帐户的任何正在运行的进程
echo
echo "第 2 步 - 在属于用户帐户的系统上查找进程"
echo
ps -u $USER_ACCOUNT >/dev/null #用户进程是否正在运行?
case $? in
1)
  # 没有为此用户帐户运行的进程
  echo "此帐户当前没有正在运行的进程"
  echo
  ;;
0)
  # 为此用户帐户运行的进程。询问脚本用户是否希望我们终止进程。
  echo "$USER_ACCOUNT 有以下进程正在运行: "
  echo
  ps -u $USER_ACCOUNT
  LINE1="你想让我杀死进程吗? [y/n]"
  get_answer
  case $ANSWER in
  y | Y | YES | yes | Yes | yEs | yeS | YEs | yES) # 如果用户回答“是”，
    # 杀死用户帐户进程
    echo
    echo "杀死进程..."
    # 列出在变量 COMMAND_1 中运行代码的用户进程
    COMMAND_1="ps -u $USER_ACCOUNT --no-heading"
    # 创建命令以在变量 COMMAND 3 中终止进程
    COMMAND_3="xargs -d \\n /usr/bin/sudo /bin/kill -9"
    # 通过管道命令一起杀死进程
    $COMMAND_1 | gawk '{print $1}' | $COMMAND_3
    echo
    echo "Process(es) killed."
    ;;
  *) # 如果用户回答“是”以外的任何内容，请不要杀死。
    echo
    echo "不会杀死进程"
    echo
    ;;
  esac
  ;;
esac
#################################################################
#################################################################
#################################################################
# 创建用户帐户拥有的所有文件的报告
echo
echo "第 3 步 - 在系统上查找属于用户帐户的文件"
echo
echo "创建所有文件的报告 $USER_ACCOUNT."
echo
echo "建议您备份存档这些文件,"
echo "然后做两件事之一:"
echo " 1) 删除文件"
echo " 2) 将文件的所有权更改为当前用户帐户."
echo
echo "请稍等。可能还要等一下..."
REPORT_DATE=$(date +%y%m%d)
REPORT_FILE=$USER_ACCOUNT"_Files_"$REPORT_DATE".rpt"
find / -user $USER_ACCOUNT >$REPORT_FILE 2>/dev/null
echo
echo "报告完成."
echo "报告名称: $REPORT_FILE"
echo "报告地点: $(pwd)"
echo
#################################################################
#################################################################
#################################################################
# 删除用户帐户
echo
echo "第 4 步 - 删除用户帐户"
echo
LINE1="删除 $USER_ACCOUNT's 系统账户? [y/n]"
get_answer
# 调用 process_answer 函数：如果用户回答“是”以外的任何内容，则退出脚本
EXIT_LINE1="由于您不希望删除用户帐户,"
EXIT_LINE2="$USER_ACCOUNT 此时，退出脚本..."
process_answer
userdel $USER_ACCOUNT #删除用户帐户
echo
echo "用户帐号, $USER_ACCOUNT,已被删除"
echo
exit

```

### 运行脚本

```shell
[root@admin ~]# sh delete-user.sh
第 1 步 - 确定要删除的用户帐户名称


请输入用户的用户名
您希望从系统中删除的帐户: user2

user2 是用户帐户
你想从系统中删除? [y/n] y

我找到了这个记录:
user2:x:1005:1005::/home/user2:/bin/bash

这是正确的用户帐户吗? [y/n] y

第 2 步 - 在属于用户帐户的系统上查找进程

此帐户当前没有正在运行的进程


第 3 步 - 在系统上查找属于用户帐户的文件

创建所有文件的报告 user2.

建议您备份存档这些文件,
然后做两件事之一:
 1) 删除文件
 2) 将文件的所有权更改为当前用户帐户.

请稍等。可能还要等一下...

报告完成.
报告名称: user2_Files_220922.rpt
报告地点: /root


第 4 步 - 删除用户帐户


删除 user2's 系统账户? [y/n] y

用户帐号, user2,已被删除

[root@admin ~]# cat user2_Files_220922.rpt
/home/user2
/home/user2/.bash_logout
/home/user2/.bash_profile
/home/user2/.bashrc
/home/user2/.mozilla
/home/user2/.mozilla/extensions
/home/user2/.mozilla/plugins
/home/user2/.bash_history
/var/spool/mail/user2
```

## 用户猜数字

- 脚本生成一个 100 以内的随机数,提示用户猜数字,根据用户的输入,提示用户猜对了,猜小了或猜大了,直至用户猜对脚本结束。
- RANDOM 为系统自带的系统变量,值为 0‐32767的随机数
- 使用取余算法将随机数变为 1‐100 的随机数

```shell
#!/bin/bash

num=$[RANDOM%100+1]
echo "$num"

# 使用 read 提示用户猜数字
# 使用 if 判断用户猜数字的大小关系:‐eq(等于),‐ne(不等于),‐gt(大于),‐ge(大于等于),
# ‐lt(小于),‐le(小于等于)
while :
do 
 read -p "计算机生成了一个 1‐100 的随机数,你猜: " cai  
    if [ $cai -eq $num ]   
    then     
        echo "恭喜,猜对了"     
        exit  
     elif [ $cai -gt $num ]  
     then       
            echo "Oops,猜大了"    
       else      
            echo "Oops,猜小了" 
  fi
done
```

## 查看有多少远程的 IP 在连接本机

查看有多少远程的 IP 在连接本机(不管是通过 ssh 还是 web 还是 ftp 都统计)

- netstat ‐atn 可以查看本机所有连接的状态,
- ‐a 查看所有
- -t 仅显示 tcp 连接的信息,
- ‐n 数字格式显示
- Local Address(第四列是本机的 IP 和端口信息)
- Foreign Address(第五列是远程主机的 IP 和端口信息)
- 使用 awk 命令仅显示第 5 列数据,再显示第 1 列 IP 地址的信息
- sort 可以按数字大小排序,最后使用 uniq 将多余重复的删除,并统计重复的次数

```shell
#!/bin/bash

netstat -atn  |  awk  '{print $5}'  | awk  '{print $1}' | sort -nr  |  uniq -c
```

## helloworld

```shell
#!/bin/bash

function example {
 echo "Hello world!"
}
example
```

## 打印 tomcat 的pid

```shell
#!/bin/sh

v1="Hello"
v2="world"
v3=${v1}${v2}
echo $v3

pidlist=`ps -ef|grep apache-tomcat-7.0.75|grep -v "grep"|awk '{print $2}'`
echo $pidlist
echo "tomcat Id list :$pidlist"  //显示pid
```

## 脚本编写 剪刀 、 石头、布游戏

```shell
#!/bin/bash

game=(石头 剪刀 布)
num=$[RANDOM%3]
computer=${game[$sum]}

echo "请根据下列提示选择您的出拳手势"
echo " 1. 石头"
echo " 2. 剪刀"
echo " 3. 布 "

read -p "请选择 1-3 ：" person
case $person in
1)
  if [ $num -eq 0 ]
  then 
    echo "平局"
    elif [ $num -eq 1 ]
    then
      echo "你赢"
    else 
      echo "计算机赢"
fi;;
2)
 if [ $num -eq 0 ]
 then
    echo "计算机赢"
    elif [ $num -eq 1 ] 
    then
     echo "平局"
    else 
      echo "你赢"
fi;;
3)
 if [ $num -eq 0 ]
 then  
   echo "你赢"
   elif [ $num -eq 1 ]
   then 
     echo "计算机赢"
   else 
      echo "平局"
fi;;
*)
  echo "必须输入1-3 的数字"
esac
```

## 九九乘法表

```shell
#!/bin/bash

for i in `seq 9`
do 
 for j in `seq $i`
 do 
 echo -n "$j*$i=$[i*j] "
 done
    echo
done
```

## 脚本用源码来安装 memcached 服务器

注意: 如果软件的下载链接过期了,请更新 memcached 的下载链接

```shell
#!/bin/bash

wget http://www.memcached.org/files/memcached-1.5.1.tar.gz
yum -y install gcc
tar -xf  memcached‐1.5.1.tar.gz
cd memcached‐1.5.1
./configure
make
make install
```

## 检测本机当前用户是否为超级管理员

检测本机当前用户是否为超级管理员,如果是管理员,则使用 yum 安装 vsftpd,如果不是,则提示您非管理员(使用字串对比版本)

```shell
#!/bin/bash
 
if [ $USER == "root" ] 
then 
 yum -y install vsftpd
else 
 echo "您不是管理员，没有权限安装软件"
fi
```

## if 运算表达式

```shell
#!/bin/bash -xv

if [ $1 -eq 2 ] ;then
 echo "wo ai wenmin"
elif [ $1 -eq 3 ] ;then 
 echo "wo ai wenxing "
elif [ $1 -eq 4 ] ;then 
 echo "wo de xin "
elif [ $1 -eq 5 ] ;then
 echo "wo de ai "
fi
```

## 脚本 杀掉 tomcat 进程并重新启动

```shell
#!/bin/bash

#kill tomcat pid

pidlist=`ps -ef|grep apache-tomcat-7.0.75|grep -v "grep"|awk '{print $2}'`  #找到tomcat的PID号

echo "tomcat Id list :$pidlist"  //显示pid

kill -9 $pidlist  #杀掉改进程

echo "KILL $pidlist:" //提示进程以及被杀掉

echo "service stop success"

echo "start tomcat"

cd /opt/apache-tomcat-7.0.75

pwd 

rm -rf work/*

cd bin

./startup.sh #;tail -f ../logs/catalina.out
```

## 打印国际象棋棋盘

- 打印国际象棋棋盘

- 设置两个变量,i 和 j,一个代表行,一个代表列,国际象棋为 8*8 棋盘

- i=1 是代表准备打印第一行棋盘,第 1 行棋盘有灰色和蓝色间隔输出,总共为 8 列

- i=1,j=1 代表第 1 行的第 1 列;i=2,j=3 代表第 2 行的第 3 列

- 棋盘的规律是 i+j 如果是偶数,就打印蓝色色块,如果是奇数就打印灰色色块

- 使用 echo ‐ne 打印色块,并且打印完成色块后不自动换行,在同一行继续输出其他色块

```shell
#!/bin/bash

for i in {1..8}
do
   for j in {1..8}
   do
    sum=$[i+j]
  if [  $[sum%2] -eq 0 ];then
    echo -ne "\033[46m  \033[0m"
  else
   echo -ne "\033[47m  \033[0m"
  fi
   done
   echo
done
```

## 统计当前 Linux 系统中可以登录计算机的账户有多少个

```shell
#!/bin/bash

#方法 1:
grep "bash$" /etc/passwd | wc -l

#方法 2：
awk -f : '/bash$/{x++}end{print x}' /etc/passwd
```

## 备份 MySQL 表数据

```shell
#!/bin/sh

source /etc/profile
dbName=mysql
tableName=db
echo [`date +'%Y-%m-%d %H:%M:%S'`]' start loading data...'

mysql -uroot -proot -P3306 ${dbName} -e "LOAD DATA LOCAL INFILE '# /home/wenmin/wenxing.txt' INTO TABLE ${tableName} FIELDS TERMINATED BY ';'"
echo [`date +'%Y-%m-%d %H:%M:%S'`]' end loading data...'
exit
EOF
```

## 使用死循环实时显示 eth0 网卡发送的数据包流量

```shell
#!/bin/bash

while :
do 
 echo '本地网卡 ens33 流量信息如下：'
 ifconfig ens33 | grep "RX pack" | awk '{print $5}'
     ifconfig ens33 | grep "TX pack" | awk '{print $5}'
 sleep 1
done
```

## 编写脚本测试 192.168.4.0/24 整个网段中哪些主机处于开机状态，哪些主机处于关机

```shell
#!/bin/bash

# 状态(for 版本)
for i in {1..254}
do 
 # 每隔0.3秒ping一次，一共ping2次，并以1毫秒为单位设置ping的超时时间
 ping -c 2 -i 0.3 -W 1 192.168.1.$i &>/dev/null
     if [ $? -eq 0 ];then
 echo "192.168.1.$i is up"
 else 
 echo "192.168.1.$i is down"
 fi
done
```

## 提示用户输入用户名和密码,脚本自动创建相应的账户及配置密码。如果用户

不输入账户名,则提示必须输入账户名并退出脚本;如果用户不输入密码,则统一使用默认的 123456 作为默认密码。

```shell
#!/bin/bash

read -p "请输入用户名：" user

#使用‐z 可以判断一个变量是否为空,如果为空,提示用户必须输入账户名,并退出脚本,退出码为 2
#没有输入用户名脚本退出后,使用$?查看的返回码为 2

if [ -z $user ]; then
 echo " 您不需要输入账户名" 
 exit 2
fi

#使用 stty ‐echo 关闭 shell 的回显功能
#使用 stty  echo 打开 shell 的回显功能
stty -echo 
read -p "请输入密码：" pass
stty echo 
pass=${pass:-123456}
useradd "$user"
echo "$pass" | passwd --stdin "$user"
```

## 使用脚本对输入的三个整数进行排序

- 不管谁大谁小,最后都打印 echo "$num1,$num2,$num3"
- num1 中永远存最小的值,num2 中永远存中间值,num3 永远存最大值
- 如果输入的不是这样的顺序,则改变数的存储顺序,如:可以将 num1 和 num2 的值对调
tmp=0
- 如果 num1 大于 num2,就把 num1 和和 num2 的值对调,确保 num1 变量中存的是最小值

```shell
#!/bin/bash

# 依次提示用户输入 3 个整数,脚本根据数字大小依次排序输出 3 个数字
read -p " 请输入一个整数：" num1
read -p " 请输入一个整数：" num2
read -p " 请输入一个整数:  " num3

if [ $num1 -gt $num2 ];then
 tmp=$num1
 num1=$num2
 num2=tmp
fi

# 如果 num1 大于 num3,就把 num1 和 num3 对调,确保 num1 变量中存的是最小值
if [ $num1 -gt $num3 ];then
 tmp=$num1
 num1=$num3
 num3=$tmp
fi

# 如果 num2 大于 num3,就把 num2 和 num3 对调,确保 num2 变量中存的是最小值
if [ $num2 -gt $num3 ];then
 tmp=$num2
 num2=$num3
 num3=$tmp
fi

echo "排序后数据（从小到大）为：$num1,$num2,$num3"
```

## 根据计算机当前时间，返回问候语，可以将该脚本设置为开机启动

`00‐12` 点为早晨,`12‐18` 点为下午,`18‐24` 点为晚上

```shell
#!/bin/bash

# 使用 date 命令获取时间后,if 判断时间的区间,确定问候语内容
tm=$(date +%H)
if [ $tm -le 12 ];then
 msg="Good Morning $USER"
elif [ $tm -gt 12 -a $tm -le 18 ];then
   msg="Good Afternoon $USER"
else
   msg="Good Night $USER"
fi
echo "当前时间是:$(date +"%Y‐%m‐%d %H:%M:%S")"
echo -e "\033[34m$msg\033[0m"
```


## 将 I lov cls 写入到 txt 文件中

```shell
#!/bin/bash

cd /home/wenmin/
touch wenxing.txt
echo "I lov cls" >>wenxing.txt
```

## 脚本编写 for 循环判断

```shell
#!/bin/bash

s=0;
for((i=1;i<100;i++))
do 
 s=$[$s+$i]
done 

echo $s

r=0;
a=0;
b=0;
for((x=1;x<9;x++))
do 
 a=$[$a+$x] 
echo $x
done

for((y=1;y<9;y++))
do 
 b=$[$b+$y]
echo $y

done

echo $r=$[$a+$b]
```

```shell
#!/bin/bash

for i in "$*"
do 
 echo "wenmin xihuan $i"
done

for j in "$@"
do 
 echo "wenmin xihuan $j"
done
```

## 每周 5 使用 tar 命令备份/var/log 下的所有日志文件

`vim  /root/logbak.sh`

- 编写备份脚本,备份后的文件名包含日期标签,防止后面的备份将前面的备份数据覆盖
- 注意 date 命令需要使用反引号括起来

```shell
#!/bin/bash

tar -czf log-`date +%Y%m%d`.tar.gz /var/log 

# crontab -e #编写计划任务，执行备份脚本
00 03 * * 5 /home/wenmin/datas/logbak.sh
```

## 脚本编写 求和 函数运算 function xx()

```shell
#!/bin/bash

function sum()
{
 s=0;
 s=$[$1+$2]
 echo $s
}
read -p "input your parameter " p1
read -p "input your parameter " p2

sum $p1 $p2

function multi()
{
 r=0;
 r=$[$1/$2]
 echo $r
}
read -p "input your parameter " x1
read -p "input your parameter " x2

multi $x1 $x2

v1=1
v2=2
let v3=$v1+$v2
echo $v3
```

## 脚本编写 case — esac 分支结构表达式

```shell
#!/bin/bash 

case $1 in 
1) 
 echo "wenmin "
;;
2)
 echo "wenxing "
;; 
3)  
 echo "wemchang "
;;
4) 
 echo "yijun"
;;
5)
 echo "sinian"
;;
6)  
 echo "sikeng"
;;
7) 
 echo "yanna"
;;
*)
 echo "danlian"
;; 
esac
```

## 定义要监控的页面地址，对 tomcat 状态进行重启或维护

```shell
#!/bin/sh

# 获取tomcat PPID  
TomcatID=$(ps -ef |grep tomcat |grep -w 'apache-tomcat-7.0.75'|grep -v 'grep'|awk '{print $2}')  

# tomcat_startup  
StartTomcat=/opt/apache-tomcat-7.0.75/bin/startup.sh  


#TomcatCache=/usr/apache-tomcat-5.5.23/work  

# 定义要监控的页面地址  
WebUrl=http://192.168.254.118:8080/

# 日志输出  
GetPageInfo=/dev/null  
TomcatMonitorLog=/tmp/TomcatMonitor.log  

Monitor()  
  {  
   echo "[info]开始监控tomcat...[$(date +'%F %H:%M:%S')]"  
   if [ $TomcatID ]
 then  
      echo "[info]tomcat进程ID为:$TomcatID."  
      # 获取返回状态码  
      TomcatServiceCode=$(curl -s -o $GetPageInfo -m 10 --connect-timeout 10 $WebUrl -w %{http_code})  
      if [ $TomcatServiceCode -eq 200 ];then  
          echo "[info]返回码为$TomcatServiceCode,tomcat启动成功,页面正常."  
      else  
          echo "[error]访问出错，状态码为$TomcatServiceCode,错误日志已输出到$GetPageInfo"  
          echo "[error]开始重启tomcat"  
          kill -9 $TomcatID  # 杀掉原tomcat进程  
          sleep 3  
          #rm -rf $TomcatCache # 清理tomcat缓存  
          $StartTomcat  
      fi  
      else  
      echo "[error]进程不存在!tomcat自动重启..."  
      echo "[info]$StartTomcat,请稍候......"  
      #rm -rf $TomcatCache  
      $StartTomcat  
    fi  
    echo "------------------------------"  
   }  
   Monitor>>$TomcatMonitorLog
```

## 通过位置变量创建 Linux 系统账户及密码

`$1` 是执行脚本的第一个参数，`$2` 是执行脚本的第二个参数

```shell
#!/bin/bash

useradd "$1"
echo "$2" | passwd --stdin "$1"
```

## 对变量的传入与获取个数及打印

```shell
#!/bin/bash
echo "$0 $1 $2 $3"  // 传入三个参数
echo $#    //获取传入参数的数量
echo $@    //打印获取传入参数
echo $*    //打印获取传入参数
```

## 实时监控本机内存和硬盘剩余空间，剩余内存小于500M、根分区剩余空间小于1000M时，发送报警邮件给root管理员


```shell
#!/bin/bash

# 提取根分区剩余空间
disk_size=$(df / | awk '/\//{print $4}')

# 提取内存剩余空空间
mem_size=$(free | awk '/Mem/{print $4}')
while :
do 
# 注意内存和磁盘提取的空间大小都是以 Kb 为单位
if  [  $disk_size -le 512000 -a $mem_size -le 1024000  ]
then
    mail  ‐s  "Warning"  root  <<EOF
 Insufficient resources,资源不足
EOF
fi
done
```

## 检查指定目录下是否存在 对应 文件

```shell
#!/bin/bash

if [ -f /home/wenmin/datas ]
then 
  echo "File exists"
fi
```

## 脚本定义while循环语句

```shell
#!/bin/bash

if [ -f /home/wenmin/datas ]
then 
  echo "File exists"
fi
```

while.sh

```shell
#!/bin/bash

s=0
i=1
while [ $i -le 100 ]
do
    s=$[$s + $i]
    i=$[$i + 1]
done

echo $s
echo $i
```

## 一键部署 LNMP（RPM 包版本）

- 使用 yum 安装部署 LNMP,需要提前配置好 yum 源,否则该脚本会失败

- 本脚本使用于 centos7.2 或 RHEL7.2

```shell
#!/bin/bash 

yum -y install httpd
yum -y install mariadb mariadb-devel mariadb-server
yum -y install php php-mysql

systemctl start httpd mariadb
systemctl enable httpd mariadb
```

## 读取控制台传入参数

```shell
#!/bin/bash
read -t 7 -p "input your name " NAME
echo $NAME

read -t 11 -p "input you age " AGE
echo $AGE

read -t 15 -p "input your friend " FRIEND
echo $FRIEND

read -t 16 -p "input your love " LOVE
echo $LOVE
```

## 脚本实现 复制

```shell
#!/bin/bash

cp $1 $2
```

## 脚本实现文件存在与否的判断

```shell
#!/bin/bash

if [ -f file.txt ];then
 echo "文件存在"
else 
 echo "文件不存在"
fi
```

## 监测磁盘空间

### 需要的功能

你要用到的第一个工具是 du 命令。该命令能够显示出单个文件和目录的磁盘使用情况。 -s 选项用来总结目录一级的整体使用状况。这在计算单个用户使用的总体磁盘空间时很方便。下面的例子是使用 du 命令总结/home目录下每个用户的$HOME目录的磁盘占用情况。

```shell
[root@admin ~]# du -s /home/*
12      /home/barbara
12      /home/christine
108     /home/shell
942476  /home/soft
12      /home/tim
16      /home/user1
16      /home/user2

[root@admin ~]# du -s /var/log/*
6308    /var/log/anaconda
988     /var/log/ansible.log
12980   /var/log/audit
0       /var/log/boot.log
12      /var/log/boot.log-20220914
12      /var/log/boot.log-20220915
[....]

[root@admin ~]# du -S /var/log/*
6308    /var/log/anaconda
988     /var/log/ansible.log
12980   /var/log/audit

```

-S （大写的S）选项能更适合我们的目的，它为每个目录和子目录分别提供了总计信息。这样你就能快速地定位问题的根源。

```shell
#!/bin/bash
# Big_Users - 在各种目录中查找大磁盘空间用户
###############################################################
CHECK_DIRECTORIES=" /var/log /home" #要检查的目录
############## Main Script #################################
DATE=$(date '+%Y%m%d')          #报告文件的日期
exec >disk_space_$DATE.rpt      #制作报告文件 STDOUT
echo "十大磁盘空间使用率" #报告标题
echo "来自 $CHECK_DIRECTORIES 目录"
for DIR_CHECK in $CHECK_DIRECTORIES; do
  echo ""
  echo "The $DIR_CHECK 目录:"
  # 在此目录中创建前十名磁盘空间用户的列表
  du -S $DIR_CHECK 2>/dev/null |
    sort -rn |
    sed '{11,$D; =}' |
    sed 'N; s/\n/ /' |
    gawk '{printf $1 ":" "\t" $2 "\t" $3 "\n"}'
done
exit

```

```shell
[root@admin ~]# chmod +x disk-info.sh
[root@admin ~]# sh disk-info.sh
[root@admin ~]# cat disk_space_20220922.rpt
十大磁盘空间使用率
来自  /var/log /home 目录

The /var/log 目录:
1:      13196   /var/log/audit
2:      6308    /var/log/anaconda
3:      6212    /var/log
4:      2232    /var/log/sa
5:      100     /var/log/tuned
6:      24      /var/log/tomcat
7:      8       /var/log/pki
8:      0       /var/log/sssd
9:      0       /var/log/samba/old
10:     0       /var/log/samba

The /home 目录:
1:      942476  /home/soft
2:      108     /home/shell
3:      16      /home/user2
4:      16      /home/user1
5:      12      /home/tim
6:      12      /home/christine
7:      12      /home/barbara
8:      0       /home/user2/.mozilla/plugins
9:      0       /home/user2/.mozilla/extensions
10:     0       /home/user2/.mozilla
```

## MySQL 数据库

### 向mysql服务器发送命令

有两种实现方法：

- 发送单个命令并退出；
- 发送多个命令。

要发送单个命令，你必须将命令作为 mysql 命令行的一部分。对于 mysql 命令，可以用 -e 选项。

```shell
 cat mtest1
#!/bin/bas
MYSQL=$(which mysql)
$MYSQL mytest -u test -e 'select * from employees'

$ ./mtest1
+-------+----------+------------+---------+
| empid | lastname | firstname | salary |
+-------+----------+------------+---------+
| 1 | Blum | Rich | 25000 |
| 2 | Blum | Barbara | 45000 |
| 3 | Blum | Katie Jane | 34500 |
| 4 | Blum | Jessica | 52340 |
+-------+----------+------------+---------+

cat mtest2
#!/bin/bash
MYSQL=$(which mysql)
$MYSQL mytest -u test <<EOF
show tables;
select * from employees where salary > 40000;
EOF

$ ./mtest2
Tables_in_test
employees

empid lastname firstname salary
2 Blum Barbara 45000
4 Blum Jessica 52340
```

```shell
cat mtest3
#!/bin/bash
MYSQL=$(which mysql)
if [ $# -ne 4 ]
then
    echo "Usage: mtest3 empid lastname firstname salary"
else
    statement="INSERT INTO employees VALUES ($1, '$2', '$3', $4)"
    $MYSQL mytest -u test << EOF
    $statement
EOF
    if [ $? -eq 0 ]
    then
        echo Data successfully added
    else
        echo Problem adding data
    fi
fi

$ ./mtest3
Usage: mtest3 empid lastname firstname salary

$ ./mtest3 5 Blum Jasper 100000
Data added successfully

$ ./mtest3 5 Blum Jasper 100000
ERROR 1062 (23000) at line 1: Duplicate entry '5' for key 1
Problem adding data
```

### 格式化数据

```shell
 cat mtest4
#!/bin/bash
MYSQL=$(which mysql)
dbs=$($MYSQL mytest -u test -Bse 'show databases')
for db in $dbs
do
    echo $db
done

$ ./mtest4
information_schema
test
```

`-B` 选项指定mysql程序工作在批处理模式运行， `-s` （ silent ）选项用于禁止输出列标题和格式化符号

可以用 -X 命令行选项来输出

```shell
mysql mytest -u test -X -e 'select * from employees where empid = 1'
<?xml version="1.0"?>

<resultset statement="select * from employees">
<row>
    <field name="empid">1</field>
    <field name="lastname">Blum</field>
    <field name="firstname">Rich</field>
    <field name="salary">25000</field>
</row>
</resultset>
```
