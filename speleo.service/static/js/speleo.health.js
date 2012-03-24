window.valid_times = {
  '1 second':   1000,
  '5 seconds':  5000,
  '10 seconds': 10000,
  '15 seconds': 15000,
  '30 seconds': 30000,
  '60 seconds': 60000,
  '1 minute':   60000,
  '2 minutes':  120000,
  '5 minutes':  300000,
  '10 minutes': 600000,
  '15 minutes': 900000,
  '30 minutes': 1800000,
  '60 minutes': 3600000,
  '1 hour':     3600000
};

// ------------------------------------------------------------
// views
// ------------------------------------------------------------
var GenericChartView = Backbone.View.extend({

  /**
   * Add new data to the supplied chart
   * @param reading The new data to add to the chart
   */
  update: function(reading) {
    var parsed = this.parse(reading);
    this._appendData(parsed.data, parsed.time);
    this._shrink(parsed.time);
    this.render();
  },

  /**
   * Add new data to the end of the supplied chart
   * @param reading The new data to add to the chart
   * @param current The new x axis value to link with
   */
  _appendData: function(reading, current) {
    var shift = this.shift ? this.shift : false;
    _.each(_.zip(this.chart.series, reading), function(pair) {
      pair[0].addPoint([current, pair[1]], false, shift);
    });
  },

  /**
   * Shrink the chart data series to stay in alloted space
   * @param current The new max x asix to limit by
   */
  _shrink: function(current) {
    var threshold = current - window.config.chart_window;
    _.each(this.chart.series, function(series) {
      if (series.data && series.data.length > 0) {
        while (series.data[0].category
            && series.data[0].category < threshold) {
          series.data[0].remove(false);
          this.shift = true;
        }
      }
    });
  },

  clear: function() {
    _.each(this.chart.series, function(series) {
      series.setData([], true);
    });
    this.shift = false;
  },

  render: function() {
    this.chart.redraw();
  }

});

var GenericTableView = Backbone.View.extend({
  events: {
    'click table': 'toggleTable'
  },

  toggleTable: function() {
    $('tbody', this.el).toggle('fast');
  },

  render: function() {
    var current = $('tbody', this.el).css('display');
    $(this.el).html(this.template(this.model.toJSON()));
    $('tbody', this.el).css('display', current);
    return this;
  }

});


var HealthNodeView = Backbone.View.extend({
  tagName: 'em',
  template: _.template($('#health-node-template').html()),
  initialize: function() {
    this.model.bind('destroy', this.remove, this);
    this.model.bind('change:current', this.update, this);
    HealthNodes.bind('reset',  this.remove, this);
  },

  remove: function() {
    this.$el.remove();
  },

  update: function() {
    var method = this.model.get('current') ? 'addClass' : 'removeClass';
    $('.btn', this.el)[method]('btn-primary disabled');
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
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
    var threads = reading.get('jvm').threads;
    if (!threads) {
      var dataset = [0,0];
    } else {
      var dataset = [
        threads.count,
        threads.peak_count
      ];
    }
    return {
      data: dataset,
      time: reading.get('jvm').timestamp
    };
  }
});

var JvmHeapMemoryChartView = GenericChartView.extend({
  el: $('#node-jvm-heap-memory'),

  initialize: function() {
    this.chart = jvmMemoryChartFactory(this.el, 'Jvm Heap Memory');
  },

  parse: function(reading) {
    var mem = reading.get('jvm').mem;
    if (!mem) {
      var dataset = [0,0];
    } else {
      var dataset = [
        mem.heap_committed_in_bytes,
        mem.heap_used_in_bytes
      ];
    }
    return {
      data: dataset,
      time: reading.get('os').timestamp
    };
  }
});

var JvmOtherMemoryChartView = GenericChartView.extend({
  el: $('#node-jvm-stack-memory'),

  initialize: function() {
    this.chart = jvmMemoryChartFactory(this.el, 'Jvm Other Memory');
  },

  parse: function(reading) {
    var mem = reading.get('jvm').mem;
    if (!mem) {
      var dataset = [0,0];
    } else {
      var dataset = [
        mem.non_heap_committed_in_bytes,
        mem.non_heap_used_in_bytes
      ];
    }
    return {
      data: dataset,
      time: reading.get('os').timestamp
    };
  }

});

