---
icon: linux
title: Shell脚本编程-高级篇之gawk
category: 
- Linux
headerDepth: 5
date: 2022-09-12
star: true
tag:
- Linux
- Shell
---

shell脚本高级实战案例篇之Gawk

<!-- more -->

# Shell脚本编程-高级篇之gawk


## gawk

虽然sed编辑器是非常方便自动修改文本文件的工具，但其也有自身的限制。通常你需要一个用来处理文件中的数据的更高级工具，它能提供一个类编程环境来修改和重新组织文件中的数据。这正是gawk能够做到的。

---

**说明**  在所有的发行版中都没有默认安装gawk程序。如果你所用的Linux发行版中没有包含gawk.

---

gawk程序是Unix中的原始awk程序的GNU版本。gawk程序让流编辑迈上了一个新的台阶，它提供了一种编程语言而不只是编辑器命令。在gawk编程语言中，你可以做下面的事情：

- 定义变量来保存数据；
- 使用算术和字符串操作符来处理数据；
- 使用结构化编程概念（比如 if-then 语句和循环）来为数据处理增加处理逻辑；
- 通过提取数据文件中的数据元素，将其重新排列或格式化，生成格式化报告。

gawk程序的报告生成能力通常用来从大文本文件中提取数据元素，并将它们格式化成可读的
报告。其中最完美的例子是格式化日志文件。在日志文件中找出错误行会很难，gawk程序可以让
你从日志文件中过滤出需要的数据元素，然后你可以将其格式化，使得重要的数据更易于阅读。

### 基础

gawk命令格式

> gawk options program file

```tex
选 项    描 述
-F fs  指定行中划分数据字段的字段分隔符
-f file  从指定的文件中读取程序
-v var=value  定义gawk程序中的一个变量及其默认值
-mf N  指定要处理的数据文件中的最大字段数
-mr N  指定数据文件中的最大数据行数
-W keyword  指定gawk的兼容模式或警告等级
```

#### 从命令行读取程序脚本

gawk程序脚本用一对花括号来定义。你必须将脚本命令放到两个花括号（ {} ）中。如果你
错误地使用了圆括号来包含gawk脚本，就会得到一条类似于下面的错误提示。

```shell
gawk '(print "Hello World!"}'
gawk: (print "Hello World!"}
gawk: ^ syntax error
```

由于 gawk 命令行假定脚本是单个文本字符串，你还必须将脚本放到单引号中。下面的例子在命令行上指定了一个简单的gawk程序脚本：

> gawk '{print "Hello World!"}'

这个程序脚本定义了一个命令： print 命令。这个命令名副其实：它会将文本打印到 STDOUT 。如果尝试运行这个命令，你可能会有些失望，因为什么都不会发生。原因在于没有在命令行上指定文件名，所以gawk程序会从 STDIN 接收数据。在运行这个程序时，它会一直等待从 STDIN 输入的文本。

如果你输入一行文本并按下回车键，gawk会对这行文本运行一遍程序脚本。跟sed编辑器一样，gawk程序会针对数据流中的每行文本执行程序脚本。由于程序脚本被设为显示一行固定的文本字符串，因此不管你在数据流中输入什么文本，都会得到同样的文本输出。

```shell
$ gawk '{print "Hello World!"}'
This is a test
Hello World!
hello
Hello World!
This is another test
Hello World!
```

要终止这个gawk程序，你必须表明数据流已经结束了。bash shell提供了一个组合键来生成EOF（End-of-File）字符。Ctrl+D组合键会在bash中产生一个EOF字符。这个组合键能够终止该gawk程序并返回到命令行界面提示符下

#### 使用数据字段变量

gawk的主要特性之一是其处理文本文件中数据的能力。它会自动给一行中的每个数据元素分配一个变量。默认情况下，gawk会将如下变量分配给它在文本行中发现的数据字段：

- $0 代表整个文本行；
- $1 代表文本行中的第1个数据字段；
- $2 代表文本行中的第2个数据字段；
- $n 代表文本行中的第n个数据字段。

gawk程序读取文本文件，只显示第1个数据字段的值

```shell
cat data2.txt
One line of test text.
Two lines of test text.
Three lines of test text.

gawk '{print $1}' data2.txt
One
Two
Three
```

如果你要读取采用了其他字段分隔符的文件，可以用 -F 选项指定

```shell
gawk -F: '{print $1}' /etc/passwd
root
bin
daemon
adm
lp
sync
shutdown
halt
mail
[...]
```

#### 在程序脚本中使用多个命令

如果一种编程语言只能执行一条命令，那么它不会有太大用处。gawk编程语言允许你将多条命令组合成一个正常的程序。要在命令行上的程序脚本中使用多条命令，只要在命令之间放个分号即可

