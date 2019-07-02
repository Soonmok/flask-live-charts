var chart;
var scatter;

/**
 * Request data from the server, add it to the graph and set a timeout
 * to request again
 */
function requestData() {
    $.ajax({
        url: '/live-data',
        success: function(point) {
            var series = chart.series[0],
                shift = series.data.length > 20; // shift if the series is
            // add the point
            chart.series[0].addPoint(point['traffic'], true, shift);
            for (var i = 0; i < point['port'].length; i += 1) {
                scatter.series[0].addPoint(point['port'][i], false);
            }
            //scatter.redraw();
            // call it again after one second
            setTimeout(requestData, 1000);
        },
        cache: false
    });
}

$(document).ready(function() {
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'data-container',
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live network traffic'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Traffic',
                margin: 80
            }
        },
        series: [{
            name: 'Time series traffic data',
            data: []
        }]
    });

    scatter = new Highcharts.Chart({
        chart: {
            renderTo: 'scatter-container',
            type: 'scatter',
            zoomType: 'xy',
            events: {
              load: requestData
            }
        },
        title: {
            text: 'Destination Port'
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            title: {
                text: 'Dst port'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'top',
            x: 100,
            y: 70,
            floating: true,
            backgroundColor: Highcharts.defaultOptions.chart.backgroundColor,
            borderWidth: 1
        },
        plotOptions: {
            scatter: {
                marker: {
                    radius: 5,
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: {
                            enabled: false
                        }
                    }
                },
            }
        },
        series: [{
            name: 'Port number',
            color: 'rgba(223, 83, 83, .5)',
            data: []
        }]
    });
});
