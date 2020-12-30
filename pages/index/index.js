let db = wx.cloud.database()
Page({
    data: {
        claArr:[],
        hotArr:[],
        userInfo:[],
        types: [
            {
                src: "../../imgs/index_07.jpg",
                typename: "营养菜谱"
            },
            {
                src: "../../imgs/index_09.jpg",
                typename: "儿童菜谱"
            },
        ],
        recipes:[
            {
                recipeName:"烤苏格兰蛋",
                src:"../../imgs/1.jpg"
            },
            {
                recipeName:"法国甜点",
                src:"../../imgs/2.jpg"
            },
            {
                recipeName:"法式蓝带芝心猪排",
                src:"../../imgs/3.jpg"
            },
            {
                recipeName:"菠萝煎牛肉扒",
                src:"../../imgs/4.jpg"
            },
            {
                recipeName:"快手营养三明治",
                src:"../../imgs/5.jpg"
            },
            {
                recipeName:"顶级菲力牛排",
                src:"../../imgs/6.jpg"
            }
        ]
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
        // console.log(result);
        this.setData({
            hotArr:result.data,
            userInfo
        }) 
},
//菜谱导航栏
getCla(){
    db.collection("recipe").where({}).get({
        success:(res)=>{
            // console.log(res);
            this.setData({
                claArr:res.data
            })
        }
    })
},
//去到列表页
tolist(e){
    console.log(e);
    let {id=null,tag,title}=e.currentTarget.dataset
    // console.log(tag);
    wx.navigateTo({
      url: `../list/list?id=${id}&tag=${tag}&title=${title}`,
    })
},
//菜谱分类
goCla(){
    wx.navigateTo({
      url: '../type/type',
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
    onShow(){
        this.getHot()
        this.getCla()
    },
})