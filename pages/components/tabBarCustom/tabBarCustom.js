Component({
  properties: {
    // 属性值可以在组件使用时指定
    current: { 
      type: Number,
      value: 0, 
    },
    show: {
      type: Boolean,
      value: true,
    },
  },
  data: {
    // 这里是一些组件内部数据
    
  },
  methods: {
    binToIndex: function(){

      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
    binToDingdan: function () {

      wx.redirectTo({
        url: '/pages/orderlist/orderlist'
      })
    },
    binToUserCenter: function () {

      wx.redirectTo({
        url: '/pages/usercenter/usercenter'
      })
    }
  }
})