// pages/orderall/orderall.js
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
    orderprise: 100,
    orderoldprise: 120,
    contentheight: 0,
    ordergoodslist1: [],
    containerID: '',
    bindstarttime: 0,
    bindendtime: 0,
    bindtimer: null,
    progressShow: false,
    currentPage: 2,
    allPages: false,
    loadMoreData: '加载更多……',
    date: 0,
    showloading: false,
    isload: true,
    show: true,
    showorderno: false,
    promptlayerTxT: ''
  },
  // 退订单
  bindorderIDTap(ev) {
    var orderid = ev.target.dataset.orderid //订单号
    var money = ev.target.dataset.money //取餐时间
    var token = app.globalData.token

    wx.showModal({
      title: '订单退货',
      content: '确认申请订单退货 ' + '订单：' + orderid + ' 金额：' + money,
      confirmColor: '#ff8339',
      success: function (res) {
        if (res.confirm) {
          utils.request('http://fanmofang.17d3.com/api/order/' + orderid + '/refund?type=order', {
            token: token,
            method: 'POST'
          })
            .then(function (res) {
              console.log(res, '订单退货')
              if (res.statusCode == '200') {
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
            })
        } else if (res.cancel) {

        }
      }
    })


  },

  // 退货单品
  bindTHTab(ev) {
    var orderid = ev.target.dataset.orderid //订单号
    var date = ev.target.dataset.date //取餐时间
    var money = ev.target.dataset.money //取餐时间
    var name = ev.target.dataset.name //取餐时间
    var goodsid = ev.target.dataset.goodsid //商品ID
    var ssid = ev.target.dataset.ssid //商品ID
    var token = app.globalData.token
    var refund_status = ev.target.dataset.refund_status
    if (refund_status == 'refund_success') {
      return
    } else if (!!refund_status){
      return
    }
    wx.showModal({
      title: '单品退货确认',
      content: '确认申请退货退货 ' + date + ' 午餐 ' + name + ' 退款金额：￥' + money,
      confirmColor: '#ff8339',
      success: function(res) {
        if (res.confirm) {
          utils.request('http://fanmofang.17d3.com/api/order/' + orderid + '/refund?type=single_product&slot_schema_id=' + ssid, {
              token: token,
              method: 'POST'
            })
            .then(function(res) {
              console.log(res, '单品退货')
              if (res.statusCode == '200') {
                wx.showModal({
                  title: '提示',
                  showCancel: false,
                  content: res.data.message,
                  confirmColor: '#ff8339',
                  success: function(res) {
                    if (res.confirm) {

                    } else if (res.cancel) {

                    }
                  }
                })
              }
            })
        } else if (res.cancel) {

        }
      }
    })


  },
  bindOpenlongTap: function() {
    var that = this;
    this.data.bindendtime = new Date().getTime();

    if (this.data.bindendtime - this.data.bindstarttime < 1500) {

      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '请长按解锁',
        confirmColor: '#ff8339',
        success: function(res) {
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
  bindOpenTap: function(ev) {
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

    this.data.bindtimer = setTimeout(function() {

      utils.request('http://fanmofang.17d3.com/api/slot_schema/' + ssid + '/pickup', {
          token: token,
          method: 'POST'
        })
        .then(function(res) {
          console.log(res, '开启格子返回')

          if (res.statusCode == '200') {
            var a = that.data.ordergoodslist1.find(function(item) {
              return item.id == orderid
            })
            var b = a.detail_by_date.find(function(item) {
              return item.date == date
            })
            var c = b.products.find(function(item) {
              return item.slot_schema_id == ssid
            })

            // c.delivery_status = 'picking'
            // c.delivery_status_message = '取餐处理中'
            // c.is_pick_button_visible = false
            that.setData({
              ordergoodslist1: that.data.ordergoodslist1
            });
            var slot_schema_ids = res.data.data.slot_schema_id
            /* 开启一个轮询 查询取餐状态 */
            that.searchStatus(slot_schema_ids, token, c)
            //that.searchStatus1(c)
            wx.showModal({
              title: '提示',
              showCancel: false,
              content: '解锁成功,请到' + res.data.data.slot_display_number + '号格子取餐',
              confirmColor: '#ff8339',
              success: function(res) {
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
              success: function(res) {
                if (res.confirm) {

                } else if (res.cancel) {

                }
              }
            })
            that.setData({
              progressShow: false,

            });
          }

        }, function(err) {

        })



    }, 1500)

  },
  searchStatus: function(slot_schema_ids, token, c) {
    var that = this;
    var beginTime = new Date().getTime();
    clearInterval(c.timer)
    c.timer = setInterval(function() {
      var url = 'http://fanmofang.17d3.com/api/slot_schema/' + slot_schema_ids + '/status'
      wx.request({
        url: url,
        method: 'get',
        data: {},
        header: {
          'Authorization': 'Bearer ' + token,
          'content-type': 'application/json'
        },
        success: function(res) {
          console.log(res, '用户取餐查询')
          c.delivery_status = res.data.data.delivery_status
          c.delivery_status_message = res.data.data.delivery_status_message
          c.is_pick_button_visible = res.data.data.is_pick_button_visible
          // clearInterval(c.timer)
          if (res.data.data.delivery_status == 'picked_up') {
            clearInterval(c.timer)
          }
          that.setData({
            ordergoodslist1: that.data.ordergoodslist1
          });
          console.log(c, res.data.data)
        },
        fail: function(err) {
          //
        }
      })

    }, 5000)
  },
  searchStatus1: function(c) {
    var that = this;
    var beginTime = new Date().getTime();
    clearInterval(c.timer1)
    c.time = c.time ? c.time : 59
    c.timer1 = setInterval(function() {
      that.setData({
        progressShow: false,
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
  bindNoOpenTap: function(ev) {
    var that = this;
    var txt = ev.target.dataset.tishi
    console.log(ev)
    wx.showModal({
      title: '提示',
      showCancel: false,
      content: txt,
      confirmColor: '#ff8339',
      success: function(res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    });
  },
  bindLoadScrollTolower: function(ev) {
    return
    var that = this;
    if (that.data.showorderno) {
      return
    }
    // 当前页是最后一页
    if (that.data.allPages) {
      that.setData({
        loadMoreData: '已经到顶'
      })
      return;
    };

    var date = new Date().getTime();

    if (that.data.date + 2000 < date) {
      var token = app.globalData.token;
      utils.request('http://fanmofang.17d3.com/api/my/orders?page=' + that.data.currentPage, {
          token: token
        })
        .then(function(res) {
          console.log(res, '获取所有订单分页信息')
          if (res.data.length == 0) {
            that.data.allPages = true
          }
          res.data.forEach(function(item) {
            item.oldprice = 0;
            item.isshow = true;
            if (that.data.containerID) {
              if (item.container.id != that.data.containerID) {
                item.isshow = false;
              }
            }
            item.detail.forEach(function(item2) {
              item2.datetext = ''
              var nowDate = new Date();
              console.log(item2)
              if (utils.formatTime(nowDate) == item2.date) {
                item2.datetext = '今天'
              } else if (item2.date < utils.formatTime(nowDate)) {
                item2.datetext = ''
              } else {
                item2.datetext = '预定'
              }
              item2.products.forEach(function(item3) {
                item.oldprice += parseFloat(Number(item3.product.base_price * 100 * item3.num / 100)).toFixed(2)
                item3.slot_display_numberstxt = item3.slot_display_numbers.join()
              })
            })

            that.data.ordergoodslist1.push(item)
          })
          that.data.currentPage++
            setTimeout(function() {
              that.setData({
                showloading: false,
                ordergoodslist1: that.data.ordergoodslist1
              })
            }, 2000)
        }, function() {

        })
      console.log('加载更多...')
      that.setData({
        showloading: true,
        loadMoreData: '加载更多……'
      })
      that.data.date = date;
      that.data.isload = true
    } else {
      if (!that.data.isload) {
        console.log('稍后再试...')
        that.setData({
          showloading: true,
          loadMoreData: '稍后再试……'
        })
      }
    }

    /*setTimeout(function () {
      console.log('上拉加载更多');
      var tempCurrentPage = that.data.currentPage;
      tempCurrentPage = tempCurrentPage + 1;
      that.setData({
        currentPage: tempCurrentPage,
        hideBottom: false
      })
     
    }, 300);*/
  },
  binCallTap: function() {
    //拨打客服电话 
    wx.makePhoneCall({
      confirmColor: '#ff8339',
      phoneNumber: '18210990920'
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this
    that.data.containerID = options.containerID
    app.globalData.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZmFubW9mYW5nLjE3ZDMuY29tXC9hcGlcL3VzZXJcL2xvZ2luXC93ZWNoYXQiLCJpYXQiOjE1NTExNjI4MjEsImV4cCI6MTg2NjUyMjgyMSwibmJmIjoxNTUxMTYyODIxLCJqdGkiOiI4d0J3Wk9PMUlKcXNMUHNrIiwic3ViIjo0LCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.uk3Hsw1R6qrMSLk1ueLelAtfiScz6pJTAuYdAtYekbY"
    var token = app.globalData.token;

    options.orderid = 100010987
    utils.request('http://fanmofang.17d3.com/api/order/' + options.orderid + '/detail', {
        token: token
      })
      .then(function(res) {
        console.log(res.data, '单个订单 详情')
        if (res.data.length == 0) {
          that.data.showorderno = true;
        } else {
          var item = res.data
          if (that.data.containerID) {
            if (item.container.id == that.data.containerID) {

              if (item.detail.length === 0) {
                that.data.showorderno = true;
              }
            }
          }

        }

        var item = res.data

        item.oldprice = 0;
        item.isshow = true;

        if (that.data.containerID) {
          if (item.container.id != that.data.containerID) {
            item.isshow = false;
          }

        }



        item.detail_by_date.forEach(function(item2) {
          item2.datetext = ''
          var nowDate = new Date()

          if (utils.formatTime(nowDate) == item2.date) {
            item2.datetext = '今天'
          } else if (item2.date < utils.formatTime(nowDate)) {
            item2.datetext = ''
          } else {
            item2.datetext = '预定'
          }
          item2.products.forEach(function(item3) {

            item.oldprice += item3.product.base_price
            // item3.slot_display_numberstxt = item3.slot_display_numbers.join()
          })
        })



        // console.log(res.data)

        that.setData({
          ordergoodslist1: [res.data],
          showorderno: that.data.showorderno,
          promptlayerTxT: app.globalData.promptlayerTxT ? app.globalData.promptlayerTxT : ''
        })

      }, function(err) {

      })

    /*utils.request('http://fanmofang.17d3.com/api/my/orders', { token: token })
     .then(function (res) {
       //console.log(res.data)
       if (res.statusCode == 200) {
         console.log(res.data, '获取所有订单')

         //初始化日期 与优惠前总价格

         //没有数据
         return
         if (res.data.length == 0) {
           that.data.showorderno = true;
         } else {
           res.data.forEach(function (item) {
             if (that.data.containerID) {
               if (item.container.id == that.data.containerID) {

                 if (item.detail.length === 0) {
                   that.data.showorderno = true;
                 }
               }
             }
           })
         }

         // console.log(that.data.showorderno, '是否显示默认背景图')

         res.data.forEach(function (item) {
           item.oldprice = 0;
           item.isshow = true;

           if (that.data.containerID) {
             if (item.container.id != that.data.containerID) {
               item.isshow = false;
             }

           }



           item.detail.forEach(function (item2) {
             item2.datetext = ''
             var nowDate = new Date()

             if (utils.formatTime(nowDate) == item2.date) {
               item2.datetext = '今天'
             } else if (item2.date < utils.formatTime(nowDate)) {
               item2.datetext = ''
             } else {
               item2.datetext = '预定'
             }
             item2.products.forEach(function (item3) {
               item.oldprice = (item.oldprice * 100 + item3.product.base_price * 100 * item3.num) / 100;
               item3.slot_display_numberstxt = item3.slot_display_numbers.join()
             })
           })

         })



         that.setData({
           ordergoodslist1: res.data,
           showorderno: that.data.showorderno,
           promptlayerTxT: app.globalData.promptlayerTxT ? app.globalData.promptlayerTxT : ''
         })


       }
     }, function (err) {

     })*/




    if (options.hidden) {
      that.setData({
        show: false
      })
    }

    // 页面适配 计算页面剩余高度  
    utils.computeHeight(['.botmenu'], function(contentheight) {
      that.setData({
        contentheight: contentheight
      })
    });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },


})