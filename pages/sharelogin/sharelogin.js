// pages/sharelogin/sharelogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendYZM: false,
    yzmtext: '获取验证码'
  },
  bindToIndexTap () {
    wx.navigateTo({
      url: '/pages/index/index'
    })
  },
  bindGetYZMTap () {

    if (this.data.sendYZM) {
      return   
    }

    this.setData({
      sendYZM : true,
      yzmtext: 60 + 's'
    })
    this.countDown()
  },

  countDown () {
    let s = 59
    let timer = setInterval(()=>{
      this.setData({
        yzmtext: s + 's'
      })
      s--;
      if ( s == -1 ) {
        this.setData({
          yzmtext: '获取验证码',
          sendYZM: false,
        })
        clearInterval(timer)
      }
    },1000)

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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