---
icon: linux
title: Shell脚本编程-基础篇
category: 
- Linux
headerDepth: 5
date: 2022-09-12
star: true
tag:
- Linux
- Shell
---

将带你直接进入shell脚本基础实操，脚本的语法、函数和变量等等

<!-- more -->

# shell 脚本编程基础

## 构建基本脚本

```shell
#!/bin//bash
# 构建基本脚本

name=demo
testing='date'

echo 666666
echo "Let's see who's logged"
echo 'Rich says "scripting is easy".'
echo 使用系统变量：$HOME + $LANG
echo 使用用户变量：$name + $testing
testing=$(date)
echo 更改用户变量：$testing
echo 重定向输出 > demo.log
echo 重定向输出追加 >> demo.log

cat <<EOF >>./demo2.log
重定向输入追加1
重定向输入追加2
重定向输入追加3
EOF
```

### expr 命令操作符

```
ARG1 | ARG2  如果 ARG1 既不是null也不是零值，返回 ARG1 ；否则返回 ARG2
ARG1 & ARG2  如果没有参数是null或零值，返回 ARG1 ；否则返回 0
ARG1 < ARG2  如果 ARG1 小于 ARG2 ，返回 1 ；否则返回 0
ARG1 <= ARG2 如果 ARG1 小于或等于 ARG2 ，返回 1 ；否则返回 0
ARG1 = ARG2  如果 ARG1 等于 ARG2 ，返回 1 ；否则返回 0
ARG1 != ARG2 如果 ARG1 不等于 ARG2 ，返回 1 ；否则返回 0
ARG1 >= ARG2 如果 ARG1 大于或等于 ARG2 ，返回 1 ；否则返回 0
ARG1 > ARG2  如果 ARG1 大于 ARG2 ，返回 1 ；否则返回 0
ARG1 + ARG2  返回 ARG1 和 ARG2 的算术运算和
ARG1 - ARG2  返回 ARG1 和 ARG2 的算术运算差
ARG1 * ARG2  返回 ARG1 和 ARG2 的算术乘积
ARG1 / ARG2  返回 ARG1 被 ARG2 除的算术商
ARG1 % ARG2  返回 ARG1 被 ARG2 除的算术余数
STRING : REGEXP  如果 REGEXP 匹配到了 STRING 中的某个模式，返回该模式匹配
match STRING REGEXP  如果 REGEXP 匹配到了 STRING 中的某个模式，返回该模式匹配
substr STRING POS LENGTH 返回起始位置为 POS （从 1 开始计数）、长度为 LENGTH 个字符的子字符串
index STRING CHARS  返回在 STRING 中找到 CHARS 字符串的位置；否则，返回 0
length STRING  返回字符串 STRING 的数值长度
+ TOKEN   将 TOKEN 解释成字符串，即使是个关键字
(EXPRESSION) 返回 EXPRESSION 的值
```

```shell
#!/bin//bash

echo 使用expr：
expr 12 + 22
expr 12 \* 22
expr 66 / 1
var1=10
var2=20
var3=$(expr $var2 / $var1)
echo The result is $var3
```

### 使用方括号

可以用美元符和方括号（ $[ operation ] ）将数学表达式围起来；

用方括号执行shell数学运算比用 expr 命令方便很多。

```shell
#!/bin//bash

echo 使用方括号：
var3=$[1 + 5]
echo $var3
var4=$[$var3 * 2]
echo $var4
var5=$[$var4 * 2 + ( 12 + 2 ) ]
echo $var5
```

### 浮点解决方案

格式：variable=$(echo "options; expression" | bc)

```shell
#!/bin//bash

echo 浮点解决方案:
var6=$(echo "scale=4; 3.44 / 5" | bc)
echo The answer is $var6
var7=100
var8=45
var9=$(echo "scale=4; $var7 / $var8" | bc)
echo The answer for this is $var9
v1=10.46
v2=43.67
v3=33.2
v4=71
v5=$(bc << EOF
scale = 4
a1 = ( $v1 * $v2)
b1 = ($v3 * $v4)
a1 + b1
EOF
)
echo The final answer for this mess is $v5
```

### 退出脚本

```shell
exit status

查看退出状态码
echo $?
```

Linux退出状态码

```
0  命令成功结束
1  一般性未知错误
2  不适合的shell命令
126  命令不可执行
127  没找到命令
128  无效的退出参数
128+x 与Linux信号x相关的严重错误
130  通过Ctrl+C终止的命令
255  正常范围之外的退出状态码
```

可以改变这种默认行为，返回自己的退出状态码。 exit 命令允许你在脚本结束时指定一个退出状态码。

```shell
#!/bin//bash

exit 5
```

## 使用结构化命令

### 使用 if-then语句和else

格式

```shell
if  command
then
  commands
fi

if  command; then
  commands
else
  commands
fi
```



```shell
#!/bin/bash

if pwd
then
  echo "It worked"
fi

if IamNotaCommand; then
  echo "It worked"
  echo "It worked2"  
fi
echo "We are outside the if statement"

testuser=user1
if grep $testuser /etc/passwd; then
  echo "This is my first command"
fi

if pwd; then
  echo okokokok
else
  echo nononono
fi
```

### 嵌套 if 语句

```shell
if  command1; then
  commands
elif  command2; then
  more  commands
elif  command3; then
  more  commands
  [....]
fi
```

```shell
#!/bin/bash

if pwd; then
  if ls -d /home/user1/; then
   echo okokokok
  fi   
else
 echo nononono
fi

if pwd; then
 echo ok-5555
elif ls -d /home/user1/; then
 echo ok-6666
elif ls -d /home/user2/; then
 echo ok-8888 
fi
```

### test 命令

```shell
if test condition; then
   commands
fi
```

如果不写 test 命令的 condition 部分，它会以非零的退出状态码退出，并执行 else 语句块。

```shell
if test pwd; then
  echo "No expression returns a True"
else
  echo "No expression returns a False"
fi
```

bash shell提供了另一种条件测试方法，无需在 if-then 语句中声明 test 命令:

```shell
if [  condition ] ; then
  commands
fi
```

test 命令可以判断三类条件：**数值比较**、**字符串比较**、**文件比较**



### 数值比较

```shell
n1 -eq n2  检查 n1 是否与 n2 相等
n1 -ge n2  检查 n1 是否大于或等于 n2
n1 -gt n2  检查 n1 是否大于 n2
n1 -le n2  检查 n1 是否小于或等于 n2
n1 -lt n2  检查 n1 是否小于 n2
n1 -ne n2  检查 n1 是否不等于 n2
```

```shell
value1=13
value2=11
value3=11
if [ $value1 -gt $value2 ]; then
  echo "$value1 大于 $value2"
fi
if [ $value2 -eq $value3 ]; then
  echo "$value2 等于 $value3"
else
  echo "$value2 不等于 $value3"
fi
```

### 字符串比较

```shell
str1 = str2  检查 str1 是否和 str2 相同
str1 != str2 检查 str1 是否和 str2 不同
str1 < str2  检查 str1 是否比 str2 小
str1 > str2  检查 str1 是否比 str2 大
-n str1   检查 str1 的长度是否非0
-z str1   检查 str1 的长度是否为0
```

```shell
#!/bin/bash

username=root
if [ $USER = $username ]; then
  echo "Welcome $username"
fi
vs1=baseball
vs2=hockey
if [ $vs1 \> $vs2 ]; then
  echo "$vs1 > $vs2"
elif [ $vs1 \< $vs2 ]; then
  echo "$vs1 < $vs2"
else 
  echo   "$vs1 !< !> $vs2"
fi

vs3=gfstes
vs4=''
if [ -n $vs3 ]; then
  echo "The string '$vs3' is not empty"
else
  echo "The string '$vs3' is empty"
fi
if [ -z $vs4 ]; then
  echo "The string '$vs4' is empty"
else
  echo "The string '$vs4' is not empty"
fi
```

### 文件比较

```shell
-d file    检查 file 是否存在并是一个目录
-e file    检查 file 是否存在
-f file    检查 file 是否存在并是一个文件
-r file    检查 file 是否存在并可读
-s file    检查 file 是否存在并非空
-w file    检查 file 是否存在并可写
-x file    检查 file 是否存在并可执行
-O file    检查 file 是否存在并属当前用户所有
-G file    检查 file 是否存在并且默认组与当前用户相同
file1 -nt file2  检查 file1 是否比 file2 新
file1 -ot file2  检查 file1 是否比 file2 旧
```

```shell
#!/bin/bash

jump_directory=/home/shell
jump_directory2=/home/shell/demo.sh
#
if [ -d $jump_directory ]; then
  echo "The $jump_directory directory exists"
  cd $jump_directory
  ls
else
  echo "The $jump_directory directory does not exist"
fi
if [ -f $jump_directory2 ]; then
  echo "存在 $jump_directory2 文件"
  if [ -s $jump_directory2 ]; then 
    echo "$jump_directory2 不是空文件"
  fi
  if [ -w $jump_directory2 ]; then 
    echo "$jump_directory2 文件可写"
  fi
  if [ -x $jump_directory2 ]; then 
    echo "$jump_directory2 文件可执行"
  fi   
  if [ -x $jump_directory2 ]; then 
    echo "$jump_directory2 文件可执行"
  fi 
fi
```

---

### 复合条件测试

if-then 语句允许你使用布尔逻辑来组合测试。有两种布尔运算符可用：

- [ condition1 ] && [ condition2 ]
- [ condition1 ] || [ condition2 ]

```shell
#!/bin/bash

if [ -d $HOME ] && [ -w $HOME/testing ]; then
 echo "The file exists and you can write to it"
else
 echo "I cannot write to the file"
fi
```

---

### 使用双方括号和双括号

**双括号**命令允许你在比较过程中使用高级数学表达式。 test 命令只能在比较中使用简单的算术操作。双括号命令提供了更多的数学符号，这些符号对于用过其他编程语言的程序员而言并不陌生。

`(( expression ))`

expression 可以是任意的数学赋值或比较表达式。除了 test 命令使用的标准数学运算符

```tex
val++  后增
val--  后减
++val  先增
--val  先减
!   逻辑求反
~   位求反
**   幂运算
<<   左位移
>>   右位移
&   位布尔和
|   位布尔或
&&   逻辑和
||   逻辑或
```

**双方括号**命令提供了针对字符串比较的高级特性。双方括号命令的格式如下：

[[ expression ]]


**说明** 双方括号在bash shell中工作良好。不过要小心，不是所有的shell都支持双方括号


```shell
val12=10
#
if (( $val12 ** 2 > 90 ))
then
(( val13 = $val12 ** 2 ))
echo "The square of $val12 is $val13"
fi

if [[ $USER == r* ]]; then
  echo "Hello $USER"
else 
  echo "Sorry, I do not know you"
fi
```


### case 命令

在模式匹配中，可以定义一个正则表达式来匹配字符串值

```shell
case  variable in

pattern1 |  pattern2 )  

  commands1 ;;

pattern3 )  

 commands2 ;;

*)  default commands ;;

esac
```

```shell
case $1 in
  install)
     echo "安装ok" ;;
  -h)
    echo "sh $0 { *默认执行 | install | start | stop | disable | -h }" ;;
  *)
     echo “执行默认方法” ;;
esac
```

## 更多的结构化命令

