// pages/pbrecipe/pbrecipe.js
let db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
      reList:[],
      files:[],
      fileds:[]
  },
//获取数据
getdata(){
    db.collection('recipe').where({}).get({
      success:(res)=>{
        console.log(res);
        this.setData({
          reList:res.data
        })
      }
    })
},
//获取图片列表
async  _select(e){
    console.log(e);
    let temp = e.detail.tempFilePaths
   let filesArr =  temp.map(item=>{
      return {url:item}
    })
    let files = this.data.files.concat(filesArr)

    // console.log(filesArr);
    //获取上传云端的fileID
   
    // console.log(arr);
    this.setData({
      files
    })
    let arr = await this._cloud(this.data.files)
    let _fileID = arr.map(item=>{
      return item.fileID
    })
    this.setData({
      fileds:_fileID
    })
    
},
//删除图片
_delete(e){
  console.log(e);
  let index = e.detail.index
  let fileDel = this.data.files.splice(index,1)
  this.setData({
    files:fileDel
  })
},
//上传到云端
async  _cloud(files){
  let fileidArr=[]
    files.forEach((item,index)=>{
      let extname = item.url.split('.').pop()
      let cloud = new Date().getTime() + '_'+index +"."+extname
      let fileId =  wx.cloud.uploadFile({
        cloudPath:"images/"+cloud,
        filePath:item.url
      })
      // console.log(fileId);
      fileidArr.push(fileId)
    })
    return await Promise.all(fileidArr)
},
//发布
fbcd(e){
  console.log(e);
  if(e.detail.value.recipeName==''||e.detail.value.recipeTypeid==''||e.detail.value.recipesMake==''||this.data.fileds.length==0){
    wx.showToast({
      title: '内容不能为空',
      icon:'none'
    })
  }else{
    db.collection("re-recipes").add({
      data:{
        recipeName:e.detail.value.recipeName,
        recipeTypeId:e.detail.value.recipeTypeid,
        fields:this.data.fileds,
        recipeMakes:e.detail.value.recipesMake,
        follows:0,
        views:0,
        status:1,
        time:new Date().getTime()
      },
      success:()=>{
        wx.showToast({
          title: '发布成功',
        })
        setTimeout(()=>{
          wx.switchTab({
            url: '../index/index',
          })
        },1500)
      }
    })
  }
},
onLoad(){
  this.getdata()
}
 
})