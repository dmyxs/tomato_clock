// pages/count/i.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isToday:true,
    countItem:[
      {title:'今日次数',value:'0次'},
      {title:'累计次数',value:'0次'},
      {title:'今日时长',value:'0分钟'},
      {title:'累计时长',value:'0分钟'},
    ],
    filterIndex:0,
    index:null,
    filterItem:['全部','工作','思考','读书','写作','代码','运动'],
    todayList:[],
    historyList:[]
  },

  onSwitchToday(){
    this.setData({
      isToday:true,
    })
    this.onFilterList()
  },
  onSwitchHistory(){
    this.setData({
      isToday:false,
    })
    this.onFilterList()
  },

  onFilterList(e = null){
    if(e === null){
      var index = this.data.filterIndex
    }else{
      var index = e.currentTarget.dataset.index
      if(index !== 'undefined'){
        this.setData({
          filterIndex:index
        })
      }
    }

    const arr = this.data.filterItem
    const text = arr[index]
    //今天
    if(this.data.isToday){
      let data = wx.getStorageSync('today_list')
      let res = data.filter(item => item.category == text)
      if(res.length){
        const i = arr.indexOf(text)
        if(index === i){ //筛选项对应的index
          this.setData({
            todayList:res
          })
        }
      }else if(index === 0){ //全部
        this.setData({
          todayList:data
        })
      }else{
        this.setData({
          todayList:[]
        })
      }
    }else{ //历史
      let data = wx.getStorageSync('misstion_logs')
      let res = data.filter(item => item.category == text)
      if(res.length){
        const i = arr.indexOf(text)
        if(index === i){ //筛选项对应的index
          this.setData({
            historyList:this._tranDate(res)
          })
        }
      }else if(index === 0){ //全部
        this.setData({
          historyList:this._tranDate(data)
        })
      }else{
        this.setData({
          historyList:[]
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let logs = wx.getStorageSync('misstion_logs') || []
    let day = 0 
    let totel = logs.length
    let dayTime = 0
    let totelTime = 0
    let todayList = []
    if(logs.length){
      const today = new Date().toLocaleDateString()
      logs.forEach((item,i) => {
        //今日数据
        if(new Date(item.date).toLocaleDateString() === today){
          day = day + 1
          dayTime = dayTime + logs[i].time
          todayList.push(logs[i])
          this.setData({
            todayList:this._tranDate(todayList)
          })
        }
        totelTime = totelTime + logs[i].time
      })

      wx.setStorageSync('today_list', this.data.todayList)
      this.setData({
        'countItem[0].value':day + '次',
        'countItem[1].value':totel + '次',
        'countItem[2].value':dayTime + '分钟',
        'countItem[3].value':totelTime  + '分钟',
        historyList:this._tranDate(logs), //历史数据
        filterIndex:0
      })
    }
  },

  _tranDate(dataArr){
    dataArr.map((item) => item.date = this._format(item.date))
    return dataArr
  },

  _format(dateStr){
    const date = new Date(dateStr)
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate() 
    const h = date.getHours()
    const s = date.getMinutes()
    return `${y}-${this._z(m)}-${this._z(d)} ${this._z(h)}:${this._z(s)}`
  },

  _z(n){
    return n < 10 ? '0' + n : n
  },



  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})