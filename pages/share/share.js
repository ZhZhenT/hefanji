// pages/share/share.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    savedFilePath: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.globalData, '分享详情')
    var that = this;
    wx.downloadFile({
      url: 'https://www.yuexd.com/assets/images2/share_bg_2019_03.jpg',
      success: function (res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            console.log(res.savedFilePath)
            that.setData({
              savedFilePath: res.savedFilePath
            })
          }
        })

      }
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
  binToShareTap: function () {
    console.log('分享')
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      path: 'pages/index/index?userid=' + app.globalData.userid + '&containerID=' + app.globalData.containerID + '&ads=' + app.globalData.ads + '&code=register',// system
      imageUrl: that.data.savedFilePath
    }
  }
})