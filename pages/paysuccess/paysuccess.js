// pages/paysuccess/paysuccess.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperAdsText: '',
    ordernum:111111111111,
    ordertime:'2018-4-10',
    orderprise:0,
    orderoldprise:0,
    contentheight:0,
    ordergoodslist1:[],
    bindstarttime : 0,
    bindendtime:0,
    bindtimer:null,
    progressShow:false,
    dataLsit:[],
    orderID:0,
    promptlayerTxT:''
  },
  bindToIndexTap:function(){
    wx.reLaunch({
      url: '/pages/index/index' 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindOpenlongTap:function(){
    var that = this;
    this.data.bindendtime = new Date().getTime();
    if (this.data.bindendtime - this.data.bindstarttime < 1500){
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请长按解锁',
        confirmColor: '#ff8339',
        success: function (res) {
          if (res.confirm) {

          } else if (res.cancel) {

          }
        }
      })
      that.setData({
        progressShow: false
      })

    }else{
 
    }
    clearTimeout(this.data.bindtimer);
  },
  bindOpenTap:function(ev){
    var that = this;
    this.data.bindstarttime = new Date().getTime();
    this.data.bindendtime = 0;
    this.data.bindtimer = null;
    this.setData({
      progressShow:true
    })
    this.data.bindtimer = setTimeout(function(){

      var orderid = ev.target.dataset.orderid
      var date = ev.target.dataset.date
      var goodsid = ev.target.dataset.goodsid
      var token = app.globalData.token
     
      utils.request('https://www.yuexd.com/api/order/' + orderid + '/open/' + date + '/' + goodsid, { token: token, method:'POST'})
      .then(function(res){
        console.log(res, '开启格子返回')
        
        if (res.statusCode == '200'){
          var a = that.data.ordergoodslist1.detail_by_date.find(function (item) {
            return item.date == date
          })

          var b = a.products.find(function (item) {
            return item.product.id == goodsid
          })

          b.delivery_status = 'picking'
          b.delivery_status_message = '取餐处理中'
          b.is_pick_button_visible = false


          var slot_schema_ids = res.data.slot_schema_ids.join();
          var timer = null;
          /* 开启一个轮询 查询取餐状态 */
          that.searchStatus(slot_schema_ids, timer, token, b, date, goodsid)

          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '解锁成功,请到' + res.data.slot_display_numbers.join() + '号格子取餐',
            confirmColor: '#ff8339',
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })

          that.setData({
            progressShow: false,
            ordergoodslist1: that.data.ordergoodslist1
          })
        }else{
          wx.showModal({
            title: '提示',
            showCancel: false,
            content: '开启失败',
            confirmColor: '#ff8339',
            success: function (res) {
              if (res.confirm) {

              } else if (res.cancel) {

              }
            }
          })
        }

      },function(err){

      })


    },1500)

  },
  bindNoOpenTap: function (ev) {
    var that = this;
    var txt = ev.target.dataset.tishi
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: txt,
      confirmColor: '#ff8339',
      success: function (res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    });
  },
  searchStatus: function (slot_schema_ids, timer, token, b, date, goodsid) {
    var that = this;
    var beginTime = new Date().getTime();
    timer = setInterval(function () {
      var url = 'https://www.yuexd.com/api/status/picking/?slot_schema_id=' + slot_schema_ids
      wx.request({
        url: url,
        method: 'get',
        data: {},
        header: {
          'Authorization': 'Bearer ' + token,
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res, '用户取餐查询')
          var isFlag = res.data.find(function (item) {
            return item.delivery_status != 'picked_up'
          });
          if (!isFlag) {
            var a = that.data.ordergoodslist1.detail_by_date.find(function (item) {
              return item.date == date
            })

            var b = a.products.find(function (item) {
              return item.product.id == goodsid
            })

            b.delivery_status = 'picked_up'
            b.delivery_status_message = '已取餐'

            clearInterval(timer)
            that.setData({
              ordergoodslist1: that.data.ordergoodslist1
            });
            console.log('已取餐', that.data.ordergoodslist1)
          } else {  
            console.log('未取餐')
           /* var a = that.data.ordergoodslist1.detail_by_date.find(function (item) {
              return item.date == date
            })

            var b = a.products.find(function (item) {
              return item.product.id == goodsid
            })

            b.delivery_status = 'picked_up'
            b.delivery_status_message = '已取餐'

            clearInterval(timer)
            that.setData({
              ordergoodslist1: that.data.ordergoodslist1
            });*/
          }

        },
        fail: function (err) {
          //
        }
      })

    }, 5000)
  },
  onLoad: function (options) {
    var orderID = options.orderID;// 获取订单号 
    var that = this;  

    var token = app.globalData.token
    
    utils.request('https://www.yuexd.com/api/order/' + orderID + '/detail', { token: token})
    .then(function(res){
      console.log(res,'获取单个订单详情')

      //初始化左边日期
      var dataLsit = []
      var addDate = ''

      var orderprise = 0, orderoldprise = 0;

      res.data.detail_by_date.forEach(function (item, index) {

        item.products.forEach(function(val){
          //orderprise += Number(val.total_price)
          orderoldprise += Number(val.product.base_price * val.num);
          console.log(orderoldprise)
          val.slot_display_numberstxt = val.slot_display_numbers.join()
        })
      
        var nowDate = new Date()
        if (utils.formatTime(nowDate) == item.date) {
          addDate = '今天'
        } else {
          addDate = '预定'
        }
        dataLsit.push(addDate)
      })

      that.setData({
        ordergoodslist1: res.data,
        dataLsit: dataLsit,
        orderprise: res.data.amount,
        orderoldprise: parseFloat(orderoldprise).toFixed(2),
        swiperAdsText:res.data.container.address,
        orderID: orderID,
        promptlayerTxT: app.globalData.promptlayerTxT 
      })

    },function(err){

    })

    // 页面适配 计算页面剩余高度  
    utils.computeHeight(['.order-info-box'],function(contentheight){
      that.setData({
        contentheight: contentheight
      })
    });

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