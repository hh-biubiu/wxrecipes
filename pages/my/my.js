// pages/my/my.js
import admin from '../../utils/admin'
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:[],
    recList:[],
    clasList:[],
    cuopacity:-1,
    navArr:["菜单","分类","关注"],
    menuArr:[],
    curIndex:0,
    userInfo:{},
    isLogin: false, //是否登录。 false 未登录  true，已经登录
    recipes: [{
        id: "1",
        recipeName: "烤苏格兰蛋",
        src: "../../imgs/1.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "2",
        recipeName: "法国甜点",
        src: "../../imgs/2.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "3",
        recipeName: "法式蓝带芝心猪排",
        src: "../../imgs/3.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "4",
        recipeName: "菠萝煎牛肉扒",
        src: "../../imgs/4.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "5",
        recipeName: "快手营养三明治",
        src: "../../imgs/5.jpg",
        opacity: 0, //遮罩层默认不显示
      },
      {
        id: "6",
        recipeName: "顶级菲力牛排",
        src: "../../imgs/6.jpg",
        opacity: 0, //遮罩层默认不显示
      }
    ],
    types: [{
        typename: "营养菜谱",
        'src': "../../static/type/type01.jpg"
      },
      {
        typename: "儿童菜谱",
        'src': "../../static/type/type02.jpg"
      },
      {
        typename: "家常菜谱",
        'src': "../../static/type/type03.jpg"
      },
      {
        typename: "主食菜谱",
        'src': "../../static/type/type04.jpg"
      },
      {
        typename: "西餐菜谱",
        'src': "../../static/type/type05.jpg"
      },
      {
        typename: "早餐菜谱",
        'src': "../../static/type/type06.jpg"
      },
    ],
    lists: [{
        src: "../../static/list/list01.jpg",
        name: "土豆小番茄披萨",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      },
      {
        src: "../../static/list/list02.jpg",
        name: "草莓巧克力三明治",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 88,
        follow: 200
      },
      {
        src: "../../static/list/list03.jpg",
        name: "法师意大利面",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      },
      {
        src: "../../static/list/list04.jpg",
        name: "自制拉花",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      },
      {
        src: "../../static/list/list05.jpg",
        name: "营养早餐",
        userInfo: {
          nickName: "林总小图",
          pic: "../../static/list/users.png"
        },
        views: 999,
        follow: 100
      }
    ],
  },
  onLoad(){
    this._checkLogin()
    this.getClass() //分类列表
    this.getRec() //关注列表
  },
  onShow(){
    this.getRec()
    this.getmenu()
  },
  //检查是否登录
  _checkLogin(){
   
    wx.checkSession({
      success: (res) => {
       let userInfo =  wx.getStorageSync('userInfo')
        console.log(res)
        this.setData({
          isLogin:true,
          userInfo
        })
        //登录成功之后获取数据
        this.getmenu()
      },
      fail:(res)=>{
        console.log(res)
        this.setData({
          isLogin:false
        })
        wx.showToast({
          title: '请先登录',
          icon:'none'
        })
      }
    })
  },
  //去登录
  doLogin(e){
    //先授权
    console.log(e);
    if(e.detail.errMsg=="getUserInfo:fail auth deny"){
      wx.showToast({
        title: "授权才能登录",
        icon:'none'
      })
    }else{
       //登录
      wx.login({
        success:()=>{
          wx.cloud.callFunction({
            name:'login',
            success:(res)=>{
              console.log(res);
              let openid = res.result.openid
              db.collection("user").where({_openid:openid}).get({
                success:(res)=>{
                  console.log(res);
                  if(res.data.length==0){
                    db.collection("user").add({
                      data:e.detail.userInfo
                    })
                  }
                  wx.showToast({
                    title: '登录成功',
                  })
                  wx.setStorage({
                    data: e.detail.userInfo,
                    key: 'userInfo',
                  })
                  wx.setStorage({
                    data:openid,
                    key:'openid'
                  })
                  this.setData({
                    isLogin:true,
                    userInfo: e.detail.userInfo
                  })
                  //登录成功之后获取数据
                  this.getmenu()
                }
              })

            }
          })
        }
      })
    }
   
  },
