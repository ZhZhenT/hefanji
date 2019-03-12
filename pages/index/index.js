// pages/index/index.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    useList:[],
    indexshow:false,
    containerid:0,
    bgH :0,
    promotions: []
  },
  //扫一扫
  binSaoYiSaoTap:function(){
    wx.scanCode({
      //扫码成功
      success: (res) => {
        // console.log(res.result)

        var id = utils.GetQueryString(res.result, 'containerID')
   
        wx.navigateTo({
          url: '/pages/shopping/shopping?containerID=' + id
        })
        
      }
    })
  },
  unbd () {
    wx.setStorageSync('mobile', '')
    utils.request('http://fanmofang.17d3.com/api/user/unbindMobile', {  token :app.globalData.token})
      .then(function (res) {

      }, function (err) {

      })
  },
  //去购物页面
  bindToShoppingTap:function(ev){

    var id = ev.currentTarget.dataset.containerid;

    wx.navigateTo({
      url: '/pages/shopping/shopping?containerID=' + id
    })

  },
  bindTojuan (ev) {
    
    var code = ev.target.dataset.code
    var containerid = ev.target.dataset.containerid
    wx.navigateTo({
      url: '/pages/index/index?containerID=' + containerid + '&code=' + code
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    utils.computeHeight(['.tabBarCustom'], function (h) {
      that.setData({
        bgH: h
      })
    })
    console.log(options)
    //获取tocken
    app.getUserToken(options.userid).then(function (res) {
      var token = res.data.token;
      app.globalData.token = token;

      if (options.code) {

        if (options.code === 'register') {
          wx.navigateTo({
            url: '/pages/sharelogin/sharelogin?userid=' + options.userid + '&containerID=' + options.containerID + '&ads=' + options.ads + '&code=' + options.code
          })
        } else {
          wx.navigateTo({
            url: '/pages/sharelogin/sharelogin?userid=' + options.userid + '&containerID=' + options.containerID + '&ads=' + options.ads + '&code=' + options.code
          })
        }  


        setTimeout(function () {
          that.setData({
            indexshow: true
          })
        }, 500)

        return  

      }

      if (options.containerID) {

        wx.navigateTo({
          url: '/pages/shopping/shopping?containerID=' + options.containerID
        })
        setTimeout(function () {
          that.setData({
            indexshow: true
          })
        }, 500)
      } else if (options.toOrder) {
        wx.redirectTo({
          url: '/pages/orderall/orderall'
        })
        setTimeout(function () {
          that.setData({
            indexshow: true
          })
        }, 500)
      } else if (options.q) {
        wx.navigateTo({
          url: '/pages/shopping/shopping?containerID=' + decodeURIComponent(options.q).slice(52)
        })
        setTimeout(function () {
          that.setData({
            indexshow: true
          })
        }, 500)
      } else {
        that.setData({
          indexshow: true
        })
      }
    }, function (err) {

    })

    utils.request('http://fanmofang.17d3.com/api/containers/all', { token: app.globalData.token })
      .then(function (res) {
        console.log(res,'containers')
        var useList = res.data.map((item)=>{
          return {
            id:item.id,
            ads: item.address
          }
        })
        that.setData({
          useList: useList
        })
      }, function (err) {

      })

    utils.request('http://fanmofang.17d3.com/api/promotions/all', { token: app.globalData.token })
      .then(function (res) {
        console.log(res, 'promotions')
        that.setData({
          promotions: res.data
        })
      }, function (err) {

      })
    return
    var containerObj = wx.getStorageSync('containerObj1') || {};
    var useList = []

    for (var key in containerObj) {

      if (!containerObj[key]){
        continue
      }
    
      var obj = { id: key, ads: containerObj[key].slice(0, -13), time: containerObj[key].slice(-13)}
     useList.unshift(obj)
    }

    useList.sort(function (a, b) {
      return a.time < b.time ? 1 : -1;
    });

    this.setData({
      useList: useList
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

})