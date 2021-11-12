/**
 * @author Ren Jiangdu
 * @date 2021-11-03
 * @github https://github.com/renjiangdu/mp-calendar
 */

/** 一年中每个月的天数 */
const YEAR_MONTH_DAYS = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]
const LEAP_YEAR_MONTH_DAYS = [ 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ]

/**
 * 判断是否为闰年
 *
 * @param {number} year
 * @return {number}
 */
function isLeapYear(year: number) {
  return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0)
}

/**
 * 获取某年某月的总天数
 *
 * @param {number} year
 * @param {number} month
 * @return {number}
 */
function countDaysOfMonth(year: number, month: number): number {
  if (month < 1 || month > 12) {
    throw new Error('month should be an integer in [1, 12]')
  }
  return isLeapYear(year) ? LEAP_YEAR_MONTH_DAYS[month - 1] : YEAR_MONTH_DAYS[month - 1]
}

function formatNumber(n: number) {
  const digits = n.toString()
  return digits[1] ? n : `0${n}`
}

interface DateDetail {
  year: number
  month: number
  date: number
}

/**
 * 将 Date 实例解析为年、月、日
 *
 * @param {Date} date
 * @return {DateDetail}
 */
export function resolveDateInstance(date: Date): DateDetail {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    date: date.getDate()
  }
}

/**
 * 解析日期字符串为年、月、日
 *
 * @param {string} dateString YYYY-MM-DD 格式的日期字符串
 * @return {DateDetail}
 */
export function resolveDateString(dateString: string): DateDetail {
  const reg = /^\d{4}-\d{1,2}-\d{1,2}$/
  if (!reg.test(dateString)) {
    throw new Error('invalid date string')
  }
  const [ year, month, date ] = dateString.split('-')
  return {
    year: parseInt(year),
    month: parseInt(month),
    date: parseInt(date)
  }
}

interface MonthDetail {
  year: number
  month: number
}

/**
 * 解析月份字符串为年、月
 *
 * @param {string} monthString YYYY-MM 格式的月份字符串
 * @return {MonthDetail}
 */
export function resolveMonthString(monthString: string): MonthDetail {
  const reg = /^\d{4}-\d{1,2}$/
  if (!reg.test(monthString)) {
    throw new Error('invalid month string')
  }
  const [ year, month ] = monthString.split('-')
  return {
    year: parseInt(year),
    month: parseInt(month)
  }
}

/** 月度区间 */
export interface MonthSpan {
  /** 月份的数值为月份第一天的日期数值 */
  monthValue: number
  year: number
  month: number
  days: number
  /** 本月的第一天是周几 */
  weekdayOfFirstDate: number
  /** 上个月的总天数 */
  daysOfLastMonth: number
}

/**
 * 获取一个月度区间信息
 *
 * @param {number} year
 * @param {number} month
 * @param {number} [offset] 与指定月份的偏移量
 * @return {MonthSpan}
 */
function getMonthSpan(year: number, month: number, offset?: number): MonthSpan {
  if (offset === undefined) {
    offset = 0
  }
  month = month - 1 + offset

  // 获取目标月份的年、月
  const target = new Date(year, month, 1)
  const { year: tYear, month: tMonth } = resolveDateInstance(target)

  // 获取目标月份上个月的年、月
  const last = new Date(year, month - 1, 1)
  const { year: lYear, month: lMonth } = resolveDateInstance(last)

  return {
    monthValue: parseInt(`${tYear}${formatNumber(tMonth)}01`),
    year: tYear,
    month: tMonth,
    days: countDaysOfMonth(tYear, tMonth),
    weekdayOfFirstDate: target.getDay(),
    daysOfLastMonth: countDaysOfMonth(lYear, lMonth)
  }
}

export function getMonthSpans(year: number, month: number, left: number, right: number): MonthSpan[] {
  const spans: MonthSpan[] = []
  for (let offset = left; offset <= right; offset++) {
    spans.push(getMonthSpan(year, month, offset))
  }
  return spans
}

/**
 * 转换日期字符串为日期数值
 *
 * @param {string} dateString YYYY-MM-DD 格式的日期字符串，如：2020-10-29
 * @return {number} 日期数值，如：20201029
 */
export function parseDateStringToDateValue(dateString: string): number {
  const { year, month, date } = resolveDateString(dateString)
  const valueString = `${year}${formatNumber(month)}${formatNumber(date)}`
  return parseInt(valueString)
}