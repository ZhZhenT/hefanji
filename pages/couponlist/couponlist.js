// pages/couponlist/couponlist.js
const utils = require('../../utils/util.js')
const app = getApp()
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
    swiperheigh: 1200,
    sildeHeight:0,
    current: 0,
    scrollTop: 0,
    select: true,
    selectAll: false,
    discount_list1: [],
    discount_list0: []
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
  binSelectAlltab() {
    let flag = !this.data.selectAll
    this.data.discount_list1.forEach((item) => {
      item.select = false
    })
    this.setData({
      discount_list1: this.data.discount_list1,
      selectAll: flag
    })
  },
  binSelectTab (ev) {
    let id = ev.currentTarget.dataset.id
    this.data.discount_list1.forEach((item) => {
      if (item.id == id) {
        item.select = !item.select
      }
    })
    this.setData({
      discount_list1: this.data.discount_list1,
      selectAll: false
    })
  },
  onLoad: function (options) {
    var that = this;
    // var token = app.globalData.token;
    var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9mYW5tb2ZhbmcuMTdkMy5jb21cL2FwaVwvdXNlclwvbG9naW5cL3dlY2hhdCIsImlhdCI6MTU0NzEzMjcxMCwiZXhwIjoxODYyNDkyNzEwLCJuYmYiOjE1NDcxMzI3MTAsImp0aSI6ImoxZmNOREEzUW1CdzZmUlAiLCJzdWIiOjQsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.xHX5FEkRkCoPyDAez0iEWDE0DUIg-AMXXvxj3OEmKYI'
    this.modifyTitle()
    
    utils.computeHeight2(['.dinner-time-wrap', '.yesbtn', '#discount_list1', '#discount_list2']).then(function (results) {
      that.setData({
        // swiperheigh: Math.max(...(results).slice(1)),
        sildeHeight: results[0] - results[1] - results[2]
      })
    }).catch(function (e) {

    });

    // 获取货柜信息
    utils.request('http://fanmofang.17d3.com/api/my/coupons?type=1', {token: token})
      .then(function (res) {
        console.log(res,'优惠卷 可用')
        that.setData({
          discount_list1: res.data.data.map((item) => {
            item.select = false
            return item
          })
        })
      }, function (err) {

      })

    utils.request('http://fanmofang.17d3.com/api/my/coupons?type=0', { token: token })
      .then(function (res) {
        console.log(res, '优惠卷 不可用')
        that.setData({
          discount_list0: res.data.data
        })
      }, function (err) {

      })

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