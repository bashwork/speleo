/**
 * --------------------------------------------------------
 * Visual Chart Types
 * --------------------------------------------------------
 *
 * * pie chart 
 * * bar chart 
 * * line chart 
 * * single value (button)
 * * table block
 */

// ------------------------------------------------------------
// chart factories
// ------------------------------------------------------------
var lineChartFactory = function(options) {
  return new Highcharts.StockChart({
    chart: {
      renderTo: options.selector,
      type: 'line',
      borderWidth: 1,
      borderColor: '#eee'
    },
    credits: {
      enabled: false,
    },
    series: options.data
  });
};

var barChartFactory = function(options) {
  return new Highcharts.StockChart({
    chart: {
      renderTo: options.selector,
      type: 'bar',
      borderWidth: 1,
      borderColor: '#eee'
    },
    yAxis: {
      min: 0
    },
    plotOptions: {
      bar: {
        dataLabels: {
          enabled: true
        }
      }
    },
    credits: {
      enabled: false,
    },
    series: options.data
  });
};

var pieChartFactory = function(options) {
  return new Highcharts.StockChart({
    chart: {
      renderTo: options.selector,
      plotShadow: false,
      plotBackgroundColor: null,
      plotBorderWidth: null
    },
    plotOptions: {
      pie: {
        allowPointSelector: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          color: '#000000',
          connectColor: '#000000',
          formatter: function() {
            return '<b>' + this.point.name + '</b>: ' + this.percentage + '%';
          }
        }
      }
    },
    credits: {
      enabled: false
    },
    series: options.data
  });
};

// ------------------------------------------------------------
// views
// ------------------------------------------------------------
// use facets for the view
// ------------------------------------------------------------
var PieChartBlockView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click .block-close': 'remove'
  },

  initailize: function(args) {
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.chart = pieChartFactory({
      selector: this.el.name,
      data: this.formatModel()
    });
    return this;
  },

  formatModel: function() {
    var hits = this.model.get('_hits'),
        size = _.size(hits),
        data = _.groupBy(hits, function(hit) {
          return hit.title;
        });

    return _.map(_.keys(data), function(key) {
      return [key, _.size(data[key])];
    });
  },

  remove: function() {
    this.$el.remove();
  }

});

var BarChartBlockView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click .block-close': 'remove'
  },

  initailize: function(args) {
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.chart = barChartFactory({
      selector: this.el.name,
      data: this.formatModel()
    });
    return this;
  },

  formatModel: function() {
    var hits = this.model.get('_hits'),
        size = _.size(hits),
        data = _.groupBy(hits, function(hit) {
          return hit.title;
        });

    return _.map(_.keys(data), function(key) {
      return { name: key, data: [ _.size(data[key]) ] };
    });
  },

  remove: function() {
    this.$el.remove();
  }

});

var LineChartBlockView = Backbone.View.extend({
  tagName: 'li',
  events: {
    'click .block-close': 'remove'
  },

  initailize: function(args) {
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.chart = lineChartFactory({
      selector: this.el.name,
      data: this.formatModel()
    });
    return this;
  },

  formatModel: function() {
    var hits = this.model.get('_hits'),
        size = _.size(hits),
        data = _.groupBy(hits, function(hit) {
          return hit.title;
        });

    return _.map(_.keys(data), function(key) {
      return { name: key, data: [ _.size(data[key]) ] };
    });
  },

  remove: function() {
    this.$el.remove();
  }

});

var TableBlockView = Backbone.View.extend({
  tagName: 'li',
  template: _.template($('#block-table-template').html()),
  events: {
    'click .block-close': 'remove'
  },

  initailize: function(args) {
    this.model.bind('change',  this.render, this);
    this.model.bind('destroy', this.remove, this);
  },

  render: function() {
    this.$el.html(this.template(this.formatModel()))
    return this;
  },

  formatModel: function() {
    // not correct for template
    return this.model.toJSON();
  },

  remove: function() {
    this.$el.remove();
  }

});
