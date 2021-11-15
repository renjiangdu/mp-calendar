/**
 * @author Ren Jiangdu
 * @date 2021-11-03
 * @github https://github.com/renjiangdu/mp-calendar
 */

import {
  MonthSpan,
  resolveDateInstance,
  getMonthSpans,
  resolveDateString,
  resolveMonthString,
  parseDateStringToDateValue
} from './utils'

/** 默认的最大和最小日期数值 */
const DEFAULT_MIN_DATE_VALUE = 19700101
const DEFAULT_MAX_DATE_VALUE = 99991231

/** 默认渲染的 spans 数目，必须是一个奇数 */
const DEFAULT_SPAN_COUNT = 5
const DEFAULT_SPAN_PIVOT = Math.floor(DEFAULT_SPAN_COUNT / 2)

Component({
  options: {
    pureDataPattern: /^_/
  },

  properties: {
    /** 动态设置当前月份，格式为：YYYY-MM */
    currentMonth: {
      type: String
    },

    /** 动态设置默认选中的日期，格式为： YYYY-MM-DD */
    selectedDate: {
      type: String
    },

    /** 动态设置特殊标记的日期 */
    markedDates: {
      type: Array
    },

    /** 设置可选日期范围的左端点，格式为： YYYY-MM-DD */
    startDate: {
      type: String
    },

    /** 设置可选日期范围的右端点，格式为： YYYY-MM-DD */
    endDate: {
      type: String
    },

    /** 是否显示上个月的最后几天和下个月的前几天用于填充日历的空白位置 */
    showExtraDates: {
      type: Boolean,
      value: false
    }
  },

  data: {
    weekdays: [ '日', '一', '二', '三', '四', '五', '六' ],

    /** 选中的日期 */
    selected: { year: 0, month: 0, date: 0 },

    today: { year: 0, month: 0, date: 0 },

    /** 限制的可选日期范围 */
    minDateValue: DEFAULT_MIN_DATE_VALUE,
    maxDateValue: DEFAULT_MAX_DATE_VALUE,

    spanIndex: -1,
    spans: [] as MonthSpan[],

    marks: {} as Record<number, boolean>,

    swiperHeight: 0,
    /** 日历单行的高度 */
    _rowHeight: 0,

    _currentMonth: '',
    _selectedDate: '',

    _count: 0
  },

  observers: {
    /**
     * 监听 current-month 属性的变化，调整当前显示的月份
     */
    'currentMonth': function (monthString: string) {
      if (!monthString) {
        return
      }
      console.log(monthString, this.data._currentMonth)
      if (monthString === this.data._currentMonth) {
        return
      }

      const { year, month } = resolveMonthString(monthString)
      const spans = getMonthSpans(year, month, -DEFAULT_SPAN_PIVOT, DEFAULT_SPAN_PIVOT)
      this.setData({
        spanIndex: DEFAULT_SPAN_PIVOT,
        spans
      })
    },


    /**
     * 监听 selected-date 属性的变化，调整当前显示的月份
     */
    'selectedDate': function (dateString: string) {
      if (!dateString) {
        return
      }
      if (dateString === this.data._selectedDate) {
        return
      }

      // 记录当前值用于比较，避免重复渲染
      this.data._selectedDate = dateString

      this.setData({
        selected: resolveDateString(dateString)
      })
    },

    /**
     * 监听 spanIndex 和 spans 的变化，调整日历的高度
     */
    'spanIndex, spans': function () {
      console.log(++this.data._count)
      this.modifySwiperHeight()
    },

    /**
     * 监听 marked-dates 的变化，调整特殊标记的日期
     */
    'markedDates': function (markedDates: string[]) {
      if (!markedDates) {
        return
      }
      const marks: Record<number, boolean> = {}
      markedDates.forEach(date => {
        const value = parseDateStringToDateValue(date)
        marks[value] = true
      })
      this.setData({
        marks
      })
    }
  },

  lifetimes: {
    attached() {
      const today = resolveDateInstance(new Date())

      // 如果未设置 current-month，则默认为当前月份
      if (!this.data.currentMonth) {
        this.setData({
          currentMonth: `${today.year}-${today.month}`
        })
      }

      // 如果未设置 selected-date，则默认为今天
      if (!this.data.selectedDate) {
        this.setData({
          selectedDate: `${today.year}-${today.month}-${today.date}`
        })
      }

      // 设置可选的日期区间
      const minDateValue = this.data.startDate ? parseDateStringToDateValue(this.data.startDate) : DEFAULT_MIN_DATE_VALUE
      const maxDateValue = this.data.endDate ? parseDateStringToDateValue(this.data.endDate) : DEFAULT_MAX_DATE_VALUE

      this.setData({
        today,
        minDateValue,
        maxDateValue
      })
    },

    /** 视图层布局完成后执行，获取日历单行的高度 */
    ready() {
      const query = wx.createSelectorQuery().in(this)
      query.select('.item').boundingClientRect(rect => {
        this.data._rowHeight = rect.height
        this.modifySwiperHeight()
      })
      query.exec()
    }
  },

  methods: {
    modifySwiperHeight() {
      // 计算行数
      const { spans, spanIndex } = this.data
      const rows = Math.ceil((spans[spanIndex].weekdayOfFirstDate + spans[spanIndex].days) / 7)
      this.setData({
        swiperHeight: rows * this.data._rowHeight
      })
    },

    /**
     * 当滑动切换月度区间时：
     * 1. 判断是否触及边界，若触及边界则更新日历范围
     * 2. 更新日历区域的高度
     * 3. 事件冒泡，通知上层当前显示的年、月
     */
    bindSwipe(e: WechatMiniprogram.SwiperAnimationFinish) {
      const spanIndex = e.detail.current
      const { year, month } = this.data.spans[spanIndex]

      // 记录当前值用于比较，避免重复渲染
      this.data._currentMonth = `${year}-${month}`

      // 当滑动到右边界时
      if (spanIndex === this.data.spans.length - 1) {
        const spans = getMonthSpans(year, month, -DEFAULT_SPAN_PIVOT, DEFAULT_SPAN_PIVOT)
        this.setData({
          spanIndex: DEFAULT_SPAN_PIVOT,
          spans: spans
        })
      }
      // 当滑动到左边界时
      else if (spanIndex === 0) {
        const spans = getMonthSpans(year, month, -DEFAULT_SPAN_PIVOT, DEFAULT_SPAN_PIVOT)
        this.setData({
          spanIndex: DEFAULT_SPAN_PIVOT,
          spans: spans
        })
      }
      // 在中间部分滑动时
      else {
        this.setData({
          spanIndex: spanIndex
        })
      }

      this.triggerEvent('swipe', { year, month })
    },

    /**
     * 当选中某个日期时：
     * 1. 判断是否在日期的限制范围之内
     * 2. 事件冒泡，通知上层当前选中的年、月、日
     */
    bindSelect(e: WechatMiniprogram.TouchEvent) {
      const { year, month, date, value } = e.currentTarget.dataset
      // 判断是否在限制范围之内
      if (value < this.data.minDateValue || value > this.data.maxDateValue) {
        return
      }

      this.setData({
        selected: { year, month, date }
      })

      this.triggerEvent('select', { year, month, date })
    }
  }
})