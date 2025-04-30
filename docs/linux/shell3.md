---
icon: linux
title: Shell脚本编程-高级篇之基础
category: 
- Linux
# headerDepth: 5
date: 2022-09-12
star: true
tag:
- Linux
- Shell
---

shell脚本高级实战案例篇之【创建函数、图形化桌面脚本编程、正则表达式、使用其他 shell】

<!-- more -->

# Shell脚本编程高级篇之基础

## 创建函数

### 基本的脚本函数

#### 创建函数

```shell
#1
function  name {
 commands
}
#2
name () {
 commands
}
```

#### 使用函数

```shell
#!/bin/bash

count=1

function func1 {
    echo "# $count - This is an example of a function111"
}
func2 () {
    echo "# $count - This is an example of a function222"
}


while [ $count -le 5 ]
do
    func1
    count=$[ $count + 1 ]
done

while [ $count -ge 5 ] && [ $count -le 10 ]
do
    func2
    count=$[ $count + 1 ]
done
echo
echo "This is the end of the loop"
func1
echo
func2
echo "Now this is the end of the script"
```

```shell
[root@admin shell]# sh demo7.sh
# 1 - This is an example of a function111
# 2 - This is an example of a function111
# 3 - This is an example of a function111
# 4 - This is an example of a function111
# 5 - This is an example of a function111
# 6 - This is an example of a function222
# 7 - This is an example of a function222
# 8 - This is an example of a function222
# 9 - This is an example of a function222
# 10 - This is an example of a function222

This is the end of the loop
# 11 - This is an example of a function111

# 11 - This is an example of a function222
Now this is the end of the script
```

**注意** 如果在函数被定义前使用函数，你会收到一条错误消息

#### 返回值

**使用 $?**

```
echo
echo "The exit status is: $?"
```

```shell
[root@admin shell]# sh demo7.sh
The exit status is: 0
```

**使用 return**

```shell
function dbl {
    read -p "Enter a value: " value
    echo "doubling the value"
    return $[ $value * 2 ]
}
dbl
echo "The new value is $?"
```

```
[root@admin shell]# sh demo8.sh
Enter a value: 2
doubling the value
The new value is 4
```

但当用这种方法从函数中返回值时，要小心了。记住下面两条技巧来避免问题：

- 记住，函数一结束就取返回值；
- 记住，退出状态码必须是 `0~255`。

>如果在用 `$?` 变量提取函数返回值之前执行了其他命令，函数的返回值就会丢失。记住，`$?` 变量会返回执行的最后一条命令的退出状态码。
>
>第二个问题界定了返回值的取值范围。由于退出状态码必须小于256，函数的结果必须生成一个小于256的整数值。任何大于256的值都会产生一个错误值。

**使用函数输出**

`result=$(dbl)` 这个命令会将 dbl 函数的输出`echo`赋给 $result 变量

```shell
#!/bin/bash

function dbl {
    read -p "Enter a value: " value
    echo $[ $value * 2 ]
    echo 6666
}
result=$(dbl)
echo "The new value is $result"
```

```
[root@admin shell]# sh demo9.sh
Enter a value: 200
The new value is 400
6666
```

---

**说明** 通过这种技术，你还可以返回浮点值和字符串值。这使它成为一种获取函数返回值的强大方法。

---

#### 在函数中使用变量

**向函数传递参数**

```shell
#!/bin/bash

function addem {
    if [ $# -eq 0 ] || [ $# -gt 2 ]; then
     echo 0个或大于2个参数
    elif [ $# -eq 1 ]; then
     echo $[ $1 + $1 ]
    else
     echo $[ $1 * $2 ]
    fi
}

echo -n "传入 10 15 "
value=$(addem 10 15)
echo 返回：$value
echo
echo -n "传入 10 "
value=$(addem 10)
echo 返回：$value
echo
echo -n "无参数 "
value=$(addem)
echo 返回：$value
echo
echo -n "传入 10 15 20 "
value=$(addem 10 15 20)
echo 返回：$value
echo
```

```
[root@admin shell]# sh demo10.sh
传入 10 15 返回：150

传入 10 返回：20

无参数 返回：0个或大于2个参数

传入 10 15 20 返回：0个或大于2个参数
```

由于函数使用特殊参数环境变量作为自己的参数值，因此它无法直接获取脚本在命令行中的参数值。下面的例子将会运行失败。尽管函数也使用了 $1 和 $2 变量，但它们和脚本主体中的 $1 和 $2 变量并不相同。要在函数中使用这些值，必须在调用函数时手动将它们传过去.。

