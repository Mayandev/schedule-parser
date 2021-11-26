export type Language = 'en-us' | 'zh-cn';


export type DateRangeTime  = 'datetimerange' | 'daterange';
export type DateType = 'date' | 'datetime';
export type TimeType = DateType | DateRangeTime;

export type Schedule = {
  start: string;
  end: string;
  type: DateRangeTime,
  value?: string
}
export type TimePriority = {
  [key in TimeType]: number;
}

export type CountUnit = 'day' | 'hour';
export type CountUnitText = {
  [keyof in CountUnit]: string;
}
