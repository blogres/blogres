---
icon: linux
title: 启动Java项目脚本
category: 
- Linux
headerDepth: 5
date: 2022-06-11
tag:
- Shell
---

<!-- more -->

**前提**：本例中是基于 java->jar与lib 依赖分离，且处于同级目录；如果不是，可以自己修改配置文件（`nohup java -jar xxx.jar`）

[maven打包配置jar与lib依赖分离](https://blog.csdn.net/qq_42476834/article/details/112507565)

## 使用示例

**语法**：`sh start.sh [options] [jar-version] [ADD_PORT]`

*options*：

- start：启动服务
- stop：停止服务
- restart：重启服务
- status：查看服务状态
- debug：开启远程debug控制

*jar-version*：Java项目jar包名称，无需输入`.jar`后缀

*ADD_PORT*：options 为 debug 调试模式时用，默认监听端口为 *51135*，可自定义


启动程序：`sh start.sh start test-1.x.x`

debug启动：`sh start.sh debug test-1.x.x` |
 `sh start.sh debug test-1.x.x 51235`

重启程序：`sh start.sh restart test-1.x.x`

查看运行状态：`sh start.sh status test-1.x.x`

关闭程序：`sh start.sh stop test-1.x.x`

获取使用教程：`sh start.sh -h`

```shell
[root@demo demos]# ls
start.sh lib test-1.0.jar

[root@demo demos]# sh start.sh start test-1.0
Service test-1.0.jar is starting！pid=17827
.................Start success.................

[root@demo demos]# sh start.sh status test-1.0
Service test-1.0.jar is running. It's pid=17827

[root@demo demos]# sh start.sh restart test-1.0
.................Restarting.................
Service test-1.0.jar is starting！pid=19134
.................Start success.................
.................Restart success.................

[root@demo demos]# sh start.sh stop test-1.0
Service stop success！pid:19134 which has been killed forcibly!
```

start.sh脚本

```shell
#!/bin/sh

# 定义变量
JAR_NAME="$2.jar"
# debug监听端口
ADD_PORT="$3"
# help获取使用方法
help() {
  echo ""
  echo "please use command: sh start.sh [start|stop|restart|status|debug] [jar-version] [ADD_PORT]"
  echo "For example: sh start.sh start 1.0.1"
  echo "debug For example: sh start.sh debug demo1.0 | sh start.sh debug demo1.0 6156"
  echo ""
  exit 1
}
# 该方法会重新启动程序
debug() {
  # 查看pid,先杀掉，再运行jar
  pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
  # 设置默认监听端口
  if [ -z $ADD_PORT ]; then
    ADD_PORT="51135"
    echo "......default Listen on port for DEBUG:${ADD_PORT}"
  fi
  # -z 表示为空
  if [ ! -z $pid ]; then
    kill -9 $pid
    echo ""
    echo "......kill -9 ${pid}....."
    nohup java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=$ADD_PORT -Dloader.path=lib/ -jar $JAR_NAME >debugOut.log 2>&1 &
    pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
    echo ""
    echo "debug Service ${JAR_NAME} is starting！newPid:${pid}, Listen on port:${ADD_PORT}"
    echo "......debug restart: success......"
    echo ""
  else 
    nohup java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=$ADD_PORT -Dloader.path=lib/ -jar $JAR_NAME >debugOut.log 2>&1 &
    pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
    echo ""
    echo "debug Service ${JAR_NAME} is starting！pid:${pid}, address:${ADD_PORT}"
    echo "......debug Start： success......"
    echo ""
  fi
}
# 启动方法
start() {
  # 重新获取一下pid
  pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
  # -z 表示为空
  if [ -z $pid ]; then
    nohup java -Dloader.path=lib/ -jar $JAR_NAME >out.log 2>&1 &
    pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
    echo ""
    echo "Service ${JAR_NAME} is starting！pid:${pid}"
    echo ".........Start success........"
  else
    echo ""
    echo "Service ${JAR_NAME} is already running,it's pid:${pid}. If necessary."
    echo "please use command:[sh start.sh stop [version] | sh start.sh restart [version]]."
    echo ""
  fi
}

# 停止方法
stop() {
  # 重新获取一下pid
  pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
  # -z 表示为空
  if [ -z $pid ]; then
    echo ""
    echo "Service ${JAR_NAME} is not running!"
    echo ""
  else
    kill -9 $pid
    echo ""
    echo "Service stop success！pid:${pid}"
    echo ""
  fi
}

# 输出运行状态方法
status() {
  # 重新获取一下pid
  pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
  # -z 表示为空
  if [ -z $pid ]; then
    echo ""
    echo "Service ${JAR_NAME} is not running!"
    echo ""
  else
    echo ""
    echo "Service ${JAR_NAME} is running. It's pid=${pid}"
    echo ""
  fi
}

# 重启方法
restart() {
  echo ".................Restarting................."
  pid=$(ps -ef | grep $JAR_NAME | grep -v grep | awk '{print $2}')
  # -z 表示为空
  if [ ! -z $pid ]; then
    kill -9 $pid
  fi
  start
  echo ""
}

# 根据输入参数执行对应方法
case "$1" in
"start")
  start
  ;;
"stop")
  stop
  ;;
"status")
  status
  ;;
"restart")
  restart
  ;;
"-h")
  help
  ;;
"debug")
  debug
  ;;
esac

```