```shell
echo "My name is Rich" | gawk '{$4="Christine"; print $0}'
My name is Christine
```

> 第一条命令会给字段变量 $4 赋值。第二条命令会打印整个数据字段。注意， gawk程序在输出中已经将原文本中的第四个数据字段替换成了新值

也可以用次提示符一次一行地输入程序脚本命令

```shell
gawk '{
> $4="Christine"
> print $0}'
My name is Rich
My name is Christine
```

在你用了表示起始的单引号后，bash shell会使用次提示符来提示你输入更多数据。你可以每次在每行加一条命令，直到输入了结尾的单引号。因为没有在命令行中指定文件名，gawk程序会从 STDIN 中获得数据。当运行这个程序的时候，它会等着读取来自 STDIN 的文本。要退出程序，只需按下Ctrl+D组合键来表明数据结束。

#### 从文件中读取程序

跟sed编辑器一样，gawk编辑器允许将程序存储到文件中，然后再在命令行中引用

```shell
cat script2.gawk
{print $1 "'s home directory is " $6}

gawk -F: -f script2.gawk /etc/passwd
root's home directory is /root
bin's home directory is /bin
daemon's home directory is /sbin
adm's home directory is /var/adm
lp's home directory is /var/spool/lpd
[...]
Christine's home directory is /home/Christine
Samantha's home directory is /home/Samantha
Timothy's home directory is /home/Timothy
```

可以在程序文件中指定多条命令。要这么做的话，只要一条命令放一行即可，不需要用分号

```shell
cat script3.gawk
{
text = "'s home directory is "
print $1 text $6
}

gawk -F: -f script3.gawk /etc/passwd
root's home directory is /root
bin's home directory is /bin
daemon's home directory is /sbin
adm's home directory is /var/adm
lp's home directory is /var/spool/lpd
[...]
Christine's home directory is /home/Christine
Samantha's home directory is /home/Samantha
Timothy's home directory is /home/Timothy
```

#### 在处理数据前运行脚本

gawk还允许指定程序脚本何时运行。默认情况下，gawk会从输入中读取一行文本，然后针对该行的数据执行程序脚本。有时可能需要在处理数据前运行脚本，比如为报告创建标题。 BEGIN关键字就是用来做这个的。它会强制gawk在读取数据前执行 BEGIN 关键字后指定的程序脚本

```shell
gawk 'BEGIN {print "Hello World!"}'
Hello World!
```

这次 print 命令会在读取数据前显示文本。但在它显示了文本后，它会快速退出，不等待任何数据。如果想使用正常的程序脚本中处理数据，必须用另一个脚本区域来定义程序

```shell
cat data3.txt
Line 1
Line 2
Line 3

gawk 'BEGIN {print "The data3 File Contents:"}
> {print $0}' data3.txt
The data3 File Contents:
Line 1
Line 2
Line 3
```

在gawk执行了BEGIN脚本后，它会用第二段脚本来处理文件数据。这么做时要小心，两段脚本仍然被认为是 gawk 命令行中的一个文本字符串。你需要相应地加上单引号

#### 在处理数据后运行脚本

与 BEGIN 关键字类似， END 关键字允许你指定一个程序脚本，gawk会在读完数据后执行它

```shell
gawk 'BEGIN {print "The data3 File Contents:"}
> {print $0}
> END {print "End of File"}' data3.txt
The data3 File Contents:
Line 1
Line 2
Line 3
End of File
```

当gawk程序打印完文件内容后，它会执行END脚本中的命令。这是在处理完所有正常数据后给报告添加页脚的最佳方法。
可以将所有这些内容放到一起组成一个漂亮的小程序脚本文件，用它从一个简单的数据文件中创建一份完整的报告:

```shell
cat script4.gawk
BEGIN {
print "The latest list of users and shells"
print " UserID \t Shell"
print "-------- \t -------"
FS=":"
}

{
print $1 " \t " $7
}

END {
print "This concludes the listing"
}
```

这个脚本用BEGIN脚本来为报告创建标题。它还定义了一个叫作 FS 的特殊变量。这是定义字段分隔符的另一种方法。这样你就不用依靠脚本用户在命令行选项中定义字段分隔符了。
下面是这个gawk程序脚本的输出（有部分删节）

```shell
gawk -f script4.gawk /etc/passwd
The latest list of users and shells
UserID Shell
---------------
root /bin/bash
bin /sbin/nologin
daemon /sbin/nologin
[...]
Christine /bin/bash
mysql /bin/bash
Samantha /bin/bash
Timothy /bin/bash
This concludes the listing
```

