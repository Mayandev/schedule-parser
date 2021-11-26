// 云函数模板
// 部署：在 cloud-functions/login 文件夹右击选择 “上传并部署”

const cloud = require('wx-server-sdk')
const { DateTimeRecognizer } = require('@microsoft/recognizers-text-date-time')
const { flatten, isEmpty, orderBy } =  require('lodash');
const dayjs = require('dayjs');
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

  const model = new DateTimeRecognizer(lang).getDateTimeModel();
  // result is an array
  const result = model.parse(text);
  const times = flatten(result.map((r) => r.resolution.values));

  if (isEmpty(times)) {
    return null;
  }

  const [targetTime] = orderBy(
    times,
    [({ type }) => priority[type] || 0],
    [`desc`],
  );

  const { type } = targetTime;
  if (['time'].includes(type)) {
    targetTime.start = `${dayjs().format('YYYY-MM-DD')} ${targetTime.value}`
    targetTime.end = dayjs(targetTime.start)
      .add(1, `hour`)
      .format(`YYYY-MM-DD HH:mm:ss`);
  } else if ([`datetime`, `date`].includes(type)) {
    targetTime.start = targetTime.value;
    targetTime.end = dayjs(targetTime.start)
      .add(1, `hour`)
      .format(`YYYY-MM-DD HH:mm:ss`);
  }
  return targetTime;
}

