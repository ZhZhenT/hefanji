// pages/couponlist/couponlist.js
const utils = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dinnerTimeCurrent: 0,
    dinnerTimeList: [
      { id: 0, text: '可用优惠券', num:2 },
      { id: 1, text: '不可用优惠券',num: 3 }
    ],
    swiperheigh: 1200,
    sildeHeight:0,
    current: 0,
    scrollTop: 0,
    select: true,
    selectAll: false,
    discount_list1: [],
    discount_list0: [],
    see: false
  },

  bindCurrentchange (c) {
    this.setData({
      dinnerTimeCurrent: c.detail.current,
      current: c.detail.current,
      scrollTop: 0
    })
    this.modifyTitle()
  },
  binddinnerTimeCurrentTap(ev) {
    if (this.data.dinnerTimeCurrent == ev.currentTarget.dataset.index) {
      return;
    }
    this.setData({
      dinnerTimeCurrent: ev.currentTarget.dataset.index,
      current: ev.currentTarget.dataset.index
    })
    this.modifyTitle()
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  modifyTitle () {
    wx.setNavigationBarTitle({
      title: this.data.dinnerTimeList[this.data.dinnerTimeCurrent].text
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
  showMore (ev) {
    let id = ev.currentTarget.dataset.id
    this.data.discount_list1.forEach((item) => {
      if (item.id == id) {
        item.show = !item.show
      } else {
        item.show = false
      }
    })
    this.setData({
      discount_list1: this.data.discount_list1
    })
  },
  binSelectTab (ev) {
    if (this.data.see) {
      return
    }
    let id = ev.currentTarget.dataset.id
    this.data.discount_list1.forEach((item) => {
      if (item.id == id) {
        item.select = !item.select
        var juan = item
        var juanprise = 0

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
              selectjuan: juan || '',
              juanprise: juanprise
            })
          }
        })

      } else {
        item.select = false
      }
    })
    this.setData({
      discount_list1: this.data.discount_list1,
      selectAll: false
    })
  },
  // 点击确认去上个页面 
  bindToBackTab () {
    let juan = this.data.discount_list1.find((item) => {
      if (item.select) { 
        app.globalData.selectID = item.id
        app.globalData.selectID_phone = item.is_mobile_required
        return item
      }
    })
    var juanprise = 0
    
    if (!juan) {
      wx.navigateBack({
        delta: 1
      })
      return
    }

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
          selectjuan : juan || '',
          juanprise: juanprise
        })
      }
    })

    wx.navigateBack({
      delta: 1
    })
  },
  onLoad: function (options) {
    var that = this;
    app.globalData.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczpcL1wvZmFubW9mYW5nLjE3ZDMuY29tXC9hcGlcL3VzZXJcL2xvZ2luXC93ZWNoYXQiLCJpYXQiOjE1NTI1NzU5OTksImV4cCI6MTg2NzkzNTk5OSwibmJmIjoxNTUyNTc1OTk5LCJqdGkiOiJuakx5cEFZVExWZGpLM1lLIiwic3ViIjozOTEwLCJwcnYiOiI4N2UwYWYxZWY5ZmQxNTgxMmZkZWM5NzE1M2ExNGUwYjA0NzU0NmFhIn0.unXg8i1_eFfb3s4T3jR-7G9P4fmch_sXw9LhOzv26xM"
    var token = app.globalData.token
    this.modifyTitle()

    var totalPrise = options.totalPrise || ''
    
    if (options.see) {
      that.setData({
        see: true
      })
      totalPrise = ''
    }


    utils.computeHeight2(['.dinner-time-wrap', '.yesbtn', '#discount_list1', '#discount_list2']).then(function (results) {
      that.setData({
        swiperheigh: results[0] - results[1] - results[2],
        sildeHeight: results[0] - results[1] - results[2]
      })
    }).catch(function (e) {

    });


    // 获取货柜信息
    utils.request('http://fanmofang.17d3.com/api/my/coupons?type=1' + '&cart_amount=' + totalPrise, {token: token})
      .then(function (res) {
        console.log(res,'优惠卷 可用')
        that.setData({
          discount_list1: res.data.data.map((item) => {
            item.select = false
            item.show = false
            if (options.selectjuan == item.id) {
              item.select = true
            }
            return item
          })
        })

      }, function (err) {

      })

    utils.request('http://fanmofang.17d3.com/api/my/coupons?type=0' + '&cart_amount=' + totalPrise, { token: token })
      .then(function (res) {
        console.log(res, '优惠卷 不可用')
        that.setData({
          discount_list0: res.data.data
        },function(){
           setTimeout(function(){
             utils.computeHeight2(['#discount_list1', '#discount_list2']).then(function (results) {
               that.setData({
                 swiperheigh: Math.max(...(results).slice(1), that.data.swiperheigh),
               })
             }).catch(function (e) {

             });
           },30) 
        })
        
      }, function (err) {

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