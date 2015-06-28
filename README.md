

#### \#\#目录结构
- ### apis

    > 数据库操作的直接 api, 
- scripts

    > 页面脚本文件, 压缩后输出到 dist/scripts
- styles

    > 页面样式文件, 压缩后输出到 dist/styles
- routers

    > 服务端路由，包括 api 接口
- views

    > 页面模板
- configs

    > 服务端配置文件
- statics
    - libs

        > 某些第三方库如 ueditor
    - uploads

        > 上传的文件
    - assets

        > 其它资源，如网页字体文件

---
### \#\#静态文件访问
需要在 模板文件中引用 bower_components | dist | statics 目录下的静态文件时， 只需要把相应的一级目录改为 /statics。 （目前是在 server.js中通过 express 处理， //TODO =>nginx）如：

- bower_components/jquery/dist/jquery.js  => /statics/jquery/dist/jquery.js
- dist/scripts/public-index.min.js => /statics/scripts/public-index.min.js


---

### \# workflow
1. `npm install`
2. `bower install`
3. `npm start`
4. `gulp dev`

localhost:6005

for livereload, install chrome livereload plugin