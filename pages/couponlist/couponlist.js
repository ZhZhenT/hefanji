// pages/couponlist/couponlist.js
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dinnerTimeCurrent: 0,
    dinnerTimeList: [
      { id: 0, text: '可用优惠券', num:2 },
      { id: 1, text: '不可用优惠券',num: 3 }
    ],
    swiperheigh: 500,
    sildeHeight:0,
    current: 0,
    scrollTop: 0
  },
  bindCurrentchange (c) {
    this.setData({
      dinnerTimeCurrent: c.detail.current,
      current: c.detail.current,
      scrollTop: 0
    })
    this.modifyTitle()
  },
  binddinnerTimeCurrentTap(ev) {
    if (this.data.dinnerTimeCurrent == ev.currentTarget.dataset.index) {
      return;
    }
    this.setData({
      dinnerTimeCurrent: ev.currentTarget.dataset.index,
      current: ev.currentTarget.dataset.index
    })
    this.modifyTitle()
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  modifyTitle () {
    wx.setNavigationBarTitle({
      title: this.data.dinnerTimeList[this.data.dinnerTimeCurrent].text
    })
  },
  onLoad: function (options) {
    var that = this;
    this.modifyTitle()
    
    utils.computeHeight2(['.dinner-time-wrap', '.yesbtn', '#discount_list1', '#discount_list2']).then(function (results) {
      that.setData({
        swiperheigh: Math.max(...(results).slice(1)),
        sildeHeight: results[0] - results[1] - results[2]
      })
    }).catch(function (e) {

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})