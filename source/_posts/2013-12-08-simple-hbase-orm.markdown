---
layout: post
title: "Simple HBase ORM"
date: 2013-12-08 21:08
comments: true
categories: 
    - it
    - touk
    - hadoop
    - hbase
---
When dealing with data stored in HBase, you are quick to come to a
conclusion, that it is extremaly inconvenient to reach to it 
via HBase native API. It is very verbose and you always need to convert
between bytes and simple types - a pain.  

While I was working on a project of mine, I thought, why not to easy
those pains and fetch real objects from HBase.

And that's how this simplistic, hackish ORM came to life. It is no match
for projects like [Kundera](https://github.com/impetus-opensource/Kundera)
(a JPA compliant solution), or [n-orm](https://code.google.com/p/n-orm/). Nevertheless, it just suits my needs :)

<!-- more -->

Project sources are hosted on GitHub: [https://github.com/zygm0nt/hbase-annotations](https://github.com/zygm0nt/hbase-annotations)

To make use of this, you need to have an entity class with annotations:

* @Column - with argument specifying column family and column name, ie.
  @Column("cf:column-name")
* @Id - will store row key in this property, 
* and optionaly @Value - for Spring Expression Language, in case you
  need to perform some extraction on the value.

_Annotations should be on setter methods._

Now you have your model annotated and ready to be fetched from HBase. 

The actual work is done with a service class, that should extend class
[BaseHadoopInteraction](https://github.com/zygm0nt/hbase-annotations/blob/master/src/main/java/pl/touk/hadoop/hbase/BaseHadoopInteraction.java) just as class
[SimpleHBaseClient](https://github.com/zygm0nt/hbase-annotations/blob/master/src/test/java/pl/touk/hadoop/hbase/SampleHBaseClient.java) does.

Then it is possible to just call:

<script src="https://gist.github.com/zygm0nt/7863407.js"></script>

Note that there are more methods you can use on BaseHadoopInteraction.
You can also do:

* scan
* scan with key ranges
* delete

What you won't get from this simple ORM is:

* automatic object updating,
* nested objects,
* saving to HBase - 'cause I didn't have a need for that,

Hope you'll find this piece of code useful. If you see room for
improvements while staying in project's scope - please drop me a
message.

And if you are searching for a full-fledged ORM solution for interacting with HBase, just head
straight to Kundera project website :)