var OsCpuChartView = GenericChartView.extend({
  el: $('#node-os-cpu'),

  initialize: function() {
    this.chart = osCpuChartFactory(this.el, "OS CPU Percent");
  },

  parse: function(reading) {
    var cpu = reading.get('os').cpu;
    if (!cpu) {
      var dataset = [0,0,0];
    } else {
      var dataset = [
        cpu.idle,
        cpu.sys,
        cpu.user
      ];
    }
    return {
      data: dataset,
      time: reading.get('os').timestamp
    };
  }

});

var OsSwapMemoryChartView = GenericChartView.extend({
  el: $('#node-os-swap-memory'),

  initialize: function() {
    this.chart = osSwapMemoryChartFactory(this.el, 'OS Swap Memory');
  },

  parse: function(reading) {
    var swap = reading.get('os').swap;
    if (!swap) {
      var dataset = [0,0];
    } else {
      var dataset = [
        swap.free_in_bytes,
        swap.used_in_bytes
      ];
    }
    return {
      data: dataset,
      time: reading.get('os').timestamp
    };
  }

});

var OsMemoryChartView = GenericChartView.extend({
  el: $('#node-os-main-memory'),

  initialize: function() {
    this.chart = osMemoryChartFactory(this.el, ' OS Main Memory');
  },

  parse: function(reading) {
    var mem = reading.get('os').mem;
    if (!mem) {
      var dataset = [0,0,0];
    } else {
      var dataset = [
        mem.actual_used_in_bytes + mem.actual_free_in_bytes,
        mem.used_in_bytes,
        mem.actual_used_in_bytes
      ];
    }
    return {
      data: dataset,
      time: reading.get('os').timestamp
    };
  }

});

var ChartViewCollection = Backbone.View.extend({
  initialize: function() {
    this.charts = [
      new JvmThreadsChartView(),
      new JvmHeapMemoryChartView(),
      new JvmOtherMemoryChartView(),
      new OsCpuChartView(),
      new OsSwapMemoryChartView(),
      new OsMemoryChartView()
    ];
    _.each(this.charts, function(chart) {
      chart.chart.showLoading();
    });
  },

  update:function(data) {
    _.each(this.charts, function(chart) {
      chart.update(data);
      chart.chart.hideLoading();
    });
  },

  clear:function() {
    _.each(this.charts, function(chart) {
      chart.clear();
      chart.chart.showLoading();
    });
  }

});


// ------------------------------------------------------------
// information table views
// ------------------------------------------------------------
// - update dynamic information
// - add information retrieved from update
// ------------------------------------------------------------
var SystemNodeTableView = GenericTableView.extend({
  el: $('#node-system-info'),
  template: _.template($('#system-info-template').html())
});

var JvmNodeTableView = GenericTableView.extend({
  el: $('#node-jvm-info'),
  template: _.template($('#jvm-info-template').html())
});

var IndexNodeTableView = GenericTableView.extend({
  el: $('#node-index-info'),
  template: _.template($('#index-info-template').html())
});

var NetworkNodeTableView = GenericTableView.extend({
  el: $('#node-network-info'),
  template: _.template($('#network-info-template').html())
});

var TableViewCollection = Backbone.View.extend({

  initialize: function() {
    this.tables = [
      new SystemNodeTableView({ model: null }),
      new JvmNodeTableView({ model: null }),
      new IndexNodeTableView({ model: null }),
      new NetworkNodeTableView({ model: null })
    ];
  },

  update:function(model) {
    _.each(this.tables, function(table) {
      table.model = model;
      table.render();
    });
  }

});


// ------------------------------------------------------------
// models
// ------------------------------------------------------------
var HealthNode = Backbone.Model.extend({
  defaults: {
    current: false
  },

  sync: function(x, m, o) {}
});


