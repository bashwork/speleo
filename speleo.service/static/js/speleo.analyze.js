/*
 * Add auto help documentation and paramaters
 * - like a modal help file
 */
window.analysis = {
  filters: [
    '',
    'standard',
    'lowercase',
    'asciifolding',
    'dictionary_decompounder', // word_list, word_list_path
    'hypenation_decompounder', // word_list, word_list_path
    'length',       // min(0) max(Interger.MAX_VALUE)
    'ngram',        // min_gram(1) max_gram(2)
    'elision',      // articles : []
    'edgeNGram',    // min_gram(1), max_gram(2), side { front, back }
    'kstrem',       // use with lowercase
    'pattern_replace',  // pattern, replacement
    'phonetic',
    'porterStem',   // use with lowercase
    'stemmer',      // language
    'reverse',
    'shingle',      // max_shingle_size(2), output_unigrams(true)
    'snowball',     // language
    'stop',         // stopwords, stopwords_path, ignore_case(false)
    'synonym',      // synonyms_path
    'trim',
    'truncate',     // length(10)
    'unique',
    'word_delimiter'    // lots....
  ],
  char_filters: [
    'html_strip',
    'mapping'      // ['ph=>f']
  ],
  analyzers: [
    '',
    'standard',
    'simple',
    'snowball',
    'keyword',
    'pattern',      // lowercase, pattern, flags
    'stop',         // stopwords, stopwords_path
    'whitespace'
  ],
  tokenizers: [
    '',
    'standard',
    'keyword',      // buffer_size
    'letter',
    'lowercase',
    'ngram',        // min_gram(1) max_gram(2)
    'whitespace',
    'pattern',      // lowercase, pattern, flags
    'path_hierarchy',   // delimiter, replacement, buffer_size, reverse, skip
    'edgeNGram',    // min_gram(1), max_gram(2), side { front, back }
    'uax_url_email'    // max_token_length
  ],
  languages: [
    'arabic', 'armenian', 'basque', 'brazilian',
    'bulgarian', 'catalan', 'chinese', 'cjk', 'czech', 'danish',
    'dutch', 'english', 'finnish', 'french', 'galician', 'german',
    'greek', 'hindi', 'hungarian', 'indonesian', 'italian',
    'norwegian', 'persian', 'portuguese', 'romanian',
    'russian', 'spanish', 'swedish', 'turkish', 'thai'
  ]
};

// stopwords [], max_token_length


// ------------------------------------------------------------
// main 
// ------------------------------------------------------------
var AnalyzeAppView = Backbone.View.extend({
  /**
   * add common requests autocomplete
   * - select correct method
   */

  el: $('#speleo-app'),
  queryTextEl: $('#analyze-text'),
  queryIndexEl: $('#analyze-index'),
  queryAnalyzerEl: $('#analyze-analyzer'),
  queryFiltersEl: $('#analyze-filters'),
  queryTokenizersEl: $('#analyze-tokenizers'),
  queryResultsEl: $('#analyze-results'),
  optionsTemplate: speleo.template['analyze.options'],

  events: {
    'click #analyze-submit': 'executeQueryButton',
    'click #analyze-reset':  'resetQueryButton'
  },

  initialize:function() {
    _.bindAll(this, 'displayResults', 'initSuggestions');
    this.elastic = new ElasticSearch({
      callback: this.displayResults
    });
    this.elastic.adminIndicesMappingGet({
      callback: this.initSuggestions
    });
    this.queryAnalyzerEl.popover(this.popover_options(window.analysis.analyzers));
    this.queryTokenizersEl.popover(this.popover_options(window.analysis.tokenizers));
    this.queryFiltersEl.popover(this.popover_options(window.analysis.filters));
    this.render();
  },

  initSuggestions:function(data, xhr) {
    var keys = _.keys(data);
    this.queryIndexEl.attr('autocomplete', 'off')
        .typeahead({ source: keys });
  },

  popover_options: function(database) {
    return {
      delay: { show: 1000, hide: 500 },
      title: function() {
        var name = $(this).val(),
            name = name || 'hover For Selection',
            name = name.charAt(0).toUpperCase() + name.slice(1);
        return name + ' Help';
      },
      content: function() {
        var name = $(this).val();
        return database[name] || "Choose an item to learn more about";
      }
    };
  },

  render: function() {
    this.queryAnalyzerEl.html(this.optionsTemplate({
      values: window.analysis.analyzers
    }));
    this.queryAnalyzerEl.val('standard');
    this.queryTokenizersEl.html(this.optionsTemplate({
      values: window.analysis.tokenizers
    }));
    this.queryFiltersEl.html(this.optionsTemplate({
      values: window.analysis.filters
    }));
  },

  displayResults: function(data, xhr) {
    this.queryResultsEl.html(JSON.stringify(data, null, ' '));
    prettyPrint();
  },

  resetQueryButton: function(e) {
    e.preventDefault();
    this.queryTextEl.val('');
    this.queryAnalyzerEl.val('');
    this.queryFiltersEl.val('');
    this.queryTokenizersEl.val('');
    this.queryResultsEl.html('');
  },

  executeQueryButton: function(e) {
    e.preventDefault();
    var anal = this.queryAnalyzerEl.val(),
        filt = this.queryFiltersEl.val(),
        indx = this.queryIndexEl.val(),
        toke = this.queryTokenizersEl.val(),
        text = this.queryTextEl.val(),
        quer = this.buildQuery(anal, indx, filt, toke);
    this.elastic.request('POST', quer, text);
  },

  buildQuery: function(anal, indx, filt, toke) {
    var base  = '_analyze',
        query = '';
    if (indx) { base = indx + "/" + base; }
    if (anal) {
      query += "?analyzer=" + anal;
    } else {
      if (toke) {
        query += (query) ? '&' : '?'; 
        query += "tokenizer=" + toke;
      }
      if (filt) {
        filt = _.isArray(filt) ? filt : [filt];
        var filters = _.reduce(filt, function(t, n) {
          return t + ',' + n;
        });

        query += (query) ? '&' : '?'; 
        query += "filters=" + filters;
      }
    }

    return base + query;
  }

});



// ------------------------------------------------------------
// page ready
// ------------------------------------------------------------
jQuery(function initialize($) {
  window.app = new AnalyzeAppView();
});
