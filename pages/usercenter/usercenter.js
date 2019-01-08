
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
  },
  binToOrderallTap:function(){
    wx.navigateTo({
      url: '/pages/orderall/orderall'
    }) 
  },
  binCallTap:function(){
    //拨打客服电话 
    wx.makePhoneCall({
      confirmColor: '#ff8339',
      phoneNumber: '18210990920' 
    })
    
  },
  bindToFeedbackTap:function(){
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    }) 
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


})