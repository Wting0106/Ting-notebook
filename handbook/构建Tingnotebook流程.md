# 构建Ting~notebook流程

参考：

[yindaheng98.github.io/]: 

## 涉及的配置：

```
Markdown 文档
      |
      ↓
VuePress 静态网站生成器
      |
      ↓
Node.js 环境运行
      |
      ↓
npm 管理依赖
      |
      ↓
Git 提交代码
      |
      ↓
GitHub Actions 自动构建
      |
      ↓
GitHub Pages 部署
      |
      ↓
https://xxx.github.io
```

**Node.js :** 可以让 JavaScript 可以脱离浏览器运行的运行环境。传统（浏览器-js程序），node.js（电脑系统-node.js-js程序），**node_modules**就是存放这个环境所需要的依赖

**VuePress ：**基于 Vue 的<u>静态网站</u>生成器（主要用于：技术博客、文档网站），它会读取md，生成HTML网站。 它本质是一个JavaScript，所以需要node.js。 

**JavaScript ：** JavaScript 和 Java 没有直接关系。JavaScript 是一种脚本语言，是为了给网页增加交互能力。JavaScript用在网页交互、前端、Node后端，java用在后端、android

**npm：**包管理工具（Node Package Manager），Node.js 的包管理工具。类似于`pip install torch`，Node里就是`npm install vuepress`

**package.json:** 类似于requirements.txt。 只是在Node中需要配置的json，比如这个项目需要VuePress 1.9.10。所以它的版本十分重要

**VuePress config.js：** 告诉 VuePress 网站应该怎么生成（网站名字、路径、sidebar侧边栏）

**GitHub Actions：**GitHub提供的自动化运行平台。git push后它会自动启动actions，接着自动进行`npm install`  和`npm run docs:build`

**GitHub Pages：** GitHub提供的静态网页托管服务。

**deploy.yml**： 自动部署文件（.github-workflows-deploy.yml），它会在`npm install`、

`npm run docs:build`的时候被执行

**静态网页与动态网页：**前者提前生成内容，通常不需要访问数据库，适合博客文档（比如Github pages）。后者访问时生成内容，通常需访问数据库，服务器压力大（比如：淘宝、知乎）



## 1.本地部署

```
Typora
  ↓
Markdown (.md)
  ↓
Git 管理
  ↓
GitHub 仓库
  ↓
VuePress 编译
  ↓
GitHub Pages 网页
```

1.安装node

https://nodejs.org/zh-cn

2.在notenook目录，安装 VuePress 

**一定要注意主题与node版本统一，安装过程参考gpt** 

```
cd D:\Ting-notebook
npm init   #创建 package.json 配置文件
npm install -D vuepress@next
```

![](D:\Ting-notebook\Ting-notebook-photo\1.png)

3.启动网页

```
D:\Ting-notebook
npm run docs:dev
```

![image-20260816151122049](D:\Ting-notebook\Ting-notebook-photo\image-20260816151122049.png)

## 2.Github部署

```
你本地写 Markdown

        ↓

git push

        ↓

GitHub Actions 自动编译 VuePress

        ↓

生成静态 HTML

        ↓

GitHub Pages 发布

        ↓

别人访问：

https://wting0106.github.io/Ting-notebook/
```

### 1.先规范两个文件

**注意以下两个文件的写法**!!!!!!:

+ `D:\Ting-notebook\docs\.vuepress`下config.js的写法要与版本统一：

  ==重点是：sidebar中目录的写法！！！==

  ```
  module.exports = {
  
      title: 'Ting Notebook',
  
      description: '3DGS SLAM Deep Learning Notes',
  
      themeConfig: {
  
          sidebar: {
  
              '/3DGS/': [
                  {
                      title: '3D Gaussian Splatting',
                      collapsable: false,
  
                      children: [
                          '',
                          'TEST0-Implicit-Neural-Representation'
                      ]
                  }
              ]
          }
      }
  }
  ```

+ `D:\Ting-notebook\package.json`

  ```
  {
    "name": "ting-notebook",
    "version": "1.0.0",
    "description": "My research notebook for 3DGS and 3DGS scene understandering",
    "keywords": [
      "3DGS",
      "3DGS",
      "understandering",
      "SLAM",
      "Robtics",
      "Deep",
      "Learning"
    ],
    "homepage": "https://github.com/Wting0106/Ting-notebook#readme",
    "bugs": {
      "url": "https://github.com/Wting0106/Ting-notebook/issues"
    },
    "repository": {
      "type": "git",
      "url": "git+https://github.com/Wting0106/Ting-notebook.git"
    },
    "license": "ISC",
    "author": "Ting",
    "main": "index.js",
    "scripts": {
      "docs:dev": "vuepress dev docs",
      "docs:build": "vuepress build docs"
    },
    "devDependencies": {
      "vuepress": "1.9.10"
    }
  }
  ```

### 2.本地部署

1.`D:\Ting-notebook\docs`目录下的readme.md

readme开头必须是：

```
---
home: true
heroText: Ting~Notebook
tagline: 我的科研笔记
---
```



2.本地部署，启动VuePress：

```
cd D:\Ting-notebook
npm run docs:dev     #打开http://localhost:8080，本地网页预览
```



### 3.github actions部署

**作用：** 

每次git push，自动安装依赖→ vuspress build → 生成网页 → 上传gh-pages →刷新网站

1.生成静态网页

```
npm run docs:build  
```

2.修改`D:\Ting-notebook\docs\.vuepress`,增加base

```
base: '/Ting-notebook/',   
```

   否则 GitHub Pages 后图片、CSS路径会错误。

3.在本地notebook目录下，创建 .github/workflows/deploy.yml

yml具体内容如下：

```
 name: Deploy VuePress Site

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  deploy:

    runs-on: ubuntu-latest

    steps:

      - name: Checkout
        uses: actions/checkout@v4


      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20


      - name: Install dependencies
        run: npm install


      - name: Build VuePress
        run: npm run docs:build


      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/.vuepress/dist
```

4.然后再 git add、 commit、push



### 4.Github actions查看

```
GitHub仓库
→ Actions
→ Deploy VuePress Site
```



### 5.GitHub Pages设置

```
Settings

→ Pages   
→source选择GitHub Actions  #上传好deploy.yml文件后，选择好branch后，可以选择Github actions，后续它会自己更新网页
```



## 3.日常更新流程

写 Markdown：

```
docs/3DGS/new_note.md
```

修改：

```
docs/.vuepress/config.js
```

如果需要新增sidebar。#即新增加文件后需要更新一下这个目录。

注意：**后续所有希望被** VuePress **渲染成网页**的 Markdown 文件，必须位于 `docs` 目录（sourceDir）里面或者它的子目录中。其它可以不用放，图片也不一定要放。

提交：

```
git add .
git commit -m "update 3DGS notes"
git push
```

等待：

```
GitHub Actions ✓
```

网页自动更新。

**如果没有自动更新，** ：

1.可以先看一下`npm run docs:dev `和 `npm run docs:build  `是否成功

2.误把 `docs/.vuepress/dist/`  也上传到github上了，这里面包含了最终网页，上传后可能会冲突



