<template>

  <div class="login">
      <el-form ref="elform" :model="user" :rules="rules">
          <el-form-item prop="username">
              <el-input placeholder="登录名" v-model="user.username">
              </el-input>
          </el-form-item>
           <el-form-item prop="psd">
              <el-input placeholder="密码" v-model="user.psd">
              </el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="login">
              默认按钮
            </el-button>
          </el-form-item>
      </el-form>
      <!-- 验证码弹出区域 -->
      <el-popover trigger="manual" v-model="visibile" popper-class="my" ref="popover">
          <div class="sliding-pictures">
            <div class="vimg">
              <!-- 这里生成canvas -->
              <canvas id="sliderBlock"></canvas>
              <canvas id="codeImg"></canvas>
            </div>
            <!-- 下面是滑块部分 -->
            <div class="slider">
              <div class="track" :class="{pintuTrue: puzzle}">
                {{tips}}
              </div>
              <!-- 滑动的按钮 -->
              <div class="button  el-icon-s-grid" @mousedown.prevent="drap"></div>
            </div>
          </div>
      </el-popover>
  </div>

</template>

<script>
import { log } from 'util';

export default {
  name: 'login',
  data(){
    return {
      user: {
         username: '',
         psd: '',
      },
      tips: "拖动左边滑块完成上方拼图",
      visibile: false, //弹窗的可见性
      puzzle: false, //滑动验证是否正确
      //滑块x轴数据
      slider: {
        mx: 0,
        bx: 0
      },
      rules: {
        username: [{required: true, message: '请填写登录名'}],
        psd: [{required: true, message: '请填写密码'}]
      }
    }
  },
  methods:{
    login(){
      console.log(1);
      
      var that = this;
      //点击的时候先判断，其他字段是否为空
      that.$refs['elform'].validate(valid => {
        if(valid){
          //开启弹窗
          that.visibile = true;
        }
      })
    },
    //canvas初始化
    canvasInit(){
      console.log('canvas初始化');
      //生成指定区间的随机数
      const random = (min, max) => {
        return Math.floor(Math.random() * (max - min +1) + min);
      }
      //x: 254 y:109
      let mx = random(127,234),
          bx = random(10, 97),
          y = random(10, 99);
    this.slider = {mx, bx}     
    //绘制canvas
    this.draw(mx,bx,y)     
    },

    draw(mx = 200, bx = 20, y=50){
      console.log('啦啦啦draw');
      let mainDom = document.querySelector("#codeImg"); // codeImg
      //创建context对象
      let bg = mainDom.getContext('2d');
      let width = mainDom.width;
      let height = mainDom.height;
      // console.log(bg,width,height);
      
     let blockDom = document.querySelector('#sliderBlock');
     let block = blockDom.getContext("2d");
     console.log(blockDom.width, blockDom.height);
      //重新赋值，让canvas进行重新绘制。
      blockDom.height = height;
      mainDom.height = height;

      //生成一个img元素
      let imgSrc = require('./img/back.jpg');
      let img = document.createElement('img');
      // 控制图片的缩放问题
      img.style.objectFit = 'scale-down';
      img.src = imgSrc;
     
      //当这个元素生成完毕时
      img.onload = function(){
      
        //使用2d画笔绘制图片，这个图片和背景图片是一样的
        bg.drawImage(img,0,0,width,height);
       
        block.drawImage(img,0,0,width,height);
      }

      //一些随机参数
      let mainxy = {x: mx, y: y,r: 9}
      let blockxy = { x: bx, y: y, r: 9 };
      // console.log(mainxy);
      
      //调用drawBlock方法，把2d画笔传过去
      // this.drawBlock(bg, mainxy,'fill');  //这个是绘制目标拼图，随机位置，这个是绘制指定的形状的图形
      // this.drawBlock(block, blockxy, 'clip') // 这个是起始拼图，随机位置，这个是从画布上剪切指定形状的图形
    },

    // 绘制拼图, 默认值
    drawBlock(ctx, xy = {x: 254, y:109,r:9}, type){
        let x = xy.x,
          y = xy.y,
          r = xy.r,
          w = 40;
        let PI =Math.PI;  
        // 绘制，beginPath：起始一条路径，或重置当前路径 开始定义路径
        ctx.beginPath()
        //top
        //moveTo:把路径移动到画布中的指定点，不创建线条,也相当于开始点
         ctx.moveTo(x, y);
        console.log('最初的y'+y);
         //arc 创建弧/曲线（用于创建圆形或部分圆）
          ctx.arc(x + (w + 5) / 2, y, r, -PI, 0, true); //开始画园
         //添加一个新点，然后在画布中创建从该点到最后指定点的线条
         ctx.lineTo(x + w + 5, y); //结束点
        // right
      ctx.arc(x + w + 5, y + w / 2, r, 1.5 * PI, 0.5 * PI, false);
      ctx.lineTo(x + w + 5, y + w);
      //bottom 开始画bottom
      ctx.arc(x + (w +5) /2, y + w, r, 0, 1*PI, false);
      ctx.lineTo(x, y + w);
      // left
      ctx.arc(x, y + w / 2, r, 0.5 * PI, 1.5 * PI, true);
      ctx.lineTo(x, y);
     
         //设置或返回当前的线条宽度 lineWidth 
          ctx.lineWidth = 1;
          //设置或返回用于填充绘画的颜色、渐变或模式
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'  //这个是填充图形的颜色
         //strokeStyle 设置或返回用于笔触的颜色、渐变或模式
         ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'  //这个是剪切图形的颜色
          ctx.stroke(); //开始绘制路径
          ctx[type]();
         // globalCompositeOperation 属性设置或返回如何将一个源（新的）图像绘制到目标（已有）的图像上。
        //  源图像 = 您打算放置到画布上的绘图。目标图像 = 您已经放置在画布上的绘图。
        //xor 使用异或操作对源图像与目标图像进行组合。
        ctx.globalCompositeOperation = "xor";
     
    },
    drap(e){
      console.log('鼠标按下');
      //获取dom元素
      let dom = e.target;
      //获取canvas绘制的滑块dom
      let sliderDom = document.querySelector('#sliderBlock');
  //获取当前鼠标点击位置，相对于可视区域的x，y轴
      const downCoordinate = { x: e.x || e.clientX, y: e.y || e.clientY};
    console.log('获取当前鼠标点击位置'+downCoordinate.x);
    
    
    

    //获取滑块的数据，也就是我们给出随机值,目标滑块的x - 初始滑块的x
    const checkX = Number(this.slider.mx) - Number(this.slider.bx);
    console.log('我是滑动验证的标准'+checkX);
     
    let x = 0;
    const move = moveEV => {
      // console.log(moveEV); //事件对象
      // console.log(moveEV);
      
      console.log('我是鼠标移动是的x'+moveEV.x);
      //   console.log(downCoordinate.x);
      
//moveEV是鼠标移动时候的事件对像，而downCoordinate是鼠标按下时的事件对象。先按下，然后再移动所以这两个永远可能相等

      x = moveEV.x - downCoordinate.x;
      
      if(x >= 251 || x <= 0) return false;
        
      dom.style.left = x + 'px';
      sliderDom.style.left = x + 'px'
    } 

  const up = upEv => {
    // 当鼠标抬起的时候
    // console.log(upEv.x - downCoordinate.x, checkX);
    console.log('我是鼠标抬起是的x'+upEv.x);
    
    document.removeEventListener("mousemove", move);
    document.removeEventListener("mouseup", up);
    dom.style.left = '';  
    // 实际滑动会偏小，进行偏移.允许的误差
    let max = checkX - 5;
    let min = checkX - 10;
    // 采用点击距离和最终离开距离计算滑动距离
    let movex = upEv.x - downCoordinate.x;
    console.log(max, movex, min);
    ////允许正负误差1
    if((max >= movex && movex >= min) || movex === checkX) {
      //此时滑动到位了
      console.log('滑动解锁成功');
      this.puzzle = true;
      this.tips = '验证成功';
    }else {
      console.log('验证失败');
      this.tips = '验证失败,,请重试';
      this.puzzle = false;
      this.canvasInit();
      
    }
  }

    // 还有一点就是鼠标快速滑动会导致丢失滑动效果，这里需要用document，不能是元素级别的监听。
      
      document.addEventListener("mouseup", up);
      document.addEventListener("mousemove", move);
    }
  },
  watch: {
    //侦听visible 
    visibile(e){
      if(e === true) {
        //初始化canvas
        this.canvasInit()
      }
    }
  }
  
}

