// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const { DateTimeRecognizer } = require('@microsoft/recognizers-text-date-time')
const { flatten, isEmpty, orderBy } =  require('lodash');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('Asia/Shanghai');
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 这个示例将经自动鉴权过的小程序用户 openid 返回给小程序端
 * 
 * event 参数包含小程序端调用传入的 data
 * 
 */
exports.main = async (event, context) => {

  const {lang, text} = event;
  
  const priority = {
    datetimerange: 5,
    time: 4,
    datetime: 3,
    daterange: 2,
    date: 1,
  };
  const currentTime = dayjs(dayjs.tz(dayjs()).format('YYYY-MM-DD HH:mm:ss'));
  const model = new DateTimeRecognizer(lang).getDateTimeModel();
  // result is an array
  const result = model.parse(text);
  const times = flatten(result.map((r) => r.resolution.values)).map((time) => {
    if (time.type === `time`) {
      time.value = `${currentTime.format(`YYYY-MM-DD`)} ${time.value}`;
    }
    return time;
  });

  if (isEmpty(times)) {
    return {errMsg: '未监测到时间信息'};
  }

  const filteredTimes = times.filter((time) =>
    currentTime.isBefore(dayjs(time.start || time.value)),
  );


  if (isEmpty(filteredTimes)) {
    return { errMsg: '日程已过期' };
  }

  const [targetTime] = orderBy(
    filteredTimes,
    [({ type }) => priority[type] || 0],
    [`desc`],
  );

  const { type } = targetTime;
  
  if ([`datetime`, `date`, `time`].includes(type)) {
    targetTime.start = dayjs(targetTime.value).format(`YYYY-MM-DD HH:mm:ss`);
    targetTime.end = dayjs(targetTime.start)
      .add(1, `hour`)
      .format(`YYYY-MM-DD HH:mm:ss`);
  }
  return targetTime;
}