### for循环

```shell
for var in list
do
  commands
done
```

```shell
#!/bin/bash

#读取列表中的值
for test in Alabama Alaska Arizona Arkansas California Colorado
do
 echo The next state is $test
done
echo "The last state we visited was $test"
test=Connecticut
echo "Wait, now we're visiting $test"

#读取列表中的复杂值
for test2 in I don't know if this'll work
do
 echo "word:$test2"
done

for test3 in Nevada "New Hampshire" "New Mexico" "New York"
do
 echo "Now going to $test3"
done

#从变量读取列表
list="Alabama Alaska Arizona Arkansas Colorado"
list=$list" Connecticut"
for state in $list
do
 echo "Have you ever visited $state?"
done

#从命令读取值
file="states"
for state in $(cat $file)
do
 echo "Visit beautiful $state"
done
$ cat states
Alabama
Alaska
Arizona
Arkansas
Colorado
Connecticut
Delaware
Florida
Georgia

#更改字段分隔符：空格、制表符、换行符
#IFS=$'\n'  将这个语句加入到脚本中，告诉bash shell在数据值中忽略空格和制表符
#IFS=$'\n':;" 这个赋值会将换行符、冒号、分号和双引号作为字段分隔符。如何使用 IFS 字符解析数据没有任何限制。
file="states"
IFS=$'\n'
for state in $(cat $file)
do
 echo "Visit beautiful $state"
done

#用通配符读取目录
for file in /home/demo/test/*
do
if [ -d "$file" ]; then
 echo "$file is a directory"
elif [ -f "$file" ]; then
 echo "$file is a file"
fi
done

for file in /home/demo/.b* /home/demo/badtest
do
if [ -d "$file" ]; then
 echo "$file is a directory"
elif [ -f "$file" ]; then
 echo "$file is a file"
else
 echo "$file doesn't exist"
fi
done

for (( b = 1; b <= 3; b++ ))
do
 echo " Inside loop: $b"
done
```

### while

```shell
while test command
do
  other commands
done
```

while 命令中定义的 test command 和 if-then 语句中的格式一模一样。

```shell
#!/bin/bash

var1=10
while [ $var1 -gt 0 ]
do
 echo $var1
 var1=$[ $var1 - 1 ]
done

#使用多个测试命令
#只有最后一个测试命令的退出状态码会被用来决定什么时候结束循环。
var2=10
while echo $var2 
 [ $var2 -ge 0 ]
do
 echo "This is inside the loop"
 var2=$[ $var2 - 1 ]
done
#【...】

This is inside the loop
1
This is inside the loop
0
This is inside the loop
-1
```

while 循环会在 var1 变量等于 0 时执行 echo 语句，然后将 var1 变量的值减一。接下来再次执行测试命令，用于下一次迭代。 echo 测试命令被执行并显示了 var 变量的值（现在小于 0 了）。直到shell执行 test 测试命令， whle 循环才会停止。

这说明在含有多个命令的 while 语句中，在每次迭代中所有的测试命令都会被执行，包括测试命令失败的最后一次迭代。要留心这种用法。另一处要留意的是该如何指定多个测试命令。

**注意**：每个测试命令都出现在单独的一行上。

### until

until 命令和 while 命令工作的方式完全相反。 until 命令要求你指定一个通常返回非零退出状态码的测试命令。只有测试命令的退出状态码不为 0 ，bash shell才会执行循环中列出的命令。一旦测试命令返回了退出状态码 0 ，循环就结束了。

```shell
until test commands
do
  other commands
done
```

```shell
var1=100
until [ $var1 -eq 0 ]
do
 echo $var1
 var1=$[ $var1 - 25 ]
done
$ ./test12
100
75
50
25

var2=100
until echo $var2 [ $var2 -eq 0 ]
do
 echo Inside the loop: $var2
 var2=$[ $var2 - 25 ]
done
$ ./test13
100
Inside the loop: 100
75
Inside the loop: 75
50
Inside the loop: 50
25
Inside the loop: 25
0

var1=3
until [ $var1 -eq 0 ]
do
    echo "Outer loop: $var1"
    var2=1
    while [ $var2 -lt 5 ]
    do
        var3=$(echo "scale=4; $var1 / $var2" | bc)
        echo " Inner loop: $var1 / $var2 = $var3"
        var2=$[ $var2 + 1 ]
    done
    var1=$[ $var1 - 1 ]
done
$ ./test16
Outer loop: 3
Inner loop: 3 / 1 = 3.0000
Inner loop: 3 / 2 = 1.5000
Inner loop: 3 / 3 = 1.0000
Inner loop: 3 / 4 = .7500
Outer loop: 2
Inner loop: 2 / 1 = 2.0000
Inner loop: 2 / 2 = 1.0000
Inner loop: 2 / 3 = .6666
Inner loop: 2 / 4 = .5000
Outer loop: 1
Inner loop: 1 / 1 = 1.0000
Inner loop: 1 / 2 = .5000
Inner loop: 1 / 3 = .3333
Inner loop: 1 / 4 = .2500
```

### 嵌套循环

```shell
var1=5
while [ $var1 -ge 0 ]
do
 echo "Outer loop: $var1"
 for (( var2 = 1; $var2 < 3; var2++ ))
 do
  var3=$[ $var1 * $var2 ]
  echo " Inner loop: $var1 * $var2 = $var3"
 done
 var1=$[ $var1 - 1 ]
done
$ ./test15
Outer loop: 5
Inner loop: 5 * 1 = 5
Inner loop: 5 * 2 = 10
Outer loop: 4
Inner loop: 4 * 1 = 4
Inner loop: 4 * 2 = 8
Outer loop: 3
Inner loop: 3 * 1 = 3
Inner loop: 3 * 2 = 6
Outer loop: 2
Inner loop: 2 * 1 = 2
Inner loop: 2 * 2 = 4
Outer loop: 1
Inner loop: 1 * 1 = 1
Inner loop: 1 * 2 = 2
Outer loop: 0
Inner loop: 0 * 1 = 0
Inner loop: 0 * 2 = 0
```

### 循环处理文件数据

通常必须遍历存储在文件中的数据。这要求结合已经讲过的两种技术：

- 使用嵌套循环
- 修改 IFS 环境变量

通过修改 IFS 环境变量，就能强制 for 命令将文件中的每行都当成单独的一个条目来处理，即便数据中有空格也是如此。一旦从文件中提取出了单独的行，可能需要再次利用循环来提取行中的数据。

典型的例子是处理/etc/passwd文件中的数据。这要求你逐行遍历/etc/passwd文件，并将 IFS变量的值改成冒号，这样就能分隔开每行中的各个数据段了。

```shell
#!/bin/bash

IFS.OLD=$IFS
IFS=$'\n'
for entry in $(cat /etc/passwd)
do
    echo "Values in $entry –"
    IFS=:
    for value in $entry
    do
     echo " $value"
    done
done
```

这个脚本使用了两个不同的 IFS 值来解析数据。第一个 IFS 值解析出/etc/passwd文件中的单独的行。内部 for 循环接着将 IFS 的值修改为冒号，允许你从/etc/passwd的行中解析出单独的值。

在运行这个脚本时，你会得到如下输出。

```
[root@admin shell]# sh demo2.sh
demo2.sh:行3: IFS.OLD=: 未找到命令
Values in root:x:0:0:root:/root:/bin/bash –
 root
 x
 0
 0
 root
 /root
 /bin/bash
Values in bin:x:1:1:bin:/bin:/sbin/nologin -
```

内部循环会解析出/etc/passwd每行中的各个值。这种方法在处理外部导入电子表格所采用的逗号分隔的数据时也很方便。

### 控制循环

- break  退出任意类型的循环，包括 `while` 和 `until` 循环
- - 跳出单个循环

```shell
  #!/bin/bash
  
  for var1 in 1 2 3 4 5 6 7
  do
  if [ $var1 -eq 5 ]; then
      break
  fi
  echo "Iteration number: $var1"
  done
  echo "The for loop is completed"
  ---
  [root@admin shell]# sh demo3.sh
  Iteration number: 1
  Iteration number: 2
  Iteration number: 3
  Iteration number: 4
  The for loop is completed
  ------------
  
  var2=1
  while [ $var2 -lt 8 ]
  do
  if [ $var2 -eq 5 ]
  then
      break
  fi
      echo "Iteration: $var2"
      var2=$[ $var2 + 1 ]
  done
  echo "The while loop is completed"
  ------------
  [root@admin shell]# sh demo3.sh
  Iteration: 1
  Iteration: 2
  Iteration: 3
  Iteration: 4
  The while loop is completed
  ------------
```

- 跳出内部循环

```shell
  for (( a = 1; a < 4; a++ ))
  do
      echo "Outer loop: $a"
      for (( b = 1; b < 100; b++ ))
      do
          if [ $b -eq 5 ]; then
              break
          fi
          echo " Inner loop: $b"
      done
  done
  ---
  Outer loop: 1
   Inner loop: 1
   Inner loop: 2
   Inner loop: 3
   Inner loop: 4
  Outer loop: 2
   Inner loop: 1
   Inner loop: 2
   Inner loop: 3
   Inner loop: 4
  Outer loop: 3
   Inner loop: 1
   Inner loop: 2
   Inner loop: 3
   Inner loop: 4
  ---
```

- 跳出外部循环 break n

  其中 n 指定了要跳出的循环层级。默认情况下， n 为 1 ，表明跳出的是当前的循环。如果你将n 设为 2 ， break 命令就会停止下一级的外部循环。

```shell
  for (( a = 1; a < 4; a++ ))
  do
      echo "Outer loop: $a"
      for (( b = 1; b < 100; b++ ))
      do
      if [ $b -gt 4 ]; then
          break 2
      fi
      echo " Inner loop: $b"
      done
  done
  ---
  Outer loop: 1
   Inner loop: 1
   Inner loop: 2
   Inner loop: 3
   Inner loop: 4
  ---
  
```

- continue

可以提前中止某次循环中的命令，但并不会完全终止整个循环。可以在循环内部设置shell不执行命令的条件。

```shell
for (( var1 = 1; var1 < 15; var1++ ))
do
    if [ $var1 -gt 5 ] && [ $var1 -lt 10 ]
    then
        continue
    fi
echo "Iteration number: $var1"
done
---
Iteration number: 1
Iteration number: 2
Iteration number: 3
Iteration number: 4
Iteration number: 5
Iteration number: 10
Iteration number: 11
Iteration number: 12
Iteration number: 13
Iteration number: 14
---
```

当 if-then 语句的条件被满足时（值大于5且小于10），shell会执行 continue 命令，跳过此次循环中剩余的命令，但整个循环还会继续。当 if-then 的条件不再被满足时，一切又回到正轨。

也可以在 while 和 until 循环中使用 continue 命令，但要特别小心。当shell执行 continue 命令时，它会跳过剩余的命令。如果你在其中某个条件里对测试条件变量进行增值，问题就会出。