与预想的一样，BEGIN脚本创建了标题，程序脚本处理特定数据文件（/etc/passwd）中的信息，END脚本生成页脚。这个简单的脚本让你小试了一把gawk的强大威力。

### 使用变量

#### 内建变量

- 字段和记录分隔符变量

数据字段是由字段分隔符来划定的。默认情况下，字段分隔符是一个空白字符，也就是空格符或者制表符。

内建变量 FS 是一组内建变量中的一个，这组变量用于控制gawk如何处理输入输出数据中的字段和记录；

```shell
变 量    描 述
FIELDWIDTHS  由空格分隔的一列数字，定义了每个数据字段确切宽度
FS  输入字段分隔符
RS  输入记录分隔符
OFS  输出字段分隔符
ORS  输出记录分隔符
```

变量 FS 来定义记录中的字段分隔符。变量 OFS 具备相同的功能，只不过是用在 print 命令的输出上。默认情况下，gawk将 OFS 设成一个空格，所以如果你用命令：

```shell
cat data1
data11,data12,data13,data14,data15
data21,data22,data23,data24,data25
data31,data32,data33,data34,data35

gawk 'BEGIN{FS=","} {print $1,$2,$3}' data1
data11 data12 data13
data21 data22 data23
data31 data32 data33
```

print 命令会自动将 OFS 变量的值放置在输出中的每个字段间。通过设置 OFS 变量，可以在输出中使用任意字符串来分隔字段

```shell
gawk 'BEGIN{FS=","; OFS="-"} {print $1,$2,$3}' data1
data11-data12-data13
data21-data22-data23
data31-data32-data33

gawk 'BEGIN{FS=","; OFS="--"} {print $1,$2,$3}' data1
data11--data12--data13
data21--data22--data23
data31--data32--data33

gawk 'BEGIN{FS=","; OFS="<-->"} {print $1,$2,$3}' data1
data11<-->data12<-->data13
data21<-->data22<-->data23
data31<-->data32<-->data33
```

FIELDWIDTHS 变量允许你不依靠字段分隔符来读取记录。在一些应用程序中，数据并没有使用字段分隔符，而是被放置在了记录中的特定列。这种情况下，必须设定 FIELDWIDTHS 变量来匹配数据在记录中的位置。

一旦设置了 FIELDWIDTH 变量，gawk就会忽略 FS 变量，并根据提供的字段宽度来计算字段。

下面是个采用字段宽度而非字段分隔符的例子，每个记录中的数字串会根
据已定义好的字段长度来分割。

```shell
cat data1b
1005.3247596.37
115-2.349194.00
05810.1298100.1

gawk 'BEGIN{FIELDWIDTHS="3 5 2 5"}{print $1,$2,$3,$4}' data1b
100 5.324 75 96.37
115 -2.34 91 94.00
058 10.12 98 100.1
```

---

**警告** 一定要记住，一旦设定了 FIELDWIDTHS 变量的值，就不能再改变了。这种方法并不适用于变长的字段。

---

变量 RS 和 ORS 定义了gawk程序如何处理数据流中的字段。默认情况下，gawk将 RS 和 ORS 设为换行符。默认的 RS 值表明，输入数据流中的每行新文本就是一条新纪录。

有时，你会在数据流中碰到占据多行的字段。

典型的例子是包含地址和电话号码的数据，其中地址和电话号码各占一行。

把 RS 变量设置成空字符串，然后在数据记录间留一个空白行。gawk会把每个空白行当作一个记录分隔符。

```shell
cat data2
Riley Mullen
123 Main Street
Chicago, IL 60601
(312)555-1234

Frank Williams
456 Oak Street
Indianapolis, IN 46201
(317)555-9876

Haley Snell
4231 Elm Street
Detroit, MI 48201
(313)555-4938

gawk 'BEGIN{FS="\n"; RS=""} {print $1,$4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938
```

- 数据变量

除了字段和记录分隔符变量外，gawk还提供了其他一些内建变量来帮助你了解数据发生了什么变化，并提取shell环境的信息。

```tex
变 量    描 述
ARGC  当前命令行参数个数
ARGIND  当前文件在 ARGV 中的位置
ARGV[n]  包含命令行参数的数组
CONVFMT  数字的转换格式（参见 printf 语句），默认值为 %.6 g
ENVIRON  当前shell环境变量及其值组成的关联数组
ERRNO  当读取或关闭输入文件发生错误时的系统错误号
FILENAME  用作gawk输入数据的数据文件的文件名
IGNORECASE  设成非零值时，忽略 gawk 命令中出现的字符串的字符大小写
NF  含有数据文件中最后一个数据字段的数字值。
NR  已处理过的记录总数
FNR  当前数据文件中的数据行数（记录数）
OFMT  数字的输出格式，默认值为 %.6 g
RLENGTH  由 match 函数所匹配的子字符串的长度
RSTART  由 match 函数所匹配的子字符串的起始位置
```

