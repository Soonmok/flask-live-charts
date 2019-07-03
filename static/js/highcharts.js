var trafficChart;
var lenScatter;
var portScatter;

/**
 * Request data from the server, add it to the graph and set a timeout
 * to request again
 */
function requestData() {

    async function updateChart(point) { 
    	await loadData(point).then(() => {
	    lenScatter.redraw();
	    portScatter.redraw();
	    console.log("asd");
	});
    }

    function loadData(point){
    	return new Promise(function(resolve, reject){
            var seriesTraffic = trafficChart.series[0],
                shiftTraffic = seriesTraffic.data.length > 20
            // add the point
            trafficChart.series[0].addPoint(point['traffic'], true, shiftTraffic);
            for (var i = 0; i < point['port'].length - 1; i += 1) {
                portScatter.series[0].addPoint(point['port'][i], false);
            }
	    for (var i = 0; i < point['len'].length - 1; i += 1) {
	    	lenScatter.series[0].addPoint(point['len'][i], false);
	    }
	    resolve("resolve");
	});
    }

    $.ajax({
        url: '/live-data',
        success: function(point) {
            // call it again after one second
	    updateChart(point);
            setTimeout(requestData, 1000);
        },
        cache: false
    });
}

function createLineCharts(type, renderLocation) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderLocation,
            defaultSeriesType: 'spline',
            events: {
                load: requestData
            }
        },
        title: {
            text: 'Live network '.concat(type)
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
                text: type,
                margin: 80
            }
        },
        series: [{
            name: 'Time series '.concat(type),
            data: []
        }]
    });
}

function createScatterCharts(type, renderLocation) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderLocation,
            type: 'scatter',
            zoomType: 'xy'
        },
        title: {
            text: 'Destination '.concat(type)
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150,
            maxZoom: 20 * 1000
        },
        yAxis: {
            title: {
                text: 'Dst '.concat(type)
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
            name: type,
            color: 'rgba(223, 83, 83, .5)',
            data: []
        }]
    });
}
$(document).ready(function() {
    trafficChart = createLineCharts('Traffic', 'data-container');
    console.log(trafficChart);
    portScatter = createScatterCharts('port', 'port-scatter-container');
    console.log(portScatter);
    lenScatter = createScatterCharts('len', 'len-scatter-container');
    console.log(lenScatter);
});
