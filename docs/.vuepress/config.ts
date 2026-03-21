import { defineUserConfig } from "vuepress";
import { viteBundler } from "@vuepress/bundler-vite";
import theme from "./theme";

export default defineUserConfig({

    base: "/",

    lang: "zh-CN",

    //title: "", //导航栏左logo图标名称

    description: "꧁「阿牛专属笔记本」꧂",

    theme,

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
