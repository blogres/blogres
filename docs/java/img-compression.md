---
icon: java
title: SpringBoot图片大小压缩
category: 
- Java
headerDepth: 5
date: 2020-09-29
tag:
- image
---

SpringBoot图片大小压缩

<!-- more -->

# 使用Java压缩图片大小

application.properties配置文件

```java
#后端接收图片大小
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
```

## java工具类

```java
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.awt.image.ImageObserver;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.io.InputStream;
/
/**
     * 请求调用方法
     * gb
     *
     * @param fromPath1 byte直接文件图片
     * @return 剪切后的byte文件
     */
    public static byte[] imageSet(byte[] fromPath1) throws Exception {
        return imageChangeSize(fromPath1, 470, 635);
    }

    /**
     * @param data   byte类型图片
     * @param max_wi 图片修改后最大的宽
     * @param max_he 图片修改后最大的高
     * @return
     * @throws Exception
     * @Description 更改图片内容的大小 byte【】 类型
     */
    public static byte[] imageChangeSize(byte[] data, int max_wi, int max_he) throws Exception {
        ImageIO io = null;
        float rate = 1;
        /*图片的原始宽 120*/
        int oldwi;
        /*图片的原始高 120*/
        int oldhe;
        /*图片修改后的宽 0*/
        int new_wi = 0;
        /*图片修改后的高 0*/
        int new_he = 0;
        /*拿到byte图片*/
        InputStream is = new ByteArrayInputStream(data);
        BufferedImage bufImg = ImageIO.read(is);
        /*图片的原始宽度*/
        oldwi = bufImg.getWidth();
        /*图片的原始高度*/
        oldhe = bufImg.getHeight();
        //
        rate = (float) oldwi / (float) oldhe;
        /*如果图片的原宽大于最大宽度，并且原高小于等于最大高度。则证明图片过宽了，将图片宽度设置为最大宽度，此时需要等比例减小高度*/
        if (oldwi > max_wi && oldhe <= max_he) {
            new_wi = max_wi;
            new_he = new Float((float) new_wi / rate).intValue();
            /*如果图片的原宽和原高都大于或者都小于其所对应的最大值，则以任意一方为主(此处以最大高度为主)*/
        } else if (oldwi >= max_wi && oldhe >= max_he || oldwi <= max_wi && oldhe <= max_he) {
            new_he = max_he;
            new_wi = new Float(new_he * rate).intValue();
            /*如果图片的原宽小于于最大宽度，并且原高大于等于最大高度。则证明图片过高了，将图片宽度设置为最大高度，此时需要等比例减小宽度*/
        } else if (oldwi <= max_wi && oldhe > max_he) {
            new_he = max_he;
            new_wi = new Float(new_he * rate).intValue();
        }
//        System.err.println("原宽度：" + oldwi + "原高度：" + oldhe + "_" + rate);
        /*开始改变大小*/
        ImageObserver ser = null;
        BufferedImage bf = new BufferedImage(new_wi, new_he, BufferedImage.TYPE_INT_RGB);
        bf.getGraphics().drawImage(bufImg, 0, 0, new_wi, new_he, null);
//        System.err.println("新宽度：" + bf.getWidth() + "-" + "新高度：" + bf.getHeight());
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        //转换编码格式JPEG
        ImageIO.write(bf, "jpeg", out);
        byte[] re = out.toByteArray();
        //logger.info("【图片剪切】| 图片原大小={}kb | 压缩后大小={}kb", (data.length / 1024), (re.length / 1024));
        return re;
    }
```

## controller

```java
    @RequestMapping(value = "/getImage", method = RequestMethod.POST)
    @ResponseBody
    public JsonData getidcart(@RequestParam(value = "front", required = false) MultipartFile front) throws Exception {
        byte[] IdCartFront;
        /**
         *  图片字节
         *  判断压缩 >300kb就压缩到300kb以下 300000k=300kb 设置宽高px--->转小kb
         */
        if (front.getSize() > SIZE_DEFUALT) {
            IdCartFront = ImageUtils.imageSet(front.getBytes());
        } else {
            IdCartFront = front.getBytes();
        }
```

## HTML部分

```java
            <div class="photo" id="photo" enctype="multipart/form-data">
                <input type="file" multiple="multiple" accept="image/*"
                       onchange="getImg(event,'photo',1)" enctype="multipart/form-data" id="face" required/>
            </div>
```

## JavaScript部分

```java
/** 获取照片 */
function getImg(e, eId, next) {
    var imgFile = e.target.files[0];
    var newImgFile = window.webkitURL.createObjectURL(imgFile);
    document.getElementById("" + eId + "").style.backgroundImage = "url(" + newImgFile + ")";

    if (next == 1) {
        front = imgFile;
    } else if (next == 2) {
        back = imgFile;
    } else if (next == 3) {
        face = imgFile;
    }
}
//ajax：
************************
//将file文件转为formdata,Ajax传到后台
    formData = new FormData();
    formData.append('front', front);
  
        url: url,
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
```
