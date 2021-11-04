const COS = require('cos-nodejs-sdk-v5');
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ConcatSource } = require("webpack-sources");

module.exports = class MelonCosPlugin {
  constructor(options) {
    options.dirName = options.dirName || new Date().toLocaleDateString()
    this.options = options;
    this.cosObj = new COS({
      SecretId: options.SecretId,
      SecretKey: options.SecretKey
    });
  }

  apply(compiler) {

    compiler.hooks.compilation.tap('updateWebp', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync('updateHtmlWebp', (data, cb) => {
        // data.html = data.html.replace(".png", ".webp");
        data.html = data.html.replace(/\/(\w+).png/g, `/${projectName}/${dirName}/$1.webp`);
        cb(null, data)
      })
      compilation.hooks.processAssets.tap({
        name: 'updateCssWebp',
        stage: compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
      }, (assets) => {
        Object.entries(assets).forEach(([pathname, source]) => {
          if (pathname.endsWith(".css")) {
            // assets[pathname] = new ConcatSource(source.source().replace(/.png/g, ".webp"));
            assets[pathname] = new ConcatSource(source.source().replace(/\/(\w+).png/g, `/${projectName}/${dirName}/$1.webp`));
          }
        });
      });
    });

    compiler.hooks.emit.tapAsync('ToCos', (params, cb) => {
      for (const key in params.assets) {
        if (Object.hasOwnProperty.call(params.assets, key)) {
          if (!key.endsWith(".html")) {
            this.uploadFile(path.join(this.options.this.options.dirName, dirName, key).replace(/\\/, "/"), params.assets[key].source());
            // this.uploadFile(key, params.assets[key].source());
          }
        }
      }
      cb();
    });
  }

  uploadFile(fileName, bufferData) {
    this.cosObj.putObject({
      Bucket: this.options.Bucket,
      Region: this.options.Region,
      Key: fileName,
      Body: bufferData,
    }, function (err) {
      if (err) {
        console.error("----------COS 错误--------------");
        console.log(`文件 ${fileName} 上传失败`);
        console.log(err);
        console.error("----------COS 错误--------------");
      } else {
        console.log(`文件 ${fileName} 成功上传`);
      }
    });
  }
};