//判断是否为管理员
toCart(){
  let openid = wx.getStorageSync('openid')
  if(admin == openid){
    wx.navigateTo({
      url: '../category/category',
    })
  }
},
//导航栏
navIndex(e){
  // console.log(e);
  this.setData({
    curIndex:e.target.dataset.index
  })
},
//加号跳转
addMeun(){
  wx.navigateTo({
    url: '../pbrecipe/pbrecipe',
  })
},
  // 处理遮罩层显示问题
  _delStyle(e) {
    // 获取索引
    let index = e.currentTarget.dataset.index;
    this.setData({
      cuopacity:index
    })
    // 将所有的列表都设置不显示
    // this.data.recipes.map((item) => {
    //   item.opacity = 0;
    // })
    // // 将长按的列表项设置为选中
    // this.data.recipes[index].opacity = 1;
    // this.setData({
    //   recipes: this.data.recipes
    // })
  },
  // 执行删除操作
  _doDelete(e){
    let index = e.currentTarget.dataset.index;
    // 如果没有显示删除图标，点击删除，直接返回
    if(!this.data.recipes[index].opacity)return;
    let _this = this;
    wx.showModal({
       title:"删除提示",
       content:"您确定删除么？",
       success(res){
            if(res.confirm){
              //执行删除
              console.log('执行删除')
            }else{
              //取消删除
              _this.data.recipes[index].opacity = 0;
              _this.setData({
                recipes: _this.data.recipes
              })
            }
       }
    })
  },
//获取菜单列表
  getmenu(){
    let openids = wx.getStorageSync('openid')
    
    let where = {
      status:1,
      _openid:openids
    }
    db.collection("re-recipes").where(where).get({
      success:(res)=>{
        // console.log(res);
        this.setData({
          menuArr:res.data
        })
      }
    })
},
 //详情
 toDetail(e){
  // console.log(e);
 let {id,img,name,title} = e.currentTarget.dataset;
  wx.navigateTo({
    url: `../detail/detail?id=${id}&title=${title}&img=${img}&name=${name}`,
  })
},
//删除
_doDelete(e){
  console.log(e);
  let id = e.target.dataset.id
  db.collection("re-recipes").doc(id).update({
    data:{
      status:2
    },
    success:()=>{
      wx.showToast({
        title: '删除成功',
      })
      this.setData({
        cuopacity:-1
      })
      this.getmenu()
    }
  })
},
//点击空白处让遮罩层消失
dispear(){
  this.setData({
    cuopacity:-1,
  })
},
//分类列表
getClass(){
  // let openid = wx.getStorageSync('openid')
  db.collection("recipe").where({_openid:admin}).get({
    success:(res)=>{
      this.setData({
        clasList:res.data
      })
    }
  })
},
//关注列表
async getRec(){
  let newRec=[]
  let openid = wx.getStorageSync('openid')
  let result = await db.collection("re-followRecipe").where({_openid:openid}).get({})
  // console.log(result.data);
  let arr = result.data.map(item=>{
   return   db.collection("re-recipes").where({_id:item.recipeID}).get({})
  })
  let newList = await Promise.all(arr)
  newList.forEach(item=>{
    // console.log(item.data);
    return newRec.push(item.data)
  })
  console.log(newRec);
  //  console.log(newList);
  //  console.log(arr);
   //处理用户信息
   let newArr = []
   newRec.map(item=>{
       let one = db.collection("user").where({_openid:item[0]._openid}).get({})
       newArr.push(one)
   })
   let user = await Promise.all(newArr)
   let newUser = []
   user.map(item=>{
     return newUser.push(item)
   })
  //  console.log(newUser);
  //  console.log(newUser[0].data[0]._id);
   this.setData({
    recList:newRec,
    user:newUser
   }) 
  // console.log(newList.data);
},
//从分类去到列表页
tolist(e){
  // console.log(e);
  let {id=null,tag,title}=e.currentTarget.dataset
  // console.log(tag);
  wx.navigateTo({
    url: `../list/list?id=${id}&tag=${tag}&title=${title}`,
  })
},

})