```shell
#!/bin/bash

function badfunc1 {
    echo $[ $1 * $2 ]
}

echo $@
echo

if [ $# -eq 2 ]; then
    value=$(badfunc1)
    echo "The result is $value"
elif [ $# -eq 3 ]; then
    value=$(badfunc1 $1 $2)
    echo "The result is $value"
else
    echo "Usage: badtest1 a b"
fi
```

```
[root@admin shell]# sh demo11.sh 12 2
12 2

demo11.sh:行4: *  : 语法错误: 期待操作数 （错误符号是 "*  "）
The result is
[root@admin shell]# sh demo11.sh 12 2 21
12 2 21

The result is 24
```

**在函数中处理变量**

- 全局变量

```shell
function dbl {
    value=$[ $value * 2 ]
    echo 函数内：$value
}
read -p "输入一个值: " value
dbl
echo "函数外: $value"
```

```shell
[root@admin shell]# sh demo12.sh
输入一个值: 12
函数内：24
函数外: 24
```

\$value 变量在函数外定义并被赋值。当 dbl 函数被调用时，该变量及其值在函数中都依然有效。如果变量在函数内被赋予了新值，那么在脚本中引用该变量时，新值也依然有效。

```shell
function func1 {
    temp=$[ $value + 5 ]
    result=$[ $temp * 2 ]
}

temp=4
value=6

func1
echo "temp = $temp"
echo "result = $result"
if [ $temp -gt $value ]; then
    echo "temp is 大"
else
    echo "temp is 小"
fi
```

```shell
[root@admin shell]# sh demo12.sh
temp = 11
result = 22
temp is 大
```

由于函数中用到了 \$temp 变量，它的值在脚本中使用时受到了影响，产生了意想不到的后果。有个简单的办法可以在函数中解决这个问题，下面将会介绍

- 局部变量 local

```shell
function func1 {
    local temp=$[ $value + 5 ]
    result=$[ $temp * 2 ]
}

temp=4
value=6

func1
echo "temp = $temp"
echo "result = $result"
if [ $temp -gt $value ]; then
    echo "temp is 大"
else
    echo "temp is 小"
fi
```

local 关键字保证了变量只局限在该函数中。如果脚本中在该函数之外有同样名字的变量，那么shell将会保持这两个变量的值是分离的。

#### 数组变量和函数

**向函数传数组参数**

```shell
function testit {
    echo "The parameters are: $@"
    thisarray=$1
    echo "The received array is ${thisarray[*]}"
}
myarray=(1 2 3 4 5)
echo "The original array is: ${myarray[*]}"
testit $myarray

#####变化
function testit {
    local newarray
    newarray=(;'echo "$@"')
    echo "The new array value is: ${newarray[*]}"
}
myarray=(1 2 3 4 5)
echo "The original array is ${myarray[*]}"
testit ${myarray[*]}
```

```shell
The original array is: 1 2 3 4 5
The parameters are: 1
The received array is 1
#####变化后
The original array is 1 2 3 4 5
The new array value is: 1 2 3 4 5
```

在函数内部，数组仍然可以像其他数组一样使用

```shell
function addarray {
    local sum=0
    local newarray
    newarray=($(echo "$@"))
    for value in ${newarray[*]}
    do
        sum=$[ $sum + $value ]
    done
    echo $sum
}
myarray=(1 2 3 4 5)
echo "The original array is: ${myarray[*]}"
arg1=$(echo ${myarray[*]})
result=$(addarray $arg1)
echo "The result is $result"
```

```
The original array is: 1 2 3 4 5
The result is 15
```

addarray 函数会遍历所有的数组元素，将它们累加在一起。你可以在 myarray 数组变量中放置任意多的值， addarry 函数会将它们都加起来。

**从函数返回数组**

```shell
function arraydblr {
    local origarray
    local newarray
    local elements
    local i
    origarray=($(echo "$@"))
    newarray=($(echo "$@"))
    elements=$[ $# - 1 ]
    for (( i = 0; i <= $elements; i++ )) {
        newarray[$i]=$[ ${origarray[$i]} * 2 ]
    }
    echo ${newarray[*]}
}
myarray=(1 2 3 4 5)
echo "The original array is: ${myarray[*]}"
arg1=$(echo ${myarray[*]})
result=($(arraydblr $arg1))
echo "The new array is: ${result[*]}"
```

```
The original array is: 1 2 3 4 5
The new array is: 2 4 6 8 10
```

#### 函数递归

函数可以调用自己来得到结果。通常递归函数都有一个最终可以迭代到的基准值。许多高级数学算法用递归对复杂的方程进行逐级规约，直到基准值定义的那级。