```shell
var1=0
while echo "while iteration: $var1"
    [ $var1 -lt 15 ]
do
 sleep 3;
    if [ $var1 -gt 5 ] && [ $var1 -lt 10 ]; then
        continue
    fi
    echo " Inside iteration number: $var1"
    var1=$[ $var1 + 1 ]
done
---
while iteration: 0
 Inside iteration number: 0
while iteration: 1
 Inside iteration number: 1
while iteration: 2
 Inside iteration number: 2
while iteration: 3
 Inside iteration number: 3
while iteration: 4
 Inside iteration number: 4
while iteration: 5
 Inside iteration number: 5
while iteration: 6
while iteration: 6
while iteration: 6
while iteration: 6
------------
```

在 if-then 的条件成立之前，所有一切看起来都很正常，然后shell执行了 continue 命令。当shell执行 continue 命令时，它跳过了 while 循环中余下的命令。不幸的是，被跳过的部分正是 $var1 计数变量增值的地方，而这个变量又被用于 while 测试命令中。这意味着这个变量的值不会再变化了，从前面连续的输出显示中你也可以看出来。

和 break 命令一样， continue 命令也允许通过命令行参数指定要继续执行哪一级循环：

continue n

其中 n 定义了要继续的循环层级。

```shell
for (( a = 1; a <= 5; a++ ))
do
    echo "Iteration $a:"
    for (( b = 1; b < 3; b++ ))
    do
        if [ $a -gt 2 ] && [ $a -lt 4 ]; then
            continue 2
        fi
        var3=$[ $a * $b ]
        echo " The result of $a * $b = $var3"
    done
done
---
Iteration 1:
 The result of 1 * 1 = 1
 The result of 1 * 2 = 2
Iteration 2:
 The result of 2 * 1 = 2
 The result of 2 * 2 = 4
Iteration 3:
Iteration 4:
 The result of 4 * 1 = 4
 The result of 4 * 2 = 8
Iteration 5:
 The result of 5 * 1 = 5
 The result of 5 * 2 = 10
---
```

此处用 continue 命令来停止处理循环内的命令，但会继续处理外部循环。注意，值为 3 的那次迭代并没有处理任何内部循环语句，因为尽管 continue 命令停止了处理过程，但外部循环依然会继续。

### 重定向循环的输出

```shell
for file in /home/shell/*
do
    if [ -d "$file" ]; then
        echo "$file is a directory"
    else
        echo "$file is a file"
    fi
done > output.txt

for (( a = 1; a < 10; a++ ))
do
    echo "The number is $a"
done >> output.txt
---
/home/shell/demo6.sh is a file
/home/shell/demo7.sh is a file
/home/shell/demo.sh is a file
/home/shell/output.txt is a file
The number is 1
The number is 2
The number is 3
The number is 4
The number is 5
The number is 6
The number is 7
The number is 8
The number is 9
---
```

将循环的结果管接给另一个命令。

```shell
for state in "North Dakota" Connecticut Illinois Alabama Tennessee
do
echo "$state is the next place to go"
done | sort
------------
Alabama is the next place to go
Connecticut is the next place to go
Illinois is the next place to go
North Dakota is the next place to go
Tennessee is the next place to go
---
```

### 综合实例

- 查找可执行文件

首先是创建一个 for 循环，对环境变量 PATH 中的目录进行迭代。处理的时候别忘了设置 IFS 分隔符。

```shell
IFS=:
for folder in $PATH
do
```

现在你已经将各个目录存放在了变量 \$folder 中，可以使用另一个 for 循环来迭代特定目录中的所有文件。

```shell
for file in $folder/*
do
```

最后一步是检查各个文件是否具有可执行权限，你可以使用 if-then 测试功能来实现。

```shell
if [ -x $file ]; then
    echo " $file"
fi
```

好了，搞定了！将这些代码片段组合成脚本就行了。

```shell
IFS=:
for folder in $PATH
do
    echo "$folder:"
    for file in $folder/*
    do
        if [ -x $file ]; then
            echo " $file"
        fi
    done
done | more
```

运行这段代码时，你会得到一个可以在命令行中使用的可执行文件的列表。

```shell
/usr/local/sbin:
/usr/local/bin:
/usr/sbin:
 /usr/sbin/abrt-auto-reporting
 /usr/sbin/abrt-configuration
 /usr/sbin/abrtd
..... 
```

- 创建多个用户账户

```shell
#!/bin/bash

input="users.csv"
while IFS=',' read -r userid name
do
    echo "adding $userid"
    useradd -c "$name" -m $userid
done < "$input"
echo "$(tail -3 /etc/passwd)"
```

```shell
christine,Christine Bresnahan
barbara,Barbara Blum
tim,Timothy Bresnahan
```

```shell
[root@admin shell]# sh user.sh
adding christine
adding barbara
adding tim
christine:x:1002:1002:Christine Bresnahan:/home/christine:/bin/bash
barbara:x:1003:1003:Barbara Blum:/home/barbara:/bin/bash
tim:x:1004:1004:Timothy Bresnahan:/home/tim:/bin/bash
```

## 处理用户输入

### 传递与读取参数 $n

sh demo.sh xiaoyu 20

在脚本内通过 \`$n` 来获取参数（ \$0 是程序名，\$1 是第一个参数， \$2 是第二个参数，依次类推，直到第九个参数 \$9 ）。

```shell
#!/bin/bash

echo 程序名称： $0
echo 参数1 $1
echo 参数2 $2

---
[root@admin shell]# sh demo4.sh 123 3
程序名称： demo4.sh
参数1 123
参数2 3
---
```

如果脚本需要的命令行参数不止9个，你仍然可以处理，但是需要稍微修改一下变量名。在第9个变量之后，你必须在变量数字周围加上花括号，比如 `${10}`

```shell
#!/bin/bash

echo 程序名称： $0
echo 参11 $11
echo 参11 ${11}
echo 参12 ${12}

---
[root@admin shell]# sh demo4.sh 1 2 3 4 5 6 7 8 9 10 "sdfw6513wer" 12 13
程序名称： demo4.sh
参11 11
参11 sdfw6513wer
参12 12
---
```

但是这种写法是不可取的

```shell
if [ -n "$1" ]
then
    echo Hello $1, glad to meet you.
else
    echo "Sorry, you did not identify yourself. "
fi
```

### 跟踪参数 \$\# \$\* \$@

#### 参数统计 \$\#

```shell
if [ $# -ne 2 ]
then
    echo Usage: $0 a b
else
    echo
fi

echo The last parameter is ${!#}
echo The last parameter is $#
```

#### 抓取所有的数据 \$\* \$@

\$* 和 \$@ 变量可以用来轻松访问所有的参数。

\$* 所有参数当作一个单词保存

\$@ 所有参数当作同一字符串中的多个独立的单词，通常通过 for 命令得到每个参数

```shell
echo parameter \$*: $*
echo parameter \$@: $@

count=10
#
for param in "$*"
do
    echo "\$* Parameter #$count = $param"
    count=$[ $count + 1 ]
done
count2=100
for param in "$@"
do
    echo "\$@ Parameter #$count2 = $param"
    count2=$[ $count2 + 1 ]
done
```

```
$* Parameter #10 = 1 2 3 4 5 6 7 8 9 10 sdfw6513wer 12 13
$@ Parameter #100 = 1
$@ Parameter #101 = 2
$@ Parameter #102 = 3
$@ Parameter #103 = 4
$@ Parameter #104 = 5
$@ Parameter #105 = 6
$@ Parameter #106 = 7
$@ Parameter #107 = 8
$@ Parameter #108 = 9
$@ Parameter #109 = 10
$@ Parameter #110 = sdfw6513wer
$@ Parameter #111 = 12
$@ Parameter #112 = 13
```

通过使用 for 命令遍历这两个特殊变量，你能看到它们是如何不同地处理命令行参数的。 \$* 变量会将所有参数当成单个参数，而 \$@ 变量会单独处理每个参数。这是遍历命令行参数的一个绝妙方法。

### 移动变量

```shell
#!/bin/bash

#count=1
#while [ -n "$1" ]
#do
#    echo "Parameter #$count = $1"
#    count=$[ $count + 1 ]
#    shift
#done
echo
echo "The original parameters: $*"
shift 2
echo "Here's the new first parameter: $1"
```

```shell
[root@admin shell]# sh shift.sh 1 2 3 4 5 6 7 8 9 10

The original parameters: 1 2 3 4 5 6 7 8 9 10
Here's the new first parameter: 3
```

这个脚本通过测试第一个参数值的长度执行了一个 while 循环。当第一个参数的长度为零时，循环结束。测试完第一个参数后， shift 命令会将所有参数的位置移动一个位置。

---

**窍门** 使用 shift 命令的时候要小心。如果某个参数被移出，它的值就被丢弃了，无法再恢复。

---

### 处理选项

#### 处理简单选项

```shell
echo
while [ -n "$1" ]
do
    case "$1" in
    -a) echo "Found the -a option" ;;
    -b) echo "Found the -b option" ;;
    -c) echo "Found the -c option" ;;
    *) echo "$1 is not an option" ;;
    esac
    shift
done

$ ./test15.sh -a -b -c -d
Found the -a option
Found the -b option
Found the -c option
-d is not an option
```

#### 分离参数和选项

对Linux来说，这个特殊字符是双破折线（ -- ）。shell会用双破折线来表明选项列表结束。在双破折线之后，脚本就可以放心地将剩下的命令行参数当作参数，而不是选项来处理了。

要检查双破折线，只要在 case 语句中加一项就行了。

```shell
echo
while [ -n "$1" ]
do
    case "$1" in
        -a) echo "Found the -a option" ;;
        -b) echo "Found the -b option";;
        -c) echo "Found the -c option" ;;
        --) shift
        break ;;
        *) echo "$1 is not an option";;
    esac
    shift
done
#
count=1
for param in $@
do
    echo "Parameter #$count: $param"
    count=$[ $count + 1 ]
done
```

在遇到双破折线时，脚本用 break 命令来跳出 while 循环。由于过早地跳出了循环，我们需要再加一条 shift 命令来将双破折线移出参数变量。

```
sh test16.sh -c -a -b test1 test2 test3
Found the -c option
Found the -a option
Found the -b option
test1 is not an option
test2 is not an option
test3 is not an option

sh test16.sh -c -a -b -- test1 test2 test3
Found the -c option
Found the -a option
Found the -b option
Parameter #1: test1
Parameter #2: test2
Parameter #3: test3
```

当脚本遇到双破折线时，它会停止处理选项，并将剩下的参数都当作命令行参数。

#### 处理带值的选项

```shell
while [ -n "$1" ]
do
    case "$1" in
        -a) echo "Found the -a option";;
        -b) param="$2"
            echo "Found the -b option, with parameter value $param"
            shift ;;
        -c) echo "Found the -c option";;
        --) shift
            break ;;
        *) echo "$1 is not an option";;
    esac
    shift
done
#
count=1
for param in "$@"
do
    echo "Parameter #$count: $param"
    count=$[ $count + 1 ]
done
```

```shell
$ sh demo4.sh -a -b test1 -d
Found the -a option
Found the -b option, with parameter value test1
-d is not an option
```

在这个例子中， case 语句定义了三个它要处理的选项。 -b 选项还需要一个额外的参数值。由于要处理的参数是 \$1 ，额外的参数值就应该位于 \$2 （因为所有的参数在处理完之后都会被移出）。只要将参数值从 \$2 变量中提取出来就可以了。当然，因为这个选项占用了两个参数位，所以你还需要使用 shift 命令多移动一个位置。

