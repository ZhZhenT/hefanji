//app.js
const utils = require('./utils/util.js')
App({
  onLaunch: function () { // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次） console.log('App onLaunch')
    var that = this;
    // 登录
    that.getUserToken = function (){
      return new Promise(function (resolve, reject) {
        if (that.globalData.tokenRes){
          resolve(that.globalData.tokenRes)
          return 
        }
        wx.login({
          success: res => {
            //发送 res.code 到后台换取 openId, sessionKey, unionId
            utils.request('https://www.yuexd.com/api/user/login/wechat', { data: { code: res.code } })
              .then(function (res) {
                that.globalData.tokenRes = res
                resolve(res)
              }, function (err) {
                reject(err)
              })
          }
        });
      });
    }

  },
  onShow:function(){

  },
  // 全局变量 
  globalData: {}
})