递归算法的经典例子是计算阶乘。一个数的阶乘是该数之前的所有数乘以该数的值。因此，要计算5的阶乘，可以执行如下方程：

> 5! = 1 *2* 3 *4* 5 = 120

使用递归，方程可以简化成以下形式：

> x! = x * (x-1)!

也就是说，x的阶乘等于x乘以x1的阶乘。这可以用简单的递归脚本表达为：

```shell
function factorial {
    if [ $1 -eq 1 ]; then
        echo 1
    else
        local temp=$[ $1 - 1 ]
        local result='factorial $temp'
        echo $[ $result * $1 ]
    fi
}
read -p "Enter value: " value
result=$(factorial $value)
echo "The factorial of $value is: $result"
```

```
Enter value: 5
The factorial of 5 is: 120
```

#### 创建库 source

 source 命令会在当前shell上下文中执行命令，而不是创建一个新shell。可以用 source 命令来在shell脚本中运行库文件脚本。

第一步是创建一个包含脚本中所需函数的公用库文件

```
function addem {
    echo $[ $1 + $2 ]
}
function multem {
    echo $[ $1 * $2 ]
}
function divem {
    if [ $2 -ne 0 ]; then
        echo $[ $1 / $2 ]
    else
        echo -1
    fi
}
```

```shell
#!/bin/bash

. ./myfuncs

value1=10
value2=5

result1=$(addem $value1 $value2)
result2=$(multem $value1 $value2)
result3=$(divem $value1 $value2)

echo "The result of adding them is: $result1"
echo "The result of multiplying them is: $result2"
echo "The result of dividing them is: $result3"
```

```
The result of adding them is: 15
The result of multiplying them is: 50
The result of dividing them is: 2
```

#### 在命令行上使用函数

- 一种方法是采用单行方式定义函数

```shell
[root@admin shell]# function divem { echo $[ $1 / $2 ]; }
[root@admin shell]# divem 66 3
22
```

- 另一种方法是采用多行方式来定义函数

```shell
[root@admin shell]# function multem {
> echo $[ $1 * $2 ]
> }
[root@admin shell]# multem 12 2
24
```

**在.bashrc 文件中定义函数**

最佳地点就是.bashrc文件。bash shell在每次启动时都会在主目录下查找这个文件，不管是交互式shell还是从现有shell中启动的新shell。

- 直接定义函数

```shell
# .bashrc
# Source global definitions
if [ -r /etc/bashrc ]; then
    . /etc/bashrc
fi
function addem {
    echo $[ $1 + $2 ]
}
```

- 读取函数文件

只要是在shell脚本中，都可以用 source 命令（或者它的别名点操作符）将库文件中的函数添加到你的.bashrc脚本中。

```shell
# .bashrc
# Source global definitions
if [ -r /etc/bashrc ]; then
    . /etc/bashrc
fi

. /home/shell/libraries/myfuncs
```

要确保库文件的路径名正确，以便bash shell能够找到该文件。下次启动shell时，库中的所有函数都可在命令行界面下使用了。

```
$ addem 10 5
15
$ multem 10 5
50
$ divem 10 5
2
```

### shtool函数库使用示例

#### 下载与安装

```
yum install shtool
```

#### 构建库

```shell
./confifgure
make
make install
```

configure 命令会检查构建shtool库文件所必需的软件。一旦发现了所需的工具，它会使用工具路径修改配置文件。

make 命令负责构建shtool库文件。最终的结果（ shtool ）是一个完整的库软件包。

要完成安装，需要使用 make 命令的 install 选项。

#### shtool 库函数

```
函 数   描 述
Arx   创建归档文件（包含一些扩展功能）
Echo  显示字符串，并提供了一些扩展构件
fixperm  改变目录树中的文件权限
install  安装脚本或文件
mdate  显示文件或目录的修改时间
mkdir  创建一个或更多目录
Mkln  使用相对路径创建链接
mkshadow  创建一棵阴影树
move  带有替换功能的文件移动
Path  处理程序路径
platform  显示平台标识
Prop  显示一个带有动画效果的进度条
rotate  转置日志文件
Scpp  共享的C预处理器
Slo   根据库的类别，分离链接器选项
Subst  使用sed的替换操作
Table  以表格的形式显示由字段分隔（field-separated）的数据
tarball  从文件和目录中创建tar文件
version  创建版本信息文件
```

每个shtool函数都包含大量的选项和参数，你可以利用它们改变函数的工作方式。下面是 shtool函数的使用格式：

> shtool [options] [function [options] [args]]

#### 使用库

可以在命令行或自己的shell脚本中直接使用shtool函数。下面是一个在shell脚本中使用 platform 函数的例子。