只用这些基本的特性，整个过程就能正常工作，不管按什么顺序放置选项（但要记住包含每个选项相应的选项参数）。

现在shell脚本中已经有了处理命令行选项的基本能力，但还有一些限制。比如，如果你想将
多个选项放进一个参数中时，它就不能工作了。

> sh test.sh -ac

#### getopt

它能够识别命令行参数，从而在脚本中解析它们时更方便。

> getopt optstring parameters
>
> optstring 是这个过程的关键所在。它定义了命令行有效的选项字母，还定义了哪些选项字母需要参数值。
> 首先，在 optstring 中列出你要在脚本中用到的每个命令行选项字母。然后，在每个需要参数值的选项字母后加一个冒号。 getopt 命令会基于你定义的 optstring 解析提供的参数。

简单例子:

> 如果指定了一个不在 optstring 中的选项，默认情况下， getopt 命令会产生一条错误消息。

```shell
[root@admin shell]# getopt ab:cd -a -b test1 -cd test2 test3
 -a -b test1 -c -d -- test2 test3
[root@admin shell]# getopt ab:cd -a -b test1 -cde test2 test3
getopt：无效选项 -- e
 -a -b test1 -c -d -- test2 test3
 [root@admin shell]# getopt -q ab:cd -a -b test1 -cde test2 test3
 -a -b 'test1' -c -d -- 'test2' 'test3'
```

> 注意 ： getopt 命令选项必须出现在 optstring 之前。

**在脚本中使用**

```shell
#!/bin/bash

set -- $(getopt -q ab:cd "$@")

while [ -n "$1" ]
do
    case "$1" in
        -a) echo "Found the -a option" ;;
        -b) param="$2"
            echo "Found the -b option, with parameter value $param"
            shift ;;
        -c) echo "Found the -c option" ;;
        --) shift
            break ;;
        *) echo "$1 is not an option";;
    esac
    shift
done
#
count=1
for param in "$@"
do
    echo "Parameter #$count: $param"
    count=$[ $count + 1 ]
done
```

```shell
[root@admin shell]# sh demo5.sh -ac
Found the -a option
Found the -c option

[root@admin shell]# sh demo5.sh -a -b test1 -cd test2 test3 test4
Found the -a option
Found the -b option, with parameter value 'test1'
Found the -c option
-d is not an option
Parameter #1: 'test2'
Parameter #2: 'test3'
Parameter #3: 'test4'
```

getopt 命令并不擅长处理带空格和引号的参数值。它会将空格当作参数分隔符，而不是根据双引号将二者当作一个参数。幸而还有另外一个办法能解决这个问题 **（使用更高级的 getopts）** 。

#### getopts

getopt会将命令行上选项和参数处理后只生成一个输出，而 getopts 命令能够和已有的shell参数变量配合默契。

每次调用它时，它一次只处理命令行上检测到的一个参数。处理完所有的参数后，它会退出并返回一个大于0的退出状态码。这让它非常适合用解析命令行所有参数的循环中。

getopts 命令的格式如下：

`getopts optstring variable`

optstring 值类似于 getopt 命令中的那个。有效的选项字母都会列在 optstring 中，如果选项字母要求有个参数值，就加一个冒号。要去掉错误消息的话，可以在 optstring 之前加一个冒号。 getopts 命令将当前参数保存在命令行中定义的 variable 中。

getopts 命令会用到两个环境变量。如果选项需要跟一个参数值， OPTARG 环境变量就会保存这个值。 OPTIND 环境变量保存了参数列表中 getopts 正在处理的参数位置。这样你就能在处理完选项之后继续处理其他命令行参数了。

```shell
#!/bin/bash

echo
while getopts :ab:c opt
do
    case "$opt" in
        a) echo "Found the -a option" ;;
        b) echo "Found the -b option, with value $OPTARG";;
        c) echo "Found the -c option" ;;
        *) echo "Unknown option: $opt";;
    esac
done
```

```shell
[root@admin shell]# sh demo5.sh -ab test1 -c
Found the -a option
Found the -b option, with value test1
Found the -c option
[root@admin shell]# -b "test1 test2" -a
Found the -b option, with value test1 test2
Found the -a option
[root@admin shell]# -abtest1
Found the -a option
Found the -b option, with value test1
[root@admin shell]# -acde
Found the -a option
Found the -c option
Unknown option: ?
Unknown option: ?
```

**特性：**

- 可以在参数值中包含空格
- 将选项字母和参数值放在一起使用，而不用加空格
- 将命令行上找到的所有未定义的选项统一输出成问号
- 知道何时停止处理选项，并将参数留给你处理

在 getopts 处理每个选项时，它会将 OPTIND 环境变量值增一。在 getopts 完成处理时，你可以使用 shift 命令和 OPTIND 值来移动参数。

```shell
while getopts :ab:cd opt
do
    case "$opt" in
        a) echo "Found the -a option" ;;
        b) echo "Found the -b option, with value $OPTARG" ;;
        c) echo "Found the -c option" ;;
        d) echo "Found the -d option" ;;
        *) echo "Unknown option: $opt" ;;
    esac
done
#
shift $[ $OPTIND - 1 ]
#
echo
count=1
for param in "$@"
do
    echo "Parameter $count: $param"
    count=$[ $count + 1 ]
done
```

```shell
[root@admin shell]# -a -b test1 -d test2 test3 test4
Found the -a option
Found the -b option, with value test1
Found the -d option
Parameter 1: test2
Parameter 2: test3
Parameter 3: test4
```

### 将选项标准化

在创建shell脚本时，显然可以控制具体怎么做。你完全可以决定用哪些字母选项以及它们的
用法。

但有些字母选项在Linux世界里已经拥有了某种程度的标准含义。如果你能在shell脚本中支
持这些选项，脚本看起来能更友好一些：

```tex
选项  描述
-a  显示所有对象
-c  生成一个计数
-d  指定一个目录
-e  扩展一个对象
-f  指定读入数据的文件
-h  显示命令的帮助信息
-i  忽略文本大小写
-l  产生输出的长格式版本
-n  使用非交互模式（批处理）
-o  将所有输出重定向到的指定的输出文件
-q  以安静模式运行
-r  递归地处理目录和文件
-s  以安静模式运行
-v  生成详细输出
-x  排除某个对象
-y  对所有问题回答yes
```

### 获得用户输入 read

尽管命令行选项和参数是从脚本用户处获得输入的一种重要方式，但有时脚本的交互性还需要更强一些。比如你想要在脚本运行时问个问题，并等待运行脚本的人来回答

#### 基本的读取 read -p

read 命令从标准输入（键盘）或另一个文件描述符中接受输入。在收到输入后， read 命令
会将数据放进一个变量。下面是 read 命令的最简单用法。

```shell
#!/bin/bash
echo -n "Enter your name: "
read name
echo "Hello $name, welcome to my program. "
```

```
sh test21.sh
Enter your name: xiao yu
Hello xiao yu, welcome to my program.
```

 read 命令包含了 -p 选项，允许你直接在 read 命令行指定提示符

```shell
#!/bin/bash
read -p "Please enter your age: " age name
days=$[ $age * 365 ]
echo "name $name; That makes you over $days days old! "
```

```shell
sh test22.sh
Please enter your age: 10 yu
name yu; That makes you over 3650 days old!
```

也可以在 read 命令行中不指定变量。如果是这样， read 命令会将它收到的任何数据都放进特殊环境变量 REPLY 中

```shell
#!/bin/bash
# Testing the REPLY Environment variable
#
read -p "Enter your name: "
echo
echo Hello $REPLY, welcome to my program.
```

```
sh test24.sh
Enter your name: Christine
Hello Christine, welcome to my program.
```

REPLY 环境变量会保存输入的所有数据，可以在shell脚本中像其他变量一样使用

#### 超时 read -t

使用 read 命令时要当心。脚本很可能会一直苦等着脚本用户的输入。如果不管是否有数据输入，脚本都必须继续执行，你可以用 -t 选项来指定一个计时器。 -t 选项指定了 read 命令等待输入的秒数。当计时器过期后， read 命令会返回一个非零退出状态码。

```shell
#!/bin/bash

if read -t 5 -p "Please enter your name: " name
then
    echo "Hello $name, welcome to my script"
else
    echo
    echo "Sorry, too slow! "
fi

$ sh test25.sh
Please enter your name: Rich
Hello Rich, welcome to my script
$ sh test25.sh
Please enter your name:
Sorry, too slow!
```

如果计时器过期， read 命令会以非零退出状态码退出。

当输入的字符达到预设的字符数时，就自动退出，将输入的数据赋给变量：

```shell
#!/bin/bash

read -n1 -p "Do you want to continue [Y/N]? " answer
case $answer in
    Y | y) echo
        echo "fine, continue on…";;
    N | n) echo
        echo OK, goodbye
    exit;;
esac
echo "This is the end of the script"
```

```
$ sh test26.sh
Do you want to continue [Y/N]? Y
fine, continue on…
This is the end of the script
$
$ sh test26.sh
Do you want to continue [Y/N]? n
OK, goodbye
```

-n 选项和值 1 一起使用，告诉 read 命令在接受单个字符后退出。

#### 隐藏方式读取 read -s

有时你需要从脚本用户处得到输入，但又在屏幕上显示输入信息。其中典型的例子就是输入的密码，但除此之外还有很多其他需要隐藏的数据类型。

-s 选项可以避免在 read 命令中输入的数据出现在显示器上（实际上，数据会被显示，只是 read 命令会将文本颜色设成跟背景色一样）。这里有个在脚本中使用 -s 选项的例子。

```shell
read -s -p "Enter your password: " pass
echo
echo "Is your password really $pass? "

$ sh test27.sh
Enter your password:
Is your password really T3st1ng?
```

#### 从文件中读取

也可以用 read 命令来读取Linux系统上文件里保存的数据。每次调用 read 命令，它都会从文件中读取一行文本。当文件中再没有内容时， read 命令会退出并返回非零退出状态码。

其中最难的部分是将文件中的数据传给 read 命令。最常见的方法是对文件使用 cat 命令，将结果通过管道直接传给含有 read 命令的 while 命令。

```shell
#!/bin/bas
count=1
cat test | while read line
do
    echo "Line $count: $line"
    count=$[ $count + 1]
done
echo "Finished processing the file"
$
$ cat test
The quick brown dog jumps over the lazy fox.
This is a test, this is only a test.
O Romeo, Romeo! Wherefore art thou Romeo?
$
$ sh test28.sh
Line 1: The quick brown dog jumps over the lazy fox.
Line 2: This is a test, this is only a test.
Line 3: O Romeo, Romeo! Wherefore art thou Romeo?
Finished processing the file
```

## 呈现数据

### 输入和输出

**标准文件描述符**

Linux系统将每个对象当作文件处理。这包括输入和输出进程。Linux用文件描述符（ filedescriptor ）来标识每个文件对象。文件描述符是一个非负整数，可以唯一标识会话中打开的文件。每个进程一次最多可以有九个文件描述符。出于特殊目的，bash shell保留了前三个文件描述符（ 0 、 1 和 2 ）

```
文件描述符   缩 写    描 述
0     STDIN  标准输入 <
1     STDOUT  标准输出 > >> 
2     STDERR  标准错误
```

- STDIN

