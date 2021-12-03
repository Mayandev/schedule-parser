# 日程小助手

一个极简的日程解析小程序。给我一段文本，还你一个日程。

![schedule-parser-3](https://mayandev.oss-cn-hangzhou.aliyuncs.com/uPic/schedule-parser-3.png)

小程序二维码：

![gh_afe22e1af473_344](https://mayandev.oss-cn-hangzhou.aliyuncs.com/uPic/gh_afe22e1af473_344.jpeg)

## 快捷指令

为了简化操作步骤，制作了[快捷指令](https://www.icloud.com/shortcuts/4a4c7d5243b54af3b5c1857e96edf450)，使用者可以在 iOS、iPadOS、MacOS（需要更新 Monterey 系统）使用。当复制了一段通知之后，点击快捷指令，会自动解析通知的文本内容，创建一个新的日程。

## API 文档

为了方便二次开发，将开发的 API 接口进行开放，可以移步查阅 [API 文档](https://documenter.getpostman.com/view/6822627/UVJbJy7G)。

![schedule-parse-1](https://mayandev.oss-cn-hangzhou.aliyuncs.com/uPic/schedule-parse-1.png)

本次提供两个 API，**文字解析**接口支持传入一段文字，返回其中的时间信息；**下载日历**接口支持生成 `.ics` 文件，可以直接导入系统的日历。

## 运行项目

运行环境：

- Node: 14.17.0
- Taro: 3.3.14

输入下面的命令运行小程序：

```bash
git clone https://github.com/Mayandev/schedule-parser
cd schedule-parser/client
yarn && yarn start
```