```shell
gawk 'BEGIN{print ARGC,ARGV[1]}' data1
2 data1
```

ARGC 变量表明命令行上有两个参数。这包括 gawk 命令和 data1 参数（记住，程序脚本并不算参数）。

ARGV 数组从索引 0 开始，代表的是命令。第一个数组值是 gawk 命令后的第一个命令行参数。

---

ENVIRON 获取 shell 环境变量

```shell
gawk '
> BEGIN{
> print ENVIRON["HOME"]
> print ENVIRON["PATH"]
> }'
/home/rich
/usr/local/bin:/bin:/usr/bin:/usr/X11R6/bin
```

---

跟踪数据字段和记录时，变量 `FNR` 、 `NF` 和 `NR` 用起来就非常方便。有时你并不知道记录中到底有多少个数据字段。

`NF` 变量可以让你在不知道具体位置的情况下指定记录中的最后一个数据字段。`FNR` 变量的值在 gawk 处理第二个数据文件时被重置了，而 `NR` 变量则在处理第二个数据文件时继续计数。

```shell
gawk 'BEGIN{FS=":"; OFS=":"} {print $1,$NF}' /etc/passwd
testy:/bin/csh
mark:/bin/bash
dan:/bin/bash
mike:/bin/bash
test:/bin/bash

gawk 'BEGIN{FS=","}{print $1,"FNR="FNR}' data1 data1
data11 FNR=1
data21 FNR=2
data31 FNR=3
data11 FNR=1
data21 FNR=2
data31 FNR=3

gawk '
> BEGIN {FS=","}
> {print $1,"FNR="FNR,"NR="NR}
> END{print "There were",NR,"records processed"}' data1 data1
data11 FNR=1 NR=1
data21 FNR=2 NR=2
data31 FNR=3 NR=3
data11 FNR=1 NR=4
data21 FNR=2 NR=5
data31 FNR=3 NR=6
There were 6 records processed
```

---

**说明** 在使用gawk时你可能会注意到，gawk脚本通常会比shell脚本中的其他部分还要大一些。为了简单起见，在本章的例子中，我们利用shell的多行特性直接在命令行上运行了gawk脚本。在shell脚本中使用gawk时，应该将不同的 gawk 命令放到不同的行，这样会比较容易阅读和理解，不要在shell脚本中将所有的命令都塞到同一行。还有，如果你发现在不同的shell脚本中用到了同样的gawk脚本，记着将这段gawk脚本放到一个单独的文件中，并用 `-f` 参数来在shell脚本中引用它.

---

#### 自定义变量

自定义变量名可以是任意数目的字母、数字和下划线，但不能以数字开头。重要的是，要记住 gawk 变量名区分大小写。

- 在脚本中给变量赋值

```shell
gawk '
> BEGIN{
> testing="This is a test"
> print testing
> }'
This is a test

```

 gawk 变量可以保存数值或文本值。

```shell
gawk '
> BEGIN{
> testing="This is a test"
> print testing
> testing=45
> print testing
> }'
This is a test
45
```

赋值语句还可以包含数学算式来处理数字值。

```shell
gawk 'BEGIN{x=4; x= x * 2 + 3; print x}'
11
```

- 在命令行上给变量赋值

```shell
cat script1
BEGIN{FS=","}
{print $n}

gawk -f script1 n=2 data1
data12
data22
data32

gawk -f script1 n=3 data1
data13
data23
data33
```

使用命令行参数来定义变量值会有一个问题。在你设置了变量后，这个值在代码的 BEGIN 部分不可用。可以用 -v 命令行参数来解决这个问题。它允许你在 BEGIN 代码之前设定变量。在命令行上，-v 命令行参数必须放在脚本代码之前。

```shell
cat script2
BEGIN{print "The starting value is",n; FS=","}
{print $n}

gawk -f script2 n=3 data1
The starting value is
data13
data23
data33

gawk -v n=3 -f script2 data1
The starting value is 3
data13
data23
data33
```

### 处理数组

#### 定义数组变量

数组变量赋值的格式如下：

> var[index] = element

其中 var 是变量名， index 是关联数组的索引值， element 是数据元素值。

```shell
capital["Illinois"] = "Springfield"
capital["Indiana"] = "Indianapolis"
capital["Ohio"] = "Columbus"
```

在引用数组变量时，必须包含索引值来提取相应的数据元素值。

```shell
gawk 'BEGIN{
> capital["Illinois"] = "Springfield"
> print capital["Illinois"]
> }'
Springfield
```

