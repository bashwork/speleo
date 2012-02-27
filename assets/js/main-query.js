// ------------------------------------------------------------
// models
// ------------------------------------------------------------

// ------------------------------------------------------------
// router
// ------------------------------------------------------------
var Router = Backbone.Router.extend({
  routes : {
    '': 'index',
  },
});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var QueryAppView = Backbone.View.extend({
  /**
   * add common requests autocomplete
   * - select correct method
   */

  el: $('#query-app'),
  queryDataEl: $('#query-data'),
  queryActionEl: $('#query-action'),
  queryPathEl: $('#query-path'),
  queryResults: $('#query-results'),

  events: {
    'click #query-submit': 'executeQueryButton',
    'click #query-reset':  'resetQueryButton'
  },

  initialize:function() {
    this.elastic = new ElasticSearch({
      callback: this.displayResults
    });
  },

  displayResults: function(data, xhr) {
    $('#query-results').html(JSON.stringify(data, null, ' '));
    prettyPrint();
  },

  resetQueryButton: function(e) {
    e.preventDefault();
    this.queryDataEl.val('');
    this.queryActionEl.val('POST');
    this.queryPathEl.val('');
    this.queryResults.html('');
  },

  executeQueryButton: function(e) {
    e.preventDefault();
    var path = this.queryPathEl.val(),
        data = this.queryDataEl.val(),
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
  app.router = new Router();
  Backbone.history.start({ pushState : true });
});