对终端界面来说，标准输入是键盘。shell从 STDIN 文件描述符对应的键盘获得输入，在用户输入时处理每个字符。
在使用输入重定向符号（ < ）时，Linux会用重定向指定的文件来替换标准输入文件描述符。它会读取文件并提取数据，就如同它是键盘上键入的。许多bash命令能接受 STDIN 的输入，尤其是没有在命令行上指定文件的话。下面是个用 cat 命令处理 STDIN 输入的数据的例子。

```
$ cat
this is a test
this is a test
this is a second test.
this is a second test.
```

当在命令行上只输入 cat 命令时，它会从 STDIN 接受输入。输入一行， cat 命令就会显示出一行。

但你也可以通过 STDIN 重定向符号强制 cat 命令接受来自另一个非 STDIN 文件的输入。

```shell
$ cat < testfile
This is the first line.
This is the second line.
This is the third line.
```

现在 cat 命令会用testfile文件中的行作为输入。你可以使用这种技术将数据输入到任何能从STDIN 接受数据的shell命令中。

- STDOUT

STDOUT 文件描述符代表shell的标准输出。在终端界面上，标准输出就是终端显示器。shell的所有输出（包括shell中运行的程序和脚本）会被定向到标准输出中，也就是显示器。

默认情况下，大多数bash命令会将输出导向 STDOUT 文件描述符。如第11章中所述，你可以用输出重定向来改变。

```shell
$ ls -l > test2
$ cat test2
total 20
-rw-rw-r-- 1 demo demo 53 2014-10-16 11:30 test
-rw-rw-r-- 1 demo demo 0 2014-10-16 11:32 test2
-rw-rw-r-- 1 demo demo 73 2014-10-16 11:23 testfile

$ who >> test2
$ cat test2
total 20
-rw-rw-r-- 1 demo demo 53 2014-10-16 11:30 test
-rw-rw-r-- 1 demo demo 0 2014-10-16 11:32 test2
-rw-rw-r-- 1 demo demo 73 2014-10-16 11:23 testfile
demo pts/0 2014-10-17 15:34 (192.168.1.2)
```

who 命令生成的输出会被追加到test2文件中已有数据的后面。

但是，如果你对脚本使用了标准输出重定向，你会遇到一个问题。下面的例子说明了可能会出现什么情况。

```shell
$ ls -al badfile > test3
ls: cannot access badfile: No such file or directory
$ cat test3

```

当命令生成错误消息时，shell并未将错误消息重定向到输出重定向文件。shell创建了输出重定向文件，但错误消息却显示在了显示器屏幕上。注意，在显示test3文件的内容时并没有任何错误。test3文件创建成功了，只是里面是空的。

shell对于错误消息的处理是跟普通输出分开的。如果你创建了在后台模式下运行的shell脚本，通常你必须依赖发送到日志文件的输出消息。用这种方法的话，如果出现了错误信息，这些信息是不会出现在日志文件中的。你需要换种方法来处理。

- STDERR

shell通过特殊的 STDERR 文件描述符来处理错误消息。 STDERR 文件描述符代表shell的标准错误输出。shell或shell中运行的程序和脚本出错时生成的错误消息都会发送到这个位置。

默认情况下， STDERR 文件描述符会和 STDOUT 文件描述符指向同样的地方（尽管分配给它们的文件描述符值不同）。也就是说，默认情况下，错误消息也会输出到显示器输出中。

但从上面的例子可以看出， STDERR 并不会随着 STDOUT 的重定向而发生改变。使用脚本时，你常常会想改变这种行为，尤其是当你希望将错误消息保存到日志文件中的时候。

**重定向错误**

你已经知道如何用重定向符号来重定向 STDOUT 数据。重定向 STDERR 数据也没太大差别，只要在使用重定向符号时定义 STDERR 文件描述符就可以了。有几种办法实现方法。

- 只重定向错误

STDERR 文件描述符被设成 2 。可以选择只重定向错误消息，将该文件描述符值放在重定向符号前。该值必须紧紧地放在重定向符号前，否则不会工作。

```shell
$ ls -al badfile 2> test4
$ cat test4
ls: cannot access badfile: No such file or directory
```

运行该命令，错误消息不会出现在屏幕上了。该命令生成的任何错误消息都会保存在输出文件中。用这种方法，shell会只重定向错误消息，而非普通数据。这里是另一个将 STDOUT 和 STDERR 消息混杂在同一输出中的例子

```shell
ls -al test badtest test2 2> test5
-rw-rw-r-- 1 demo demo 158 2014-10-16 11:32 test2

$ cat test5
ls: cannot access test: No such file or directory
ls: cannot access badtest: No such file or directory
```

- 重定向错误和数据

如果想重定向错误和正常输出，必须用两个重定向符号。需要在符号前面放上待重定向数据所对应的文件描述符，然后指向用于保存数据的输出文件。

```shell
$ ls -al test test2 test3 badtest 2> test6 1> test7

$ cat test6
ls: cannot access test: No such file or directory
ls: cannot access badtest: No such file or directory
$ cat test7
-rw-rw-r-- 1 demo demo 158 2014-10-16 11:32 test2
-rw-rw-r-- 1 demo demo 0 2014-10-16 11:33 test3
```

> 可以用这种方法将脚本的正常输出和脚本生成的错误消息分离开来。这样就可以轻松地识别出错误信息，再不用在成千上万行正常输出数据中翻腾了。

如果愿意，也可以将 STDERR 和 STDOUT 的输出重定向到同一个输出文件。为此bash shell提供了特殊的重定向符号 &> 。当使用 &> 符时，命令生成的所有输出都会发送到同一位置，包括数据和错误。

```shell
$ ls -al test test2 test3 badtest &> test7

$ cat test7
ls: cannot access test: No such file or directory
ls: cannot access badtest: No such file or directory
-rw-rw-r-- 1 demo demo 158 2014-10-16 11:32 test2
-rw-rw-r-- 1 demo demo 0 2014-10-16 11:33 test3
```

### 在脚本中重定向输出输入

**重定向输出**

#### 临时重定向行输出

在重定向到文件描述符时，你必须在文件描述符数字之前加一个 & ：

```shell
echo "This is an error message" >&2
```

```shell
#!/bin/bash
echo "This is an error" >&2
echo "This is normal output"

$ ./test8
This is an error
This is normal output
```

默认情况下，Linux会将 STDERR 导向 STDOUT 。但是，如果你在运行脚本时重定向了STDERR ，脚本中所有导向 STDERR 的文本都会被重定向。

```shell
./test8 2> test9
This is normal output
$ cat test9
This is an error
```

这个方法非常适合在脚本中生成错误消息。如果有人用了你的脚本，他们可以像上面的例子中那样轻松地通过 STDERR 文件描述符重定向错误消息

#### 永久重定向脚本中的所有命令 exec

如果脚本中有大量数据需要重定向，那重定向每个 echo 语句就会很烦琐。取而代之，你可以用 exec 命令告诉shell在脚本执行期间重定向某个特定文件描述符。

```shell
#!/bin/bash
exec 1>testout
echo "This is a test of redirecting all output"
echo "from a script to another file."
echo "without having to redirect every individual line"

$ ./test10
$ cat testout
This is a test of redirecting all output
from a script to another file.
without having to redirect every individual line
```

也可以在脚本执行过程中重定向 STDOUT 。

```shell
#!/bin/bash
# redirecting output to different locations
exec 2>testerror
echo "This is the start of the script"
echo "now redirecting all output to another location"
exec 1>testout
echo "This output should go to the testout file"
echo "but this should go to the testerror file" >&2

$ ./test11
This is the start of the script
now redirecting all output to another location
$ cat testout
This output should go to the testout file
$ cat testerror
but this should go to the testerror file
```

**重定向输入**

> exec 0< testfile

这个命令会告诉shell它应该从文件 testfile 中获得输入，而不是 STDIN 。这个重定向只要在脚本需要输入时就会作用。

```shell
#!/bin/bash
exec 0< testfile
count=1
while read line
do
    echo "Line #$count: $line"
    count=$[ $count + 1 ]
done

$ ./test12
Line #1: This is the first line.
Line #2: This is the second line.
Line #3: This is the third line.
```

### 创建自己的重定向

**创建输出文件描述符**

可以用 exec 命令来给输出分配文件描述符。和标准的文件描述符一样，一旦将另一个文件描述符分配给一个文件，这个重定向就会一直有效，直到你重新分配。

```shell
#!/bin/bash
#exec 3>test13out
exec 3>>test13out
echo "This should display on the monitor"
echo "and this should be stored in the file" >&3
echo "Then this should be back on the monitor"

$ ./test13
This should display on the monitor
Then this should be back on the monitor
$ cat test13out
and this should be stored in the file
```

这个脚本用 exec 命令将文件描述符 3 重定向到另一个文件。当脚本执行 echo 语句时，输出内容会像预想中那样显示在 STDOUT 上。但你重定向到文件描述符 3 的那行 echo 语句的输出却进入了另一个文件。这样你就可以在显示器上保持正常的输出，而将特定信息重定向到文件中（比如日志文件）。

**重定向文件描述符**

现在介绍怎么恢复已重定向的文件描述符。你可以分配另外一个文件描述符给标准文件描述
符，反之亦然。这意味着你可以将 STDOUT 的原来位置重定向到另一个文件描述符，然后再利用
该文件描述符重定向回 STDOUT 。

```shell
#!/bin/bash
exec 3>&1
exec 1>test14out
echo "This should store in the output file"
echo "along with this line."
exec 1>&3
echo "Now things should be back to normal"

$ ./test14
Now things should be back to normal
$ cat test14out
This should store in the output file
along with this line.
```

首先，脚本将文件描述符 3 重定向到文件描述符1的当前位置，也就是 STDOUT 。这意味着任何发送给文件描述符 3 的输出都将出现在显示器上。

第二个 exec 命令将 STDOUT 重定向到文件，shell现在会将发送给 STDOUT 的输出直接重定向到输出文件中。但是，文件描述符 3 仍然指向 STDOUT 原来的位置，也就是显示器。如果此时将输出数据发送给文件描述符 3 ，它仍然会出现在显示器上，尽管 STDOUT 已经被重定向了。

在向 STDOUT （现在指向一个文件）发送一些输出之后，脚本将 STDOUT 重定向到文件描述符 3 的当前位置（现在仍然是显示器）。这意味着现在 STDOUT 又指向了它原来的位置：显示器。

这个方法可能有点叫人困惑，但这是一种在脚本中临时重定向输出，然后恢复默认输出设置的常用方法。

**创建输入文件描述符**

可以用和重定向输出文件描述符同样的办法重定向输入文件描述符。在重定向到文件之前，先将 STDIN 文件描述符保存到另外一个文件描述符，然后在读取完文件之后再将 STDIN 恢复到它原来的位置。

```shell
#!/bin/bash
exec 6<&0
exec 0< testfile
count=1
while read line
do
    echo "Line #$count: $line"
    count=$[ $count + 1 ]
done

exec 0<&6
read -p "Are you done now? " answer
case $answer in
    Y|y) echo "Goodbye";;
    N|n) echo "Sorry, this is the end.";;
esac
$ ./test15
Line #1: This is the first line.
Line #2: This is the second line.
Line #3: This is the third line.
Are you done now? y
Goodbye
```

