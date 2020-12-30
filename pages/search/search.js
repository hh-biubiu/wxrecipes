// pages/search/search.js
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowList:[],
    hotArr:[],
    value:'',
  },
  //获取搜索框的输入
  seaval(e){
    console.log(e);
    this.setData({
      value:e.detail.value
    })
  },
  //搜索按钮
  _search(e){
    console.log(e);
    let nowArr = this.data.nowList
    nowArr.push(this.data.value)
    console.log(nowArr);
    this.setData({
      nowList:nowArr
    })
    let {tag,title}= e.currentTarget.dataset
    wx.navigateTo({
      url: `../list/list?tag=${tag}&title=${title}&msg=${this.data.value}`,
    })
  },
    //获取热门菜谱，views
    async  getHot(){
      let result = await  db.collection("re-recipes").where({status:1}).get({})
      result.data.sort(function(a,b){
          return b.views - a.views
      })
      let newArr = []
      result.data.map(item=>{
          let one = db.collection("user").where({_openid:item._openid}).get({})
          newArr.push(one)
      })
      let userInfo = await Promise.all(newArr)
      // console.log(userInfo);
      console.log(result);
      this.setData({
          hotArr:result.data,
          userInfo
      }) 
},
//详情页
toDetail(e){
  // console.log(e);
 let {id,img,name,title} = e.currentTarget.dataset;
  wx.navigateTo({
    url: `../detail/detail?id=${id}&title=${title}&img=${img}&name=${name}`,
  })
},
toNow(e){
  console.log(e);
  this.setData({
    value:e.currentTarget.dataset.name
  })
},
onLoad(){
  this.getHot()
} 
})