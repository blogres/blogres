import { getDirname, path } from "@vuepress/utils";
import {hopeTheme} from "vuepress-theme-hope";
import {allNavbar} from "./navbar.ts";
import {allSidebar} from "./sidebar/index";

const __dirname = getDirname(import.meta.url);

export default hopeTheme({
    //导航栏左logo图标
    logo: "/logo.png",

    favicon: "/favicon.ico",

    hostname: "https://blogres.github.io",

    author: {
        // Copyright © 20xx ${name} 和主页卡片名称{blog.name}为null时
        name: "blogres",
        // 根据自己的域名设置
        url: "/article",
    },

    darkmode: "toggle",/*toggle,auto*/

    //仓库
    repo: "https://github.com/blogres/blogres",

    //文档在仓库中的目录
    docsDir: "docs",

    //文档存放分支
    docsBranch: "main",

    // 关键词: "iconfont", "iconify", "fontawesome", "fontawesome-with-brands"
    // 参考：https://theme-hope.vuejs.press/zh/guide/interface/icon.html#设置图标资源
    iconAssets: "iconfont",
    // iconPrefix: "iconfont icon-",

    fullscreen: true,

    pageInfo: ["Author", "Category", "Tag", "Date", "Original", "Word", "PageView", "ReadingTime"],

    // 导航栏
    navbar: allNavbar,

    // 侧边栏
    sidebar: allSidebar,

    blog: {
        avatar: "/blog.png",
        name: "Blog",
        intro: "/about-this",
        sidebarDisplay: "mobile",
        description: "爱搬砖的后端开发者",

        medias: {
            Gitee: "https://gitee.com/blogres/blogres",
            Github: "https://github.com/blogres/blogres",
            Zhihu: "https://www.zhihu.com/people/tops6",
            OSChina: [
                "https://my.oschina.net/jinfang",
                path.resolve(__dirname, "public/icons/oschina.svg"),
            ],
            csdn: [
                "https://blog.csdn.net/qq_42476834",
                path.resolve(__dirname, "public/icons/csdn.svg"),
            ],
        },
    },

    // page meta
    metaLocales: {
        editLink: "在 GitHub 编辑此页",
    },

    footer: "", //'<a href="https://beian.miit.gov.cn/" target="_blank">黔ICP备2022xxxxxx号-1</a>',

    displayFooter: true,

    plugins: {
        //搜索插件
        searchPro: {
            indexContent: true,
            customFields: [
                {
                    getter: (page) => page.frontmatter.category,
                    formatter: "分类：$content",
                },
                {
                    getter: (page) => page.frontmatter.tag,
                    formatter: "标签：$content",
                },
            ],
        },

        //评论模块
        comment: {
            // 评论模块设置教程：https://vuepress-theme-hope.github.io/v2/zh/guide/feature/comment.html
            // Giscus配置地址：https://giscus.app/zh-CN
            provider: "Waline",  //Giscus、Waline
            serverURL: "https://waline-discussions-4zbiiizlr-blogres.vercel.app", 
            // repo: "blogres/discussions",
            // repoId: "R_kgDOLC_epg",
            // category: "Announcements",
            // categoryId: "DIC_kwDOLC_eps4CcUgg",
        },

        //其他插件
        components: {
            components: [
                "Badge", //为标题或链接添加一些状态
                "BiliBili", //哔哩哔哩视频支持
                "PDF", //PDF支持
                "Share", //分享组件，将页面内容分享到社交媒体。
                "VPBanner", //用于展示 banner
                "VPCard", //卡片组件，可用于展示项目。
                "VidStack", //视频播放器
                "XiGua", //西瓜视频
              ],
              componentOptions: {
                pdf: {
                    pdfjs: "/assets/lib/pdfjs",
                },
            },
        },

        //md增强
        mdEnhance: {
            align: true,
            attrs: true,
            chart: true,
            codetabs: true,
            demo: true,
            echarts: true,
            gfm: true,
            include: true,
            katex: true,
            mark: true,
            mermaid: true,
            //交互演示
            playground: {
                presets: ["ts", "vue"],
            },
            //幻灯片
            revealJs: true,
            sub: true,
            sup: true,
            tabs: true,
            vPre: true,
            vuePlayground: true,
            //流程图
            flowchart: true,
            //脚注
            footnote: true,
            //自定义容器:提示、注释、信息、注意、警告和详情
            hint: true,
            // 启用图片大小
            imgLazyload: true,
            // 启用图片标记
            imgMark: true,
            imgSize: true,
            figure: true,
        },

        copyCode: {
            showInMobile: true,
        },

        photoSwipe: true,

        blog: {
            excerpt: true,
        },

        pwa: {
            update: "hint",
            cachePic: true,
            maxSize: 1024 * 8,
            maxPicSize: 1024 * 6,
            //是否缓存除主页和 404 错误页之外的 HTML 文件
            cacheHTML: false,
            appendBase: true,
        },

    },
});
