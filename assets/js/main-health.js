// ------------------------------------------------------------
// chart factories
// ------------------------------------------------------------
var jvmThreadsChartFactory = function(renderTo) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderTo,
            defaultSeriesType: 'line',
            marginRight: 10
        },
        title: {
            text: 'Threads'
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'Count'
            },
            plotLines: [
                {
                    value: 0,
                    width: 1,
                    color: '#808080'
                }
            ]
        },
        tooltip: {
            formatter: function() {
                return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
            }
        },
        legend: {
            enabled: true
        },
        exporting: {
            enabled: false
        },
        series: [
            { name: 'count' },
            { name: 'peak count' }
        ]
    });
}

var jvmMemoryChartFactory = function(renderTo, title) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderTo,
            defaultSeriesType: 'area'
        },
        title: {
            text: title
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'MegaBytes'
            },
            labels: {
                formatter: function() {
                    var res = this.value / 1024000;
                    res = Math.round(res*Math.pow(10,2))/Math.pow(10,2);
                    return res;
                }
            }
        },
        tooltip: {
            formatter: function() {
                return '' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ': ' +
                        Highcharts.numberFormat(this.y / 1024000, 1) + 'mb';
            }
        },
        plotOptions: {
            area: {
                //            stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [
            { name: 'Heap Allocated' },
            { name: 'Heap Used' }
        ]
    });
}

var osCpuChartFactory = function(renderTo) {
    return new Highcharts.Chart({
      chart: {
         renderTo: renderTo,
         defaultSeriesType: 'area',
         marginRight: 10
      },
      title: {
         text: 'CPU(%)'
      },
        credits: {
            enabled: false
        },
      xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
      },
      yAxis: {
         title: {
            text: 'Percent'
         }
      },
      tooltip: {
         formatter: function() {
                   return ''+
                Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) +': '+
                Highcharts.numberFormat(this.percentage, 1) +'%';
         }
      },
      plotOptions: {
         area: {
            stacking: 'percent',
            lineColor: '#ffffff',
            lineWidth: 1,
            marker: {
               lineWidth: 1,
               lineColor: '#ffffff'
            }
         }
      },
      series: [
          { name: 'Idle' },
          { name: 'Sys' },
          { name: 'User' }
      ]
   });
}

var osSwapMemoryFactory = function(renderTo, title) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderTo,
            defaultSeriesType: 'area'
        },
        title: {
            text: title
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'MegaBytes'
            },
            labels: {
                formatter: function() {
                    var res = this.value / 1024000;
                    res = Math.round(res*Math.pow(10,2))/Math.pow(10,2);
                    return res;
                }
            }
        },
        tooltip: {
            formatter: function() {
                return '' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ': ' +
                        Highcharts.numberFormat(this.y / 1024000, 1) + 'mb';
            }
        },
        plotOptions: {
            area: {
                stacking: 'normal',
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [
            { name: 'Free' },
            { name: 'Used' }
        ]
    });
}

var osMemoryChartFactory = function(renderTo) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderTo,
            defaultSeriesType: 'area'
        },
        title: {
            text: "Mem"
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            tickPixelInterval: 150
        },
        yAxis: {
            title: {
                text: 'MegaBytes'
            },
            labels: {
                formatter: function() {
                    var res = this.value / 1024000;
                    res = Math.round(res*Math.pow(10,2))/Math.pow(10,2);
                    return res;
                }
            }
        },
        tooltip: {
            formatter: function() {
                return '' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + ': ' +
                        Highcharts.numberFormat(this.y / 1024000, 1) + 'mb';
            }
        },
        plotOptions: {
            area: {
                lineColor: '#666666',
                lineWidth: 1,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [
            { name: 'Total Mem' },
            { name: 'Used' },
            { name: 'Actual Used' }
        ]
    });
}

// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var GenericChartView = Backbone.View.extend({

  defaults: {
    size: 100,
  },

  /**
   * @param char The initialized chart to manage
   */
  initialize:function(chart) {
    this.chart = chart;
  },

  /**
   * Add new data to the supplied chart
   * @param reading The new data to add to the chart
   * @param current The new max x asix to limit by
   */
  update: function(reading, current) {
    this.appendData(reading, current);
    this.shrink(current);
    this.render();
  },

  /**
   * Add new data to the end of the supplied chart
   * @param reading The new data to add to the chart
   * @param current The new x axis value to link with
   */
  appendData: function(reading, current) {
    _.each(_.zip(reading, this.chart.series), function(pair) {
      pair[1].addPoint([current, pair[0]], false, false);
    });
  },

  /**
   * Shrink the chart data series to stay in alloted space
   * @param current The new max x asix to limit by
   */
  shrink: function(current) {
    var threshold = current - this.size;
    _.each(this.chart.series, function(series) {
      while(series.data[0].category && series.data[0].category < threshold) {
        series.data[0].remove(false);
      }
    });
  },

  clear: function() {
    _.each(this.chart.series, function(series) {
      series.setData([], true);
    });
  },

  render: function() {
    this.chart.redraw();
  }

});


// ------------------------------------------------------------
// router
// ------------------------------------------------------------
var Router = Backbone.Router.extend({
  routes : {
    '': 'index',
  },
});

// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var HealthNode = Backbone.Model.extend({
});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var HealthNodeCollection = Backbone.Collection.extend({
  model: HealthNode,
  localStorage: new Store('health-nodes'),
});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var ElasticHealthAppView = Backbone.View.extend({

  defaults: {
    host: 'localhost',
    port: 9200,
    delay: 2,
    connected: false
  },
  template: _.template($('#info-template').html()),

  el: $('#health-app'),
  events: {
    'click #health-enable': 'toggleUpdating'
  },

  initialize: function() {
    this.elastic = new ElasticSearch({
      host: this.host,
      port: this.port
    });
    //this.toggleUpdating();
    this.elastic.adminClusterNodeInfo({
      callback: this.updateInformation
    });
  },

  updateInformation: function(d, x) {
    _.each(nodes, function(node) {
      HealthNodes.create(node);
    });
  },

  pollingCallback: function() {
    if (this.connected) {
      setInterval(function() {
        this.elastic.adminClusterNodeStats({
          callback: this.newReading
        });
      }, this.delay);
    }
  },

  newReading: function(data, xhr) {
    this.pollingCallback();
  },

  toggleUpdating: function() {
    this.connected = !this.connected;
    if (this.connected) {
      this.elastic.adminClusterNodeStats({
        callback: this.newReading
      });
      $(this.el).text('Stop Polling');
    } else {
      $(this.el).text('Start Polling');
    }
  },

});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.HealthNodes = new HealthNodeCollection();
  window.app = new ElasticHealthAppView();
  app.router = new Router();
  Backbone.history.start({ pushState : true });
});
