# 基于 `WebPack5` 的 `COS` 搭建

## 主要功能
* 自动识别页面引入的 `png` 和 `jpg` 类型
* 读取图片上传到 `COS`
* `HTML` 和 `CSS` 的引入图片格式变为 `Webp`

## 使用方式

* 项目安装

```bash
  npm i melon-cos-plugin -D
```

* `webpack` 初始化

```js
  const MelonCosPlugin = require("melon-cos-plugin");
  const projectName = "项目名";
  const dirName = new Date().toLocaleDateString().replace(/\//g, "");
  plugins: [
    new MelonCosPlugin({
      projectName,
      dirName,
      SecretId: 'COS账号',
      SecretKey: 'COS密码',
      Bucket: '存储桶ID',
      Region: '存储桶地区'
    })
  ],
  output: {
    publicPath: `https://cos.bluej.cn/${projectName}/${dirName}/`
  }
```

## 相关文档链接

* [`基于NodeJS的COS操作`](https://cloud.tencent.com/document/product/436/8629)
* [`html-webpack-plugin`](https://www.npmjs.com/package/html-webpack-plugin)
* [`webpack-sources`](https://www.npmjs.com/package/webpack-sources)

