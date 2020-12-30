// pages/type/type.js
let db = wx.cloud.database()
import admin from '../../utils/admin'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    clasList:[],
    types:[
      {typename:"营养菜谱",'src':"../../static/type/type01.jpg"},
      {typename:"儿童菜谱",'src':"../../static/type/type02.jpg"},
      {typename:"家常菜谱",'src':"../../static/type/type03.jpg"},
      {typename:"主食菜谱",'src':"../../static/type/type04.jpg"},
      {typename:"西餐菜谱",'src':"../../static/type/type05.jpg"},
      {typename:"早餐菜谱",'src':"../../static/type/type06.jpg"},
    ]
  },
  onLoad(){
    this.getClass()
  },
//分类列表
getClass(){
  // let openid = wx.getStorageSync('openid')
  db.collection("recipe").where({_openid:admin}).get({
    success:(res)=>{
      this.setData({
        clasList:res.data
      })
      // console.log(res.data);
    }
  })
},
 //去到列表页
tolist(e){
  console.log(e);
  let {id=null,tag,title}=e.currentTarget.dataset
  console.log(tag);
  wx.navigateTo({
    url: `../list/list?id=${id}&tag=${tag}&title=${title}`,
  })
},
})