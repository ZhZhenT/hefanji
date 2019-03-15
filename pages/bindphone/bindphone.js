const utils = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendYZM: false,
    yzmtext: '获取验证码',
    phonenum: '',
    yzm: '',
    hasphone:''
  },
  binToBackTab () {
    wx.navigateBack({
      delta: 1
    })
  },  
  
  bindPhoneInput(e) {
    this.setData({
      phonenum: e.detail.value
    })
  },
  bindYZMInput(e) {
    this.setData({
      yzm: e.detail.value
    })
  },
  isSendYZM() {
    if (this.data.sendYZM) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请稍后获取验证码',
        confirmColor: '#ff8339',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    } else {
      return true
    }
  },
  regYZM() {
    if (!this.data.yzm) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入验证码',
        confirmColor: '#ff8339',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    } else {
      return true
    }
  },
  regPhone() {
    if (!(/^1(3|4|5|7|8)\d{9}$/.test(this.data.phonenum))) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请输入正确的手机号',
        confirmColor: '#ff8339',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return;
    } else {
      return true
    }
  },
  showAlert(text) {
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: text,
      confirmColor: '#ff8339',
      success: function (res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    })
  },
  bindGetYZMTap() {

    if (!this.regPhone()) {
      return
    }

    if (!this.isSendYZM()) {
      return
    }

    this.setData({
      sendYZM: true,
      yzmtext: 60 + 's'
    })
    this.countDown()
  },
  // 获取验证码
  countDown() {

    var token = app.globalData.token;

    utils.request('http://fanmofang.17d3.com/api/sms/verificationCode/send?mobile=' + this.data.phonenum, {})
      .then(function (res) {

      }, function (err) {

      })

    let s = 59
    let timer = setInterval(() => {
      this.setData({
        yzmtext: s + 's'
      })
      s--;
      if (s == -1) {
        this.setData({
          yzmtext: '获取验证码',
          sendYZM: false,
        })
        clearInterval(timer)
      }
    }, 1000)

  },
  // 提交 

  submit() {
    var that = this;
    if (!this.regPhone()) {
      return
    }
    if (!this.regYZM()) {
      return
    }
    // mobile: 必需，11位国内手机号，不支持国际
    //  verification_code: 必需，短信验证码
    utils.request('http://fanmofang.17d3.com/api/user/bindMobile?mobile=' + this.data.phonenum + '&verification_code=' + this.data.yzm , { token: app.globalData.token })
      .then(function (res) {
        if (res.data.status) {
          that.showAlert('恭喜您！绑定成功')
          wx.navigateBack({
            delta: 1
          })
          wx.setStorageSync('mobile', that.data.phonenum)
        } else {
          if (res.data.state_code == 1) {
            that.showAlert(res.data.message + '')
          }
          if (res.data.state_code == 3) {
            that.showAlert(res.data.message + '')
            that.setData({
              type: 3
            })
          }
        }
      }, function (err) {

      })

  },
  updataphone () {
    this.setData({
      hasphone: ''
    })
  },
  onLoad: function (options) {
    this.setData({
      hasphone: wx.getStorageSync('mobile')
    })
    // app.globalData.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9mYW5tb2ZhbmcuMTdkMy5jb21cL2FwaVwvdXNlclwvbG9naW5cL3dlY2hhdCIsImlhdCI6MTU0NzI3MzE3NiwiZXhwIjoxODYyNjMzMTc2LCJuYmYiOjE1NDcyNzMxNzYsImp0aSI6IjZ5WWRBU25rOUVuZnZaaEMiLCJzdWIiOjQsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.FPzvPzP95bM8Cc9f5WVS2EJFXmno7cE4K7sLxZggTSM'
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

})