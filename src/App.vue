<template>
  <CesiumViewer />
</template>

<script setup>
import CesiumViewer from './components/CesiumViewer.vue'
</script>

<style>
:root {
  /* font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%; */
}

body {
  margin: 0;
}

.myButton {
  border: 1px solid green;
  -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
  transform: skewX(-10deg);
  height: 50px;
  width: 200px;
  border-radius: 20px 5px 20px 0px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font: 15px sans-serif;
  font-weight: 300;
  text-shadow: 0 0 20px #fff;
  text-transform: uppercase;
  -webkit-animation: breath2 2s 0.5s infinite alternate;
          animation: breath2 2s 0.5s infinite alternate;
  transition: all 0.2s ease;
  cursor: pointer;
}
.myButton:before {
  content: "";
  display: block;
  width: calc(100% - 22px);
  height: calc(50px - 8px);
  -webkit-animation: breath 2s infinite alternate;
          animation: breath 2s infinite alternate;
  left: 10px;
  top: 3px;
  position: absolute;
  background-color: transparent;
  border: 1px solid #fff;
  border-radius: 15px 3px 15px 3px;
}
.myButton.fire {
  border-color: #ffeca8;
  background-image: linear-gradient(to bottom, rgba(255, 138, 48, 0.6), rgba(240, 96, 29, 0.6));
  box-shadow: 0 0 70px rgba(255, 138, 48, 0.6), 0 5px 20px rgba(255, 138, 48, 0.6), inset 0 1px #ffeca8, inset 0 -1px #ffeca8;
  color: #ffeca8;
}
.myButton.fire:before {
  box-shadow: inset 0 0 30px 0 #ffeca8;
}
.myButton.ice {
  border-color: #a8ecff;
  background-image: linear-gradient(to bottom, rgba(48, 138, 255, 0.5), rgba(29, 96, 240, 0.5));
  box-shadow: 0 0 70px rgba(48, 138, 255, 0.5), 0 5px 20px rgba(48, 138, 255, 0.5), inset 0 1px #ffeca8, inset 0 -1px #ffeca8;
  color: #a8ecff;
}
.myButton.ice:before {
  box-shadow: inset 0 0 30px 0 #a8ecff;
}
.myButton:hover.fire {
  box-shadow: 0 0 70px rgba(255, 138, 48, 0.8), 0 5px 20px rgba(255, 138, 48, 0.8), inset 0 1px #ffeca8, inset 0 -1px #ffeca8;
}
.myButton:hover.fire:before {
  box-shadow: inset 0 0 50px 0 #ffeca8;
}
.myButton:hover.ice {
  box-shadow: 0 0 70px rgba(48, 138, 255, 0.8), 0 5px 20px rgba(48, 138, 255, 0.8), inset 0 1px #a8ecff, inset 0 -1px #a8ecff;
}
.myButton:hover.ice:before {
  box-shadow: inset 0 0 50px 0 #a8ecff;
}
.myButton + .myButton {
  margin-top: 15px;
  -webkit-animation-delay: 0.3s;
          animation-delay: 0.3s;
}

@-webkit-keyframes breath {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0.95);
  }
}

@keyframes breath {
  0% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(0.95);
  }
}
@-webkit-keyframes breath2 {
  0% {
    transform: skewX(-10deg) scaleX(1);
  }
  100% {
    transform: skewX(-10deg) scaleX(0.95);
  }
}
@keyframes breath2 {
  0% {
    transform: skewX(-10deg) scaleX(1);
  }
  100% {
    transform: skewX(-10deg) scaleX(0.95);
  }
}
.ref {
  -webkit-backdrop-filter: blur(10px);
          backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 3px;
  padding: 5px 8px;
  position: absolute;
  font-size: 16px;
  bottom: 10px;
  right: 10px;
  color: #fff;
  font-weight: 300;
  font-family: sans-serif;
  text-decoration: none;
}
.ref::first-letter {
  font-size: 12px;
}

/* 自然绿色风格 */
.myButton.nature {
  border-color: #a8ffb7;
  background-image: linear-gradient(to bottom, rgba(48, 255, 89, 0.5), rgba(29, 240, 82, 0.5));
  box-shadow: 0 0 70px rgba(48, 255, 89, 0.5), 0 5px 20px rgba(48, 255, 89, 0.5), inset 0 1px #a8ffb7, inset 0 -1px #a8ffb7;
  color: #a8ffb7;
}
.myButton.nature:before {
  box-shadow: inset 0 0 30px 0 #a8ffb7;
}
.myButton:hover.nature {
  box-shadow: 0 0 70px rgba(48, 255, 89, 0.8), 0 5px 20px rgba(48, 255, 89, 0.8), inset 0 1px #a8ffb7, inset 0 -1px #a8ffb7;
}
.myButton:hover.nature:before {
  box-shadow: inset 0 0 50px 0 #a8ffb7;
}