在这个例子中，文件描述符 6 用来保存 STDIN 的位置。然后脚本将 STDIN 重定向到一个文件。read 命令的所有输入都来自重定向后的 STDIN （也就是输入文件）。

在读取了所有行之后，脚本会将 STDIN 重定向到文件描述符 6 ，从而将 STDIN 恢复到原先的位置。该脚本用了另外一个 read 命令来测试 STDIN 是否恢复正常了。这次它会等待键盘的输入。

**创建读写文件描述符**

尽管看起来可能会很奇怪，但是你也可以打开单个文件描述符来作为输入和输出。可以用同一个文件描述符对同一个文件进行读写。

不过用这种方法时，你要特别小心。由于你是对同一个文件进行数据读写，shell会维护一个内部指针，指明在文件中的当前位置。任何读或写都会从文件指针上次的位置开始。如果不够小心，它会产生一些令人瞠目的结果。

```shell
#!/bin/bash
exec 3<> testfile
read line <&3
echo "Read: $line"
echo "This is a test line" >&3


$ cat testfile
This is the first line.
This is the second line.
This is the third line.
$ ./test16
Read: This is the first line.
$ cat testfile
This is the first line.
This is a test line
ine.
This is the third line.
```

> 这个例子用了 exec 命令将文件描述符 3 分配给文件 testfile 以进行文件读写。接下来，它通过分配好的文件描述符，使用 read 命令读取文件中的第一行，然后将这一行显示在 STDOUT 上。最后，它用 echo 语句将一行数据写入由同一个文件描述符打开的文件中。

在运行脚本时，一开始还算正常。输出内容表明脚本读取了testfile文件中的第一行。但如果你在脚本运行完毕后，查看testfile文件内容的话，你会发现写入文件中的数据覆盖了已有的数据。

当脚本向文件中写入数据时，它会从文件指针所处的位置开始。 read 命令读取了第一行数据，所以它使得文件指针指向了第二行数据的第一个字符。在 echo 语句将数据输出到文件时，它会将数据放在文件指针的当前位置，覆盖了该位置的已有数据。

**关闭文件描述符**

如果你创建了新的输入或输出文件描述符，shell会在脚本退出时自动关闭它们。然而在有些情况下，你需要在脚本结束前手动关闭文件描述符。

要关闭文件描述符，将它重定向到特殊符号 &- 。

exec 3>&-
该语句会关闭文件描述符 3 ，不再在脚本中使用它。这里有个例子来说明当你尝试使用已关闭的文件描述符时会怎样。一旦关闭了文件描述符，就不能在脚本中向它写入任何数据，否则shell会生成错误消息。

```shell
#!/bin/bash
exec 3> test17file
echo "This is a test line of data" >&3
exec 3>&-
echo "This won't work" >&3

$ ./badtest
./badtest: 3: Bad file descriptor
```

在关闭文件描述符时还要注意另一件事。如果随后你在脚本中打开了同一个输出文件，shell 会用一个新文件来替换已有文件。这意味着如果你输出数据，它就会覆盖已有文件。

```shell
#!/bin/bash
exec 3> test17file
echo "This is a test line of data" >&3
exec 3>&-
cat test17file
exec 3> test17file
echo "This'll be bad" >&3

$ ./test17
This is a test line of data
$ cat test17file
This'll be bad
```

> 在向test17file文件发送一个数据字符串并关闭该文件描述符之后，脚本用了 cat 命令来显示文件的内容。到目前为止，一切都还好。下一步，脚本重新打开了该输出文件并向它发送了另一个数据字符串。当显示该输出文件的内容时，你所能看到的只有第二个数据字符串。shell覆盖了原来的输出文件。

### 列出打开的文件描述符 lsof

该命令会产生大量的输出。它会显示当前Linux系统上打开的每个文件的有关信息。这包括后台运行的所有进程以及登录到系统的任何用户。有大量的命令行选项和参数可以用来帮助过滤 lsof 的输出。最常用的有 -p 和 -d ，前者允许指定进程ID（PID），后者允许指定要显示的文件描述符编号。

```
[root@admin shell]# lsof -a -p $$ -d 0,1,2
COMMAND  PID USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
bash    1458 root    0u   CHR  136,0      0t0    3 /dev/pts/0
bash    1458 root    1u   CHR  136,0      0t0    3 /dev/pts/0
bash    1458 root    2u   CHR  136,0      0t0    3 /dev/pts/0
```

- COMMAND  正在运行的命令名的前9个字符
- PID  进程的PID
- USER  进程属主的登录名
- FD  文件描述符号以及访问类型（ r 代表读， w 代表写， u 代表读写）
- TYPE  文件的类型（ CHR 代表字符型， BLK 代表块型， DIR 代表目录， REG 代表常规文件）
- DEVICE  设备的设备号（主设备号和从设备号）
- SIZE  如果有的话，表示文件的大小
- NODE  本地文件的节点号
- NAME  文件名

与 STDIN 、 STDOUT 和 STDERR 关联的文件类型是字符型。因为 STDIN 、 STDOUT 和 STDERR 文件描述符都指向终端，所以输出文件的名称就是终端的设备名。所有3种标准文件都支持读和写（尽管向 STDIN 写数据以及从 STDOUT 读数据看起来有点奇怪）。

```shell
#!/bin/bash
exec 3> test18file1
exec 6> test18file2
exec 7< testfile
/usr/sbin/lsof -a -p $$ -d0,1,2,3,6,7


$ ./test18
COMMAND PID USER FD TYPE DEVICE SIZE NODE NAME
test18 3594 demo 0u CHR 136,0 2 /dev/pts/0
test18 3594 demo 1u CHR 136,0 2 /dev/pts/0
test18 3594 demo 2u CHR 136,0 2 /dev/pts/0
18 3594 demo 3w REG 253,0 0 360712 /home/demo/test18file1
18 3594 demo 6w REG 253,0 0 360715 /home/demo/test18file2
18 3594 demo 7r REG 253,0 73 360717 /home/demo/testfile
```

### 阻止命令输出

有时候，你可能不想显示脚本的输出。这在将脚本作为后台进程运行时很常见。如果在运行在后台的脚本出现错误消息，shell会通过电子邮件将它们发给进程的属主。这会很麻烦，尤其是当运行会生成很多烦琐的小错误的脚本时。

要解决这个问题，可以将 STDERR 重定向到一个叫作null文件的特殊文件。null文件跟它的名字很像，文件里什么都没有。shell输出到null文件的任何数据都不会保存，全部都被丢掉了。

在Linux系统上null文件的标准位置是/dev/null。你重定向到该位置的任何数据都会被丢掉，不会显示。

```shell
ls -al > /dev/null
cat /dev/null
ls -al badfile test16 2> /dev/null
```

### 创建临时文件

#### 创建本地临时文件

模板可以包含任意文本文件名，在文件名末尾加上6个 X 就行了。

```shell
$ mktemp testing.XXXXXX
$ ls -al testing*
-rw------- 1 demo demo 0 Oct 17 21:30 testing.UfIi13
$ mktemp testing.XXXXXX
testing.1DRLuV
$ mktemp testing.XXXXXX
testing.lVBtkW
$ mktemp testing.XXXXXX
testing.PgqNKG
$ ls -l testing*
-rw------- 1 demo demo 0 Oct 17 21:57 testing.1DRLuV
-rw------- 1 demo demo 0 Oct 17 21:57 testing.PgqNKG
-rw------- 1 demo demo 0 Oct 17 21:30 testing.UfIi13
-rw------- 1 demo demo 0 Oct 17 21:57 testing.lVBtkW
```

```shell
#!/bin/bash

tempfile=$(mktemp test19.XXXXXX)
exec 3>$tempfile
echo "This script writes to temp file $tempfile"
echo "This is the first line" >&3
echo "This is the second line." >&3
echo "This is the last line." >&3
exec 3>&-
echo "Done creating temp file. The contents are:"
cat $tempfile
rm -f $tempfile 2> /dev/null

$ ./test19
This script writes to temp file test19.vCHoya
Done creating temp file. The contents are:
This is the first line
This is the second line.
This is the last line.
$ ls -al test19*
-rwxr--r-- 1 demo demo 356 Oct 29 22:03 test19*
```

> mktemp 命令来创建临时文件并将文件名赋给 $tempfile 变量。接着将这个临时文件作为文件描述符 3 的输出重定向文件。在将临时文件名显示在 STDOUT 之后，向临时文件中写入了几行文本，然后关闭了文件描述符。最后，显示出临时文件的内容，并用 rm 命令将其删除。

#### 在 tmp 目录创建临时文件

-t 选项会强制 mktemp 命令来在系统的临时目录来创建该文件。在用这个特性时， mktemp 命令会返回用来创建临时文件的全路径，而不是只有文件名。

```shell
$ mktemp -t test.XXXXXX
/tmp/test.xG3374
$ ls -al /tmp/test*
-rw------- 1 demo demo 0 2014-10-29 18:41 /tmp/test.xG3374
```

由于 mktemp 命令返回了全路径名，你可以在Linux系统上的任何目录下引用该临时文件，不管临时目录在哪里。

```shell
#!/bin/bash
# creating a temp file in /tmp
tempfile=$(mktemp -t tmp.XXXXXX)
echo "This is a test file." > $tempfile
echo "This is the second line of the test." >> $tempfile
echo "The temp file is located at: $tempfile"
cat $tempfile
rm -f $tempfile


$ ./test20
The temp file is located at: /tmp/tmp.Ma3390
This is a test file.
This is the second line of the test.
```

#### 创建临时目录

-d 选项告诉 mktemp 命令来创建一个临时目录而不是临时文件。这样你就能用该目录进行任何需要的操作了，比如创建其他的临时文件。

```shell
#!/bin/bash
# using a temporary directory
tempdir=$(mktemp -d dir.XXXXXX)
cd $tempdir
tempfile1=$(mktemp temp.XXXXXX)
tempfile2=$(mktemp temp.XXXXXX)
exec 7> $tempfile1
exec 8> $tempfile2
echo "Sending data to directory $tempdir"
echo "This is a test line of data for $tempfile1" >&7
echo "This is a test line of data for $tempfile2" >&8
$ ./test21
Sending data to directory dir.ouT8S8
$ ls -al
total 72
drwxr-xr-x 3 demo demo 4096 Oct 17 22:20 ./
drwxr-xr-x 9 demo demo 4096 Oct 17 09:44 ../
drwx------ 2 demo demo 4096 Oct 17 22:20 dir.ouT8S8/
-rwxr--r-- 1 demo demo 338 Oct 17 22:20 test21*
$ cd dir.ouT8S8
[dir.ouT8S8]$ ls -al
total 16
drwx------ 2 demo demo 4096 Oct 17 22:20 ./
drwxr-xr-x 3 demo demo 4096 Oct 17 22:20 ../
-rw------- 1 demo demo 44 Oct 17 22:20 temp.N5F3O6
-rw------- 1 demo demo 44 Oct 17 22:20 temp.SQslb7
[dir.ouT8S8]$ cat temp.N5F3O6
This is a test line of data for temp.N5F3O6
[dir.ouT8S8]$ cat temp.SQslb7
This is a test line of data for temp.SQslb7
```

### 记录消息

将输出同时发送到显示器和日志文件，这种做法有时候能够派上用场。你不用将输出重定向两次，只要用特殊的 tee 命令就行。

