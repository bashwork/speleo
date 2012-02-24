// ------------------------------------------------------------
// chart factories
// ------------------------------------------------------------
var jvmThreadsChartFactory = function(renderTo, title) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderTo,
            defaultSeriesType: 'line',
            marginRight: 10
        },
        title: {
            text: title,
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

var osCpuChartFactory = function(renderTo, title) {
    return new Highcharts.Chart({
      chart: {
         renderTo: renderTo,
         defaultSeriesType: 'area',
         marginRight: 10
      },
      title: {
         text: title,
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

var osSwapMemoryChartFactory = function(renderTo, title) {
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

var osMemoryChartFactory = function(renderTo, title) {
    return new Highcharts.Chart({
        chart: {
            renderTo: renderTo,
            defaultSeriesType: 'area'
        },
        title: {
            text: title,
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
    first: true,
  },

  /**
   * Add new data to the supplied chart
   * @param reading The new data to add to the chart
   */
  update: function(reading) {
    var parsed = this.parse(reading);
    this.appendData(parsed.data, parsed.time);
    this.shrink(parsed.time);
    this.render();
  },

  /**
   * Add new data to the end of the supplied chart
   * @param reading The new data to add to the chart
   * @param current The new x axis value to link with
   */
  appendData: function(reading, current) {
    if (this.first) {
      _.each(this.chart.series, function(chart) {
        chart.addPoint([current - 1, null], false, false);
      }); // hack
      this.first = false;
    }
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

var HealthNodeView = Backbone.View.extend({
  tagName: 'em',
  template: _.template($('#health-node-template').html()),
  initailize: function(args) {
    this.model.bind('change', this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  remove: function() {
    $(this.el).remove();
  },

  events: {
    'click .btn': 'toggleNodeview'
  },

  toggleNodeview: function() {
    var node = $(this.el).text();
  },

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }
});

// ------------------------------------------------------------
// chart views
// ------------------------------------------------------------
var JvmThreadsChartView = GenericChartView.extend({
  el: $('#node-jvm-threads'),

  initialize: function() {
    this.chart = jvmThreadsChartFactory(this.el, 'Jvm Threads');
  },

  parse: function(reading) {
    var threads = reading.jvm.threads;
    var dataset = [
      threads.count,
      threads.peak_count
    ];
    return {
      data: dataset,
      time: reading.os.timestamp
    };
  }
});

var JvmHeapMemoryChartView = GenericChartView.extend({
  el: $('#node-jvm-heap-memory'),

  initialize: function() {
    this.chart = jvmMemoryChartFactory(this.el, 'Jvm Heap Memory');
  },

  parse: function(reading) {
    var mem = reading.jvm.mem;
    var dataset = [
      mem.heap_committed_in_bytes,
      mem.heap_used_in_bytes
    ];
    return {
      data: dataset,
      time: reading.os.timestamp
    };
  }
});

var JvmStackMemoryChartView = GenericChartView.extend({
  el: $('#node-jvm-stack-memory'),

  initialize: function() {
    this.chart = jvmMemoryChartFactory(this.el, 'Jvm Stack Memory');
  },

  parse: function(reading) {
    var mem = reading.jvm.mem;
    var dataset = [
      mem.non_heap_committed_in_bytes,
      mem.non_heap_used_in_bytes
    ];
    return {
      data: dataset,
      time: reading.os.timestamp
    };
  }

});

var OsCpuChartView = GenericChartView.extend({
  el: $('#node-os-cpu'),

  initialize: function() {
    this.chart = osCpuChartFactory(this.el, "OS CPU Percent");
  },

  parse: function(reading) {
    var cpu = reading.os.cpu;
    var dataset = [
      os.cpu.idle,
      os.cpu.sys,
      os.cpu.user
    ];
    return {
      data: dataset,
      time: reading.os.timestamp
    };
  }

});

var OsSwapMemoryChartView = GenericChartView.extend({
  el: $('#node-os-swap-memory'),

  initialize: function() {
    this.chart = osSwapMemoryChartFactory(this.el, 'OS Swap Memory');
  },

  parse: function(reading) {
    var swap = reading.os.swap;
    var dataset = [
      swap.free_in_bytes,
      swap.used_in_bytes
    ];
    return {
      data: dataset,
      time: reading.os.timestamp
    };
  }

});

var OsMemoryChartView = GenericChartView.extend({
  el: $('#node-os-main-memory'),

  initialize: function() {
    this.chart = osMemoryChartFactory(this.el, ' OS Main Memory');
  },

  parse: function(reading) {
    var mem = reading.os.mem;
    var dataset = [
      mem.actual_used_in_bytes + mem.actual_free_in_bytes,
      mem.used_int_bytes,
      mem.actual_used_in_bytes
    ];
    return {
      data: dataset,
      time: reading.os.timestamp
    };
  }

});


// ------------------------------------------------------------
// information table views
// ------------------------------------------------------------
// - update dynamic information
// - add information retrieved from update
// ------------------------------------------------------------
var SystemNodeTableView = Backbone.View.extend({
  el: $('#node-system-info'),
  template: _.template($('#system-info-template').html()),

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
  }

});

var JvmNodeTableView = Backbone.View.extend({
  el: $('#node-jvm-info'),
  template: _.template($('#jvm-info-template').html()),

  render: function() {
    $(this.el).html(this.template(this.model.toJSON()));
    return this;
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
  events: {
    'click #health-enable': 'toggleUpdating'
  },

  initialize: function() {
    HealthNodes.bind('add', this.addHealthNode);
    this.elastic = new ElasticSearch({
      host: this.host,
      port: this.port
    });

    this.charts = [
      new JvmThreadsChartView(),
      new JvmHeapMemoryChartView(),
      new JvmStackMemoryChartView(),
      new OsCpuChartView(),
      new OsSwapMemoryChartView(),
      new OsMemoryChartView()
    ];
    this.toggleUpdating();
  },

  addHealthNode: function(node) {
    var view = new HealthNodeView({ model: node });
    $('#health-nodes').append(view.render().el);
  },

  pollingCallback: function() {
    if (this.connected) {
      setInterval(function() {
         this.elastic.adminClusterNodeStats({
           callback: this.newReading
         });
         this.elastic.adminClusterNodeInfo({
           callback: this.updateInformation
         });
      }, this.delay);
    }
  },

  updateInformation: function(data, xhr) {
    HealthNodes.reset();
    _.each(data.nodes, function(node) {
      HealthNodes.create(node);
    });
  },

  newReading: function(data, xhr) {
    var node = data.nodes[_.first(_.keys(data.nodes))];
    _.each(window.app.charts, function(chart) {
      chart.update(node);
    });
    //this.pollingCallback();
  },

  toggleUpdating: function() {
    this.connected = !this.connected;
    if (this.connected) {
      //this.elastic.adminClusterNodeStats({ callback: this.newReading });
      this.elastic.adminClusterNodeInfo({
        callback: this.updateInformation
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