在引用数组变量时，会得到数据元素的值。数据元素值是数字值时也一样。

```shell
gawk 'BEGIN{
> var[1] = 34
> var[2] = 3
> total = var[1] + var[2]
> print total
> }'
37
```

#### 遍历数组变量

可以用 for 语句的一种特殊形式。

> for (var in array)
>
> {
>
> ​ statements
>
> }
>
> for 语句会在每次循环时将关联数组 array 的下一个索引值赋给变量 var ，然后执行一遍 statements .

```shell
gawk 'BEGIN{
> var["a"] = 1
> var["g"] = 2
> var["m"] = 3
> var["u"] = 4
> for (test in var)
> {
> print "Index:",test," - Value:",var[test]
> }
> }'
Index: u - Value: 4
Index: m - Value: 3
Index: a - Value: 1
Index: g - Value: 2
```

#### 删除数组变量

从关联数组中删除数组索引要用一个特殊的命令。

> delete array[index]

删除命令会从数组中删除关联索引值和相关的数据元素值。

```shell
gawk 'BEGIN{
> var["a"] = 1
> var["g"] = 2
> for (test in var)
> {
> print "Index:",test," - Value:",var[test]
> }
> delete var["g"]
> print "---"
> for (test in var)
> print "Index:",test," - Value:",var[test]
> }'

Index: a - Value: 1
Index: g - Value: 2
---
Index: a - Value: 1
```

### 使用模式

#### 正则表达式

在使用正则表达式时，正则表达式必须出现在它要控制的程序脚本的左花括号前。

```shell
gawk 'BEGIN{FS=","} /11/{print $1}' data1
data11

gawk 'BEGIN{FS=","} /,d/{print $1}' data1
data11
data21
data31
```

- 1 正则表达式 /11/ 匹配了数据字段中含有字符串 11 的记录

- 2 匹配了用作字段分隔符的逗号。这也并不总是件好事。它可能会造
  成如下问题：当试图匹配某个数据字段中的特定数据时，这些数据又出现在其他数据字段中。如果需要用正则表达式匹配某个特定的数据实例，应该使用匹配操作符。

#### 匹配操作符

匹配操作符（matching operator）允许将正则表达式限定在记录中的特定数据字段。匹配操作符是波浪线（ ~ ）。可以指定匹配操作符、数据字段变量以及要匹配的正则表达式。

```
$1 ~ /^data/
```

\$1 变量代表记录中的第一个数据字段。这个表达式会过滤出第一个字段以文本 data 开头的所有记录。

下面是在gawk程序脚本中使用匹配操作符的例子。

```shell
gawk 'BEGIN{FS=","} $2 ~ /^data2/{print $0}' data1
data21,data22,data23,data24,data25
```

匹配操作符会用正则表达式 /^data2/ 来比较第二个数据字段，该正则表达式指明字符串要以文本 data2 开头。

这可是件强大的工具，gawk程序脚本中经常用它在数据文件中搜索特定的数据元素。

```shell
$ gawk -F: '$1 ~ /rich/{print $1,$NF}' /etc/passwd
rich /bin/bash
```

这个例子会在第一个数据字段中查找文本 rich 。如果在记录中找到了这个模式，它会打印该记录的第一个和最后一个数据字段值。

你也可以用 ! 符号来排除正则表达式的匹配。

```shell
$1 !~ /expression/
```

如果记录中没有找到匹配正则表达式的文本，程序脚本就会作用到记录数据。

```shell
gawk –F: '$1 !~ /rich/{print $1,$NF}' /etc/passwd

root /bin/bash
daemon /bin/sh
bin /bin/sh
sys /bin/sh
--- output truncated ---
```

在这个例子中，gawk程序脚本会打印/etc/passwd文件中与用户ID  rich 不匹配的用户ID和登录shell。

#### 数学表达式

除了正则表达式，你也可以在匹配模式中用数学表达式。这个功能在匹配数据字段中的数字值时非常方便。举个例子，如果你想显示所有属于root用户组（组ID为 0 ）的系统用户，可以用这个脚本。

```shell
gawk -F: '$4 == 0{print $1}' /etc/passwd
root
sync
shutdown
halt
operator
```

这段脚本会查看第四个数据字段含有值 0 的记录。在这个Linux系统中，有五个用户账户属于root用户组。

可以使用任何常见的数学比较表达式。

- x == y ：值x等于y。
- x <= y ：值x小于等于y。
- x < y ：值x小于y。
- x >= y ：值x大于等于y。
- x > y ：值x大于y。

也可以对文本数据使用表达式，但必须小心。跟正则表达式不同，表达式必须完全匹配。数据必须跟模式严格匹配。

