export default {
  config: {
    default: true,
    MD001: false,
    MD003: {
      style: "atx"
    },
    MD004: {
      style: "dash"
    },
    MD007: false,
    MD010: false,
    MD012: false,
    MD013: false,
    MD024: {
      siblings_only: true
    },
    MD025: false,
    MD029: false,
    MD033: {
      allowed_elements: [
        "div",
        "br",
        "a",
        "img",
        "p",
        "code",
        "span",
        "Badge",
        "Catalog",
        "BiliBili",
        "PDF",
        "Share",
        "VPBanner",
        "VPCard",
        "VidStack",
        "XiGua"
      ]
    },
    MD035: {
      style: "---"
    },
    MD036: false,
    MD040: false,
    MD041: false,
    MD042: false,
    MD045: false,
    MD046: false,
    MD049: false
  },
  ignores: [
    "**/node_modules/**",
    "**/__tests__/**",
    // markdown import demo
    "**/*.snippet.md",
    "README.md",
    "home.md",
    "LICENSE"
  ],
};