/* 紫色神秘风格 */
.myButton.mystic {
  border-color: #e2a8ff;
  background-image: linear-gradient(to bottom, rgba(147, 48, 255, 0.5), rgba(116, 29, 240, 0.5));
  box-shadow: 0 0 70px rgba(147, 48, 255, 0.5), 0 5px 20px rgba(147, 48, 255, 0.5), inset 0 1px #e2a8ff, inset 0 -1px #e2a8ff;
  color: #e2a8ff;
}
.myButton.mystic:before {
  box-shadow: inset 0 0 30px 0 #e2a8ff;
}
.myButton:hover.mystic {
  box-shadow: 0 0 70px rgba(147, 48, 255, 0.8), 0 5px 20px rgba(147, 48, 255, 0.8), inset 0 1px #e2a8ff, inset 0 -1px #e2a8ff;
}
.myButton:hover.mystic:before {
  box-shadow: inset 0 0 50px 0 #e2a8ff;
}

/* 金属银色风格 */
.myButton.metal {
  border-color: #e8e8e8;
  background-image: linear-gradient(to bottom, rgba(192, 192, 192, 0.5), rgba(128, 128, 128, 0.5));
  box-shadow: 0 0 70px rgba(192, 192, 192, 0.5), 0 5px 20px rgba(192, 192, 192, 0.5), inset 0 1px #e8e8e8, inset 0 -1px #e8e8e8;
  color: #e8e8e8;
}
.myButton.metal:before {
  box-shadow: inset 0 0 30px 0 #e8e8e8;
}
.myButton:hover.metal {
  box-shadow: 0 0 70px rgba(192, 192, 192, 0.8), 0 5px 20px rgba(192, 192, 192, 0.8), inset 0 1px #e8e8e8, inset 0 -1px #e8e8e8;
}
.myButton:hover.metal:before {
  box-shadow: inset 0 0 50px 0 #e8e8e8;
}

/* 深海蓝风格 */
.myButton.ocean {
  border-color: #a8dfff;
  background-image: linear-gradient(to bottom, rgba(0, 119, 190, 0.5), rgba(0, 87, 145, 0.5));
  box-shadow: 0 0 70px rgba(0, 119, 190, 0.5), 0 5px 20px rgba(0, 119, 190, 0.5), inset 0 1px #a8dfff, inset 0 -1px #a8dfff;
  color: #a8dfff;
}
.myButton.ocean:before {
  box-shadow: inset 0 0 30px 0 #a8dfff;
}
.myButton:hover.ocean {
  box-shadow: 0 0 70px rgba(0, 119, 190, 0.8), 0 5px 20px rgba(0, 119, 190, 0.8), inset 0 1px #a8dfff, inset 0 -1px #a8dfff;
}
.myButton:hover.ocean:before {
  box-shadow: inset 0 0 50px 0 #a8dfff;
}

/* 日落橙色风格 */
.myButton.sunset {
  border-color: #ffd4a8;
  background-image: linear-gradient(to bottom, rgba(255, 123, 0, 0.5), rgba(240, 95, 0, 0.5));
  box-shadow: 0 0 70px rgba(255, 123, 0, 0.5), 0 5px 20px rgba(255, 123, 0, 0.5), inset 0 1px #ffd4a8, inset 0 -1px #ffd4a8;
  color: #ffd4a8;
}
.myButton.sunset:before {
  box-shadow: inset 0 0 30px 0 #ffd4a8;
}
.myButton:hover.sunset {
  box-shadow: 0 0 70px rgba(255, 123, 0, 0.8), 0 5px 20px rgba(255, 123, 0, 0.8), inset 0 1px #ffd4a8, inset 0 -1px #ffd4a8;
}
.myButton:hover.sunset:before {
  box-shadow: inset 0 0 50px 0 #ffd4a8;
}

