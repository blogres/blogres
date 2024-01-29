---
icon: java
title: 将字符串转为日期格式yyyy-MM-dd||自定义格式
category: 
- Java
headerDepth: 5
date: 2020-09-30
tag:
- DateFormat
---

<!-- more -->

# 将字符串转为日期格式yyyy-MM-dd||自定义格式

```java
/**
     * 将字符串格式转日期，如：yyyy-MM-dd ||自定义格式
     *
     * @param date       日期字符串
     * @param dateFormat 设置将字符串格式转日期格式，这个与date的格式必须一致
     * @param tarFormat  设置目标格式
     * @return 返回格式化的日期，默认格式：yyyy-MM-dd
     * @throws ParseException 分析时意外地出现了错误异常
     */
    public static String strToDateFormat(String date, String dateFormat, String tarFormat) throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat(StringUtils.isBlank(dateFormat) ? "yyyyMMdd" : dateFormat);
        formatter.setLenient(false);
        Date newDate = formatter.parse(date);
        formatter = new SimpleDateFormat(StringUtils.isBlank(tarFormat) ? "yyyy-MM-dd" : tarFormat);
        return formatter.format(newDate);
    }

    /**
     * 获取LocalDateTime的指定日期格式
     *
     * @param ofPattern 设置时间格式：yyyy-MM-dd HH:mm:ss
     * @return 2020-09-30 10:41:47
     */
    public static String dateFormat(String ofPattern) {
        return LocalDateTime.now().format(DateTimeFormatter.ofPattern(ofPattern));
    }

    public static void main(String[] args) throws ParseException {
        System.out.println(dateFormat("yyyy-MM-dd HH:mm:ss"));//2020-09-30 12:06:09
        System.out.println(strToDateFormat("20111205", "yyyyMMdd", "yyyy-MM-dd"));//2011-12-05
        System.out.println(strToDateFormat("20121205", "", ""));//2012-12-05
        System.out.println(strToDateFormat("2013-12-05", "yyyy-MM-dd", "yyyy/MM/dd"));//2013/12/05
        System.out.println(strToDateFormat("2014-1205", "yyyy-MMdd", "yyyyMM/dd"));//201412/05
        System.out.println(strToDateFormat("2015-12-05", "yyyy-MM-dd", "yyyy/MM/dd HH:mm:ss"));//2015/12/05 00:00:00
        System.out.println(strToDateFormat("2016/12/05", "yyyy/MM/dd", "yyyy-MM-dd"));//2016-12-05
    }
```
