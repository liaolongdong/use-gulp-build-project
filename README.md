# use-gulp-build-project

---使用`gulp`和`browserify`搭建单页面或者多页面项目---

## 使用gulp构建

首先安装依赖包

```bash
yarn
```

启动项目

```bash
yarn start
```

构建生产环境包

```bash
yarn build:prod
```

## 使用`browserify`打包打一个文件及打包第三方类库

> 注意：所有带`browserify-shim`都是用到browserify打包的文件，其它的默认都是只是用了gulp打包的文件

使用`browserify`打包打一个文件及打包第三方类库需要使用`bower`安装npm仓库没有的依赖包以及使用`gulpfile-browserify-shim.js`和`package-browserify-shim.js`中的内容替换`gulpfile.js`和`package.json`里的内容，然后在执行以下操作

全局安装browserify

```bash
npm install -g browserify
```

执行使用了browserify的gulp任务

```bash
gulp mainJs
```

在项目文件夹`src/demoOne/`下打开`index-browserify-shim.html`

[查看更多browserify的用法](https://github.com/browserify/browserify#usage)
