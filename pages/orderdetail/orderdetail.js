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
    showorderno:false,
    selectjuan: '',
    discountnum: 0,
    juanprise: 0,

    swiperheigh: 1200,
    sildeHeight: 0,
    current: 0,
    scrollTop: 0,
    select: true,
    selectAll: false,
    discount_list1: [],
    see: false,
    seelength:3
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindSeeAll () {
    console.log(this.data.discount_list1)
    this.setData({
      seelength: this.data.seelength == 3 ? this.data.discount_list1.length : 3
    })
  },
  binSelectTab(ev) {
    if (this.data.see) {
      return
    }
    let id = ev.currentTarget.dataset.id
    this.data.discount_list1.forEach((item) => {
      if (item.id == id) {
        console.log(item,'优惠卷')
        item.select = !item.select
        var juan = item
        var juanprise = 0
        var itemselect = item.select
        if (juan.type !== 'fixed') {
          juanprise = utils.findMax(app.globalData.goodsList)
        } else if (juan.type == 'fixed') {
          juanprise = juan.value
        }
        
        //更新上个页面数据
        var pages = getCurrentPages();
        pages.forEach(function (item, index) {
          if (index < pages.length) {
            item.setData({
              selectjuan: itemselect ? juan || '' : '' ,
              juanprise: itemselect ? juanprise : 0
            })
          }
        })
 
        app.globalData.selectID = item.id
        app.globalData.selectID_phone = item.is_mobile_required

      } else {
        item.select = false
      }
    })
    this.setData({
      discount_list1: this.data.discount_list1,
      selectAll: false
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
    var pages = getCurrentPages();
    pages.forEach(function (item, index) {
      if (index < pages.length) {
        item.setData({
          selectjuan: '',
          juanprise: 0
        })
      }
    })
  },
  binTocouponlistTap: function () {
    let selectID = ''
    let selectID_phone = ''
    if (this.data.selectjuan) {
      selectID = this.data.selectjuan.id
      selectID_phone = this.data.selectjuan.is_mobile_required
    }
    app.globalData.selectID = selectID
    app.globalData.selectID_phone = selectID_phone
    wx.navigateTo({
      url: '/pages/couponlist/couponlist?selectjuan=' + selectID + '&totalPrise=' + app.globalData.totalPrise
    })
  },
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
    that.bindDeleteTab()
    this.getjuan()
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
    var can = ev.detail.can
    var containerid = app.globalData.containerID
    // 计算当前商品数量
    goodsList = utils.reducegoods(goodsList, goodsid, dateid, containerid,can);
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
    that.bindDeleteTab()
    this.getjuan()
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
    var containerid = app.globalData.containerID
    var can = ev.detail.can
    // 计算当前商品数量
    goodsList = utils.addgoods(goodsList, goodsid, dateid,containerid,can);
    
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
    that.bindDeleteTab()
    this.getjuan()
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
    var can = ev.currentTarget.dataset.can
    // 计算当前商品数量
    goodsList = utils.reducegoods(goodsList, goodsid, dateid,can);
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
    that.bindDeleteTab()
    this.getjuan()
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
  showMore(ev) {
    let id = ev.currentTarget.dataset.id
    var that = this
    this.data.discount_list1.forEach((item) => {
      if (item.id == id) {
        item.show = !item.show
        // setTimeout(function () {
        //   utils.computeHeight2(['#discount_list1', '#discount_list2']).then(function (results) {
        //     that.setData({
        //       swiperheigh: Math.max(...(results).slice(1), that.data.swiperheigh),
        //     })
        //   }).catch(function (e) {

        //   });
        // }, 30)
      } else {
        item.show = false
      }
    })
    this.setData({
      discount_list1: this.data.discount_list1
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
    var can = ev.currentTarget.dataset.can
    // 计算当前商品数量
    goodsList = utils.addgoods(goodsList, goodsid, dateid,can);
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

    that.bindDeleteTab()

    this.getjuan()

    //更新上个页面数据
    var pages = getCurrentPages();

    pages[0].setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList
    })
  },
  // 删除优惠卷
  bindDeleteTab: function (ev) {
    console.log(this.data.selectjuan)

    this.data.discount_list1.forEach((item) => {
      item.select = false
    })
    this.setData({
      selectjuan: false,
      juanprise: 0,
      discount_list1: this.data.discount_list1
    })
    app.globalData.selectID = ''
    app.globalData.selectID_phone = ''
  }, 
  getjuan () {
    var that = this;
    utils.request('https://www.yuexd.com/api/my/coupons?type=1' + '&cart_amount=' + app.globalData.totalPrise, { token: app.globalData.token })
      .then(function (res) {
        console.log(res, '优惠卷 可用')
        that.setData({
          discountnum: res.data.data.length,
          discount_list1: res.data.data
        });
      }, function (err) {

      })
  },
  onLoad: function (options) {
 
    var that = this;
    var token = app.globalData.token
    var detail =  utils.getdatefenzu(app.globalData.goodsList);
    
    //初始化购物车数据
    this.setData({
      goodsList: app.globalData.goodsList,
      totalNum: app.globalData.totalNum,
      totalPrise: app.globalData.totalPrise,
      reducePrise: app.globalData.reducePrise,
      detail: detail
    })


    this.getjuan()

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