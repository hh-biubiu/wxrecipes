// pages/list/list.js
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ptList:[],
    userInfo:[],
    lists:[
      {
        src:"../../static/list/list01.jpg",
        name:"土豆小番茄披萨",
        userInfo:{
          nickName:"林总小图",
          pic:"../../static/list/users.png"
        },
        views:999,
        follow:100
      },
      {
        src:"../../static/list/list02.jpg",
        name:"草莓巧克力三明治",
        userInfo:{
          nickName:"林总小图",
          pic:"../../static/list/users.png"
        },
        views:88,
        follow:200
      },
      {
        src:"../../static/list/list03.jpg",
        name:"法师意大利面",
        userInfo:{
          nickName:"林总小图",
          pic:"../../static/list/users.png"
        },
        views:999,
        follow:100
      },
      {
        src:"../../static/list/list04.jpg",
        name:"自制拉花",
        userInfo:{
          nickName:"林总小图",
          pic:"../../static/list/users.png"
        },
        views:999,
        follow:100
      },
      {
        src:"../../static/list/list05.jpg",
        name:"营养早餐",
        userInfo:{
          nickName:"林总小图",
          pic:"../../static/list/users.png"
        },
        views:999,
        follow:100
      }
    ]
  },
  onLoad(options){
    console.log(options);
  wx.setNavigationBarTitle({
      title: options.title
    })
    this.getDate(options)
  },
 getDate(info){
   switch (info.tag) {
     case 'putong':
       this.ptData(info.id)
       break;
   case 'recon':
     this.recData()
     break;
   case 'my':
     this.mydata(info.id)
     break;
     default:
       this.seaData(info)
       break;
   }
 },
 //普通菜谱
async ptData(id){
  let result= await  db.collection("re-recipes").where({recipeTypeId:id,status:1}).get({})
  console.log(result);
  //处理用户信息
  let newArr = []
  result.data.map(item=>{
      let one = db.collection("user").where({_openid:item._openid}).get({})
      newArr.push(one)
  })
  let userInfo = await Promise.all(newArr)
  this.setData({
      ptList:result.data,
      userInfo
  }) 
 },
 //推荐菜谱
async recData(){
  let result= await  db.collection("re-recipes").where({status:1}).get({})
  result.data.sort(function(a,b){
    return b.follows - a.follows
  })
   //处理用户信息
   let newArr = []
   result.data.map(item=>{
       let one = db.collection("user").where({_openid:item._openid}).get({})
       newArr.push(one)
   })
   let userInfo = await Promise.all(newArr)
   this.setData({
       ptList:result.data,
       userInfo
   }) 
},
 //搜索
async  seaData(info){
   let value = info.msg
   //匹配正则
   let reg = db.RegExp({
    regexp: value,
    options: 'i',
  })
  //获取数据进行模糊查询
  let result = await db.collection("re-recipes").where({recipeName:reg,status:1}).get({})
  console.log(result);
  if(result.data.length==0){
    wx.showToast({
      title: '暂无数据',
      icon:"none"
    })
  }
    //处理用户信息
    let newArr = []
    result.data.map(item=>{
        let one = db.collection("user").where({_openid:item._openid}).get({})
        newArr.push(one)
    })
    let userInfo = await Promise.all(newArr)
    this.setData({
        ptList:result.data,
        userInfo
    }) 
 },
 //详情
 toDetail(e){
  console.log(e);
 let {id,img,name,title} = e.currentTarget.dataset;
  wx.navigateTo({
    url: `../detail/detail?id=${id}&title=${title}&img=${img}&name=${name}`,
  })
},
//我的分类
async mydata(id){
  // console.log(id);
  let openid = wx.getStorageSync('openid')
  let result= await  db.collection("re-recipes").where({recipeTypeId:id,status:1,_openid:openid}).get({})
  console.log(result);
  //处理用户信息
  let newArr = []
  result.data.map(item=>{
      let one = db.collection("user").where({_openid:item._openid}).get({})
      newArr.push(one)
  })
  let userInfo = await Promise.all(newArr)
  this.setData({
      ptList:result.data,
      userInfo
  }) 
 },
})