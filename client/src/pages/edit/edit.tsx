import Taro, { useRouter } from "@tarojs/taro";
import { useEffect, useState } from "react";
import { isEmpty } from "lodash";
import { View, Form, Button, Input, Text, Picker } from "@tarojs/components";
import * as dayjs from "dayjs";
import { CountUnit, Schedule } from "../../types";

import "./index.scss";
import { AlertTime, CounteTimeMap } from "../../const";

const CURRENT = dayjs();

export default function Edit() {
  const {
    params: { time = "", text = "" }
  } = useRouter();
  const targetTime: Schedule = JSON.parse(time);

  const [startTime, setStartTime] = useState(dayjs(targetTime.start));
  const [endTime, setEndTime] = useState(dayjs(targetTime.end));
  const [alertTime, setAlertTime] = useState(AlertTime[0]);
  const [title, setTitle] = useState("日程标题");
  const [counterUnit, setCounterUnit] = useState("day" as CountUnit);

  const changeAlertTime = async e => {
    const index = e.detail.value;
    const time = AlertTime[Number(index)];
    setAlertTime(time);
  };

  const changerStartTime = (e, type: "date" | "time") => {
    const timeStr = e.detail.value;
    let day;
    if (type === "date") {
      day = dayjs(`${timeStr} ${startTime.format("HH:mm")}`);
    } else if (type === "time") {
      day = dayjs(`${startTime.format("YYYY-MM-DD")} ${timeStr}`);
    }

    setStartTime(day);
    setEndTime(day.add(1, "hour"));
  };

  useEffect(() => {
    if (startTime.diff(CURRENT, "hour") < 24) {
      setCounterUnit("hour");
    } else {
      setCounterUnit("day");
    }
  }, [startTime]);

  const saveSchedule = async () => {
    const { platform } = await Taro.getSystemInfo();
    Taro.showLoading({ title: "正在保存..." });
    const downloadUrl =
      "https://service-p0x2esh8-1254432069.gz.apigw.tencentcs.com/release/ics";
    const data = {
      start: String(startTime.unix()),
      end: String(endTime.unix()),
      title,
      description: text,
      alarm: String(alertTime.value)
    };
    const paramStr = Object.entries(data)
      .map(e => e.join("="))
      .join("&");

    Taro.downloadFile({
      url: `${downloadUrl}?${paramStr}`,
      filePath: Taro.env.USER_DATA_PATH+`/${title}.ics`,
      success: async res => {
        const { filePath } = res;
        // @ts-ignore
        Taro.saveFileToDisk({
          filePath,
          success: () => {
            Taro.hideLoading();
          },
          fail: ({errMsg}) => {
            Taro.showModal({ content: JSON.stringify(errMsg) });
          }
        });
      },
      fail: ({ errMsg }) => {
        Taro.showModal({ content: JSON.stringify(errMsg, null, 2) });
        Taro.showToast({
          title: "网络异常",
          // @ts-ignore
          icon: "error"
        });
      }
    });
    return;
    if (["mac", "windows"].includes(platform)) {
      
    }

    try {
      // @ts-ignore
      const { errMsg } = await Taro.addPhoneCalendar({
        title,
        startTime: startTime.unix(),
        endTime: endTime.unix(),
        description: text,
        alarm: true,
        alarmOffset: alertTime.value * 60
      });

      if (errMsg === "addPhoneCalendar:ok") {
        await Taro.showToast({ title: "保存成功", icon: "success" });
      }
    } catch (error) {
      const { errMsg = "" } = error;

      if (errMsg.indexOf("addPhoneCalendar:fail") > -1) {
        // @ts-ignore
        await Taro.showToast({ title: "已取消", icon: "error" });
      }
    }
  };

  return (
    <View className="edit">
      <View className="card">
        <View className="card-left">
          <View className="card-header">
            <Text className="schedule-title">
              {isEmpty(title) ? "日程标题" : title}
              {"\n"}
            </Text>
            <Text className="schedule-time">
              {startTime.format("HH:mm")}-{endTime.format("HH:mm")}
            </Text>
          </View>
          <View className="card-footer">
            <Text className="count-day">
              {startTime.diff(CURRENT, counterUnit)}
            </Text>
            <Text className="count-day-unit">{CounteTimeMap[counterUnit]}</Text>
          </View>
        </View>
        <View className="card-right">
          <Text className="month">{startTime.month() + 1}月</Text>
          <Text className="day">{startTime.date()}</Text>
        </View>
      </View>
      <Form className="schedule-form">
        <View className="form-item">
          <Input
            onInput={e => setTitle(e.detail.value)}
            placeholder="日程标题"
            placeholderClass="placeholder"
          ></Input>
        </View>
        <View className="picker">
          <Picker
            mode="date"
            onChange={e => {
              changerStartTime(e, "date");
            }}
            value={startTime.format("YYYY-MM-DD")}
            className="form-item date-picker"
          >
            <View>{startTime.format("YYYY-MM-DD")}</View>
          </Picker>
          <Picker
            mode="time"
            onChange={e => {
              changerStartTime(e, "time");
            }}
            value={startTime.format("HH:mm")}
            className="form-item time-picker"
          >
            <View>{startTime.format("HH:mm")}</View>
          </Picker>
        </View>
        <Picker
          header-text="请选择通知时间"
          mode="selector"
          onChange={changeAlertTime}
          range={AlertTime}
          rangeKey={"text"}
          className="alert-picker form-item"
        >
          <View className="alert-picker-text">提前{alertTime.text}提醒</View>
          <View className="right-arrow"></View>
        </Picker>
        <View className="form-item">
          <Input
            className=""
            placeholder="日程描述（默认填充复制内容）"
            placeholderClass="placeholder"
            value={text}
          ></Input>
        </View>
        <Button onClick={saveSchedule} className="btn" hoverClass="btn__hover">
          保存日程
        </Button>
        <Button openType="share" className="share-btn">
          分享日程
        </Button>
      </Form>
    </View>
  );
}