tee 命令相当于管道的一个T型接头。它将从 STDIN 过来的数据同时发往两处。一处是STDOUT ，另一处是 tee 命令行所指定的文件名：

tee filename

由于 tee 会重定向来自 STDIN 的数据，你可以用它配合管道命令来重定向命令输出

```shell
$ date | tee testfile
Sun Oct 19 18:56:21 EDT 2014
$ cat testfile
Sun Oct 19 18:56:21 EDT 2014
```

注意，默认情况下， tee 命令会在每次使用时覆盖输出文件内容，如果你想将数据追加到文件中，必须用 -a 选项

```shell
$ who | tee testfile
demo pts/0 2014-10-17 18:41 (192.168.1.2)
$ cat testfile
demo pts/0 2014-10-17 18:41 (192.168.1.2)

$ date | tee -a testfile
Sun Oct 19 18:58:05 EDT 2014
$ cat testfile
demo pts/0 2014-10-17 18:41 (192.168.1.2)
Sun Oct 19 18:58:05 EDT 2014
```

利用这个方法，既能将数据保存在文件中，也能将数据显示在屏幕上

```shell
#!/bin/bash

tempfile=test22file
echo "This is the start of the test" | tee $tempfile
echo "This is the second line of the test" | tee -a $tempfile
echo "This is the end of the test" | tee -a $tempfile

$ ./test22
This is the start of the test
This is the second line of the test
This is the end of the test
$ cat test22file
This is the start of the test
This is the second line of the test
This is the end of the test
```

### 综合实例

这个样例脚本两件事都做了。它读取.csv 格式的数据文件，输出SQL  INSERT 语句来将数据插入数据库。

使用命令行参数指定待读取的.csv文件。.csv格式用于从电子表格中导出数据，所以你可以把数据库数据放入电子表格中，把电子表格保存成.csv格式，读取文件，然后创建 INSERT 语句将数据插入MySQL数据库。

```shell
#!/bin/bash
outfile='members.sql'
IFS=','
while read lname fname address city state zip
do
cat >> $outfile << EOF
INSERT INTO members (lname,fname,address,city,state,zip) VALUES
('$lname', '$fname', '$address', '$city', '$state', '$zip');
EOF
done < ${1}
```

## 控制脚本

### 处理信号

#### 信号

```
信号  值    描述
1   SIGHUP  挂起进程
2   SIGINT  终止进程
3   SIGQUIT  停止进程
9   SIGKILL  无条件终止进程
15  SIGTERM  尽可能终止进程
17  SIGSTOP  无条件停止进程，但不是终止进程
18  SIGTSTP  停止或暂停进程，但不终止进程
19  SIGCONT  继续运行停止的进程
```

#### sleep((生成信号:中断、暂停进程)、

sleep 100;

#### kill(结束进程)

kill -9 2152

#### trap(捕获信号)

> trap commands signals

展示了如何使用 trap 命令来忽略 SIGINT 信号

```shell
#!/bin/bash

trap "echo ' Sorry! I have trapped Ctrl-C'" SIGINT

echo This is a test script

count=1
while [ $count -le 10 ]
do
    echo "Loop #$count"
    sleep 1
    count=$[ $count + 1 ]
done
#
echo "This is the end of the test script"
```

```shell
$ ./test1.sh
This is a test script
Loop #1
Loop #2
Loop #3
Loop #4
Loop #5
^C Sorry! I have trapped Ctrl-C
Loop #6
Loop #7
Loop #8
^C Sorry! I have trapped Ctrl-C
Loop #9
Loop #10
This is the end of the test script
```

#### 捕获脚本退出

除了在shell脚本中捕获信号，你也可以在shell脚本退出时进行捕获。这是在shell完成任务时执行命令的一种简便方法。

要捕获shell脚本的退出，只要在 trap 命令后加上 EXIT 信号就行。

```shell
#!/bin/bash

trap "echo Goodbye..." EXIT

count=1
while [ $count -le 5 ]
do
    echo "Loop #$count"
    sleep 1
    count=$[ $count + 1 ]
done


$ ./test2.sh
Loop #1
Loop #2
Loop #3
Loop #4
Loop #5
Goodbye...
```

#### 修改或移除捕获

要想在脚本中的不同位置进行不同的捕获处理，只需重新使用带有新选项的 trap 命令。

```shell
#!/bin/bash
# Modifying a set trap
#
trap "echo ' Sorry... Ctrl-C is trapped.'" SIGINT
#
count=1
while [ $count -le 5 ]
do
    echo "Loop #$count"
    sleep 1
    count=$[ $count + 1 ]
done
#
trap "echo ' I modified the trap!'" SIGINT
#
count=1
while [ $count -le 5 ]
do
    echo "Second Loop #$count"
    sleep 1
    count=$[ $count + 1 ]
done
```

修改了信号捕获之后，脚本处理信号的方式就会发生变化。但如果一个信号是在捕获被修改前接收到的，那么脚本仍然会根据最初的 trap 命令进行处理。

```
sh test3.sh
Loop #1
Loop #2
Loop #3
^C Sorry... Ctrl-C is trapped.
Loop #4
Loop #5
Second Loop #1
Second Loop #2
^C I modified the trap!
Second Loop #3
Second Loop #4
Second Loop #5
```

也可以删除已设置好的捕获。只需要在 trap 命令与希望恢复默认行为的信号列表之间加上两个破折号就行了。

```shell
#!/bin/bash
# Modifying a set trap
#
trap "echo ' Sorry... Ctrl-C is trapped.'" SIGINT
#
count=1
while [ $count -le 5 ]
do
    echo "Loop #$count"
    sleep 1
    count=$[ $count + 1 ]
done

trap -- SIGINT
echo "I just removed the trap"

count=1
while [ $count -le 5 ]
do
    echo "Second Loop #$count"
    sleep 1
    count=$[ $count + 1 ]
done

$ ./test3b.sh
Loop #1
Loop #2
Loop #3
Loop #4
Loop #5
I just removed the trap
Second Loop #1
Second Loop #2
Second Loop #3
^C
```

移除信号捕获后，脚本按照默认行为来处理 SIGINT 信号，也就是终止脚本运行。但如果信号是在捕获被移除前接收到的，那么脚本会按照原先 trap 命令中的设置进行处理。

```shell
$ ./test3b.sh
Loop #1
Loop #2
Loop #3
^C Sorry... Ctrl-C is trapped.
Loop #4
Loop #5
I just removed the trap
Second Loop #1
Second Loop #2
^C
```

### 后台模式 \&

当 & 符放到命令后时，它会将命令和bash shell分离开来，将命令作为系统中的一个独立的后台进程运行。

后台运行脚本

```shell
./test4.sh &
```

在非控制台下运行脚本（在退出终端会话时阻止进程退出）

```shell
nohup ./test1.sh &
```

### 作业控制 jobs

**查看作业**

```tex
参 数   描 述
-l  列出进程的PID以及作业号
-n  只列出上次shell发出的通知后改变了状态的作业
-p  只列出作业的PID
-r  只列出运行中的作业
-s  只列出已停止的作业
```

```shell
$ jobs
[1]+ Stopped ./test10.sh
[2]- Running ./test10.sh > test10.out &
$ jobs -l
[1]+ 1897 Stopped ./test10.sh
[2]- 1917 Running ./test10.sh > test10.out &
```

带加号`+`的作业会被当做默认作业。带减号`-`的作业成为下一个默认作业。

下面例子说明了队列中的下一个作业在默认作业移除时是如何成为默认作业的。有3个独立的进程在后台被启动。 jobs 命令显示出了这些进程、进程的PID及其状态。注意，默认进程（带有加号的那个）是最后启动的那个进程，也就是3号作业。

```shell
$ ./test10.sh > test10a.out &
[1] 1950
$ ./test10.sh > test10b.out &
[2] 1952
$ ./test10.sh > test10c.out &
[3] 1955
$ jobs -l
[1] 1950 Running ./test10.sh > test10a.out &
[2]- 1952 Running ./test10.sh > test10b.out &
[3]+ 1955 Running ./test10.sh > test10c.out &
$ kill 1955
$ jobs -l
[1]- 1950 Running ./test10.sh > test10a.out &
[2]+ 1952 Running ./test10.sh > test10b.out &
$ kill 1952
$ jobs -l
[1]+ 1950 Running ./test10.sh > test10a.out &
```

**重启停止的作业**

要以后台模式重启一个作业，可用 bg n 命令加上作业号。

```shell
$ ./test11.sh
^Z
[1]+ Stopped ./test11.sh
$ bg
[1]+ ./test11.sh &
$ jobs
[1]+ Running ./test11.sh &
```

命令 bg 2 用于将第二个作业置于后台模式。注意，当使用 jobs 命令时，它列出了作业及其状态，即便是默认作业当前并未处于后台模式。

```shell
$ ./test11.sh
^Z
[1]+ Stopped ./test11.sh
$ ./test12.sh
^Z
[2]+ Stopped ./test12.sh
$ bg 2
[2]+ ./test12.sh &
$ jobs
[1]+ Stopped ./test11.sh
[2]- Running ./test12.sh &
```

要以前台模式重启作业，可用带有作业号的 fg 命令

```shell
$ fg 2
./test12.sh
This is the script's end...
```

### 调整谦让度 nice

调度优先级是个整数值，从 -20（最高优先级）到+19（最低优先级）。默认情况下，bash shell
以优先级0来启动所有进程

nice 命令允许你设置命令启动时的调度优先级。要让命令以更低的优先级运行，只要用 nice 的 -n 命令行来指定新的优先级级别。

```shell
$ nice -n 10 ./test4.sh > test4.out &
[1] 4973
$ ps -p 4973 -o pid,ppid,ni,cmd
PID PPID NI CMD
4973 4721 10 /bin/bash ./test4.sh
```

nice 命令会阻止普通系统用户来提高命令的优先级

```shell
$ nice -n -10 ./test4.sh > test4.out &
[1] 4985
$ nice: cannot set niceness: Permission denied
 [1]+ Done nice -n -10 ./test4.sh > test4.out
```

nice 命令的 -n 选项并不是必须的，只需要在破折号后面跟上优先级就行了.

```shell
$ nice -10 ./test4.sh > test4.out &
[1] 4993
$ ps -p 4993 -o pid,ppid,ni,cmd
PID PPID NI CMD
4993 4721 10 /bin/bash ./test4.sh
```

**renice**

有时你想改变系统上已运行命令的优先级。这正是 renice 命令可以做到的。它允许你指定运行进程的PID来改变它的优先级。

```shell
$ ./test11.sh &
[1] 5055
$ ps -p 5055 -o pid,ppid,ni,cmd
PID PPID NI CMD
5055 4721 0 /bin/bash ./test11.sh
$ renice -n 10 -p 5055
5055: old priority 0, new priority 10
$ ps -p 5055 -o pid,ppid,ni,cmd
PID PPID NI CMD
5055 4721 10 /bin/bash ./test11.sh
```

renice 命令会自动更新当前运行进程的调度优先级。和 nice 命令一样， renice 命令也有一些限制：

- 只能对属于你的进程执行 renice ；
- 只能通过 renice 降低进程的优先级；
- root用户可以通过 renice 来任意调整进程的优先级。

