========================================================
speleo.frontend
========================================================

* I18N
* testing (performance, memory leaks)
* add one page routing (server/frontend/both?)
* save page state between switches (service)
* attach link to hue(configure)

--------------------------------------------------------
common ui components
--------------------------------------------------------

* generic growl alerts
* system connecting / error modal
* chart result views
* table result views
* single value views
* search result views
* search query builder with suggest

--------------------------------------------------------
user profile page
--------------------------------------------------------

* past dashboards
* blocks
* information (readonly)
    
--------------------------------------------------------
plugins
--------------------------------------------------------

* define dict of utilities and roles
* memcached monitor
* redis monitor
* hue linking

--------------------------------------------------------
Speleo Settings
--------------------------------------------------------

* add chicken test to shutdown/delete
* add roles
* add all possible settings and bind them

========================================================
speleo.service
========================================================

--------------------------------------------------------
elastic search proxy
--------------------------------------------------------

* manage elastic search configuration

  - rivers (custom)
  - index schema
  - analyzers

--------------------------------------------------------
service api
--------------------------------------------------------

* authentication and authorization
* statistics api
* save views/searches
* report/image generation
* load balance elastic search

--------------------------------------------------------
service alerts
--------------------------------------------------------

* configure via service
* monitoring service to send

  - email
  - sms
  - snmp trap
  - udp message

--------------------------------------------------------
collector health system
--------------------------------------------------------

* graph view of agents and collectors

--------------------------------------------------------
index health view
--------------------------------------------------------

* top sources
* index rates

--------------------------------------------------------
Speleo Query
--------------------------------------------------------

* complete suggest query builder

  - all methods and sub methods
  - lookup possible namespace values

--------------------------------------------------------
Speleo Dashboard
--------------------------------------------------------

* link auto update polling
* change search filter dynamically and refresh
* percolate in the future

  - custom alert api
  - wait for percolate through elastic

--------------------------------------------------------
Speleo Search
--------------------------------------------------------

* query builder -> convert query to elastic search
* click on chart and chart filter
* sidebar for suggested tag filter
* speed up slow updates
* send to dashboard
* clone splunk

  - recent searches
  - field suggest with facet matches
  - suggest matching terms, current matching count

--------------------------------------------------------
Speleo Blocks
--------------------------------------------------------

* save
* apply to new search (generic dash)
* apply in time range (search)
* block builder page (live)

  - dynamic options based on block type
  - jquery movable to arrange

* time limit

========================================================
speleo.collector
========================================================

--------------------------------------------------------
Speleo Statistics
--------------------------------------------------------

* save these from the river to the service
* ability to query with dsl

--------------------------------------------------------
speleo flume
--------------------------------------------------------

* collapse the same events (add a count)
* simplify deployment and management of
  
  - flume agent
  - flume collector
  - elastic search nodes
  - main service

* collect statistics
* bayesian log type detector and parsing
* hot cold log data
  
  - let elastic search expire incoming data
  - push data to hadoop