/* 翡翠绿风格 */
.myButton.jade {
  border-color: #7fffd4;
  background-image: linear-gradient(to bottom, rgba(64, 224, 208, 0.5), rgba(47, 179, 167, 0.5));
  box-shadow: 0 0 70px rgba(64, 224, 208, 0.5), 0 5px 20px rgba(64, 224, 208, 0.5), inset 0 1px #7fffd4, inset 0 -1px #7fffd4;
  color: #7fffd4;
}
.myButton.jade:before {
  box-shadow: inset 0 0 30px 0 #7fffd4;
}
.myButton:hover.jade {
  box-shadow: 0 0 70px rgba(64, 224, 208, 0.8), 0 5px 20px rgba(64, 224, 208, 0.8), inset 0 1px #7fffd4, inset 0 -1px #7fffd4;
}
.myButton:hover.jade:before {
  box-shadow: inset 0 0 50px 0 #7fffd4;
}

/* 玫瑰金风格 */
.myButton.rose-gold {
  border-color: #ffdab9;
  background-image: linear-gradient(to bottom, rgba(255, 182, 193, 0.5), rgba(233, 150, 122, 0.5));
  box-shadow: 0 0 70px rgba(255, 182, 193, 0.5), 0 5px 20px rgba(255, 182, 193, 0.5), inset 0 1px #ffdab9, inset 0 -1px #ffdab9;
  color: #ffdab9;
}
.myButton.rose-gold:before {
  box-shadow: inset 0 0 30px 0 #ffdab9;
}
.myButton:hover.rose-gold {
  box-shadow: 0 0 70px rgba(255, 182, 193, 0.8), 0 5px 20px rgba(255, 182, 193, 0.8), inset 0 1px #ffdab9, inset 0 -1px #ffdab9;
}
.myButton:hover.rose-gold:before {
  box-shadow: inset 0 0 50px 0 #ffdab9;
}

/* 极光风格 */
.myButton.aurora {
  border-color: #adff2f;
  background-image: linear-gradient(to bottom, rgba(0, 255, 127, 0.5), rgba(127, 255, 212, 0.5));
  box-shadow: 0 0 70px rgba(0, 255, 127, 0.5), 0 5px 20px rgba(0, 255, 127, 0.5), inset 0 1px #adff2f, inset 0 -1px #adff2f;
  color: #adff2f;
}
.myButton.aurora:before {
  box-shadow: inset 0 0 30px 0 #adff2f;
}
.myButton:hover.aurora {
  box-shadow: 0 0 70px rgba(0, 255, 127, 0.8), 0 5px 20px rgba(0, 255, 127, 0.8), inset 0 1px #adff2f, inset 0 -1px #adff2f;
}
.myButton:hover.aurora:before {
  box-shadow: inset 0 0 50px 0 #adff2f;
}

/* 深邃夜空风格 */
.myButton.night-sky {
  border-color: #4169e1;
  background-image: linear-gradient(to bottom, rgba(25, 25, 112, 0.5), rgba(0, 0, 128, 0.5));
  box-shadow: 0 0 70px rgba(25, 25, 112, 0.5), 0 5px 20px rgba(25, 25, 112, 0.5), inset 0 1px #4169e1, inset 0 -1px #4169e1;
  color: #4169e1;
}
.myButton.night-sky:before {
  box-shadow: inset 0 0 30px 0 #4169e1;
}
.myButton:hover.night-sky {
  box-shadow: 0 0 70px rgba(25, 25, 112, 0.8), 0 5px 20px rgba(25, 25, 112, 0.8), inset 0 1px #4169e1, inset 0 -1px #4169e1;
}
.myButton:hover.night-sky:before {
  box-shadow: inset 0 0 50px 0 #4169e1;
}

/* 樱花粉风格 */
.myButton.sakura {
  border-color: #ffb7c5;
  background-image: linear-gradient(to bottom, rgba(255, 182, 193, 0.5), rgba(255, 192, 203, 0.5));
  box-shadow: 0 0 70px rgba(255, 182, 193, 0.5), 0 5px 20px rgba(255, 182, 193, 0.5), inset 0 1px #ffb7c5, inset 0 -1px #ffb7c5;
  color: #ffb7c5;
}
.myButton.sakura:before {
  box-shadow: inset 0 0 30px 0 #ffb7c5;
}
.myButton:hover.sakura {
  box-shadow: 0 0 70px rgba(255, 182, 193, 0.8), 0 5px 20px rgba(255, 182, 193, 0.8), inset 0 1px #ffb7c5, inset 0 -1px #ffb7c5;
}
.myButton:hover.sakura:before {
  box-shadow: inset 0 0 50px 0 #ffb7c5;
}
</style>