如果想完全控制运行进程，必须以root账户身份登录或使用 sudo 命令。

### 定时运行作业

#### at

`at` 命令会将作业提交到队列中，指定shell何时运行该作业。 at 的守护进程 atd 会以后台模式运行，检查作业队列来运行作业。大多数Linux发行版会在启动时运行此守护进程。

`atd` 守护进程会检查系统上的一个特殊目录（通常位于/var/spool/at）来获取用 at 命令提交的作业。默认情况下， atd 守护进程会每60秒检查一下这个目录。有作业时， atd 守护进程会检查作业设置运行的时间。如果时间跟当前时间匹配， atd 守护进程就会运行此作业。

*命令的格式:*

> at [-f filename] time
>
> 默认情况下， at 命令会将 STDIN 的输入放到队列中。
>
> `-f` 参数来指定用于读取命令（脚本文件）的文件名
>
> `time` 如果指定的时间已经错过， at 命令会在第二天的那个时间运行指定的作业。

*时间格式:*

- 标准的小时和分钟格式，比如10:15。
- AM/PM指示符，比如10:15 PM。
- 特定可命名时间，比如now、noon、midnight或者teatime（4 PM）。除了指定运行作业的时间，也可以通过不同的日期格式指定特定的日期。
- 标准日期格式，比如MMDDYY、MM/DD/YY或DD.MM.YY。
- 文本日期，比如Jul 4或Dec 25，加不加年份均可。
- 你也可以指定时间增量
  - 当前时间+25 min
  - 明天10:15 PM
  - 10:15+7 天

使用 at 命令时，该作业会被提交到作业队列（job queue）。作业队列会保存通过 at 命令提交的待处理的作业。针对不同优先级，存在26种不同的作业队列。作业队列通常用小写字母 `a~z` 和大写字母 `A~Z` 来指代。

作业队列的字母排序越高，作业运行的优先级就越低。默认情况下， at 的作业会被提交到 a 作业队列。如果想以更高优先级运行作业，可以用 -q 参数指定不同的队列字母。

**获取作业的输出**

重定向输出

```shell
#!/bin/bash

echo > zz.log
echo "at 定时执行任务: $(date +%F,%T)" >> zz.log
sleep 5
echo "脚本任务执行完成: $(date +%F,%T)" >> zz.log


[root@admin shell]# at -f demo6.sh now
job 12 at Fri Sep 16 13:05:00 2022
[root@admin shell]# cat zz.log
at 定时执行任务: 2022-09-16,13:05:49
[root@admin shell]# cat zz.log
at 定时执行任务: 2022-09-16,13:05:49
脚本任务执行完成: 2022-09-16,13:05:54
```

> 如果不想在 at 命令中使用邮件或重定向，最好加上 -M 选项来屏蔽作业产生的输出信息。

使用 e-mail 作为 at 命令的输出极其不便。使用 `sendmail` 应用程序来发送邮件。

yum -y install sendmail

**列出等待的作业 atq**

```shell
at -M -f demo6.sh teatime
at -M -f demo6.sh tomorrow
at -M -f demo6.sh 13:04
at -M -f demo6.sh now
atq
```

```shell
[root@admin shell]# at -M -f demo6.sh teatime
job 13 at Fri Sep 16 16:00:00 2022
[root@admin shell]# at -M -f demo6.sh tomorrow
job 14 at Sat Sep 17 13:07:00 2022
[root@admin shell]# at -M -f demo6.sh 13:04
job 15 at Sat Sep 17 13:04:00 2022
[root@admin shell]# at -M -f demo6.sh now
job 16 at Fri Sep 16 13:07:00 2022
[root@admin shell]# atq
9       Sat Sep 17 13:02:00 2022 a root
13      Fri Sep 16 16:00:00 2022 a root
14      Sat Sep 17 13:07:00 2022 a root
15      Sat Sep 17 13:04:00 2022 a root
16      Fri Sep 16 13:07:00 2022 = root
```

**删除作业 atrm**

```shell
[root@admin shell]# atq
9       Sat Sep 17 13:02:00 2022 a root
17      Fri Sep 16 16:00:00 2022 a root
18      Sat Sep 17 13:11:00 2022 a root
19      Sat Sep 17 13:04:00 2022 a root
20      Fri Sep 16 13:11:00 2022 = root
[root@admin shell]# atrm {17,19,18}
[root@admin shell]# atq
9       Sat Sep 17 13:02:00 2022 a root
```

#### cron

[在线表达式生成器](http://cron.ciding.cc/)

用 at 命令在预设时间安排脚本执行非常好用，但如果你需要脚本在每天的同一时间运行或是每周一次、每月一次呢？用不着再使用 at 不断提交作业了。

**cron时间表**

*格式如下：*

> 分钟 小时 日期值（N号） 月 周 【需要执行的命令】
>
> min hour dayofmonth month dayofweek command
>
> - dayofmonth 表项指定月份中的日期值（\*，1-31）
> - dayofweek（\*，mon、tue、wed、thu、fri、sat、sun）或数值（\*，0为周日，6为周六）来指定。

cron时间表允许你用特定值、取值范围（比如1~5）或者是通配符（星号\*）来指定条目。

例如：在每天的10:15运行一个命令

```shell
15 10 * * * command
```

在每周一4:15 PM运行

```shell
15 16 * * 1 command
```

在每个月的第一天中午12点执行命令

```shell
00 12 1 * * command
```

> **说明**  如何设置一个在每个月的最后一天执行的命令，因为你无法设置dayofmonth的值来涵盖所有的月份。这个问题困扰着Linux和Unix程序员，也激发了不少解决办法。常用的方法是加一条使用 date 命令的 if-then 语句来检查明天的日期是不是01：
>
> ```shell
> 00 12 * * * if [ ` date +%d -d tomorrow ` = 01 ] ; then ; command
> ```
>
> 它会在每天中午12点来检查是不是当月的最后一天，如果是，cron将会运行该命令。

命令列表必须指定要运行的命令或脚本的全路径名:

```shell
15 10 * * * /home/shell/test4.sh > test4out
```

#### crontab

**浏览cron目录**

```shell
ls /etc/cron.*ly
```

有4个基本目录：`hourly`、`daily`、`monthly` 和 `weekly`

因此，如果脚本需要每天运行一次，只要将脚本复制到daily目录，cron就会每天执行它，以此类推。

**常见示例**

```tex
（1）0/2 * * * * ?   表示每2秒 执行任务
（1）0 0/2 * * * ?    表示每2分钟 执行任务
（1）0 0 2 1 * ?   表示在每月的1日的凌晨2点调整任务
（2）0 15 10 ? * MON-FRI   表示周一到周五每天上午10:15执行作业
（3）0 15 10 ? 6L 2002-2006   表示2002-2006年的每个月的最后一个星期五上午10:15执行
（4）0 0 10,14,16 * * ?   每天上午10点，下午2点，4点 
（5）0 0/30 9-17 * * ?   朝九晚五工作时间内每半小时 
（6）0 0 12 ? * WED    表示每个星期三中午12点 
（7）0 0 12 * * ?   每天中午12点触发 
（8）0 15 10 ? * *    每天上午10:15触发 
（9）0 15 10 * * ?     每天上午10:15触发 
（10）0 15 10 * * ?    每天上午10:15触发 
（11）0 15 10 * * ? 2005    2005年的每天上午10:15触发 
（12）0 * 14 * * ?     在每天下午2点到下午2:59期间的每1分钟触发 
（13）0 0/5 14 * * ?    在每天下午2点到下午2:55期间的每5分钟触发 
（14）0 0/5 14,18 * * ?     在每天下午2点到2:55期间和下午6点到6:55期间的每5分钟触发
（15）0 0-5 14 * * ?    在每天下午2点到下午2:05期间的每1分钟触发 
（16）0 10,44 14 ? 3 WED    每年三月的星期三的下午2:10和2:44触发 
（17）0 15 10 ? * MON-FRI    周一至周五的上午10:15触发 
（18）0 15 10 15 * ?    每月15日上午10:15触发 
（19）0 15 10 L * ?    每月最后一日的上午10:15触发 
（20）0 15 10 ? * 6L    每月的最后一个星期五上午10:15触发 
（21）0 15 10 ? * 6L 2002-2005   2002年至2005年的每月的最后一个星期五上午10:15触发 
（22）0 15 10 ? * 6#3   每月的第三个星期五上午10:15触发
```

#### anacron

如果某个作业在cron时间表中安排运行的时间已到，但这时候Linux系统处于关机状态，那么这个作业就不会被运行。当系统开机时，cron程序不会再去运行那些错过的作业。要解决这个问题，许多Linux发行版还包含了anacron 程序。

这个功能常用于进行常规日志维护的脚本。

只会处理位于cron目录的程序，比如/etc/cron.monthly。它用时间戳来决定作业是否在正确的计划间隔内运行了。每个cron目录都有个时间戳文件，该文件位于/var/spool/anacron。

```shell
[root@admin shell]# cat /var/spool/anacron/cron.monthly
20220908
```

anacron程序使用自己的时间表（通常位于/etc/anacrontab）来检查作业目录

```shell
[root@admin shell]# cat /etc/anacrontab
# /etc/anacrontab: configuration file for anacron

# See anacron(8) and anacrontab(5) for details.

SHELL=/bin/sh
PATH=/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=root
# the maximal random delay added to the base delay of the jobs
RANDOM_DELAY=45
# the jobs will be started during the following hours only
START_HOURS_RANGE=3-22

#period in days   delay in minutes   job-identifier   command
1       5       cron.daily              nice run-parts /etc/cron.daily
7       25      cron.weekly             nice run-parts /etc/cron.weekly
@monthly 45     cron.monthly            nice run-parts /etc/cron.monthly
```

anacron时间表的基本格式和cron时间表略有不同：

> period delay identifier command

- period 条目定义了作业多久运行一次，以天为单位。anacron程序用此条目来检查作业的时间戳文件。
- delay 条目会指定系统启动后anacron程序需要等待多少分钟再开始运行错过的脚本。
- command 条目包含了run-parts程序和一个cron脚本目录名。run-parts程序负责运行目录中传给它的
  任何脚本。**注意** anacron不会运行位于/etc/cron.hourly的脚本。这是因为anacron程序不会处理执行时间
  需求小于一天的脚本。
- identifier 条目是一种特别的非空字符串，如 cron-weekly 。它用于唯一标识日志消息和错误邮件中的作业

#### 使用新 shell 启动脚本

回想一下当用户登入bash shell时需要运行的启动文件 *参见环境变量*。另外别忘了，不是所有的发行版中都包含这些启动文件。基本上，依照下列顺序所找到的第一个文件会被运行，其余的文件会被忽略：

- \$HOME/.bash_profil
- \$HOME/.bash_login
- \$HOME/.profile

因此，应该将需要在登录时运行的脚本放在上面第一个文件中。每次启动一个新shell时，bash shell都会运行.bashrc文件。可以这样来验证：在主目录下的.bashrc文件中加入一条简单的 echo 语句，然后启动一个新shell。

```shell
$ cat .bashrc
# .bashrc
# Source global definitions
if [ -f /etc/bashrc ]; then
. /etc/bashrc
fi
# User specific aliases and functions
echo "I'm in a new shell!"

$ bash
I'm in a new shell!
$ exit
exit
```
