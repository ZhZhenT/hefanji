function formatTime(date,add) {
  date.setDate(date.getDate() + (add?add:0));
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  return year + '-' + formatNumber(month) + '-' + formatNumber(day)
}

function formatNumber (n){
  n = n.toString()
  return n[1] ? n : '0' + n
}

function addgoods(goodsList, goodsid, date, containerid){
  var nowindex = 0
  goodsList.forEach(function (item,index){
    if(item.date == date){
      nowindex = index
      return 
    }
  });

  goodsList[nowindex].products.forEach(function (item) {
    if (item.product.id == goodsid) {
     item.selected++;

     var showCard = wx.getStorageSync('showCard') || {};
     var container = {}
     if (showCard[containerid]){
       container = showCard[containerid]
     }else{
       showCard[containerid] = {}
     } 
     var datelist = {}
     if (container[date]){
       datelist = container[datelist]
     }else{
       showCard[containerid][date] = {}
     } 
     showCard[containerid][date][goodsid] = item.selected;
     wx.setStorageSync('showCard', showCard)
     
     //console.log(containerid, date, goodsid, item.selected)
     
     return
    }
  })
 
  return goodsList
}

function reducegoods(goodsList, goodsid, date, containerid) {
  var nowindex = 0
  goodsList.forEach(function (item, index) {
    if (item.date == date) {
      nowindex = index
      return
    }
  });
  goodsList[nowindex].products.forEach(function (item) {
    if (item.product.id == goodsid) {
      item.selected--;

      var showCard = wx.getStorageSync('showCard') || {};
      var container = {}
      if (showCard[containerid]) {
        container = showCard[containerid]
      } else {
        showCard[containerid] = {}
      }
      var datelist = {}
      if (container[date]) {
        datelist = container[datelist]
      } else {
        showCard[containerid][date] = {}
      }
      showCard[containerid][date][goodsid] = item.selected;
      wx.setStorageSync('showCard', showCard)

      return
    }
  })
  return goodsList
}

function removeallgoods(goodsList, containerid){
  var showCard = wx.getStorageSync('showCard') || {};
  var container = {}

  if (showCard[containerid]) {
    showCard[containerid] = {}
  }
  wx.setStorageSync('showCard', showCard)

  goodsList.forEach(function (item) {
    item['products'].forEach(function (item) {
      item.selected = 0;
    })
  })
  
  return goodsList
}

function searchgoods(goodsList, goodsid){
  var goods = {}
  goodsList.forEach(function (item) {
    if (item.id == goodsid) {
      goods = item;
      return ;
    }
  })
  return goods
}

function computeHeight2(elarr){
  var arr = [];
  var pro = null;
  var promiseWH = new Promise(function (resolve, reject){
    wx.getSystemInfo({
      success: function (res) {
        var wh = res.windowHeight
        resolve(wh)
      }
    })
  })
  arr.push(promiseWH)
  elarr.forEach(function(item){
    pro = new Promise(function (resolve, reject){
      wx.createSelectorQuery().select(item).boundingClientRect(function (rect) {
        resolve(rect.height)
      }).exec()
    })
    arr.push(pro)
  })
  return Promise.all(arr)
}

function computeHeight(elarr,cb,isWH) {
  wx.getSystemInfo({
    success: function (res) {
      var wh = res.windowHeight
      var heightList = [];
      var index = 0;
      computeElHeight(elarr, heightList, index, wh, cb, isWH)
      
    }
  })
}

function computeElHeight(elarr, heightList, index, wh, cb, isWH){
  
  wx.createSelectorQuery().select(elarr[index]).boundingClientRect(function (rect) {
    if (!rect){
      return
    }
    heightList.push(rect.height);
    if (++index >= elarr.length) {
      if (isWH){
        var height = heightList.reduce((preTotal, item) => {
          return preTotal + item
        }, 0)
      }else{
        var height = heightList.reduce((preTotal, item) => {
          return preTotal - item
        }, wh)
      }
 
      cb(height)
    } else {
      computeElHeight(elarr, heightList, index, wh,cb)
    }
  }).exec()
}

