// pages/category/category.js
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:'',
    recipeList:[],
    name:'',
    id:''
  },
  //添加数据
  //获取添加输入框的输入
  addva(e){
    console.log(e.detail.value);
    this.setData({
      value:e.detail.value
    })
  },
  //添加
  add(){
    let value = this.data.value
    let reList = this.data.recipeList
    let flag = reList.findIndex(item=>{
      return item.typename == value
    })
    // console.log(flag);
    if(value==''){
      wx.showToast({
        title: '内容不能为空',
        icon:'none'
      })
      return;
    }
    if(flag!=-1){
      wx.showToast({
        title: '菜谱已存在',
        icon:'none'
      })
      return;
    }
    db.collection('recipe').add({
      data:{
       typename:value
      },
      success:(res)=>{
        wx.showToast({
          title: '添加成功',
        })
        this.getdata()
        this.setData({
          value:''
        })
      }
     })
  },

//获取数据库的数据
getdata(){
  db.collection("recipe").where({}).get({
    success:(res)=>{
      console.log(res);
      
      this.setData({
        recipeList:res.data
      })
    }
  })
},
//删除
del(e){
    console.log(e);
    let id = e.target.dataset.id
    db.collection("recipe").doc(id).remove({
      success:(res)=>{
        this.getdata()
        wx.showToast({
          title: '删除成功',
        })
      }
    })
},
//菜单修改
set(e){
  console.log(e);
  let name = e.target.dataset.name
  this.setData({
    name,
    id:e.target.dataset.id
  })
  console.log(this.data.id);
  
},
//获取修改输入框的输入
getva(e){
  console.log(e.detail.value);
  this.setData({
    name:e.detail.value
  })  
},
//数据库修改
update(){
  let name = this.data.name
    let reList = this.data.recipeList
    let flag = reList.findIndex(item=>{
      return item.typename == name
    })
    // console.log(flag);
    if(name==''){
      wx.showToast({
        title: '内容不能为空',
        icon:'none'
      })
      return;
    }
    if(flag!=-1){
      wx.showToast({
        title: '菜谱已存在',
        icon:'none'
      })
      return;
    }
  db.collection("recipe").doc(this.data.id).update({
    data:{
      typename:name
    },
    success:(res)=>{
      wx.showToast({
        title: '修改成功',
      })
      this.getdata()
      this.setData({
        name:''
      })
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.getdata()
  },
})