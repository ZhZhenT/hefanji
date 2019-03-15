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

function addgoods(goodsList, goodsid, date, containerid, can){
  var nowindex = 0
  goodsList.forEach(function (item,index){
    if(item.date == date){
      nowindex = index
      return 
    }
  });
  goodsList[nowindex].products[can].forEach(function (item) {
    
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

     var o = {}

      if (showCard[containerid][date][can]) {
        o = showCard[containerid][date][can]
      } else {
        showCard[containerid][date][can] = {}
      }

     
     showCard[containerid][date][can][goodsid] = item.selected;
     
     wx.setStorageSync('showCard', showCard)
     
     // console.log(containerid, date, goodsid, item.selected)
     
     return
    }
  })
 
  return goodsList
}

function reducegoods(goodsList, goodsid, date, containerid, can) {
  var nowindex = 0
  goodsList.forEach(function (item, index) {
    if (item.date == date) {
      nowindex = index
      return
    }
  });
  goodsList[nowindex].products[can].forEach(function (item) {
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
      var o = {}

      if (showCard[containerid][date][can]) {
        o = showCard[containerid][date][can]
      } else {
        showCard[containerid][date][can] = {}
      }


      showCard[containerid][date][can][goodsid] = item.selected;

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
    
    /*item['products'].forEach(function (item) {
      item.selected = 0;
    })*/
    for (var i in item['products']) {
      item['products'][i].forEach(function (item) {
        item.selected = 0;
      })
    }

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

  
    if (item.date == formatTime(new Date())) {
      item.datetext1 = '今天'
    }else{
      item.datetext1 = '预定'
    }

    for (var i in item['products']) {

      item['products'][i].forEach(function (item) {
        if (!item.is_hot_sale) {
          item.zhekou = parseFloat(item.price / item.product.base_price * 10).toFixed(1);
        } else {
          item.zhekou = 0
        }
        res.totalNum += item.selected;
        res.totalPrise = parseFloat((res.totalPrise * 100 + Number(item.price) * Number(item.selected) * 100) / 100).toFixed(2);
        res.reducePrise = parseFloat((res.reducePrise * 100 + Number(item.product.base_price) * Number(item.selected) * 100) / 100).toFixed(2);
      })

    }

    /*item['products'].forEach(function (item) {
      if (!item.is_hot_sale) {
        item.zhekou =  parseFloat(item.price / item.product.base_price * 10).toFixed(1);
      } else {
        item.zhekou = 0
      }
      res.totalNum += item.selected;
      res.totalPrise = parseFloat((res.totalPrise * 100 + Number(item.price) * Number(item.selected) * 100) / 100).toFixed(2);
      res.reducePrise = parseFloat((res.reducePrise * 100 + Number(item.product.base_price) * Number(item.selected) * 100) / 100).toFixed(2);
    })*/

  })

  res.reducePrise = parseFloat((res.reducePrise * 100 - res.totalPrise * 100) / 100).toFixed(2);
  
  return res
}

function findMax (goodsList) {
  var res = 0
  goodsList.forEach(function (item) {
    if (item.date == formatTime(new Date())) {
      item.datetext1 = '今天'
    } else {
      item.datetext1 = '预定'
    }

    for (var i in item['products']) {

      item['products'][i].forEach(function (item) {
        if (item.selected > 0) {
          if (res) {
            res = Math.max(item.price, res)
          } else {
            res = item.price
          }
        }
      })

    }

    /*item['products'].forEach(function (item) {

      if (item.selected > 0) {
        if (res) {
          res = Math.max(item.price,res)
        } else {
          res = item.price
        }
      }

    })*/
  })

  

  return res
}

function initGoodsList(goodsList, shopCard2){
  // console.log(goodsList)
  goodsList.forEach(function (item) {

    var goodsnumlist = {}

    if (shopCard2[item.date]) {
      goodsnumlist = shopCard2[item.date]
    }
    
    

    for (var i in item['products']) {
  
      item['products'][i].forEach(function (item) {
        item.selected = 0
        item.can = i + ''
        let text = ''
        if (item.can === 'breakfast') {
          text = '早餐'
        } else if (item.can === 'lunch') {
          text = '午餐'
        } else if (item.can === 'afternoon') {
          text = '下午茶'
        } else if (item.can === 'dinner') {
          text = '晚餐'
        }
        item.cantxt = text
        if (goodsnumlist[i]) {
          if (goodsnumlist[i][item.product.id]) {
            console.log(goodsnumlist, 'xxxx')
            item.selected = goodsnumlist[i][item.product.id]
            item.selected = item.selected > item.available ? item.available : item.selected
          }
        }

        /*if (goodsnumlist[item.product.id]) {
          item.selected = goodsnumlist[item.product.id]
          item.selected = item.selected > item.available ? item.available : item.selected
        }*/
      })

    }

    /*item['product'].forEach(function (item) {
      if (goodsnumlist[item.product.id]){
        item.selected = goodsnumlist[item.product.id]
        item.selected = item.selected > item.available ? item.available : item.selected
      }
    })*/

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

        if (err.errMsg == 'request:fail timeout') {
          wx.showToast({
            title: '请求超时,请检查网络设置',
            icon: 'none',
            duration: 1500
          })
        }

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

    for (var i in item['products']) {
  
      item['products'][i].forEach(function (val) {
        
        if (val.selected != 0) {
          arr.push({ 'id': val.product.id, 'num': val.selected })
        }
      })

    }
    /*item.products.forEach(function (val) {
      if (val.selected != 0) {
        arr.push({ 'id': val.product.id, 'num': val.selected })
      }
    })*/

    obj.order_date = item.date
    obj.products = arr
  
    if (arr.length != 0) {
      detail.push(obj)
    }

  })
 
  return detail
}

function GetQueryString(url, paraName) {
  　　　　var arrObj = url.split("?");

  　　　　if (arrObj.length > 1) {
    　　　　　　var arrPara = arrObj[1].split("&");
    　　　　　　var arr;

    　　　　　　for (var i = 0; i < arrPara.length; i++) {
      　　　　　　　　arr = arrPara[i].split("=");

      　　　　　　　　if (arr != null && arr[0] == paraName) {
        　　　　　　　　　　return arr[1];
      　　　　　　　　}
    　　　　　　}
    　　　　　　return "";
  　　　　}
  　　　　else {
    　　　　　　return "";
  　　　　}
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
  getdatefenzu: getdatefenzu,
  GetQueryString: GetQueryString,
  findMax: findMax
}