```shell
gawk -F, '$1 == "data"{print $1}' data1
gawk -F, '$1 == "data11"{print $1}' data1
data11
```

第一个测试没有匹配任何记录，因为第一个数据字段的值不在任何记录中。第二个测试用值 data11 匹配了一条记录。

### 使用结构化命令

#### if

格式

> if (condition)
>
> ​ statement1
>
> 或者
>
> if (condition) statement1

```shell
cat data4
10
5
13
50
34
gawk '{if ($1 > 20) print $1}' data4
50
34

gawk '{
> if ($1 > 20)
> {
> x = $1 * 2
> print x
> }
> }' data4
100
68
```

注意，不能弄混 if 语句的花括号和用来表示程序脚本开始和结束的花括号。如果弄混了，gawk程序能够发现丢失了花括号，并产生一条错误消息

```shell
 gawk '{
> if ($1 > 20)
> {
> x = $1 * 2
> print x
> }' data4
gawk: cmd. line:6: }
gawk: cmd. line:6: ^ unexpected newline or end of string
```

```shell
gawk '{
> if ($1 > 20)
> {
> x = $1 * 2
> print x
> } else
> {
> x = $1 / 2
> print x
> }}' data4
5
2.5
6.5
100
68
```

if (condition) statement1; else statement2

```shell
gawk '{if ($1 > 20) print $1 * 2; else print $1 / 2}' data4
5
2.5
6.5
100
68
```

#### while

> while (condition)
>
> {
>
> ​ statements
>
> }

```shell
cat data5
130 120 135
160 113 140
145 170 215

gawk '{
> total = 0
> i = 1
> while (i < 4)
> {
> total += $i
> i++
> }
> avg = total / 3
> print "Average:",avg
> }' data5
Average: 128.333
Average: 137.667
Average: 176.667
```

> while 语句会遍历记录中的数据字段，将每个值都加到 total 变量上，并将计数器变量 i 增值。
>
> 当计数器值等于 4 时， while 的条件变成了 FALSE ，循环结束，然后执行脚本中的下一条语句

gawk编程语言支持在 while 循环中使用 break 语句和 continue 语句，允许你从循环中跳出。

```shell
gawk '{
> total = 0
> i = 1
> while (i < 4)
> {
> total += $i
> if (i == 2)
> break
> i++
> }
> avg = total / 2
> print "The average of the first two data elements is:",avg
> }' data5
The average of the first two data elements is: 125
The average of the first two data elements is: 136.5
The average of the first two data elements is: 157.5
```

#### do-while

会在检查条件语句之前执行命令。

> do
> {
> statements
> } while (condition)

这种格式保证了语句会在条件被求值之前至少执行一次。当需要在求值条件前执行语句时，这个特性非常方便。

```shell
gawk '{
> total = 0
> i = 1
> do
> {
> total += $i
> i++
> } while (total < 150)
> print total }' data5
250
160
315
```

> 这个脚本会读取每条记录的数据字段并将它们加在一起，直到累加结果达到150。如果第一个数据字段大于150（就像在第二条记录中看到的那样），则脚本会保证在条件被求值前至少读取第一个数据字段的内容。

#### for

for( variable assignment; condition; iteration process)

```shell
gawk '{
> total = 0
> for (i = 1; i < 4; i++)
> {
> total += $i
> }
> avg = total / 3
> print "Average:",avg
> }' data5
Average: 128.333
Average: 137.667
Average: 176.667
```

### 格式化打印 printf

命令的格式：

> printf "format string", var1, var2 . . .
>
> format string 是格式化输出的关键。它会用文本元素和格式化指定符来具体指定如何呈现格式化输出。第一个格式化指定符对应列出的
> 第一个变量，第二个对应第二个变量，依此类推。

格式化指定符采用如下格式：

> %[modifier]control-letter

其中 control-letter 是一个单字符代码，用于指明显示什么类型的数据，而 modifier 则定义了可选的格式化特性。

```tex
控制字母   描 述
c  将一个数作为ASCII字符显示
d  显示一个整数值
i  显示一个整数值（跟d一样）
e  用科学计数法显示一个数
f  显示一个浮点值
g  用科学计数法或浮点数显示（选择较短的格式）
o  显示一个八进制值
s  显示一个文本字符串
x  显示一个十六进制值
X  显示一个十六进制值，但用大写字母A~F
```

因此，如果你需要显示一个字符串变量，可以用格式化指定符 %s 。如果你需要显示一个整数值，可以用 %d 或 %i （ %d 是十进制数的C风格显示方式）。如果你要用科学计数法显示很大的值，就用 %e 格式化指定符

```shell
gawk 'BEGIN{
x = 10 * 100
printf "The answer is: %e\n", x
}'
The answer is: 1.000000e+03
```

