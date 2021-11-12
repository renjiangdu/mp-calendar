const app = getApp()

Page({
  data: {
    startDate: '1970-01-01',
    endDate: '9999-12-31',
    currentMonth: '2021-10',
    selectedDate: '2021-10-05',
    markedDates: [ '2021-11-09', '2021-11-10', '2021-11-13', '2021-12-01' ]
  },

  bindChangeMonth(e: WechatMiniprogram.PickerChange) {
    this.setData({
      currentMonth: e.detail.value as string
    })
  },

  bindChangeDate(e: WechatMiniprogram.PickerChange) {
    this.setData({
      selectedDate: e.detail.value as string
    })
  },

  bindSwipe(e: WechatMiniprogram.TouchEvent) {
    const { year, month } = e.detail
    this.setData({
      currentMonth: `${year}-${month}`
    })
  },

  bindSelect(e: WechatMiniprogram.TouchEvent) {
    const { year, month, date } = e.detail
    this.setData({
      selectedDate: `${year}-${month}-${date}`
    })
  }
})
