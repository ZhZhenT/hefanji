// pages/goodsdetail/goodsdetail.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    goodsList: [],
    goodsid: 0,
    totalNum: 0,
    totalPrise: 0,
    reducePrise:0,
    onMyEventAddGoods: {},
    detail:null,
    showorderno:false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onMyEventRemoveShopCartTap: function (ev) {
    var that = this
    // 所有商品列表
    var goodsList = this.data.goodsList
    //清空已选择商品
    goodsList = utils.removeallgoods(goodsList, app.globalData.containerID);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)
    var detail = utils.getdatefenzu(goodsList);


    var flag = true
    if (ev.detail.noshow ){
      flag = false
    }  

    that.setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList,
      detail: detail,
      showorderno: flag
    })

    app.globalData.goodsList = goodsList;
    app.globalData.totalNum = res.totalNum;
    app.globalData.totalPrise = res.totalPrise;
    app.globalData.reducePrise = res.reducePrise;

    //更新上个页面数据
    var pages = getCurrentPages();

    pages.forEach(function (item, index) {
      if (index < pages.length) {
        item.setData({
          totalNum: res.totalNum,
          totalPrise: res.totalPrise,
          reducePrise: res.reducePrise,
          goodsList: goodsList,
          detail: detail
        })
      }
    })
  },
  onMyEventReduceGoods: function (ev) {
    var that = this
    // 所有商品列表
    var goodsList = this.data.goodsList
    // 当前商品ID
    var goodsid = ev.detail.goodsid
    // 商品时间
    var dateid = ev.detail.dateid

    // 计算当前商品数量
    goodsList = utils.reducegoods(goodsList, goodsid, dateid);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)

    var detail = utils.getdatefenzu(app.globalData.goodsList);

    if (res.totalNum == 0) {
      that.setData({
        isCartShow: false,
        showorderno: true
      })
    }

    that.setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList,
      detail: detail
    })

    app.globalData.goodsList = goodsList;
    app.globalData.totalNum = res.totalNum;
    app.globalData.totalPrise = res.totalPrise;
    app.globalData.reducePrise = res.reducePrise;

    //更新上个页面数据
    var pages = getCurrentPages();
    
    pages.forEach(function(item,index){
        if(index<pages.length){
          item.setData({
            totalNum: res.totalNum,
            totalPrise: res.totalPrise,
            reducePrise: res.reducePrise,
            goodsList: goodsList,
            detail:detail
          })
        }
    })



  },
  onMyEventAddGoods: function (ev) {
    var that = this
    // 获取库存 当前数量
    var available = ev.detail.available
    var total = ev.detail.total

    if (available <= total) {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '库存不足',
        confirmColor: '#ff8339',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      return
    }
    // 所有商品列表
    var goodsList = this.data.goodsList
    // 当前商品ID
    var goodsid = ev.detail.goodsid
    // 商品时间
    var dateid = ev.detail.dateid
    // 计算当前商品数量
    goodsList = utils.addgoods(goodsList, goodsid, dateid);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)

    that.setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList
    })

    app.globalData.goodsList = goodsList;
    app.globalData.totalNum = res.totalNum;
    app.globalData.totalPrise = res.totalPrise;
    app.globalData.reducePrise = res.reducePrise;

    //更新上个页面数据
    var pages = getCurrentPages();

    pages.forEach(function (item, index) {
      if (index < pages.length) {
        item.setData({
          totalNum: res.totalNum,
          totalPrise: res.totalPrise,
          reducePrise: res.reducePrise,
          goodsList: goodsList
        })
      }
    })

  },
  bindReduceTap: function (ev) {
    var that = this
    // 所有商品列表
    var goodsList = this.data.goodsList
    // 当前商品ID
    var goodsid = ev.currentTarget.dataset.goodsid
    // 餐品时间
    var dateid = ev.currentTarget.dataset.dateid
    // 计算当前商品数量
    goodsList = utils.reducegoods(goodsList, goodsid, dateid);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)

    that.setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList
    })

    app.globalData.goodsList = goodsList;
    app.globalData.totalNum = res.totalNum;
    app.globalData.totalPrise = res.totalPrise;
    app.globalData.reducePrise = res.reducePrise;

    //更新上个页面数据
    var pages = getCurrentPages();

    pages.forEach(function (item, index) {
      if (index < pages.length) {
        item.setData({
          totalNum: res.totalNum,
          totalPrise: res.totalPrise,
          reducePrise: res.reducePrise,
          goodsList: goodsList
        })
      }
    })
  },
  bindAddTap: function (ev) {
    var that = this
    // 所有商品列表
    var goodsList = this.data.goodsList
    // 当前商品ID
    var goodsid = ev.currentTarget.dataset.goodsid
    // 餐品时间
    var dateid = ev.currentTarget.dataset.dateid
    // 计算当前商品数量
    goodsList = utils.addgoods(goodsList, goodsid, dateid);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)

    that.setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList
    })

    app.globalData.goodsList = goodsList;
    app.globalData.totalNum = res.totalNum;
    app.globalData.totalPrise = res.totalPrise;
    app.globalData.reducePrise = res.reducePrise;
    //更新上个页面数据
    var pages = getCurrentPages();

    pages[0].setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList
    })
  },
  
  onLoad: function (options) {

    var that = this;

    
    var detail =  utils.getdatefenzu(app.globalData.goodsList);

    //初始化购物车数据
    this.setData({
      goodsList: app.globalData.goodsList,
      totalNum: app.globalData.totalNum,
      totalPrise: app.globalData.totalPrise,
      reducePrise: app.globalData.reducePrise,
      detail: detail
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