// pages/feedback/feedback.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneText:"",
    contentText:""
  },
  bindinputtext:function(ev){
    this.setData({
      contentText: ev.detail.value
    })
  },
  bindinputphone:function(ev){
    this.setData({
      phoneText: ev.detail.value
    })
  },
  bindToUserCenterTap:function(){
    //提交成功回到 用户中心页面
    var that = this;
    var reg = /^\s*$/g;
    var regphone = /^1[3-9][0-9]{9}$/
    if (reg.test(that.data.contentText)){
      wx.showModal({
        title: '请填写反馈意见',
        showCancel:false,
        confirmColor:'#ff8339',
        content: '',
      })
      return
    }

    if (!regphone.test(that.data.phoneText)) {
      wx.showModal({
        title: '请填正确写联系方式',
        showCancel: false,
        confirmColor:'#ff8339',
        content: '',
      })
      return
    }
    var token = app.globalData.token;
    utils.request('https://www.yuexd.com/api/feedback/create',{
      "method": 'POST',
      "token": token,
      "data":{
        "content": that.data.contentText,
        "phone": that.data.phoneText,
      }
    })
    .then(function(res){
      //console.log(res)
      wx.showToast({
        title: '意见反馈成功',
        icon: 'success',
        duration: 1000,
      })

      setTimeout(function () {
        wx.redirectTo({
          url: '/pages/usercenter/usercenter'
        })
      }, 1000)
    },function(err){

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