/*
const STATUS_DELIVERY_TO_BE_DELIVERED = 'to_be_delivered'; // 等待配送  显示灰色按钮
const STATUS_DELIVERY_DELIVERING = 'delivering'; // 配送中    显示灰色按钮
const STATUS_DELIVERY_DELIVERED = 'delivered'; // 配送完成，等待取餐  不在取餐时间内 灰色按钮   在取餐时间内 黄色按钮
const STATUS_DELIVERY_PICKING = 'picking'; // 取餐处理中 
const STATUS_DELIVERY_PICKED_UP = 'picked_up'; // 已取餐 无按钮 
过期 不显示 
*/
  //index.js
//获取应用实例
const app = getApp()
const utils = require('../../utils/util.js')
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,

    swiperImgUrls: [
      'http://fanmofang.17d3.com/assets/images2/index-banner1.jpg'
    ],
    swiperCurrent: 0,
    swiperAdsText: '',
    scrollViewLeftDateList: [],
    scrollViewLeftCurrent: 0,
    scrollHeight: 0,
    scrollLeftHeight:0,
    windowHeight:0,
    ballX: 0,
    ballY: 0,
    isBallShow: false,
    isShow:false,
    shopCartDYD:false,
    
    balls: [
      { isShow: false, ballX: 0, ballY: 0 },
      { isShow: false, ballX: 0, ballY: 0 },
      { isShow: false, ballX: 0, ballY: 0 },
      { isShow: false, ballX: 0, ballY: 0 },
      { isShow: false, ballX: 0, ballY: 0 }
    ],

    animationBall1: null,
    animationBall2: null,
    totalNum:0,
    totalPrise:0,
    reducePrise:0,
    isCartShow:false,
    isOrderConfirm:false,
    ispromptlayer:false,
    promptlayerTxT:'',
    ispromptlayertimer: null,
    isAdd:false,
    goodsList:[],
    cartGoodList:{},
    dydtimer:null,
    scrollTop:0,
    detail:[],
    
    dinnerTimeCurrent: 1,
    dinnerTimeList: [

    ]

  },
  binddinnerTimeCurrentTap (ev) {
    if (this.data.dinnerTimeCurrent == ev.currentTarget.dataset.index) {
      return;
    } this.setData({
      
    })

    this.setData({
      dinnerTimeCurrent: ev.currentTarget.dataset.index,
      scrollTop: 0
    })
    // this.getContainers(ev.currentTarget.dataset.id)
  },
  // 去分享页面
  binToShareTap (ev) {
    wx.navigateTo({
      url: '../share/share'
    })
  },
  //跳转去详情页面
  binToGoodsDetail:function(ev){

    var goodsid = ev.currentTarget.dataset.goodsid;
    var dateid = ev.currentTarget.dataset.dateid;
    var can = ev.currentTarget.dataset.can;
    wx.navigateTo({
      url: '../goodsdetail/goodsdetail?goodsid=' + goodsid + '&dateid=' + dateid + '&can=' + can,
    })

  },
  bindSwiperChange: function (ev) {
    this.setData({
      swiperCurrent: ev.detail.current
    })
  },
  //左侧tab切换
  bindScrollLeftTap: function (ev) {
    if (this.data.scrollViewLeftCurrent == ev.currentTarget.dataset.index) {
      return;
    }
    this.setData({
      scrollViewLeftCurrent: ev.currentTarget.dataset.index,
      scrollTop:0
    })
  },
  //自定义事件 清空购物车
  onMyEventRemoveShopCartTap:function(ev){
    var that = this
    // 所有商品列表
    var goodsList = this.data.goodsList
    //货柜ID
    var containerid = app.globalData.containerID
    //清空已选择商品
    goodsList = utils.removeallgoods(goodsList, containerid);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)
    var detail = utils.getdatefenzu(goodsList);
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

  },
  
  //自定义事件 增加
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
    var can = ev.detail.can
    //货柜ID
    var containerid = app.globalData.containerID
    // 计算当前商品数量
    goodsList = utils.addgoods(goodsList, goodsid, dateid, containerid,can);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)
    var detail = utils.getdatefenzu(goodsList);

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

  },
  //自定义事件 减少
  onMyEventReduceGoods: function (ev) {
    var that = this
    // 所有商品列表
    var goodsList = this.data.goodsList
    // 当前商品ID
    var goodsid = ev.detail.goodsid
    // 商品时间
    var dateid = ev.detail.dateid
    var can = ev.detail.can
    //货柜ID
    var containerid = app.globalData.containerID
    // 计算当前商品数量
    goodsList = utils.reducegoods(goodsList, goodsid, dateid, containerid,can);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)
    var detail = utils.getdatefenzu(goodsList);
    if (res.totalNum == 0) {
      that.setData({
        isCartShow: false
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
  },
  //减少
  bindReduceTap: function (ev) {
    var that = this;
    // 所有商品列表
    var goodsList = this.data.goodsList
    // 当前商品ID
    var goodsid = ev.currentTarget.dataset.goodsid
    // 餐品时间
    var dateid = ev.currentTarget.dataset.dateid
    //货柜ID
    var containerid = app.globalData.containerID
    var can = ev.currentTarget.dataset.can
    // 计算当前商品数量
    goodsList = utils.reducegoods(goodsList, goodsid, dateid, containerid, can);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)
    var detail = utils.getdatefenzu(goodsList);
    that.setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: that.data.goodsList, 
      detail: detail
    })  

    app.globalData.goodsList = goodsList;
    app.globalData.totalNum = res.totalNum;
    app.globalData.totalPrise = res.totalPrise;
    app.globalData.reducePrise = res.reducePrise;

  },
  //添加商品
  bindAddTap: function (ev) {
    var that = this;
    // 获取库存 当前数量
    var available = ev.currentTarget.dataset.available
    var total = ev.currentTarget.dataset.total
    var can = ev.currentTarget.dataset.can
    if (available <= total){
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
    //小球动画 购物车动画
    var that = this
    var ball = that.data.balls.find(ball => !ball.isShow)//返回第一个满足条件的元素
    that.cardAnimation(ev, ball)

    // 所有商品列表
    var goodsList = that.data.goodsList
    // 当前商品ID
    var goodsid = ev.currentTarget.dataset.goodsid
    // 餐品时间
    var dateid = ev.currentTarget.dataset.dateid
    //货柜ID
    var containerid = app.globalData.containerID
    // 计算当前商品数量
    goodsList = utils.addgoods(goodsList, goodsid, dateid, containerid, can);
    // 计算总价与数量
    var res = utils.computeNumPrise(goodsList)
    var detail = utils.getdatefenzu(goodsList);

    that.setData({
      totalNum: res.totalNum,
      totalPrise: res.totalPrise,
      reducePrise: res.reducePrise,
      goodsList: goodsList,
      detail: detail
    },function(){

    })  

    app.globalData.goodsList = goodsList;
    app.globalData.totalNum = res.totalNum;
    app.globalData.totalPrise = res.totalPrise;
    app.globalData.reducePrise = res.reducePrise;

  },
  //去取餐
  binToOrderallTap: function () {
    wx.navigateTo({
      url: '/pages/orderlist/orderlist?containerID=' + app.globalData.containerID + '&hidden=true'
    })
  },
  //小球与购物车动画
  cardAnimation:function(ev,ball){
    var that = this;
    if (ball) {
      ball.isShow = true
      ball.ballX = ev.detail.x - 50
      ball.ballY = -(that.data.windowHeight - ev.detail.y - 20)
      ball.startEl = ev.detail //保存对应的起始位置的元素

      that.setData({
        balls: that.data.balls,
      }, function () {
        var query = wx.createSelectorQuery().select('.bbb').boundingClientRect(function (res) {
          ball.ballX = 0
          ball.ballY = 0
          that.setData({
            balls: that.data.balls,
            shopCartDYD: !that.data.shopCartDYD,

          }, function () {
            //购物车抖一抖收尾
            clearTimeout(that.data.dydtimer)
            that.data.dydtimer = setTimeout(() => {
              that.setData({
                shopCartDYD: false,
              })
            }, 800)
          })

          setTimeout(() => {
            ball.startEl = null
            ball.isShow = false
            that.setData({
              balls: that.data.balls,
            })
          }, 600)

        }).exec()
      })
    }
    //添加成功显示提示取餐时间
    that.setData({
      ispromptlayer: true,
    
    })
    clearTimeout(that.data.ispromptlayertimer)
    that.data.ispromptlayertimer = setTimeout(() => {
      that.setData({
        ispromptlayer: false,
      })
    }, 5000)
  },
  //关闭提示弹框
  bindCloseLayerTap: function(){
    clearTimeout(this.data.ispromptlayertimer)
    this.setData({
      ispromptlayer: false,
    })
  },
  //获取当前时间
  initDate: function () {
    return new Date;
  },
  //get 餐品
  getContainers: function (time) {

    var that = this
    var token = app.globalData.token
    var containerID = app.globalData.containerID
    var shopCard = wx.getStorageSync('showCard') || {}
    var shopCard2 = shopCard[containerID] || {}
    
    var time = time || 'lunch'
    utils.request('http://fanmofang.17d3.com/api/containers/' + containerID + '/3/?meal=' + time, { token: token })
      .then(function (res) {
        console.log(res, containerID, '获取货柜菜品')
        var goodsList = res.data instanceof Array ? res.data : [];

        goodsList = utils.initGoodsList(goodsList, shopCard2)
        var res = utils.computeNumPrise(goodsList)
        //初始化左边日期
        var dataLsit = []
        var addDate = ''
        var len = goodsList.length
        len = len > 3 ? 3 : len
        goodsList.forEach(function (item, index) {
          var nowDate = new Date()
          if (utils.formatTime(nowDate) == item.date) {
            addDate = '今天'
          } else if (utils.formatTime(nowDate, 1) == item.date) {
            addDate = '明天'
          } else {
            addDate = item.date.slice(5)
          }
          dataLsit.push(addDate)
        })
        that.setData({
          scrollViewLeftDateList: dataLsit
        })
        utils.computeHeight(['.left .qucan'], function (contentheight) {
          that.setData({
            scrollLeftHeight: contentheight * len
          })
        }, true);
        
        var detail = utils.getdatefenzu(goodsList);

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


      }, function (err) {

      })
  },
  onLoad: function (options) {

    var that = this;
    // 获取货柜ID 并全局存储
    var containerID = options.containerID ? options.containerID : 1;
    app.globalData.containerID = containerID;
    // 在缓存中读取购物车信息
    var shopCard = wx.getStorageSync('showCard') || {}
    var shopCard2 = shopCard[containerID] || {}

    //获取tocken
    app.getUserToken().then(function(res){
      var restoken = res;
      return new Promise(function (resolve, reject){
        resolve(restoken)
      })
    },function(err){

    })
    .then(function(res){
      var token = res.data.token;
      app.globalData.token = token;
      var containerObj = wx.getStorageSync('containerObj1') || {};



      // 获取货柜信息
      utils.request('http://fanmofang.17d3.com/api/containers/' + containerID + '/info', {token:token})
        .then(function (res) {
          //存储货柜信息
          console.log(res, '货柜信息')
          if (res.data.meal_settings.lunch) {
            that.data.promptlayerTxT = res.data.meal_settings.lunch.order_end_time;
            that.setData({
              promptlayerTxT: that.data.promptlayerTxT
            })
            app.globalData.promptlayerTxT = that.data.promptlayerTxT
          }
          if (res.data.id ){
            containerObj[res.data.id] = res.data.address + new Date().getTime()
            wx.setStorageSync('containerObj1', containerObj)
          }
          if (res.data.meal_settings) {
            that.data.dinnerTimeList = Object.keys(res.data.meal_settings).map((item) => {
              let text = ''
              if (item === 'breakfast') {
                text = '早餐'
              } else if (item === 'lunch') {
                text = '午餐'
              } else if (item === 'afternoon') {
                text = '下午茶'
              } else if (item === 'dinner') {
                text = '晚餐'
              }
              return {
                id: item,
                text: text
              }
            })
            that.setData({
              dinnerTimeList: that.data.dinnerTimeList
            })
          }
          that.setData({
            swiperAdsText: res.data.address
          })
          app.globalData.ads = res.data.address
          //更新上个页面数据
          var useList = []

          for (var key in containerObj) {
            if (!containerObj[key]) {
              continue
            }
            var obj = { id: key, ads: containerObj[key].slice(0, -13), time: containerObj[key].slice(-13) }
            useList.unshift(obj)
          }
          useList.sort(function (a, b) {
            return a.time < b.time ? 1 : -1;
          });
          var pages = getCurrentPages();

          pages[0].setData({
            useList: useList
          })

        }, function (err) {

        })

      //获取当前货柜的所有菜品
      that.getContainers()

      wx.getSystemInfo({
        success: function (res) {
          var wh = res.windowHeight
          that.setData({
            windowHeight: wh
          })
        }
      })

      utils.computeHeight2(['.swiper-wrap', '.shopCart']).then(function (results) {
        var height = 0;
        results.forEach(function (item, index) {
          if (index != 0) {
            height = results[0] - results[index]
            results[0] = height
          }
        })
      }).catch(function (e) {

      });

      utils.computeHeight(['.swiper-wrap', '.shopCart', '.dinner-time-wrap'], function (contentheight) {
        console.log(contentheight,'contentheight')
        that.setData({
          scrollHeight: contentheight
        })
      });

    },function(err){

    })



    // 获取轮播图片
    utils.request('http://fanmofang.17d3.com/api/containers/' + containerID + '/slides')
    .then(function(res){
      var arr = []
      res.data.forEach(function(item,index){
        arr.push(item.product.slide_image)
      })
      console.log(res,'轮播接口')
      if(arr.length != 0){
        that.setData({
          swiperImgUrls: arr
        })
      }
    },function(err){

    })


    // 获取轮播图片
    /*utils.request('http://fanmofang.17d3.com/api/containers/' + containerID + '/slides')
      .then(function (res) {
        var arr = []
        res.data.forEach(function (item, index) {
          arr.push(item.product.slide_image)
        })
        console.log(res, '轮播接口')
        if (arr.length != 0) {
          that.setData({
            swiperImgUrls: arr
          })
        }
      }, function (err) {

      })*/

  },

})
