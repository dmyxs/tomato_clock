//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    missionItemIndex:0,
    timeItemIndex:0,
    time:5,
    mTime:300000,
    timeStr:'05:00',
    rate:0,
    missions:['工作','思考','读书','写作','代码','运动'],
    category:'工作',
    timeItem:[5,10,30,45],
    timer:null,
    homePage:true,
    isTimeStop:false,
    isComplete:false,
    clockHeight:0
  },

  onChangeSlider(e){
    const index = this.data.timeItem.indexOf(e.detail.value)
    this.setData({
      time:e.detail.value,
      timeItemIndex: index !== -1 ? index : null
    })
  },

  onCheckTime(e){
    if(e.detail.time === this.data.time){
      wx.showToast({
        title: '您已经选择该时间',
        icon:'none'
      })
    }
    this.setData({
      time:e.detail.time,
      timeItemIndex:e.detail.index
    })
  },

  onCkeckMission(e){
    this.setData({
      missionItemIndex:e.currentTarget.dataset.index,
      category:this.data.missions[e.currentTarget.dataset.index]
    })
  },

  onSwitchTimeoutPage(e){
    this.setData({
      homePage:false,
      isComplete:false,
      mTime:this.data.time * 60 * 1000,
      timeStr: parseInt(this.data.time) >= 10 ? this.data.time + ':00' : '0' + this.data.time + ':00'
    })
    this.drawBg()
    this.drawActive()
  },

  onPauseOrGoon(){
    if(this.data.timer){   //暂停：清除定时器  继续：不触发   暂停：清除定时器
      clearInterval(this.data.timer)
    }
    if(this.data.isTimeStop){ //false不触发 true false
      this.drawActive()
    }
    this.setData({ //设置为true false true
      isTimeStop:!this.data.isTimeStop,
    })
  },

  onSwitchHomePage(){
    this.setData({
      homePage:true,
      isTimeStop:false
    })
  },

  drawBg(){
    const rate = this.data.rate
    const lineWidth = 6 / this.data.rate
    const ctx = wx.createCanvasContext('progress_bg')
    ctx.arc(500/rate/2, 500/rate/2, 500/rate/2 - 2 * lineWidth, 0, 2 * Math.PI)
    ctx.setLineWidth(lineWidth) //线条宽度
    ctx.setStrokeStyle('#cccccc') //线条颜色
    ctx.setLineCap('round')
    // ctx.beginPath()
    ctx.stroke()  //画
    ctx.draw()

  },

  drawActive(){
    const rate = this.data.rate
    const lineWidth = 6 / this.data.rate
    const time = this.data.time * 60 * 1000
    const ctx = wx.createCanvasContext('progress_active')
    let timer = setInterval(() => {
      const mTime = this.data.mTime
      const angle = 1.5 + 2 * (time - mTime) / time
      if(angle < 3.5){
        if(mTime % 1000 === 0){ //被1000整除 === 0 就是整秒数
          const s = mTime / 1000 //毫秒数600000 ÷ 1000 = 600秒 900
          let m = parseInt(s / 60) //秒数600 ÷ 60 = 10分  15
          const str = (s - m * 60) >= 10 ? (s - m * 60) : '0' + (s - m * 60) //秒数补0
          m = m >= 10 ? m : '0' + m //分钟数补0
          this.setData({
            timeStr:m + ':' + str
          })
        }
        this.setData({
          mTime:this.data.mTime - 100
        })
        ctx.arc(500/rate/2, 500/rate/2, 500/rate/2 - 2 * lineWidth, 1.5 * Math.PI, angle * Math.PI)
        ctx.setLineWidth(lineWidth)
        ctx.setStrokeStyle('#e7624f')
        ctx.setLineCap('round')
        ctx.stroke()
        ctx.draw()
      }else{
        clearInterval(timer)
        this.setData({
          timeStr:'00:00',
          isComplete:true
        })
        let logs = wx.getStorageSync('misstion_logs') || []
        logs.unshift({
          date:Date.now(),
          category:this.data.category,
          time:this.data.time
        })
        wx.setStorageSync('misstion_logs', logs)
      }
    },100)
    this.setData({
      timer:timer
    })
  },

  onLoad: function () {
    const res = wx.getSystemInfoSync()
    const rate = 750 / res.windowWidth
    this.setData({
      rate:rate,
      clockHeight:rate * res.windowHeight
    })
  },
})
