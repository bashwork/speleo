// This file is provided to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file
// except in compliance with the License.  You may obtain
// a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

var ElasticSearch = function(settings) {
    this.defaults = ElasticSearch.prototype.mixin({}, this.defaults, settings);
    this.client = ElasticSearch.prototype.getClient();
}

ElasticSearch.prototype.defaults = {
    number_of_shards   : 5,
    number_of_replicas : 1,
    debug    : false,
    host     : "localhost",
    port     : 9200,
    callback : function(response, meta) {
        // TODO By default the "debug" is set to false.
        if (response) ElasticSearch.prototype.log(response)
    }
}

// defnie HTTP method names
ElasticSearch.prototype.method = {
    get    : "GET",
    post   : "POST",
    put    : "PUT",
    del    : "DELETE"
}

/* Cluster Admin API */

/*
    params:
        -optional-
        settings.filter_nodes
        settings.filter_routing_table
        settings.filter_metadata
        settings.filter_indices
        settings.filter_blocks
        settings.callback   function to be called once the ajax is finished
*/
ElasticSearch.prototype.adminClusterState = function(settings) {
    var settings = this.ensure(settings);
    var path = "_cluster/state";
    var params = [];
    if (settings.filter_nodes) params.push("filter_nodes="+settings.filter_nodes);
    if (settings.filter_routing_table) params.push("filter_routing_table="+settings.filter_routing_table);
    if (settings.filter_metadata) params.push("filter_metadata="+settings.filter_metadata);
    if (settings.filter_indices) params.push("filter_indices="+settings.filter_indices);
    if (settings.filter_blocks) params.push("filter_blocks="+settings.filter_blocks);
    if (params.length > 0) path += "?" + params.join("&");
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminClusterHealth = function(settings) {
    var settings = this.ensure(settings);
    var path = "_cluster/health";
    var params = [];
    if (settings.indices) path += "/"+settings.indices;
    if (settings.level) params.push("level="+settings.level);
    if (settings.wait_for_status) params.push("wait_for_status="+settings.wait_for_status);
    if (settings.wait_for_relocating_shards) params.push("wait_for_relocating_shards="+settings.wait_for_relocating_shards);
    if (settings.wait_for_nodes) params.push("wait_for_nodes="+settings.wait_for_nodes);
    if (settings.timeout) params.push("timeout="+settings.timeout);
    if (params.length > 0) path += "?" + params.join("&");
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        -optional-
        settings.nodes      array of node ids
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminClusterNodeInfo = function(settings) {
    var settings = this.ensure(settings)
    var path = "_cluster/nodes";
    if (settings.nodes) path += "/"+settings.nodes;
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        -optional-
        settings.nodes      array of node ids
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminClusterNodeStats = function(settings) {
    var settings = this.ensure(settings)
    var path = "_cluster/nodes";
    if (settings.nodes) path += "/"+settings.nodes;
    path += "/stats";
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        -optional-
        settings.nodes      array of node ids
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminClusterNodeShutdown = function(settings) {
    var settings = this.ensure(settings)
    var path = "_cluster/nodes";
    path += "/"+ (settings.nodes || "_all") + "/_shutdown";
    if (settings.delay) path += "?delay=" + settings.delay;
    with(this) {
        execute(method.post, path, settings);
    }
}

/*
    params:
        -optional-
        settings.nodes      array of node ids
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminClusterNodeRestart = function(settings) {
    var settings = this.ensure(settings)
    var path = "_cluster/nodes";
    path += "/"+ (settings.nodes || "_all") + "/_restart";
    if (settings.delay) path += "?delay=" + settings.delay;
    with(this) {
        execute(method.post, path, settings);
    }
}

/* Index Admin API */

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesStatus = function(settings) {
    var settings = this.ensure(settings);
    var path = (settings.indices || "_all") + "/_status";
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesCreate = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index) { throw("Index name must be provided.") }
    var path = settings.index+"/";
    var index = {
        number_of_shards : settings.number_of_shards || this.defaults.number_of_shards,
        number_of_replicas : settings.number_of_replicas || this.defaults.number_of_replicas
    };
    settings.stringifyData = JSON.stringify({"index":index});
    with(this) {
        execute(method.put, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesDelete = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index) { throw("Index name must be provided.") }
    var path = settings.index+"/";
    with(this) {
        execute(method.del, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesMappingGet = function(settings) {
    var settings = this.ensure(settings);
    var path = (settings.indices || "_all") + "/";
    if (settings.types) path += settings.types + "/";
    path += "_mapping";
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesMappingPut = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.type) { throw("An index type must be provided."); }
    if (!settings.mapping) { throw("No mapping request data provided."); }
    var path = (settings.indices || "_all") + settings.type + "/_mapping";
    if (settings.ignore_conflicts) { path += "?ignore_conflicts=" + settings.ignore_conflicts; }
    settings.stringifyData = JSON.stringify(settings.mapping);
    with(this) {
        execute(method.post, path, settings);
    }
}

/*
    params:
        settings.index      index name
        settings.type       index type
        -optional-
        settings.callback
 */
ElasticSearch.prototype.adminIndicesMappingDelete = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.type) { throw("An index type must be provided."); }
    if (!settings.index) { throw("And index name must be provided."); }
    with(this) {
        execute(method.del, [settings.index,settings.type,"_mapping"].join("/"), settings);
    }
}

ElasticSearch.prototype.adminIndicesFlush = function(settings) {
    var settings = this.ensure(settings);
    var path = (settings.indices || "_all") + "/_flush";
    if (settings.refresh && settings.refresh === true) path += "?refresh=true";
    with(this) {
        execute(method.post, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesRefresh = function(settings) {
    var settings = this.ensure(settings);
    var path = (settings.indices || "_all") + "/_refresh";
    with(this) {
        execute(method.post, path, settings);
    }
}

ElasticSearch.prototype.adminIndicesGatewaySnapshot = function(settings) {
    var settings = this.ensure(settings);
    var path = (settings.indices || "_all") + "/_gateway/snapshot";
    with(this) {
        execute(method.post, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesAliases = function(settings) {
    var settings = this.ensure(settings);
    if (settings.aliases) {
        settings.stringifyData = JSON.stringify(settings.aliases);
        var path = "_aliases";
        with(this) {
            execute(method.post, path, settings);
        }
    } else {
        throw("No aliases request data provided.");
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesSettings = function(settings) {
    var settings = this.ensure(settings);
    if (settings.number_of_replicas) {
        var path = (settings.indices || "_all") + "/_settings";
        var index = {
            number_of_replicas : settings.number_of_replicas
        };
        settings.stringifyData = JSON.stringify({"index":index});
        with(this) {
            execute(method.put, path, settings);
        }
    }
}

/*
    params:
        settings.index
        -optional-
        settings.callback
 */
ElasticSearch.prototype.adminIndicesOpen = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index) { throw("Index name must be provided."); }
    with(this) {
        execute(method.put, settings.index+"/_open", settings);
    }
}

/*
    params:
        settings.index
        -optional-
        settings.callback
 */
ElasticSearch.prototype.adminIndicesClose = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index) { throw("Index name must be provided."); }
    with(this) {
        execute(method.put, settings.index+"/_close", settings);
    }
}

/*
    params
        settings.index
        settings.text
        -optional-
        settings.analyzer
        settings.format     text / detailed [default]
 */
ElasticSearch.prototype.adminIndicesAnalyze = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index) { throw("Index name must be provided."); }
    if (!settings.text) { throw("Text to analyze must be provided."); }
    settings.stringifyData = settings.text;
    var path = settings.index+"/_analyze";
    var params = [];
    if (settings.analyzer) params.push("analyzer", settings.analyzer);
    if (settings.format) params.push("format", settings.format);
    if (params.length > 0) path += "?"+params.join("&");
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        settings.template_id
        settings.template_json
        -optional-
        settings.callback
 */
ElasticSearch.prototype.adminIndicesTemplatePut = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.template_id) { throw("Index template_id must be provided."); }
    if (!settings.template_json) { throw("No template json provided."); }
    var path = "_template/"+settings.template_id;
    settings.stringifyData = JSON.stringify(settings.template_json);
    with(this) {
        execute(method.put, path, settings);
    }
}

/*
    params:
        settings.template_id
        -optional-
        settings.callback
 */
ElasticSearch.prototype.adminIndicesTemplateGet = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.template_id) { throw("Index template_id must be provided."); }
    var path = "_template/"+settings.template_id;
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    params:
        settings.template_id
        -optional-
        settings.callback
 */
ElasticSearch.prototype.adminIndicesTemplateDelete = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.template_id) { throw("Index template_id must be provided."); }
    var path = "_template/"+settings.template_id;
    with(this) {
        execute(method.del, path, settings);
    }
}

/*
    params:
        -optional-
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.adminIndicesOptimize = function(settings) {
    var settings = this.ensure(settings);
    var path = (settings.indices || "_all") + "/_optimize";
    var params = []
    if (settings.max_num_segments) params.push("max_num_segments="+settings.max_num_segments);
    if (settings.only_expunge_deletes) params.push("only_expunge_deletes="+settings.only_expunge_deletes);
    if (settings.refresh) params.push("refresh="+settings.refresh);
    if (settings.flush) params.push("flush="+settings.flush);
    if (params.length > 0) path += "?"+params.join("&");
    with(this) {
        execute(method.post, path, settings);
    }
}

/* Search API using Query DSL */

/*
    Search using QueryDSL
    params:
        settings.queryDSL   custom DSL query
        -optional-
        settings.types      single index type or array of index types
        settings.indices    single index or array of indices
        settings.routing
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.search = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.queryDSL) throw("queryDSL not provided");
    settings.stringifyData = JSON.stringify(settings.queryDSL);
    var path = "_search";
    if (settings.types) path = settings.types + "/" + path;
    path = (settings.indices ? settings.indices : "_all") + "/"+ path;
    if (settings.routing) path += "?routing="+settings.routing;
    with(this) {
        execute(method.post, path, settings);
    }
}

/*
    Query and return number of matched documents.
    params:
        settings.queryDSL   custom DSL query
        -optinal-
        settings.types      index types
        settings.indices    index names
        settings.routing
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.count = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.queryDSL) throw("queryDSL not provided");
    settings.stringifyData = JSON.stringify(settings.queryDSL);
    var path = "_count";
    if (settings.types) path = settings.types + "/" + path;
    path = (settings.indices ? settings.indices : "_all") + "/"+ path;
    if (settings.routing) path += "?routing=" + settings.routing;
    with(this) {
        execute(method.post, path, settings);
    }
}

/*
    Get document from index.
    params:
        settings.index      index name
        settings.type       index type
        settings.id         document id
        -optional-
        settings.fields     _source [default]
        settings.routing
        settings.refresh    false [default]
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.get = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index || !settings.type || !settings.id) {
        throw("Full path information /{index}/{type}/{id} must be provided.");
    }
    var path = [settings.index, settings.type, settings.id].join("/");
    var params = [];
    if (settings.fields) params.push("fields="+settings.fields);
    if (settings.routing) params.push("routing="+settings.routing);
    if (settings.refresh) params.push("refresh="+settings.refresh);
    if (params.length > 0) path += "?" + params.join("&");
    with(this) {
        execute(method.get, path, settings);
    }
}

/*
    Delete document from index.
    params:
        settings.index      index name
        settings.type       index type
        settings.id         document id
        -optional-
        settings.replication    async / sync [default]
        settings.consistency    one / all / quorum [default]
        settings.refresh    false [default]
        settings.routing
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.del = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index || !settings.type || !settings.id) {
        throw("Full path information /{index}/{type}/{id} must be provided.");
    }
    var path = [settings.index, settings.type, settings.id].join("/");
    var params = [];
    if (settings.replication) params.push("replication="+settings.replication);
    if (settings.consistency) params.push("consistency="+settings.consistency);
    if (settings.refresh) params.push("refresh="+settings.refresh);
    if (settings.routing) params.push("routing="+settings.routing);
    if (params.length > 0) path += "?" + params.join("&");
    with(this) {
        execute(method.del, path, settings);
    }
}

/*
    Delete documents from index by query.
    params:
        settings.queryDSL
        -optional-
        settings.replication    async / sync [default]
        settings.consistency    one / all / quorum [default]
        settings.routing
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.deleteByQuery = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.queryDSL) throw("No queryDSL provided.");
    settings.stringifyData = JSON.stringify(settings.queryDSL);
    var path = (settings.indices || "_all") + "/" + (settings.types ? settings.types + "/" : "") + "_query";
    var params = [];
    if (settings.replication) params.push("replication="+settings.replication);
    if (settings.consistency) params.push("consistency="+settings.consistency);
    if (settings.routing) params.push("routing="+settings.routing);
    if (params.length > 0) path += "?" + params.join("&");
    with(this) {
        execute(method.del, path, settings);
    }
}

/*
    Index new document.
    params:
        settings.index      index name
        settings.type       index type
        settings.document   JSON document to index
        -optional-
        settings.id         document id provided by user
        settings.op_type    can be set to "create"
        settings.replication    async / sync [default]
        settings.timeout    1m [default]
        settings.refresh    false [default]
        settings.consistency    one / all / quorum [default]
        settings.routing
        settings.parent
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.index = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.index || !settings.type) {
        throw("Both the index and type names must be provided.");
    }
    if (!settings.document) throw("No JSON document provided.");
    settings.stringifyData = JSON.stringify(settings.document);
    var path;
    var method;
    if (settings.id) {
        path = [settings.index, settings.type, settings.id].join("/");
        if (settings.op_type && settings.op_type === "create") settings.path += "/_create";
        method = this.method.put;
    } else {
        // automatic ID generation
        path = [settings.index, settings.type].join("/") + "/";
        method = this.method.post;
    }
    var params = [];
    if (settings.replication) params.push("replication="+settings.replication);
    if (settings.timeout) params.push("timeout="+settings.timeout);
    if (settings.refresh) params.push("refresh="+settings.refresh);
    if (settings.consistency) params.push("consistency="+settings.consistency);
    if (settings.routing) params.push("routing="+settings.routing);
    if (settings.parent) params.push("parent="+settings.parent);
    if (params.length > 0) path += "?" + params.join("&");
    this.execute(method, path, settings);
}

/*
    Bulk operation.
    params:
        settings.bulkData   JSON bulk data
        -optional-
        settings.refresh    false [default]
        settings.consistency    one / all / quorum [default]
        settings.callback   function to be called once the ajax is finished
 */
ElasticSearch.prototype.bulk = function(settings) {
    var settings = this.ensure(settings);
    if (!settings.bulkData) { throw("No bulk data provided."); }
    settings.stringifyData = JSON.stringify(settings.bulkData);
    var path = "_bulk";
    var params = [];
    if (settings.refresh) params.push("refresh="+settings.refresh);
    if (settings.consistency) params.push("consistency="+settings.consistency);
    if (params.length > 0) path += "?" + params.join("&");
    with(this) {
        execute(method.post, path, settings);
    }
}

/*
    TODO _mlt

ElasticSearch.prototype.mlt = function(settings) {

}
 */
/*
    TODO _river
    Note it is pluggable, thus does not have to be installed!

ElasticSearch.prototype.river = function(settings) {

}
 */
/*
    Allows for low-level adhoc custom requests.    
    params:
        method      http method (eg "GET", "POST", ...)
        path        eg "_search" or "_all/_cluster/state" etc...
        data        either string or JSON request data
        -optional-
        callback    function to be called once the ajax is finished
*/
ElasticSearch.prototype.request = function(method, path, data, callback) {
    var settings = {};
    if (typeof data === "string") {settings.stringifyData = data}
    else {settings.stringifyData = JSON.stringify(data);}
    if (callback && typeof callback === "function") {settings.callback = callback;}
    this.execute(method, path, settings);
}

/* Internal helper methods */

ElasticSearch.prototype.ensure = function(obj) {
    return obj || {};
}

ElasticSearch.prototype.execute = function (method, path, settings) {
    var settings = this.ensure(settings);
    var url = "http://" + this.defaults.host + ":" + this.defaults.port + "/" + path;
    var callback = settings.callback || this.defaults.callback;
    settings.method = method;
//    this.log(options.method + ": " + url);
    ElasticSearch.prototype.executeInternal.call(this, url, settings, callback);
}


/*
if (typeof export === 'object') {
    exports.esclient = ElasticSearch;
}
*/// This file is provided to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file
// except in compliance with the License.  You may obtain
// a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

ElasticSearch.prototype.getClient = function() {
    return jQuery;
}

ElasticSearch.prototype.log = function(message, error) {
    if (this.defaults.debug && typeof console === 'object') {
        console.log('[elasticsearch-js] ' + (error ? 'ERROR: ' : ''), message);
    }
}

ElasticSearch.prototype.executeInternal = function(path, options, callback) {
    var request = {
        type: options.method.toUpperCase(),
        url: path,
        data: options.stringifyData,
        processData: false,
        dataType: "json"
        ,success: function(data, statusText, xhr) {
            callback(data, xhr);
        }
        ,error: function(xhr, message, error) {
            callback(message, xhr, error);
        }
    };
    this.client.ajax(request);
}

ElasticSearch.prototype.mixin = $.extend// This file is provided to you under the Apache License,
// Version 2.0 (the "License"); you may not use this file
// except in compliance with the License.  You may obtain
// a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.

ElasticSearch.prototype.events = {
    /*
        If new node is added into the cluster or any node is removed or master node is changed then
        the listener functions are executed with the following parameters:

        function( [newNodeId-1, newNodeId-2,...], [removedNodeId-1, removedNodeId-2], newMasterNodeId )

     */
    nodesAddedOrRemoved : {
        refreshInterval : 3000,
        timer : undefined,
        internal : {
            listeners : [],
            state : {
                nodesId : [],
                masterNodeId : undefined
            },
            check: function(es){
                var _this = this;
                var test = function(data, xhr) {
                    if (data && data.nodes) {

                        var _actualNodesId = [];
                        var addedNodes = [];
                        var removedNodes = [];
                        var newMasterNode = undefined;

                        // check for added nodes first
                        for (var nodeId in data.nodes) {
                            _actualNodesId.push(nodeId);
                            var idx = _this.state.nodesId.indexOf(nodeId);
                            if (idx == -1) addedNodes.push(nodeId);
                        }
                        
                        // check for removed nodes
                        for (var i = 0; i < _this.state.nodesId.length; i++) {
                            var nodeId = _this.state.nodesId[i];
                            var idx = _actualNodesId.indexOf(nodeId);
                            if (idx == -1) removedNodes.push(nodeId);
                        }

                        if (data.master_node && data.master_node != _this.state.masterNodeId) {
                            _this.state.masterNodeId = data.master_node;
                            newMasterNode = data.master_node;
                        }

                        if (addedNodes.length > 0 || removedNodes.length > 0 || newMasterNode != undefined) {
                            _this.state.nodesId = _actualNodesId.slice(0);
                            // call listeners
                            for (var l = 0; l < _this.listeners.length; l++) {
                                _this.listeners[l].apply(null,[addedNodes.slice(0), removedNodes.slice(0), newMasterNode]);
                            }
                        }
                    } else {
                        es.log("no nodes data found in response");
                    }
                };

                es.adminClusterState({
                    filter_metadata : true,
                    filter_routing_table : true,
                    callback : test
                });
            }
        }
    },

    /*
        If new index created in the cluster or any index is delete then
        the listener functions are executed with the following parameters:

        function( [newIndex-1, newIndex-2,...], [removedIndex-1, removedIndex-2] )
     */
    indicesAddedOrRemoved : {
        refreshInterval : 3000,
        timer : undefined,
        internal : {
            listeners : [],
            state : {
                indices : []
            },
            check: function(es){
                var _this = this;
                var test = function(data, xhr) {
                    if (data && data.metadata && data.metadata.indices) {

                        var indices = data.metadata.indices;
                        var _actualIndices = [];
                        var addedIndices = [];
                        var removedIndices = [];

                        // check for added indices first
                        for (var index in indices) {
                            _actualIndices.push(index);
                            var idx = _this.state.indices.indexOf(index);
                            if (idx == -1) addedIndices.push(index);
                        }

                        // check for removed indices
                        for (var i = 0; i < _this.state.indices.length; i++) {
                            var index = _this.state.indices[i];
                            var idx = _actualIndices.indexOf(index);
                            if (idx == -1) removedIndices.push(index);
                        }

                        if (addedIndices.length > 0 || removedIndices.length > 0) {
                            _this.state.indices = _actualIndices.slice(0);
                            // call listeners
                            for (var l = 0; l < _this.listeners.length; l++) {
                                _this.listeners[l].apply(null,[addedIndices.slice(0), removedIndices.slice(0)]);
                            }
                        }
                    } else {
                        es.log("no indices data found in response");
                    }
                };

                es.adminClusterState({
                    filter_nodes : true,
                    filter_routing_table : true,
                    callback : test
                });
            }
        }
    }
    //

}

ElasticSearch.prototype.addEventListener = function(event, customCheckFunction) {
    if (this.events[event] != undefined) {
        this.events[event].internal.listeners.push(customCheckFunction);
        if (this.events[event].timer == undefined) {
            var _event = this.events[event];
            var _this = this;
            _event.timer = setInterval( function(){_event.internal.check(_this)}, _event.refreshInterval);
            this.log("New event ["+event+"] was registered");
        }
    } else {
        throw("["+event + "] is not known event handler.");
    }
}

/* Internal helper methods */
// http://stackoverflow.com/questions/1068834/object-comparison-in-javascript
/*
ElasticSearch.prototype.events.countProps = function(obj) {
    var count = 0;
    for (k in obj) {
        if (obj.hasOwnProperty(k)) {
            count++;
        }
    }
    return count;
};

ElasticSearch.prototype.events.objectEquals = function(v1, v2) {

    if (typeof(v1) !== typeof(v2)) {
        return false;
    }
//    if (typeof(v1) === "function") {
//        return v1.toString() === v2.toString();
//    }
    if (v1 instanceof Object && v2 instanceof Object) {

        if (this.countProps(v1) !== this.countProps(v2)) {
            return false;
        }
        var r = true;
        for (k in v1) {
            r = this.objectEquals(v1[k], v2[k]);
            if (!r) {
                return false;
            }
        }
        return true;
    } else {
        return v1 === v2;
    }
}
*/
