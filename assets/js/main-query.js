// ------------------------------------------------------------
// models
// ------------------------------------------------------------

// ------------------------------------------------------------
// router
// ------------------------------------------------------------
var Router = Backbone.Router.extend({
  /**
   * - handle dashboard
   * - handle about
   * - handle contact (send email to support)
   * - handle statistics (a whole new iteration)
   */
  routes : {
    '': 'index',
  },
});


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var QueryAppView = Backbone.View.extend({

  el: $('#query-app'),
  queryDataEl: $('#query-data'),
  queryActionEl: $('#query-action'),
  queryPathEl: $('#query-path'),

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
    console.log(data);
    $('#query-results').html(JSON.stringify(data, null, ' '));
    prettyPrint();
  },

  resetQueryButton: function(e) {
    e.preventDefault();
    this.queryDataEl.input.val('');
    this.queryActionEl.input.val('GET');
    this.queryPathEl.input.val('');
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
