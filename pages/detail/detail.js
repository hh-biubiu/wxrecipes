// pages/detail/detail.js
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deList:[],
    option:[],
    isFolw:false,
      imgs:[
        "../../static/detail/1.jpg",
        "../../static/detail/2.jpg",
        "../../static/detail/4.jpg",
        "../../static/detail/6.jpg",
        "../../static/detail/8.jpg",
      ]
  },
onLoad(options){
  console.log(options);
  wx.setNavigationBarTitle({
    title:options.title
  })
  this.setData({
    option:options
  })
  this.getDetail(options)
},
//获取详情
async getDetail(info){
  console.log(info.id);
      //只要用户打开详情页，就给当前菜谱的views自增1
      // let news = await db.collection("re-recipes").where({_id:info.id}).get({})
      // console.log(news)
      let viewsResult = await db.collection("re-recipes").where({_id:info.id}).update({
        data:{
          views:db.command.inc(1)
        }
      })
      console.log(viewsResult);
    let result = await db.collection("re-recipes").where({_id:info.id}).get({})
    this.setData({
      deList:result.data
    })
    console.log(result);
    // 判断当前是否登录------如果登录了，在缓存中有openid
    // 如果登录了，再判断用户有没有关注
    //是否登录
    let openid = wx.getStorageSync('openid')||null
    //未登录则显示关注图标
    if(openid==null){
      this.setData({
        isFolw:false
      })
    }else{
       // 若已登录，通过openid和recipeId,查询数据库中是否有关注过  
        let where={
          _openid:openid,
          recipeID:this.data.option.id
        }
        let followed = await db.collection("re-followRecipe").where(where).get({})
        //为0则为未关注
        if(followed.data.length==0){
          this.setData({
            isFolw:false
          })
        }else{
          this.setData({
            isFolw:true
          })
        }
    }

},
//关注按钮
async doFollow(){
  //未登录时不能点击关注
  let openid = wx.getStorageSync('openid')||null
  if(openid==null){
    wx.showToast({
      title: '请先登录',
      icon:'none'
    })
    return
  }
  //登录状态已关注--取消关注
  if(this.data.isFolw){
      
      //从数据库中移出数据
      let remove =await db.collection("re-followRecipe").where({recipeID:this.data.option.id,_openid:openid}).remove({})
      console.log(remove);
      if(remove.stats.removed==1){
        this.setData({
          isFolw:false
        })
        let upFol = await db.collection("re-recipes").where({_id:this.data.option.id}).update({
          data:{
            follows:db.command.inc(-1)
          }
        })
        console.log(upFol);
      }
  }else{
//未关注---关注
   
    //往关注表中添加数据
   let folL = await db.collection("re-followRecipe").add({
      data:{
        recipeID:this.data.option.id
      }
    })
    console.log(folL);
    //关注成功，re-recipes表中follows的加一
    if(folL._id){
      let upFol = await db.collection("re-recipes").where({_id:this.data.option.id}).update({
        data:{
          follows:db.command.inc(1)
        }
      })
      wx.showToast({
        title: '关注成功',
      })
      this.setData({
        isFolw:true,

      })
      // console.log(upFol);
    }
  }
  
},
//联系客服
connect(){
  wx.makePhoneCall({
    phoneNumber: '17873223435' //仅为示例，并非真实的电话号码
  })
}
})