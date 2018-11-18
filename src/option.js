import Vue from 'vue'
import App from './Option.vue'

let vm = new Vue({
  el: '#app',
  render: h => h(App)
})

// 禁用页面缩放
chrome.tabs.getCurrent(function(obj){
  chrome.tabs.getZoomSettings(obj.id, function(settingObj){
    if(settingObj.mode !== "disabled"){
      chrome.tabs.setZoom(1);
      chrome.tabs.setZoomSettings(obj.id, {"mode": "disabled"}, function(){})
    }
  })
});


/**
 * Google 数据分析
 */
setTimeout(() => {
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-128079841-1', 'auto')
  ga('set', 'checkProtocolTask', null)
  ga('send', 'pageview')
}, 600);