```shell
$ cat test16
#!/bin/bash
shtool platform
$ ./test16
centos 7.9.2009 (AMD64)
```

```
ls –al /usr/bin | shtool prop –p "waiting..."
```

## 图形化桌面环境中的脚本编程

### 创建文本菜单

### 创建文本窗口部件

### 添加X Window图形

## 正则表达式

### 正则表达式的类型

正则表达式是通过正则表达式引擎（regular expression engine）实现的。正则表达式引擎是一套底层软件，负责解释正则表达式模式并使用这些模式进行文本匹配。
在Linux中，有两种流行的正则表达式引擎：

- POSIX基础正则表达式（basic regular expression，BRE）引擎
- POSIX扩展正则表达式（extended regular expression，ERE）引擎

大多数Linux工具都至少符合POSIX BRE引擎规范，能够识别该规范定义的所有模式符号。遗憾的是，有些工具（比如sed编辑器）只符合了BRE引擎规范的子集。这是出于速度方面的考虑导致的，因为sed编辑器希望能尽可能快地处理数据流中的文本。

POSIX BRE引擎通常出现在依赖正则表达式进行文本过滤的编程语言中。它为常见模式提供了高级模式符号和特殊符号，比如匹配数字、单词以及按字母排序的字符。gawk程序用ERE引擎来处理它的正则表达式模式。

---

**警告** 记住，sed编辑器和gawk程序的正则表达式引擎之间是有区别的。gawk程序可以使用大多数扩展正则表达式模式符号，并且能提供一些额外过滤功能，而这些功能都是sed编辑器所不具备的。但正因为如此，gawk程序在处理数据流时通常才比较慢。

---

### 基础正则表达式 BRE

#### 纯文本

在sed编辑器和gawk程序中用标准文本字符串来过滤数据：

```shell
[root@admin shell]# echo "This is a test" | sed -n '/test/p'
This is a test
[root@admin shell]# echo "This is a test" | sed -n '/trial/p'
[root@admin shell]# echo "This is a test" | gawk '/test/{print $0}'
This is a test
[root@admin shell]# echo "This is a test" | gawk '/trial/{print $0}'
```

> 第一个模式定义了一个单词test。sed编辑器和gawk程序脚本用它们各自的 print 命令打印出匹配该正则表达式模式的所有行。由于 echo 语句在文本字符串中包含了单词test，数据流文本能够匹配所定义的正则表达式模式，因此sed编辑器显示了该行。
>
> 第二个模式也定义了一个单词，这次是trial。因为 echo 语句文本字符串没包含该单词，所以正则表达式模式没有匹配，因此sed编辑器和gawk程序都没打印该行。

第一条原则就是：正则表达式模式都区分大小写。这意味着它们只会匹配大小写也相符的模式。

```shell
[root@admin shell]# echo "This is a test" | sed -n '/this/p'
[root@admin shell]# echo "This is a test" | sed -n '/This/p'
This is a test
```

---

```shell
[root@admin shell]# echo "The books are expensive" | sed -n '/book/p'
The books are expensive
[root@admin shell]# echo "The book is expensive" | sed -n '/books/p
```

可以在正则表达式中使用空格和数字。

```shell
[root@admin shell]# echo "This is line number 1" | sed -n '/ber 1/p'
This is line number 1
[root@admin shell]# echo "This is line number1" | sed -n '/ber 1/p'
```

```shell
[root@admin shell]# cat data1
Thisisanormallineoftext.
This is a line with too many spaces. 
[root@admin shell]# sed -n '/ /p' data1
This is a line with too many spaces.
```

#### 特殊字符

> - `.` `*` `[]` `^` `$` `{}` `\` `/` `+` `?` `|` `()`

用某个特殊字符作为文本字符，就必须转义。

```shell
[root@admin shell]# cat data2
The cost is $4.00
sdfs oioijk 6846
[root@admin shell]# sed -n '/\$/p' data2
The cost is $4.00

[root@admin shell]# echo "\ is a special character" | sed -n '/\\/p'
\ is a special character

[root@admin shell]# echo "3 / 2" | sed -n '///p'
sed: -e expression #1, char 2: No previous regular expression

[root@admin shell]# echo "3 / 2" | sed -n '/\//p'
3 / 2
```

#### 锚字符 ^$

- 锁定在行首 `^`

```shell
[root@admin shell]# echo "The book store" | sed -n '/^book/p'

[root@admin shell]# echo "Books are great" | sed -n '/^Book/p'
Books are great

[root@admin shell]# cat data3
This is a test line.
this is another test line.
A line that tests this feature.
Yet more testing of this
[root@admin shell]# sed -n '/^this/p' data3
this is another test line.