function computeNumPrise(goodsList) {
  var res = { totalNum: 0, totalPrise: 0, reducePrise: 0}
  goodsList.forEach(function (item) {

  
    if (item.date == formatTime(new Date())){
      item.datetext1 = '今天'
    }else{
      item.datetext1 = '预定'
    }
    item['products'].forEach(function (item) {

      if (!item.is_hot_sale){
        item.zhekou =  parseFloat(item.price / item.product.base_price * 10).toFixed(1);
      }else{
        item.zhekou = 0
      }

      res.totalNum += item.selected;
 
      res.totalPrise = parseFloat((res.totalPrise * 100 + Number(item.price) * Number(item.selected) * 100) / 100).toFixed(2);
      res.reducePrise = parseFloat((res.reducePrise * 100 + Number(item.product.base_price) * Number(item.selected) * 100) / 100).toFixed(2);

    })
  })

  res.reducePrise = parseFloat((res.reducePrise * 100 - res.totalPrise * 100) / 100).toFixed(2);
  
  return res
}

function initGoodsList(goodsList, shopCard2){
  goodsList.forEach(function (item) {

    var goodsnumlist = {}

    if (shopCard2[item.date]) {
      goodsnumlist = shopCard2[item.date]
    }

    //console.log(goodsnumlist)
    item['products'].forEach(function (item) {
      if (goodsnumlist[item.product.id]){
        item.selected = goodsnumlist[item.product.id]
        item.selected = item.selected > item.available ? item.available : item.selected
      }
    })

  })
  return goodsList
}

function formatFloat (f, digit) {
  var m = Math.pow(10, digit);
  return parseInt(f * m, 10) / m;
}

function request(url,options = {}){

  var method = options.method || 'get';
  var data = options.data || {};
  var token = options.token || '';

  wx.showLoading()
  var promise = new Promise(function (resolve,reject){
    wx.request({
      url: url,
      method: method,
      data: data,
      header: {
        'Authorization': 'Bearer '+ token,
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading()
        resolve(res);
      },
      fail:function(err){
        wx.hideLoading()
        reject({
          code:'404',
          message:'服务器请求错误',
          err:err,
          url: url
        })
      }
    })
  })
  return promise
}

function getUserToken (){
  return new Promise(function (resolve, reject) {
    wx.login({
      success: res => {
        //发送 res.code 到后台换取 openId, sessionKey, unionId,token
        request('https://www.yuexd.com/api/user/login/wechat', { data: { code: res.code } })
          .then(function (res) {
            resolve(res)
          }, function (err) {
            reject(err)
          })
      }
    });
  })
}

function getdatefenzu(goodsList){
  var detail = []

  goodsList.forEach(function (item) {
    var obj = {}
    var arr = []
    item.products.forEach(function (val) {
      if (val.selected != 0) {
        arr.push({ 'id': val.product.id, 'num': val.selected })
      }
    })

    obj.order_date = item.date
    obj.products = arr
  
    if (arr.length != 0) {
      detail.push(obj)
    }

  })

  return detail
}

module.exports = {
  formatTime: formatTime,//格式化时间
  formatFloat: formatFloat,//浮点数精度处理
  addgoods: addgoods,//添加商品
  reducegoods: reducegoods,//减少商品
  computeNumPrise: computeNumPrise,//计算购物车总价 数量
  removeallgoods: removeallgoods,//清空购物车
  searchgoods: searchgoods,//查找商品
  computeHeight: computeHeight,//计算内容区高度
  computeHeight2: computeHeight2,
  request: request,//基于promise封装request请求
  initGoodsList: initGoodsList,//初始化购物车数据
  getUserToken: getUserToken,//登陆
  getdatefenzu: getdatefenzu
}