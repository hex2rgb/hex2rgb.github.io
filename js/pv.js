(function ($) {
    var date = new Date();
    var year = date.getFullYear();
    var startDate = year + '0101';
    var endDate = year + '1201';
    var api = app.chartApi + "&start_date=" + startDate + "&end_date=" + endDate;
    
    $.get(api).done(function (res) {
        console.log(JSON.parse(res))
        var data = JSON.parse(res).result.items[1].reverse().map((item) => item[0]);

        var myChart = echarts.init(document.getElementById('line-chart'));

        var option = {
            title: {
                text: ''
            },
            tooltip: {},
            legend: {
                data: [year + 'PV']
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                name: year + 'PV',
                data: data,
                type: 'line',
                areaStyle: {}
            }]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
    })
})(jQuery);

