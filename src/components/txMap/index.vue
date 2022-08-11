<template>
  <div id="container">
    <div class="marker">这是一个标记</div>
  </div>
</template>

<script>
// window.init = () => {
//   var myLatlng = new qq.maps.LatLng(32.041805, 118.784134); // 地图经纬度
//   var myOptions = {
//     zoom: 15, // 地图放大倍数
//     center: myLatlng, // 地图经纬度
//   }
//   // 创建地图对象
//   var map = new qq.maps.Map(document.getElementById("container"), myOptions);

//   // 创建标注
//   var marker = new qq.maps.Marker({
//     position: myLatlng, // 标注位置
//     map: map
//   });

//   // 标注点击事件
//   qq.maps.event.addListener(marker, "click", function (e) {
//     var marker_div = document.querySelector('.marker')
//     console.log(e.latLng)
//   });
// }

// function loadScript () {
//   var script = document.createElement("script");
//   script.type = "text/javascript";
//   script.src = "https://map.qq.com/api/js?v=2.exp&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&callback=init";
//   document.body.appendChild(script);
// }
export default {
  data () {
    return {
      marker: [],
      map: null
    }
  },
  mounted () {
    this.init()
    setInterval(() => {
      // 创建标注
      var marker = new qq.maps.Marker({
        position: new qq.maps.LatLng(31 + Math.random(), 117 + Math.random()), // 标注位置
        map: this.map
      });
      marker.setVisible(true);
      this.marker.push(marker)
    }, 2000)
  },
  methods: {
    init () {
      var myLatlng = new qq.maps.LatLng(32.041805, 118.784134); // 地图经纬度
      var myOptions = {
        zoom: 15, // 地图放大倍数
        center: myLatlng, // 地图经纬度
      }
      // 创建地图对象
      this.map = new qq.maps.Map(document.getElementById("container"), myOptions);
    }
  }
}
</script>

<style lang='less' scoped>
#container {
  height: 100%;
  width: 100%;
}
</style>
