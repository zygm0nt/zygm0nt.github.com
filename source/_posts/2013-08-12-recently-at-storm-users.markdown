---
layout: post
title: "Recently at storm-users"
date: 2013-08-12 22:26
comments: true
categories: 
    - touk
    - it
    - storm
---
I've been reading through storm-users Google Group recently. This
resolution was heavily inspired by Adam Kawa's post ["Football zero,
Apache Pig hero"][1]. Since I've encountered a lot of insightful and very interesting
information I've decided to describe some of those in this post.

<!-- more -->

- nimbus will work in HA mode - There's a pull request open for it already... but some
recent work (distributing topology files via Bittorrent) will greatly
simplify the implementation. Once the Bittorrent work is done we'll look
at reworking the HA pull request. (storm’s pull request
https://github.com/nathanmarz/storm/pull/629)

- pig on storm - Pig on Trident would be a cool and welcome project. Join
and groupBy have very clear semantics there, as those concepts exist
directly in Trident. The extensions needed to Pig are the concept of
incremental, persistent state across batches (mirroring those concepts
in Trident). The proposal is here: 
(https://cwiki.apache.org/confluence/display/PIG/Pig+on+Storm+Proposal)

- implementing topologies in pure python (https://github.com/AirSage/Petrel) 

>     class Bolt(storm.BasicBolt):
>         def initialize(self, conf, context):
>            ''' This method executed only once '''
>             storm.log('initializing bolt')
>         
>         def process(self, tup):
>            ''' This method executed every time a new tuple arrived '''       
>            msg = tup.values[0]
>            storm.log('Got tuple %s' %msg)
>                      
>     if __name__ == "__main__":
>         Bolt().run()

- Fliptop is happy with storm - see their presentation here http://www.slideshare.net/robbiecheng/lesson-learned-of-twitter-storm

- topology metrics in 0.9.0: The new metrics feature allows you to collect
arbitrarily custom metrics over fixed windows. Those metrics are
exported to a metrics stream that you can consume by implementing
[IMetricsConsumer][2] and configure with [Config.java#L473][3].
Use **TopologyContext#registerMetric** to register new metrics.


- storm vs flume - some users' point of view: I use Storm and Flume and find that they are better at
different things - it really depends on your use case as to which one is
better suited. First and foremost, they were originally designed to do
different things: Flume is a reliable service for collecting,
aggregating, and moving large amounts of data from source to destination
(e.g. log data from many web servers to HDFS). Storm is more for
real-time computation (e.g. streaming analytics) where you analyse data
in flight and don't necessarily land it anywhere. Having said that,
Storm is also fault-tolerant and can write to external data stores (e.g.
HBase) and you can do real-time computation in Flume (using
interceptors)

That's all for this day - however, I'll keep on reading through storm-users, so watch this space for more info on storm development.

  [1]: http://hakunamapdata.com/football-zero-apache-pig-hero-the-essence-from-hundreds-of-posts-from-apache-pig-user-mailing-list/
  [2]: https://github.com/nathanmarz/storm/blob/master/storm-core/src/jvm/backtype/storm/metric/api/IMetricsConsumer.java
  [3]: https://github.com/nathanmarz/storm/blob/master/storm-core/src/jvm/backtype/storm/Config.java#L473

