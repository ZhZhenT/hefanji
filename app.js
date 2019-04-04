//app.js
const utils = require('./utils/util.js')
App({
  onLaunch: function() { // 当小程序初始化完成时，会触发 onLaunch（全局只触发一次） console.log('App onLaunch')
    var that = this;

    that.getUserToken = function(userid,cid) {
      return new Promise(function(resolve, reject) {
        // if (that.globalData.tokenRes){
        //   resolve(that.globalData.tokenRes)
        //   return 
        // }
        wx.login({
          success: res => {
            //发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log('登陆cid', cid)
            utils.request('https://www.yuexd.com/api/user/login/wechat', {
                data: {
                  code: res.code,
                  referer_user_id: userid || '',
                  container_id: cid || ''
                }
              })
              .then(function(res) {
                console.log(res, '登陆信息')
                that.globalData.tokenRes = res
                that.globalData.userid = res.data.user_info.id
                wx.setStorageSync('mobile', res.data.user_info.mobile)
                resolve(res)
              }, function(err) {

                reject(err)
              })
          }
        });
      });
    }

  },
  onShow: function() {

  },
  // 全局变量 
  globalData: {}
})