[root@admin shell]# echo "This ^ is a test" | sed -n '/s ^/p'
This ^ is a test
```

- 锁定在行尾 `$`

```shell
[root@admin shell]# echo "This is a good book" | sed -n '/book$/p'
This is a good book
[root@admin shell]# echo "This book is good" | sed -n '/book$/p'
[root@admin shell]# echo "There are a lot of good books" | sed -n '/book$/p'
```

- 组合使用

```shell
[root@admin shell]# cat data4
this is a test of using both anchors
I said this is a test
this is a test
I'm sure this is a test.
[root@admin shell]# sed -n '/^this is a test$/p' data4
this is a test
[root@admin shell]# sed -n '/^this is test$/p' data4
[root@admin shell]# sed -n '/^this test$/p' data4
```

过滤出数据流中的空白行

```shell
[root@admin shell]# cat data5
This is one test line.

This is another test line.
[root@admin shell]# sed '/^$/d' data5
This is one test line.
This is another test line.
```

#### 点号字符

`.` 用来匹配除换行符之外的 **任意单个字符**。它必须匹配一个字符，如果在点号字符的位置没有字符，那么模式就不成立。

```shell
[root@admin shell]# cat data6
This is a test of a line.
The cat is sleeping.
That is a very nice hat.
This test is at line four.
at ten o'clock we'll go home.

[root@admin shell]# sed -n '/.at/p' data6
The cat is sleeping.
That is a very nice hat.
This test is at line four.
```

在正则表达式中，空格也是字符，因此 at 前面的空格刚好匹配了该模式。第五行证明了这点，将 at 放在行首就不
会匹配该模式了。

#### 字符组 []

可以定义用来匹配文本模式中某个位置的一组字符。如果字符组中的某个字符出现在了数据流中，那它就匹配了该模式。

```shell
[root@admin shell]# cat data6
This is a test of a line.
The cat is sleeping.
That is a very nice hat.
This test is at line four.
at ten o'clock we'll go home.
[root@admin shell]# sed -n '/[ch]at/p' data6
The cat is sleeping.
That is a very nice hat.
[root@admin shell]# echo "Yes" | sed -n '/[Yy]es/p'
Yes
[root@admin shell]# echo "yes" | sed -n '/[Yy]es/p'
yes
[root@admin shell]# echo "Yes" | sed -n '/[Yy][Ee][Ss]/p'
Yes
[root@admin shell]# echo "yEs" | sed -n '/[Yy][Ee][Ss]/p'
yEs
[root@admin shell]# echo "yeS" | sed -n '/[Yy][Ee][Ss]/p'
yeS
```

还可以是数字

```shell
[root@admin shell]# cat data7
This line doesn't contain a number.
This line has 1 number on it.
This line a number 2 on it.
This line has a number 4 on it.

[root@admin shell]# sed -n '/[0123]/p' data7
This line has 1 number on it.
This line a number 2 on it.
```

邮编验证

```shell
[root@admin shell]# cat data8
60633
46201
223001
556400
4353
22203
[root@admin shell]# $ sed -n '/^[0123456789][0123456789][0123456789][0123456789][0123456789]$/p' data8
60633
46201
22203
```

```shell
[root@admin shell]# cat data9
I need to have some maintenence done on my car.
I'll pay that in a seperate invoice.
After I pay for the maintenance my car will be as good as new.

[root@admin shell]# sed -n '/maint[ea]n[ae]nce/p/sep[ea]r[ea]te/p' data9
I need to have some maintenence done on my car.
I'll pay that in a seperate invoice.
After I pay for the maintenance my car will be as good as new.
```

本例中的两个 sed 打印命令利用正则表达式字符组来帮助找到文本中拼错的单词 `maintenance` 和 `separate`。同样的正则表达式模式也能匹配正确拼写的 `maintenance`。

#### 排除型字符组

只要在字符组的开头加个脱字符

```shell
sed -n /[^ab]ops/p data
```

#### 区间

```shell
sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p' data8
60633
46201
45902

