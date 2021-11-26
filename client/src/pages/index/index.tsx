import { Component } from "react";
import Taro from "@tarojs/taro";
import { View, Button, Textarea, Form } from "@tarojs/components";

import "./index.scss";
import { isEmpty } from 'lodash';


export default class Index extends Component {
  componentWillMount() {}

  componentDidMount() {}

  componentWillUnmount() {}

  componentDidShow() {}

  componentDidHide() {}

  async submitText(e) {

    const { text } = e.detail.value;

    if (!text) {
      // @ts-ignore
      Taro.showToast({icon: 'error',title: '请输入日程信息'});
      return;
    }

    Taro.showLoading({title: '解析中'});
    try {
      const { result } = await Taro.cloud.callFunction({
        name: 'parse',
        data: {
          text,
          lang: 'zh-cn'
        }
      });
      
      Taro.hideLoading();

      if (isEmpty(result)) {
        // @ts-ignore
        Taro.showToast({icon: 'error',title: '未解析到时间'});
        return;
      }

      Taro.navigateTo({
        url: `/pages/edit/edit?time=${JSON.stringify(result)}&text=${text}&from=redirect`
      });
    } catch (error) {
        // @ts-ignore
      await Taro.showToast({icon: 'error',title: '网络错误', duration: 2000});
      Taro.hideLoading();
    }
  }

  render() {
    return (
      <View className="index">
        <Form onSubmit={this.submitText}>
          <View className="input-container">
            <Textarea
              className="textarea"
              placeholder="请输入/复制日程信息..."
              placeholderClass="placeholder"
              name="text"
            />
          </View>
          <Button
            className="btn parse-btn"
            hoverClass="btn__hover"
            formType="submit"
          >
            解析日程
          </Button>
        </Form>
      </View>
    );
  }
}
