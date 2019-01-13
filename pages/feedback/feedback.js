// pages/feedback/feedback.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneText: "",
    contentText: "",
    dinnerTimeCurrent: 1,
    dinnerTimeList: [{
        id: 0,
        text: '提交反馈',
        num: 2
      },
      {
        id: 1,
        text: '我的反馈',
        num: 3
      }
    ],
    swiperheigh: 1200,
    sildeHeight: 600,
    current: 1,
    scrollTop: 0,
    fklist: []
  },
  // 切换menu
  modifyTitle() {
    wx.setNavigationBarTitle({
      title: this.data.dinnerTimeList[this.data.dinnerTimeCurrent].text
    })
  },
  bindCurrentchange(c) {
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
  bindinputtext: function(ev) {
    this.setData({
      contentText: ev.detail.value
    })
  },
  bindinputphone: function(ev) {
    this.setData({
      phoneText: ev.detail.value
    })
  },
  bindToUserCenterTap: function() {
    //提交成功回到 用户中心页面
    var that = this;
    var reg = /^\s*$/g;
    var regphone = /^1[3-9][0-9]{9}$/
    if (reg.test(that.data.contentText)) {
      wx.showModal({
        title: '请填写反馈意见',
        showCancel: false,
        confirmColor: '#ff8339',
        content: '',
      })
      return
    }

    if (!regphone.test(that.data.phoneText)) {
      wx.showModal({
        title: '请填正确写联系方式',
        showCancel: false,
        confirmColor: '#ff8339',
        content: '',
      })
      return
    }
    var token = app.globalData.token;
    utils.request('http://fanmofang.17d3.com/api/feedback/create', {
        "method": 'POST',
        "token": token,
        "data": {
          "content": that.data.contentText,
          "phone": that.data.phoneText,
        }
      })
      .then(function(res) {
        //console.log(res)
        wx.showToast({
          title: '意见反馈成功',
          icon: 'success',
          duration: 1000,
        })

        setTimeout(function() {
          wx.redirectTo({
            url: '/pages/usercenter/usercenter'
          })
        }, 1000)
      }, function(err) {

      })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.modifyTitle()
    utils.computeHeight2(['.dinner-time-wrap', '.fk-wrap']).then(function(results) {
      console.log(results)
      that.setData({
        // swiperheigh: Math.max(...(results).slice(1)),
        sildeHeight: results[0] - results[1],
        swiperheigh: Math.max(...(results)) - results[1] + 30
      })
    }).catch(function(e) {

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

})