sed -n '/[0-9][a-z]ops/p' data
sed -n '/[a-ch-m]at/p' data6
The cat is sleeping.
That is a very nice hat.
echo "a8392" | sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p'
echo "1839a" | sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p
echo "18a92" | sed -n '/^[0-9][0-9][0-9][0-9][0-9]$/p'
```

#### 特殊的字符组

```tex
组      描 述
[[:alpha:]]  匹配任意字母字符，不管是大写还是小写
[[:alnum:]]  匹配任意字母数字字符0~9、A~Z或a~z
[[:blank:]]  匹配空格或制表符
[[:digit:]]  匹配0~9之间的数字
[[:lower:]]  匹配小写字母字符a~z
[[:print:]]  匹配任意可打印字符
[[:punct:]]  匹配标点符号
[[:space:]]  匹配任意空白字符：空格、制表符、NL、FF、VT和CR
[[:upper:]]  匹配任意大写字母字符A~Z
```

```shell
echo "abc" | sed -n '/[[:digit:]]/p'
echo "abc" | sed -n '/[[:alpha:]]/p'
abc
echo "abc123" | sed -n '/[[:digit:]]/p'
abc123
echo "This is, a test" | sed -n '/[[:punct:]]/p'
This is, a test
echo "This is a test" | sed -n '/[[:punct:]]/p'
```

#### 星号

在字符后面放置星号表明该字符必须在匹配模式的文本中出现0次或多次。

这个模式符号广泛用于处理有常见拼写错误或在不同语言中有拼写变化的单词。

```shell
echo "ik" | sed -n '/ie*k/p'
ik
$ echo "iek" | sed -n '/ie*k/p'
iek
$ echo "ieek" | sed -n '/ie*k/p'
ieek
$ echo "ieeek" | sed -n '/ie*k/p'
ieeek
```

写个可能用在美式或英式英语中的脚本，模式中的 u* 表明字母u可能出现或不出现在匹配模式的文本中。

```shell
echo "I'm getting a color TV" | sed -n '/colou*r/p'
I'm getting a color TV
echo "I'm getting a colour TV" | sed -n '/colou*r/p'
I'm getting a colour TV