</script>

<style lang="scss">
.my {
   padding: 0;
  width: 300px;
  border-radius: 2px;
}
// 这是弹出框的样式
.sliding-pictures {
  width: 100%;
  .vimg {
    width: 100%;
    height: 170px;
    #codeImg,
    #sliderBlock {
      padding: 7px 7px 0 7px;
      //是子盒子的高度与父盒子一致，即使子盒子脱离了父盒子
       width: inherit;
      height: inherit;
    }
    #sliderBlock {
      position: absolute;
      z-index: 4000;
    }
  }
  //滑动部分
  .slider {
    width: 100%;
    height: 65px;
       border-bottom: #c7c9d0 1px solid;
       display: flex;
       align-items: center;
    justify-content: flex-start;
    .track {
    box-sizing: border-box;
    margin-left: 7px;
    width: 286px;
    height: 38px;
    background-color: rgba(28, 136, 188, 0.5);
    border-radius: 25px;
    font-size: 14px;
    line-height: 38px;
    padding-right: 15px;
    padding-left: 70px;
  }
  .pintuTrue {
      background: #67c23a;
      color: #ffffff;
  }
  .button {
    position: absolute;
    width: 50px;
    height: 50px;
    line-height: 48px;
    background-color: #fff;
    box-shadow: #b9bdc8 0 0 3px;
    border-radius: 50%;
    left: 7px;
    text-align: center;
    font-size: 28px;
    color: #3e5d8b;
    &:hover {
      background-color: red;
    }
  }
  }
  
  
}
</style>