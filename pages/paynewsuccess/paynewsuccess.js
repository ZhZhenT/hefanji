// pages/paysuccess/paysuccess.js
const app = getApp()
const utils = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperAdsText: '',
    ordernum: 111111111111,
    ordertime: '2018-4-10',
    orderprise: 0,
    orderoldprise: 0,
    contentheight: 0,
    ordergoodslist1: [],
    bindstarttime: 0,
    bindendtime: 0,
    bindtimer: null,
    progressShow: false,
    dataLsit: [],
    orderID: 0,
    promptlayerTxT: ''
  },
  bindorderIDTap (ev) {
    wx.navigateTo({
      url: '../ordernewdetail/ordernewdetail?orderid=' + ev.currentTarget.dataset.orderid
    }) 
  },
  bindToIndexTap: function () {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  bindOpenlongTap: function () {
    var that = this;
    this.data.bindendtime = new Date().getTime();
    if (this.data.bindendtime - this.data.bindstarttime < 1500) {
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

    } else {

    }
    clearTimeout(this.data.bindtimer);
  },
  searchStatus1: function (c) {
    var that = this;
    var beginTime = new Date().getTime();
    clearInterval(c.timer1)
    c.time = 59
    c.time = c.time ? c.time : 59
    c.timer1 = setInterval(function () {
      that.setData({
        ordergoodslist1: that.data.ordergoodslist1
      });
      console.log(c.time)
      if (c.time == 0) {
        clearInterval(c.timer1)
      } else {
        c.time--
      }
    }, 1000)
  },
  bindOpenTap: function (ev) {
    var that = this;
    this.data.bindstarttime = new Date().getTime();
    this.data.bindendtime = 0;
    this.data.bindtimer = null;

    this.setData({
      progressShow: true
    })

    var orderid = ev.target.dataset.orderid //订单号
    var date = ev.target.dataset.date //取餐时间
    var goodsid = ev.target.dataset.goodsid //商品ID
    var ssid = ev.target.dataset.ssid //商品ID
    var token = app.globalData.token

    this.data.bindtimer = setTimeout(function () {

      utils.request('http://fanmofang.17d3.com/api/slot_schema/' + ssid + '/pickup', {
        token: token,
        method: 'POST'
      })
        .then(function (res) {
          console.log(res, '开启格子返回')

          if (res.statusCode == '200') {
            var a = that.data.ordergoodslist1.find(function (item) {
              return item.id == orderid
            })
            var b = a.detail_by_date.find(function (item) {
              return item.date == date
            })
            var c = b.products.find(function (item) {
              return item.slot_schema_id == ssid
            })

            c.delivery_status = 'picking'
            c.delivery_status_message = '取餐处理中'
            c.is_pick_button_visible = false
            that.setData({
              ordergoodslist1: that.data.ordergoodslist1
            });
            var slot_schema_ids = res.data.data.slot_schema_id
            /* 开启一个轮询 查询取餐状态 */
            that.searchStatus(slot_schema_ids, token, c)
            that.searchStatus1(c)
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '解锁成功,请到' + res.data.data.slot_display_number + '号格子取餐',
              confirmColor: '#ff8339',
              success: function (res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              }
            });

            that.setData({
              progressShow: false,
              ordergoodslist1: that.data.ordergoodslist1
            });
          } else {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '开启失败,请联系客服',
              confirmColor: '#ff8339',
              success: function (res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              }
            })
            that.setData({
              progressShow: false,

            });
          }

        }, function (err) {

        })



    }, 1500)

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
  searchStatus: function (slot_schema_ids, token, c) {
    var that = this;
    var beginTime = new Date().getTime();
    clearInterval(c.timer)
    c.timer = setInterval(function () {
      var url = 'http://fanmofang.17d3.com/api/slot_schema/' + slot_schema_ids + '/status'
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
          // var isFlag = res.data.find(function (item) {
          //   return item.delivery_status != 'picked_up'
          // });
          // if (!isFlag) {
          //   console.log('已取餐')
          //   c.delivery_status = 'picked_up'
          //   c.delivery_status_message = '已取餐'
          //   clearInterval(c.timer)
          //   that.setData({
          //     ordergoodslist1: that.data.ordergoodslist1
          //   });
          // } else {
          //   console.log('未取餐')
          // }
          c.delivery_status = res.data.data.delivery_status
          c.delivery_status_message = res.data.data.delivery_status_message
          // clearInterval(c.timer)
          if (res.data.data.delivery_status == 'picked_up') {
            clearInterval(c.timer)
          }
          that.setData({
            ordergoodslist1: that.data.ordergoodslist1
          });
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
    //app.globalData.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9mYW5tb2ZhbmcuMTdkMy5jb21cL2FwaVwvdXNlclwvbG9naW5cL3dlY2hhdCIsImlhdCI6MTU0NzM1ODY0MywiZXhwIjoxODYyNzE4NjQzLCJuYmYiOjE1NDczNTg2NDMsImp0aSI6IkthbXV4U2V6NFV6Ymttc0ciLCJzdWIiOjQsInBydiI6Ijg3ZTBhZjFlZjlmZDE1ODEyZmRlYzk3MTUzYTE0ZTBiMDQ3NTQ2YWEifQ.c-J54eE5QHEGBq8TpyKP2DtmbJt9XCucVQ1sgz9mfrA"
    var token = app.globalData.token

    utils.request('http://fanmofang.17d3.com/api/order/' + orderID + '/detail', { token: token })
      .then(function (res) {
        console.log(res, '获取单个订单详情')

        //初始化左边日期
        var dataLsit = []
        var addDate = ''
        var orderprise = 0, orderoldprise = 0;
        var ordernum = 0;

        res.data.detail_by_date.forEach(function (item, index) {
          item.datetext = ''
          var nowDate = new Date();
          // console.log(item)
          if (utils.formatTime(nowDate) == item.date) {
            item.datetext = '今天'
          } else if (item.date < utils.formatTime(nowDate)) {
            item.datetext = ''
          } else {
            item.datetext = '预定'
          }
          ordernum += item.products.length
          item.products.forEach(function (val) {
            //orderprise += Number(val.total_price)
            orderoldprise += val.product.base_price
            //val.slot_display_numberstxt = val.slot_display_number
          })

          var nowDate = new Date()
          if (utils.formatTime(nowDate) == item.date) {
            addDate = '今天'
          } else {
            addDate = '预定'
          }
          dataLsit.push(addDate)
        })
        res.data.ordernum = ordernum
        that.setData({
          ordergoodslist1: [res.data],
          dataLsit: dataLsit,
          orderprise: res.data.amount,
          orderoldprise: parseFloat(orderoldprise).toFixed(2),
          swiperAdsText: res.data.container.address,
          orderID: orderID,
          promptlayerTxT: app.globalData.promptlayerTxT ? app.globalData.promptlayerTxT : ''
        })

      }, function (err) {

      })

    // 页面适配 计算页面剩余高度  
    utils.computeHeight(['.order-info-box'], function (contentheight) {
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