echo "I ate a potatoe with my lunch." | sed -n '/potatoe*/p'
I ate a potatoe with my lunch.
echo "I ate a potato with my lunch." | sed -n '/potatoe*/p'
I ate a potato with my lunch.
```

将点号特殊字符和星号特殊字符组合起来。这个组合能够匹配任意数量的任意字符。它通常用在数据流中两个可能相邻或不相邻的文本字符串之间。

```shell
echo "this is a regular pattern expression" | sed -n '/regular.*expression/p'
this is a regular pattern expression
```

星号还能用在字符组上。它允许指定可能在文本中出现多次的字符组或字符区间。

```shell
echo "bt" | sed -n '/b[ae]*t/p'
bt
echo "bat" | sed -n '/b[ae]*t/p'
bat
echo "bet" | sed -n '/b[ae]*t/p'
bet
echo "btt" | sed -n '/b[ae]*t/p'
btt
echo "baat" | sed -n '/b[ae]*t/p'
baat
echo "baaeeet" | sed -n '/b[ae]*t/p'
baaeeet
echo "baeeaeeat" | sed -n '/b[ae]*t/p'
baeeaeeat
echo "baakeeet" | sed -n '/b[ae]*t/p'
```

### 扩展正则表达式 ERE

`gawk`程序能够识别 `ERE` 模式，但 `sed` 编辑器不能。

#### 问号

问号表明前面的字符可以出现 **0次或1次**，它不会匹配多次出现的字符。

```shell
echo "bt" | gawk '/be?t/{print $0}'
bt
echo "bet" | gawk '/be?t/{print $0}'
bet
echo "beet" | gawk '/be?t/{print $0}'
echo "beeet" | gawk '/be?t/{print $0}'
echo "bt" | gawk '/b[ae]?t/{print $0}'
bt
echo "bat" | gawk '/b[ae]?t/{print $0}'
bat
echo "bot" | gawk '/b[ae]?t/{print $0}'
echo "bet" | gawk '/b[ae]?t/{print $0}'
bet
echo "baet" | gawk '/b[ae]?t/{print $0}'
echo "beat" | gawk '/b[ae]?t/{print $0}'
echo "beet" | gawk '/b[ae]?t/{print $0}'
```

如果字符组中的字符出现了0次或1次，模式匹配就成立。但如果两个字符都出现了，或者其中一个字符出现了2次，模式匹配就不成立。

#### 加号

加号表明前面的字符可以出现 **1次或多次**，但 **必须至少出现1次**。如果该字符没有出现，那么模式就不会匹配。

```shell
echo "beeet" | gawk '/be+t/{print $0}'
beeet
echo "beet" | gawk '/be+t/{print $0}'
beet
echo "bet" | gawk '/be+t/{print $0}'
bet
echo "bt" | gawk '/be+t/{print $0}'
```

这次如果字符组中定义的任一字符出现了，文本就会匹配指定的模式。

```shell
echo "bt" | gawk '/b[ae]+t/{print $0}'
echo "bat" | gawk '/b[ae]+t/{print $0}'
bat
echo "bet" | gawk '/b[ae]+t/{print $0}'
bet
echo "beat" | gawk '/b[ae]+t/{print $0}'
beat
echo "beet" | gawk '/b[ae]+t/{print $0}'
beet
echo "beeat" | gawk '/b[ae]+t/{print $0}'
beeat
```

#### 花括号

ERE中的花括号允许你为可重复的正则表达式指定一个上限。这通常称为间隔（interval）。

可以用两种格式来指定区间。

- m ：正则表达式准确出现 m 次。
- m, n ：正则表达式至少出现 m 次，至多 n 次。

这个特性可以精确调整字符或字符集在模式中具体出现的次数。

---

**警告** 默认情况下，gawk程序不会识别正则表达式间隔。必须指定gawk程序的 `--re- interval` 命令行选项才能识别正则表达式间隔

---

```shell
echo "bt" | gawk --re-interval '/be{1}t/{print $0}'
echo "bet" | gawk --re-interval '/be{1}t/{print $0}'
bet
echo "beet" | gawk --re-interval '/be{1}t/{print $0}'
echo "beet" | gawk --re-interval '/be{1}t/{print $0}'
beet
```

```shell
echo "bt" | gawk --re-interval '/be{1,2}t/{print $0}'
echo "bet" | gawk --re-interval '/be{1,2}t/{print $0}'
bet
echo "beet" | gawk --re-interval '/be{1,2}t/{print $0}'
beet
echo "beeet" | gawk --re-interval '/be{1,2}t/{print $0}'
```

```shell
echo "bt" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
echo "bat" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
bat
echo "bet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
bet
echo "beat" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
beat
echo "beet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
beet
echo "beeat" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
echo "baeet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
echo "baeaet" | gawk --re-interval '/b[ae]{1,2}t/{print $0}'
```

字母a或e在文本模式中只出现了1~2次，则正则表达式模式匹配；否则，模式匹配失败

#### 管道符号

管道符号允许你在检查数据流时，用逻辑 OR 方式指定正则表达式引擎要用的两个或多个模式。如果任何一个模式匹配了数据流文本，

```shell
echo "The cat is asleep" | gawk '/cat|dog/{print $0}'
The cat is asleep
echo "The dog is asleep" | gawk '/cat|dog/{print $0}'
The dog is asleep
echo "The sheep is asleep" | gawk '/cat|dog/{print $0}'
echo "He has a hat." | gawk '/[ch]at|dog/{print $0}'
He has a hat.
```

#### 表达式分组-圆括号

当你将正则表达式模式分组时，该组会被视为一个标准字符。可以像对普通字符一样给该组使用特殊字符。

```shell
echo "Sat" | gawk '/Sat(urday)?/{print $0}'
Sat
echo "Saturday" | gawk '/Sat(urday)?/{print $0}'
Saturday
```

结尾的 urday 分组以及问号，使得模式能够匹配完整的 Saturday 或缩写 Sat

将分组和管道符号一起使用

```shell
echo "cat" | gawk '/(c|b)a(b|t)/{print $0}'
cat
echo "cab" | gawk '/(c|b)a(b|t)/{print $0}'
cab
echo "bat" | gawk '/(c|b)a(b|t)/{print $0}'
bat
echo "bab" | gawk '/(c|b)a(b|t)/{print $0}'
bab
echo "tab" | gawk '/(c|b)a(b|t)/{print $0}'
echo "tac" | gawk '/(c|b)a(b|t)/{print $0}'
```

### 正则表达式实例

#### \$PATH目录文件计数

首先你得将 PATH 变量解析成单独的目录名

> echo $PATH
> /usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/root/bin

用空格来替换冒号

> echo $PATH | sed 's/:/ /g'
>
> /usr/local/sbin /usr/local/bin /usr/sbin /usr/bin /root/bin

使用标准 for 语句中来遍历每个目录

```shell
#!/bin/bash

mypath=$(echo $PATH | sed 's/:/ /g')
count=0
for directory in $mypath
do
    check=$(ls $directory)
    for item in $check
    do
        count=$[ $count + 1 ]
    done
    echo "$directory - $count"
    count=0
