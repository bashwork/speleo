============================================================
Speleo
============================================================

------------------------------------------------------------
What is it?
------------------------------------------------------------

The aim of speleo is to be as good or better than splunk at
a much cheaper prices (read free).

------------------------------------------------------------
Why?
------------------------------------------------------------

Because splunk is expensive and every attempt to clone it or
to make a logging platform has not been successful in my
view because of:

* it just isn't as pretty or engaging
* it just isn't as easy to use
* it just won't scale to the needed size
* because I wanted to write this for kicks and grins

------------------------------------------------------------
What's inside?
------------------------------------------------------------

So I am putting all the hard work on the shoulders of giants:

* log agent

  I using flume for now, but whatever can send messages to
  the collection service can be used.

* log collector

  I using flume for now, but whatever can accept messages
  from the log agent can be used.

* log propagation

  I am using a plugin for flume to send the messages to
  everywhere they need to go: hadoop, elastic search,
  etc.

* log parsing

  The idea here is to train a bayesian classifier
  to decide what kind of message we have just received
  (json, syslog, xml, etc). Based on that, we parse
  it before sending it to the index.

* log indexer

  I am using elastic search for now, but maybe we can abstract
  so any of the indexers can be used (solr cloud for example).

* service api

  This will be a django (or jetty) api used to manage everything
  else: statistics, users, permissions, saved searches, etc.

  This will also need to move cold log data out of the cluster
  based on defined policy (for now we are leaving it as a
  manual step).

* service storage

  This will be abstracted using SqlAlchemy (or the java
  equivalent) and will be used to persist data used by the
  api.

* long term log storage

  This will be hadoop and the interface to this will simply
  be a linked in version of hue (or any other tool the user
  feels like using).

  Storing off log information will be handled manually by
  users for now, however, we can add administrative tools
  to help in the future.

* speleo frontend
 
  That is this! Ideally a rich web application that
  communicates with all parts of the service via rest api's
  providing a seamless experience regardless what device
  they are on (computer, tablet, mobile).

------------------------------------------------------------
What else?
------------------------------------------------------------

I dunno, I'll post this when I figure it out.

------------------------------------------------------------
License?
------------------------------------------------------------

How about the BSD License, I find that fair.
