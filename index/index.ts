const app = getApp()

Page({
  data: {
    startDate: '2021-09-28',
    endDate: '2021-11-10',
    currentMonth: '2021-10',
    selectedDate: '2021-10-05'
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
