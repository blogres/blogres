import { defineUserConfig, viteBundler } from "vuepress";
import theme from "./theme";

export default defineUserConfig({

    base: "/",

    lang: "zh-CN",

    title: "", //导航栏左logo图标名称

    description: "꧁「小牛专属笔记本」꧂",

    theme,

    markdown: {
        headers: {
            level: [2, 3, 4, 5, 6],
        },
    },

    head: [
        ["script", { type: "typescript", src: "/script/repeat.ts"}],
        ["link", { rel: "stylesheet", href: "/iconfont/iconfont.css" }],
    ],

    //预读取，开启pwa后建议为false
    shouldPrefetch: false,

    bundler: viteBundler({
        viteOptions: {
            build: {
                chunkSizeWarningLimit: 12040,
            }
        },
        vuePluginOptions: {},
    }),
});
