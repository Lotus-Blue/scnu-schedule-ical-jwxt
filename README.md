# 所需环境
(1)`node.js`

(2)`React.js`

# 配置过程
(1)在安装之前要确认你的机器上安装了[`node.js`](https://nodejs.org/zh-cn/)。如果没有安装，同学可以到 [`node.js`](https://nodejs.org/zh-cn/) 的官网下载自己电脑的对应的安装包来安装好环境。
![官网](pictures\node_js_official_website.png)
--------
(2)检测是否已安装好`node.js`
在`cmd`中输入

`npm -v`

如果有版本提示，则表明成功，若无可以考虑下要将`node.js`加入环境变量中

![检查](pictures\check.png)

--------------
(3)安装好环境以后，只需要按照官网的指引安装 `create-react-app` 即可

在`cmd`中输入

`npm install -g create-react-app`

这条命令会在我们的计算机上安装` create-react-app `的命令，安装好以后就可以直接使用这条命令来构建`react`过程

提醒:构建第一个react工程时会安装所需依赖，安装过程比较慢，大概率是因为`npm` 是从国外源下载依赖，我们 ` npm `的源改成国内的 taobao 的源，z这样速度就会有所改善。在安装依赖之前可以先修改一下 `npm` 的源：

`npm config set registry https://registry.npm.taobao.org`

(4)创建`react`工程，安装所需依赖

`create-react-app my-first-react-app`


此过程需要等待几分钟，最后提示`sucess`的话表明成功


(5)`clone`该项目

`git clone https://github.com/Lotus-Blue/scnu-schedule-ical-jwxt.git`

(6)安装该项目所需要依赖

`cd`到该项目目录，执行

`npm install`

执行后会自动安装`package.json`内的依赖,此过程有点慢，稍微等待

(7)启动项目

`npm start`

如果前面没出差错，等下会自动跳转到浏览器，此页面就是该项目页面

![主页](pictures\website_view.png)