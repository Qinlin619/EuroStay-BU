# EuroStay 官网

这是一个基于 React 和 Vite 构建的公司 landing page 项目。

## 功能特性

- 🏠 首页：产品下载链接和跳转
- 📱 产品介绍：产品功能说明和换宿指南
- 📖 换宿故事：用户分享和活动历史
- 👥 关于我们：公司介绍和联系方式

## 技术栈

- React 18
- React Router DOM 6
- Vite
- CSS3

## 安装与运行

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产版本

```bash
npm run preview
```

## 项目结构

```
EuroStay_website/
├── src/
│   ├── components/      # 组件
│   │   ├── Navbar.jsx   # 导航栏
│   │   └── Navbar.css
│   ├── pages/           # 页面
│   │   ├── Home.jsx     # 首页
│   │   ├── Products.jsx # 产品介绍
│   │   ├── Stories.jsx  # 换宿故事
│   │   └── About.jsx    # 关于我们
│   ├── App.jsx          # 主应用组件
│   ├── App.css
│   ├── main.jsx         # 入口文件
│   └── index.css        # 全局样式
├── index.html
├── package.json
└── vite.config.js
```

## 主题色

项目使用了以下主题色：

- 默认文字：`#333333`
- 未选中文字：`#9B9B9B`
- 背景底色：`#E9E9E9`
- 一级紫色：`#7A63C7`
- 二级紫色：`#D2C8FD`
- 一级黄色：`#FFD35E`
- 二级黄色：`#FFEDBE`
- 红色：`#FF5E5E`

## 部署到 GitHub Pages

项目已配置 GitHub Actions 自动部署。要启用部署：

1. 前往 GitHub 仓库设置：`Settings` > `Pages`
2. 在 `Source` 部分，选择 `GitHub Actions` 作为部署源
3. 每次推送到 `main` 分支时，GitHub Actions 会自动构建并部署网站

网站将部署到：`https://qinlin619.github.io/EuroStay-BU/`

## 图片与性能

若网站仍感觉卡顿，多半是图片体积过大。建议：

- **压缩图片**：用 [TinyPNG](https://tinypng.com/) 或 [Squoosh](https://squoosh.app/) 压缩 `public/images` 下的 jpeg/png，尽量单张 < 200KB
- **优先用 WebP**：在支持 WebP 的浏览器中可显著减小体积，可用 `<picture>` 或构建时转 WebP
- **控制尺寸**：展示宽度/高度不大的图（如缩略图）用对应尺寸导出，不要用大图再 CSS 缩小

项目已对图片做：懒加载（`loading="lazy"`）、异步解码（`decoding="async"`）、非首屏低优先级（`fetchPriority="low"`），首屏外的图会延后加载以减轻卡顿。

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)
