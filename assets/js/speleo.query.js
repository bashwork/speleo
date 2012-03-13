window.root_query_suggestions = [
  '_search',
  '_aliases',
  '_analyze',
  '_analyze',
  '_bulk',
  '_cache/clear',
  '_cluster',
  '_cluster/state',
  '_cluster/health',
  '_cluster/settings',
  '_cluster/nodes/',
  '_cluster/nodes/stats',
  '_cluster/nodes/_shutdown',
  '_count',
  '_mget',
  '_msearch',
  '_percolator',
  '_river',
  '_segments',
  '_stats',
  '_status',
  '_template',
  '_all',
];

/*
 * implement custom matcher to test for these
  '/.../_bulk',
  '/.../_count',
  '/.../_mapping',
  '/.../_setting',
  '/.../_refresh',
  '/.../_optimize',
  '/.../_flush',
  '/.../_query?q=',
  '/.../_status',
  '/.../_segments',
  '/.../_cache/clear',
  '/.../_update',
  '/.../_search',
  '/.../_mlt',
  '/.../_msearch',
  '/.../_percolate',
 */

// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var QueryAppView = Backbone.View.extend({
  /**
   * add common requests autocomplete
   * - select correct method
   */

  el: $('#query-app'),
  queryActionEl: $('#query-action'),
  queryPathEl: $('#query-path'),
  queryResults: $('#query-results'),

  events: {
    'click #query-submit': 'executeQueryButton',
    'click #query-reset':  'resetQueryButton'
  },

  initialize:function() {
    this.queryPathEl.typeahead({
      source: window.root_query_suggestions
    });
    this.elastic = new ElasticSearch({
      callback: this.displayResults
    });
    var jsmode = require('ace/mode/javascript').Mode;
    this.editor = ace.edit('query-data');
    this.editor.getSession().setMode(new jsmode());
    this.editor.renderer.setShowGutter(false);
    this.editor.renderer.setShowPrintMargin(false);
    this.editor.renderer.setHScrollBarAlwaysVisible(false);
    this.editor.setHighlightActiveLine(false);
  },

  displayResults: function(data, xhr) {
    $('#query-results').html(JSON.stringify(data, null, ' '));
    prettyPrint();
  },

  resetQueryButton: function(e) {
    e.preventDefault();
    this.queryActionEl.val('POST');
    this.queryPathEl.val('');
    this.queryResults.html('');
    this.editor.getSession().setValue('');
  },

  executeQueryButton: function(e) {
    e.preventDefault();
    var path = this.queryPathEl.val(),
        data = this.editor.getSession().getValue(),
        meth = this.queryActionEl.val();
    if (meth === "GET" && !path) return;
    else if (meth === "DELETE" && !path) return;
    else if (!path && !data) return;
    this.elastic.request(meth, path, data);
  },

});


// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.app = new QueryAppView();
});