// ------------------------------------------------------------
// collections
// ------------------------------------------------------------
var HealthNodeCollection = Backbone.Collection.extend({
  model: HealthNode,

  current: function() {
    return this.find(function(node) {
      return node.current;
    });
  },

  setAll: function(field, value) {
    this.each(function(node) {
      node.set(field, value);
    });
  },

  getBy: function(key, value) {
    return this.find(function(n) {
      return n.get(key) === value;
    });
  }

});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var ElasticHealthAppView = Backbone.View.extend({
  /**
   * Get event callbacks consistent (this!)
   */

  el: $('#health-toolbar'),
  nodesEl: $('#health-nodes'),
  enableEl: $('#health-enable'),
  delayEl: $('#health-delay'),
  windowEl: $('#health-window'),
  events: {
    'click #health-enable': 'toggleUpdating',
    'click .node-toggle': 'switchHealthNode',
    'blur #health-delay': 'switchConfigValues',
    'blur #health-window': 'switchConfigValues',
    'submit form': 'switchConfigValues'
  },

  initialize: function() {
    HealthNodes.bind('add', this.addHealthNode, this);
    HealthNodes.bind('change', this.updateHealthNode, this);

    _.bindAll(this, 'pollingCallback');

    this.elastic = new ElasticSearch({
      host: window.config.host,
      port: window.config.port
    });
    this.delayEl.attr('autocomplete', 'off').typeahead({  source: _.keys(window.valid_times) });
    this.windowEl.attr('autocomplete', 'off').typeahead({ source: _.keys(window.valid_times) });

    this.charts = new ChartViewCollection();
    this.tables = new TableViewCollection();
    this.toggleUpdating();
  },

  switchConfigValues:function(e) {
    e.preventDefault();
    var dvalue = window.valid_times[this.delayEl.val()],
        wvalue = window.valid_times[this.windowEl.val()];
    window.config.delay = dvalue ? dvalue : 5000;
    window.config.chart_window = wvalue ? wvalue : 60000
  },

  switchHealthNode: function(node) { 
    HealthNodes.setAll('current', false);
    var name   = node.target.innerText,
        handle = HealthNodes.getBy('name', name);

    if (handle) {
      handle.set('current', true);
      this.tables.update(handle);
      this.charts.clear();
      this.charts.update(handle);
    }
  },

  addHealthNode: function(node) {
    var view = new HealthNodeView({ model: node });
    this.nodesEl.append(view.render().el);
  },

  updateHealthNode: function(node) {
    if (node.get('current')) {
      this.tables.update(node);
      this.charts.update(node);
    }
  },

  pollingCallback: function() {
    var self = this;
    var request = {
      callback: function(data, xhr) {
        self.mergeNewInformation(data, xhr);
        self.pollingCallback();
      }
    };

    if (HealthNodes.current()) {
      request.nodes = [HealthNodes.current().id];
    }

    if (window.config.connected) {
      _.delay(function() {
         self.elastic.adminClusterNodeStats(request);
      }, window.config.delay);
    }
  },

  toggleUpdating: function() {
    window.config.connected = !window.config.connected;
    if (window.config.connected) {
      this.elastic.adminClusterNodeInfo({
        callback: this.updateNodeInformation
      });
      this.pollingCallback();
      $(this.enableEl).text('Stop Polling');
    } else {
      $(this.enableEl).text('Start Polling');
    }
  },

  /**
   * Elastic Search Callbacks
   */

  updateNodeInformation: function(data, xhr) {
    HealthNodes.reset();
    _.each(data.nodes, function(node, key) {
      node.id = key; // cid?
      HealthNodes.create(node);
    });
  },

  mergeNewInformation: function(data, xhr) {
    _.each(data.nodes, function(node, key) {
      var mark = HealthNodes.getBy('id', key);
      mark.set($.extend(true, mark.toJSON(), node), { silent: true });
      mark.set('dirty', !mark.get('dirty')); // hack
    });

    // choose one of the nodes to monitor
    if (!HealthNodes.getBy('current', true)) {
      $('.node-toggle:first').click();
    }
  }

});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.config = {
      host: 'localhost',
      port: 9200,
      delay: 1000,
      connected: false,
      chart_window: 60000
  };
  window.HealthNodes = new HealthNodeCollection();
  window.app = new ElasticHealthAppView();
});