除了控制字母外，还有3种修饰符可以用来进一步控制输出。

- width ：指定了输出字段最小宽度的数字值。如果输出短于这个值，printf 会将文本右对齐，并用空格进行填充。如果输出比指定的宽度还要长，则按照实际的长度输出。
- prec ：这是一个数字值，指定了浮点数中小数点后面位数，或者文本字符串中显示的最大字符数。
- -（减号）：指明在向格式化空间中放入数据时采用左对齐而不是右对齐。

在使用 printf 语句时，你可以完全控制输出样式。

```shell
gawk 'BEGIN{FS="\n"; RS=""} {print $1,$4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938

gawk 'BEGIN{FS="\n"; RS=""} {printf "%s %s\n", $1, $4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938
```

**注意**，你需要在 printf 命令的末尾手动添加换行符来生成新行。没添加的话， printf 命令会继续在同一行打印后续输出。

如果需要用几个单独的 printf 命令在同一行上打印多个输出，这就会非常有用。

```shell
gawk 'BEGIN{FS=","} {printf "%s ", $1} END{printf "\n"}' data1
data11 data21 data31
```

用修饰符来格式化第一个字符串值:

> 通过添加一个值为 16 的修饰符，我们强制第一个字符串的输出宽度为16个字符。默认情况下，printf 命令使用右对齐来将数据放到格式化空间中。要改成左对齐，只需给修饰符加一个减号即可。

```shell
gawk 'BEGIN{FS="\n"; RS=""} {printf "%16s %s\n", $1, $4}' data2
  Riley Mullen (312)555-1234
Frank Williams (317)555-9876
    Haley Snell (313)555-4938
    
gawk 'BEGIN{FS="\n"; RS=""} {printf "%-16s %s\n", $1, $4}' data2
Riley Mullen (312)555-1234
Frank Williams (317)555-9876
Haley Snell (313)555-4938    
```

处理浮点值

```shell
gawk '{
> total = 0
> for (i = 1; i < 4; i++)
> {
> total += $i
> }
> avg = total / 3
> printf "Average: %5.1f\n",avg
> }' data5
Average: 128.3
Average: 137.7
Average: 176.7
```

> 使用 %5.1f 格式指定符来强制 printf 命令将浮点值近似到小数点后一位。

### 使用函数

#### 数学函数

```tex
函 数    描 述
atan2(x, y)  x/y的反正切，x和y以弧度为单位
cos(x)  x的余弦，x以弧度为单位
exp(x)  x的指数函数
int(x)  x的整数部分，取靠近零一侧的值
log(x)  x的自然对数
rand( )  比0大比1小的随机浮点值
sin(x)  x的正弦，x以弧度为单位
sqrt(x)  x的平方根
srand(x)  为计算随机数指定一个种子值
```

```shell
x = int(10 * rand())

gawk 'BEGIN{x=exp(100); print x}'
26881171418161356094253400435962903554686976

gawk 'BEGIN{x=exp(1000); print x}'
gawk: warning: exp argument 1000 is out of range
inf
```

> 第一个例子会计算e的100次幂，虽然数值很大，但尚在系统的区间内。第二个例子尝试计算e的1000次幂，已经超出了系统的数值区间，所以就生成了一条错误消息。

gawk还支持一些按位操作数据的函数。

- and(v1, v2) ：执行值 v1 和 v2 的按位与运算。
- compl(val) ：执行 val 的补运算。
- lshift(val, count) ：将值 val 左移 count 位。
- or(v1, v2) ：执行值 v1 和 v2 的按位或运算。
- rshift(val, count) ：将值 val 右移 count 位。
- xor(v1, v2) ：执行值 v1 和 v2 的按位异或运算。

位操作函数在处理数据中的二进制值时非常有用。

#### 字符串函数

