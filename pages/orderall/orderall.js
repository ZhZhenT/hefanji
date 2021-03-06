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
    ordergoodslist1:[],
    containerID:'',
    bindstarttime: 0,
    bindendtime: 0,
    bindtimer: null,
    progressShow: false,
    currentPage:2,
    allPages:false,
    loadMoreData: '加载更多……',
    date:0,
    showloading:false,
    isload:true,
    show:true,
    showorderno:false,
    promptlayerTxT:''
  },
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
  bindOpenTap: function (ev) {
    var that = this;
    this.data.bindstarttime = new Date().getTime();
    this.data.bindendtime = 0;
    this.data.bindtimer = null;

    this.setData({
      progressShow: true
    })

    var orderid = ev.target.dataset.orderid//订单号
    var date = ev.target.dataset.date//取餐时间
    var goodsid = ev.target.dataset.goodsid//商品ID
    var token = app.globalData.token

    this.data.bindtimer = setTimeout(function () {

      utils.request('https://www.yuexd.com/api/order/' + orderid + '/open/' + date + '/' + goodsid, { token: token, method: 'POST' })
        .then(function (res) {
          console.log(res, '开启格子返回')

          if (res.statusCode == '200'){
            var a = that.data.ordergoodslist1.find(function (item) {
              return item.id == orderid
            })
            var b = a.detail.find(function (item) {
              return item.date == date
            })
            var c = b.products.find(function (item) {
              return item.product.id == goodsid
            })

            c.delivery_status = 'picking'
            c.delivery_status_message = '取餐处理中'
            c.is_pick_button_visible = false

            var slot_schema_ids = res.data.slot_schema_ids.join();
            var timer = null;
            /* 开启一个轮询 查询取餐状态 */
            that.searchStatus(slot_schema_ids, timer, token, c)

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
            });

            that.setData({
              progressShow: false,
              ordergoodslist1: that.data.ordergoodslist1
            });
          }else{
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
  searchStatus: function (slot_schema_ids, timer, token,c){
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
          console.log(res,'用户取餐查询')
          var isFlag = res.data.find(function(item){
            return item.delivery_status != 'picked_up'
          });
          if (!isFlag){
            console.log('已取餐')
            c.delivery_status = 'picked_up'
            c.delivery_status_message = '已取餐'
            clearInterval(timer)
            that.setData({
              ordergoodslist1: that.data.ordergoodslist1
            });
          }else{
            console.log('未取餐')
          }

        },
        fail: function (err) {
          //
        }
      })

    }, 5000)
  },
  bindNoOpenTap: function(ev){
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
  bindLoadScrollTolower: function(ev){
    var that = this;
    if (that.data.showorderno){
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
   
    if (that.data.date +2000 < date){
      var token = app.globalData.token;
      utils.request('https://www.yuexd.com/api/my/orders?page=' + that.data.currentPage, { token: token})
      .then(function(res){
        console.log(res,'获取所有订单分页信息')
        if (res.data.length == 0){
          that.data.allPages = true
        }
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
            var nowDate = new Date();
            console.log(item2)
            if (utils.formatTime(nowDate) == item2.date) {
              item2.datetext = '今天'
            } else if (item2.date < utils.formatTime(nowDate)) {
              item2.datetext = ''
            } else {
              item2.datetext = '预定'
            }
            item2.products.forEach(function (item3) {
              item.oldprice += parseFloat(Number(item3.product.base_price * 100 * item3.num / 100)).toFixed(2)
              item3.slot_display_numberstxt = item3.slot_display_numbers.join()
            })
          })
          
          that.data.ordergoodslist1.push(item)
        })  
        that.data.currentPage++
        setTimeout(function(){
          that.setData({
            showloading: false,
            ordergoodslist1: that.data.ordergoodslist1
          })
        },2000)
      },function(){

      })
      console.log('加载更多...')
      that.setData({
        showloading:true,
        loadMoreData: '加载更多……'
      })
      that.data.date = date;
      that.data.isload=true
    }else{
      if(!that.data.isload){
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var that = this
    that.data.containerID = options.containerID
    var token = app.globalData.token ;

    utils.request('https://www.yuexd.com/api/my/orders',{token:token})
    .then(function(res){
      //console.log(res.data)
      if (res.statusCode == 200){
        console.log(res.data,'获取所有订单')

        //初始化日期 与优惠前总价格

        //没有数据
        if(res.data.length == 0){
          that.data.showorderno = true;
        }else{
          res.data.forEach(function(item){
            if (that.data.containerID) {
              if (item.container.id == that.data.containerID) {

                if (item.detail.length === 0){
                  that.data.showorderno = true;
                }
              }
            }
          })
        }

        console.log(that.data.showorderno,'是否显示默认背景图')

        res.data.forEach(function(item){
          item.oldprice = 0;
          item.isshow = true;
          
          if (that.data.containerID){
            if (item.container.id != that.data.containerID){
              item.isshow = false;
            }
            
          }



          item.detail.forEach(function(item2){
            item2.datetext = ''
            var nowDate = new Date()
      
            if (utils.formatTime(nowDate) == item2.date) {
              item2.datetext = '今天'
            } else if (item2.date < utils.formatTime(nowDate)) {
              item2.datetext = ''
            }else{
              item2.datetext = '预定'
            }
            item2.products.forEach(function(item3){
              item.oldprice = (item.oldprice * 100 + item3.product.base_price * 100 * item3.num ) / 100 ;
              item3.slot_display_numberstxt = item3.slot_display_numbers.join()
            })
          })
         
        })  
        


        that.setData({
          ordergoodslist1: res.data,
          showorderno: that.data.showorderno,
          promptlayerTxT: app.globalData.promptlayerTxT ? app.globalData.promptlayerTxT:''
        })
  

      }
    },function(err){

    })

    if(options.hidden){
      that.setData({
        show:false
      })
    }

    // 页面适配 计算页面剩余高度  
    utils.computeHeight(['.botmenu'], function (contentheight) {
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