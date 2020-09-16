(() => {
  // pv.js
  function lineChart($) {
    var date = new Date();
    var year = date.getFullYear();
    var startDate = year + "0101";
    var endDate = year + "1201";
    var api = app.chartApi + "&start_date=" + startDate + "&end_date=" + endDate;
    var color = "#1a9e75";
    $.get(api).done(function(res) {
      console.log(JSON.parse(res));
      var data = JSON.parse(res).result.items[1].reverse().map((item) => item[0]);
      var myChart = echarts.init(document.getElementById("line-chart"));
      var option = {
        title: {
          text: ""
        },
        tooltip: {},
        legend: {
          data: [year + "年PV"],
          textStyle: {
            color,
            fontSize: 14
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"]
        },
        yAxis: {
          type: "value"
        },
        series: [{
          name: year + "年PV",
          data,
          type: "line",
          itemStyle: {
            normal: {
              color
            }
          },
          areaStyle: {
            color
          }
        }]
      };
      myChart.setOption(option);
    });
  }
  (function($) {
    lineChart($);
  })(jQuery);
})();
