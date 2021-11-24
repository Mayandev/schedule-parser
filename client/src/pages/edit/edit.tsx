import Taro from "@tarojs/taro";
import { View, Form, Button, Input, Text, Picker } from "@tarojs/components";

import "./index.scss";

export default function Edit() {
  return (
    <View className="edit">
      <View className="card">
        <View className="card-left">
          <View className="card-header">
            <Text className="schedule-title">活动标题{"\n"}</Text>
            <Text className="schedule-time">9:00-10:00</Text>
          </View>
          <View className="card-footer">
            <Text className="count-day">1</Text>
            <Text>天</Text>
          </View>
        </View>
        <View className="card-right">
          <Text className="month">11月</Text>
          <Text className="day">23</Text>
        </View>
      </View>
      <Form className="schedule-form">
        <View className="form-item">
          <Input className="" placeholder="活动标题"></Input>
        </View>
        <View className="picker">
          <Picker
            mode="date"
            onChange={() => {}}
            value={"2021-10-10"}
            className="form-item date-picker"
          >
            <View>2021-10-10</View>
          </Picker>
          <Picker
            mode="time"
            onChange={() => {}}
            value={"10:20"}
            className="form-item time-picker"
          >
            <View>10:00</View>
          </Picker>
        </View>
        <Picker
          mode="selector"
          onChange={() => {}}
          range={["1", "2"]}
          className="alert-picker form-item"
        >
          <View>提前 30 分钟通知</View>
          <View className="right-arrow"></View>
        </Picker>
        <View className="form-item">
          <Input
            className=""
            placeholder="活动描述（默认填充复制内容）"
          ></Input>
        </View>
        <Button className="btn">保存日程</Button>
        <Button openType="share" className="share-btn">分享日程</Button>
      </Form>
    </View>
  );
}
