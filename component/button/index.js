// component/button/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content:Number,
    index:Number
  },

  /**
   * 组件的初始数据
   */
  data: {

  },


  /**
   * 组件的方法列表
   */
  methods: {
    onTap(){
      // console.log(this.properties.content);
      this.triggerEvent('checkTime',{
        time:this.properties.content,
        index:this.properties.index
      })
    }
  }
})