```tex
函 数    描 述
asort(s [,d])  将数组s按数据元素值排序。索引值会被替换成表示新的排序顺序的连续数字。另外，如果指定了d，则排序后的数组会存储在数组d中

asorti(s [,d])  将数组s按索引值排序。生成的数组会将索引值作为数据元素值，用连续数字索引来表明排序顺序。另外如果指定了d，排序后的数组会存储在数组d中

gensub(r, s, h [, t])  查找变量$0或目标字符串t（如果提供了的话）来匹配正则表达式r。如果h是一个以g或G开头的字符串，就用s替换掉匹配的文本。如果h是一个数字，它表示要替换掉第h处r匹配的地方

gsub(r, s [,t])  查找变量$0或目标字符串t（如果提供了的话）来匹配正则表达式r。如果找到了，就全部替换成字符串s

index(s, t)  返回字符串t在字符串s中的索引值，如果没找到的话返回 0

length([s])  返回字符串s的长度；如果没有指定的话，返回$0的长度

match(s, r [,a])  返回字符串s中正则表达式r出现位置的索引。如果指定了数组a，它会存储s中匹配正则表达式的那部分

split(s, a [,r])  将s用 FS 字符或正则表达式r（如果指定了的话）分开放到数组a中。返回字段的总数

sprintf(format,variables)  用提供的format和variables返回一个类似于printf输出的字符串

sub(r, s [,t])  在变量$0或目标字符串t中查找正则表达式r的匹配。如果找到了，就用字符串s替换掉第一处匹配

substr(s, i [,n])  返回s中从索引值i开始的n个字符组成的子字符串。如果未提供n，则返回s剩下的部分

tolower(s)  将s中的所有字符转换成小写

toupper(s)  将s中的所有字符转换成大写
```

```shell
gawk 'BEGIN{x = "testing"; print toupper(x); print length(x) }'
TESTING
7

gawk 'BEGIN{
> var["a"] = 1
> var["g"] = 2
> var["m"] = 3
> var["u"] = 4
> asort(var, test)
> for (i in test)
> print "Index:",i," - value:",test[i]
> }'
Index: 4 - value: 4
Index: 1 - value: 1
Index: 2 - value: 2
Index: 3 - value: 3


gawk 'BEGIN{ FS=","}{
> split($0, var)
> print var[1], var[5]
> }' data1
data11 data15
data21 data25
data31 data35
```

#### 时间函数

```tex
mktime(datespec)  将一个按YYYY MM DD HH MM SS [DST]格式指定的日期转换成时间戳值 ①

strftime(format[,timestamp])  将当前时间的时间戳或timestamp（如果提供了的话）转化格式化日期（采用shell函数date()的格式）

systime( )  返回当前时间的时间戳
```

```shell
gawk 'BEGIN{
> date = systime()
> day = strftime("%A, %B %d, %Y", date)
> print day
> }'
Friday, December 26, 2014
```

#### 定义函数

要定义自己的函数，必须用 function 关键字。

> function name([variables])
> {
> statements
> }

函数名必须能够唯一标识函数。可以在调用的gawk程序中传给这个函数一个或多个变量。

```shell
function printthird()
{
    print $3
}

function myrand(limit)
{
    return int(limit * rand())
}
```

#### 使用自定义函数

```shell
gawk '
> function myprint()
> {
> printf "%-16s - %s\n", $1, $4
> }
> BEGIN{FS="\n"; RS=""}
> {
> myprint()
> }' data2

Riley Mullen - (312)555-1234
Frank Williams - (317)555-9876
Haley Snell - (313)555-4938
```

#### 创建函数库

首先，你需要创建一个存储所有gawk函数的文件

```shell
cat funclib
function myprint()
{
    printf "%-16s - %s\n", $1, $4
}

function myrand(limit)
{
    return int(limit * rand())
}

function printthird()
{
    print $3
}
```

funclib文件含有三个函数定义。需要使用 -f 命令行参数来使用它们。很遗憾，不能将 -f 命令行参数和内联gawk脚本放到一起使用，不过可以在同一个命令行中使用多个 -f 参数。

因此，要使用库，只要创建一个含有你的gawk程序的文件，然后在命令行上同时指定库文件和程序文件就行了。

```shell
cat script4
BEGIN{ FS="\n"; RS=""}
{
myprint()
}

gawk -f funclib -f script4 data2
Riley Mullen - (312)555-1234
Frank Williams - (317)555-9876
Haley Snell - (313)555-4938
```

举例来说，我们手边有一个数据文件，其中包含了两支队伍（每队两名选手）的保龄球比赛得分情况。

```shell
cat scores.txt
Rich Blum,team1,100,115,95
Barbara Blum,team1,110,115,100
Christine Bresnahan,team2,120,115,118
Tim Bresnahan,team2,125,112,116
```

每位选手都有三场比赛的成绩，这些成绩都保存在数据文件中，每位选手由位于第二列的队名来标识。下面的脚本对每队的成绩进行了排序，并计算了总分和平均分。

```shell
cat bowling.sh
#!/bin/bash
for team in $(gawk –F, '{print $2}' scores.txt | uniq)
do
    gawk –v team=$team 'BEGIN{FS=","; total=0}
    {
        if ($2==team)
        {
            total += $3 + $4 + $5;
        }
    }
    END {
        avg = total / 6;
        print "Total for", team, "is", total, ",the average is",avg
    }' scores.txt
done
```

```shell
./bowling.sh
Total for team1 is 635, the average is 105.833
Total for team2 is 706, the average is 117.667
```

