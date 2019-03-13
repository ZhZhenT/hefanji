const app = getApp()
const utils = require('../../../utils/util.js')
Component({
  properties: {
    totalNum: {
      value:0,
      type:Number, 
    },
    totalPrise: {
      value:0,
      type: String, 
      observer: function (newVal, oldVal) {

      }
    },
    reducePrise:{
      value: 0,
      type: String, 
    },
    juanprise: {
      value: 0,
      type: String,
    },
    goodsList:{
      value:{},
      type: Object,
    },
    isCartShow:{
      value:false,
      type:Boolean,
    },
    isOrderConfirm:{
      value:true,
      type:Boolean
    },
    shopCartDYD:{
      value:false,
      type:Boolean,
      observer: function (newVal, oldVal) { 
        
      }
    },
    detail:{
      value:[],
      type:Object
    }
  },

 

  data: {

    
  },
  attached:function() {

    

  },
  ready: function(){

  },

  methods: {

    //去结账 生成订单 去订单详情页
    binToSubmitTap:function(){
      var that = this;  

      if (this.data.totalNum == 0){
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '您的购物车是空的',
          confirmColor:'#ff8339',
          success: function (res) {
            if (res.confirm) {
              
            } else if (res.cancel) {
              
            }
          }
        })
        return
      }
    
      if (this.data.isOrderConfirm) {

        if (wx.getStorageSync('mobile')) {
          // console.log('已经绑定手机号 直接拉起支付接口')
          that.pay()
        } else {
          console.log('您尚未绑定手机号 绑定手机号可以享受更完整的售后服务')
          wx.showModal({
            title: '提示',
            content: '您尚未绑定手机号 绑定手机号可以享受更完整的售后服务',
            confirmColor: '#ff8339',
            cancelText: '跳过',
            confirmText: '现在绑定',
            success: function (res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../bindphone/bindphone',
                });  
              } else if (res.cancel) {
                that.pay()
              }
            }
          })
        }  

      }else{
        
        wx.navigateTo({
          url: '../orderdetail/orderdetail',
        });
        var orderconfirm = true;// 订单确认;  
        app.globalData.orderconfirm = orderconfirm



      }

    },
    //显示购物车
    bindShowShopCartTap:function(){

      if (this.data.totalNum == 0) {
        wx.showModal({
          title: '提示',
          showCancel: false,
          content: '您的购物车是空的',
          confirmColor: '#ff8339',
          success: function (res) {
            if (res.confirm) {

            } else if (res.cancel) {

            }
          }
        })
        return
      }

      this.setData({
        isCartShow: !this.data.isCartShow
      })
    },
    //关闭购物车
    bindHideShopCartTap: function(){
      this.setData({
        isCartShow: false
      })
    },
    //清空购物车
    _bindRemoveShopCartTap: function (ev) {
      this.setData({
        isCartShow: false
      })
      var myEventDetail = ev;
      this.triggerEvent('MyEventRemoveShopCartTap', myEventDetail)
    },
    //增加 
    _bindAddTap: function(ev){
      var myEventDetail = {
        goodsid: ev.currentTarget.dataset.goodsid,
        can: ev.currentTarget.dataset.can,
        dateid: ev.currentTarget.dataset.dateid,
        available :ev.currentTarget.dataset.available,
        total :ev.currentTarget.dataset.total
      }//提供给事件监听函数 商品id
      this.triggerEvent('MyEventAddGoods', myEventDetail)
    },
    //减少
    _bindReduceTap: function (ev) {
      var myEventDetail = {
        goodsid: ev.currentTarget.dataset.goodsid,
          can: ev.currentTarget.dataset.can,
        dateid: ev.currentTarget.dataset.dateid
      }//提供给事件监听函数 商品id
      this.triggerEvent('MyEventReduceGoods', myEventDetail)
    },
    pay() {
      var detail = []
      var that = this
      app.globalData.goodsList.forEach(function (item) {
        var obj = {}
        var arr = []

        for (var i in item['products']) {
          item['products'][i].forEach(function (val) {
            if (val.selected != 0) {
              arr.push({ 'id': val.product.id, 'num': val.selected })
            }
          })
        }

        obj.order_date = item.date
        obj.products = arr

        if (arr.length != 0) {
          detail.push(obj)
        }

      })

      var data = {
        container_id: app.globalData.containerID,
        detail: detail,
        user_coupon_id: app.globalData.selectID || ''
      }
      
      if (app.globalData.selectID && app.globalData.selectID_phone && !wx.getStorageSync('mobile')) {
         // 选取必须绑定号码才能使用的优惠卷 
        wx.showModal({
          title: '提示',
          content: '您使用的优惠卷需要绑定手机号码后使用，请到个人中心绑定手机号码后购买。',
          confirmColor: '#ff8339',
          confirmText: '确定',
          showCancel: false,
          success: function (res) {
 
          }
        }) 
        return 
      }
      
      var token = app.globalData.token;
      console.log(data, '订单详情')
      utils.request('http://fanmofang.17d3.com/api/order/create', { method: 'POST', token: token, data: data })
        .then(function (res) {
          var orderID = res.data.order_id;

          if (res.data.order_status === 'success') {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '支付成功',
              confirmColor: '#ff8339',
              success: function (res) {
                if (res.confirm) {
                  that.setData({
                    isCartShow: false
                  })
                  var myEventDetail = { noshow: true }

                  that.triggerEvent('MyEventRemoveShopCartTap', myEventDetail)

                  wx.redirectTo({
                    url: '../paynewsuccess/paynewsuccess?orderID=' + orderID,
                  })
                } else if (res.cancel) {

                }
              }
            })
            return
          }  

          if (res.data.status) {
            // 订单生成成功
            
            console.log(res, '订单生成');
            utils.request('http://fanmofang.17d3.com/api/order/' + orderID + '/pay', { method: 'POST', token: token })
              .then(function (res) {
                console.log(res, '调起支付接口');
                if (res.data.status) {

                  wx.requestPayment({
                    'timeStamp': res.data.data._timestamp + '',
                    'nonceStr': res.data.data.nonce_str,
                    'package': 'prepay_id=' + res.data.data.prepay_id,
                    'signType': 'MD5',
                    'paySign': res.data.data._sign,
                    'success': function (res) {
                      // 支付成功后的 跳转
                      that.setData({
                        isCartShow: false
                      })
                      var myEventDetail = { noshow: true }

                      that.triggerEvent('MyEventRemoveShopCartTap', myEventDetail)

                      wx.redirectTo({
                        url: '../paynewsuccess/paynewsuccess?orderID=' + orderID,
                      })

                    },
                    'fail': function (res) {

                      utils.request('http://fanmofang.17d3.com/api/order/' + orderID + '/cancel', { method: 'POST', token: token })
                        .then(function (res) {
                          console.log(res, '订单取消')
                          wx.showToast({
                            title: '订单取消',
                            icon: "none",
                            duration: 1500
                          })
                        }, function (err) {

                        })
                    },
                    'complete': function (res) {
                      //console.log('complete');
                    }
                  });

                } else {
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.data.message,
                    confirmColor: '#ff8339',
                    success: function (res) {
                      if (res.confirm) {

                      } else if (res.cancel) {

                      }
                    }
                  })
                }

              }, function (err) {

              })




          } else {
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: res.data.message,
              confirmColor: '#ff8339',
              success: function (res) {

                if (res.confirm) {

                  wx.reLaunch({
                    url: '/pages/index/index?containerID=' + app.globalData.containerID
                  })

                } else if (res.cancel) {

                  wx.reLaunch({
                    url: '/pages/index/index?containerID=' + app.globalData.containerID
                  })

                }
              }
            })
          }
        }, function (err) {

        })
    }
  }
})