done
```

```shell
[root@admin shell]# sh demo13.sh
/usr/local/sbin - 0
/usr/local/bin - 0
/usr/sbin - 832
/usr/bin - 1524
ls: 无法访问/root/bin: 没有那个文件或目录
/root/bin - 0
```

#### 验证电话号码

电话号码有几种常见的形式：

- (123)456-7890
- (123) 456-789
- 123-456-7890
- 123.456.7890

电话号码中可能有也可能没有左圆括号。这可以用如下模式来匹配：

```
^\(?
```

脱字符用来表明数据的开始。由于左圆括号是个特殊字符，因此必须将它转义成普通字符。问号表明左圆括号可能出现，也可能不出现。紧接着就是3位区号。在美国，区号以数字2开始（没有以数字0或1开始的区号），最大可到9。要匹配区号，可以用如下模式。

```
[2-9][0-9]{2}
```

这要求第一个字符是2~9的数字，后跟任意两位数字。在区号后面，收尾的右圆括号可能存在，也可能不存在。

```
\)
```

在区号后，存在如下可能：有一个空格，没有空格，有一条单破折线或一个点。你可以对它们使用管道符号，并用圆括号进行分组

```
(| |-|\.)
```

第一个管道符号紧跟在左圆括号后，用来匹配没有空格的情形。你必须将点字符转义，否则它会被解释成可匹配任意字符。紧接着是3位电话交换机号码。这里没什么需要特别注意的。

```
[0-9]{3}
```

在电话交换机号码之后，你必须匹配一个空格、一条单破折线或一个点（这次不用考虑匹配没有空格的情况，因为在电话交换机号码和其余号码间必须有至少一个空格）。

```
( |-|\.)
```

最后，必须在字符串尾部匹配4位本地电话分机号。

```
[0-9]{4}$
```

完整的模式如下。

```
^\(?[2-9][0-9]{2}\)?(| |-|\.)[0-9]{3}( |-|\.)[0-9]{4}$
```

```shell
cat isphone
#!/bin/bash
gawk --re-interval '/^\(?[2-9][0-9]{2}\)?(| |-|\¬[0-9]{3}( |-|\.)[0-9]{4}/{print $0}'
```

```shell
echo "317-555-1234" | ./isphone
317-555-1234
echo "000-555-1234" | ./isphone
echo "312 555-1234" | ./isphone
312 555-1234
```

```shell
cat phonelist
000-000-0000
123-456-7890
212-555-1234
(317)555-1234
(202) 555-9876
33523
1234567890
234.123.4567

$ cat phonelist | ./isphone
212-555-1234
(317)555-1234
(202) 555-9876
234.123.4567
```

#### 解析邮件地址

邮件地址的基本格式为：

> username@hostname

username 值可用字母数字字符以及以下特殊字符：

- 点号
- 单破折线
- 加号
- 下划线

在有效的邮件用户名中，这些字符可能以任意组合形式出现。邮件地址的 hostname 部分由一个或多个域名和一个服务器名组成。服务器名和域名也必须遵照严格的命名规则，只允许字母数字字符以及以下特殊字符：

- 点号
- 下划线

服务器名和域名都用点分隔，先指定服务器名，紧接着指定子域名，最后是后面不带点号的顶级域名。
顶级域名的数量在过去十分有限，正则表达式模式编写者会尝试将它们都加到验证模式中。然而遗憾的是，随着互联网的发展，可用的顶级域名也增多了。这种方法已经不再可行。从左侧开始构建这个正则表达式模式。我们知道，用户名中可以有多个有效字符。这个相当容易。

```
^([a-zA-Z0-9_\-\.\+]+) @
```

这个分组指定了用户名中允许的字符，加号表明必须有至少一个字符。下一个字符很明显是@ ，没什么意外的。
hostname 模式使用同样的方法来匹配服务器名和子域名。

```
([a-zA-Z0-9_\-\.]+)
```

这个模式可以匹配文本。

```
server
server.subdomain
server.subdomain.subdomain
```

对于顶级域名，有一些特殊的规则。顶级域名只能是字母字符，必须不少于二个字符（国家
或地区代码中使用），并且长度上不得超过五个字符。下面就是顶级域名用的正则表达式模式。

```
\.([a-zA-Z]{2,5})$
```

将整个模式放在一起会生成如下模式。

```shell
^([a-zA-Z0-9_\-\.\+]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$
```

```shell
echo "demo@here.now" | ./isemail
demo@here.now
$ echo "demo@here.now." | ./isemail
$
$ echo "demo@here.n" | ./isemail
$
$ echo "demo@here-now" | ./isemail
$
$ echo "demo.blum@here.now" | ./isemail
demo.blum@here.now
$ echo "rich_blum@here.now" | ./isemail
rich_blum@here.now
$ echo "demo/blum@here.now" | ./isemail
$
$ echo "demo#blum@here.now" | ./isemail
$
$ echo "demo*blum@here.now" | ./isemail
```

## 使用其他 shell

### 理解dash shell

### dash shell脚本编程

### zsh shell介绍

### zsh脚本编程
