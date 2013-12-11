---
layout: post
title: "Distributed scans with HBase"
date: 2013-12-10 21:26
comments: true
categories: 
    - it
    - touk
    - hbase
    - hadoop    
---
HBase is by design a columnar store, that is optimized for random reads.
You just ask for a row using rowId as an identifier and you get your
data instantaneously. 

Performing a scan on part or whole table is a completely different thing.
First of all, it is sequential. Meaning it is rather slow, because it
doesn't use all the RegionServers at the same time. It is implemented
that way to realize the contract of Scan command - which has to return
results sorted by key.

So, how to do this efficiently?

<!-- more -->

The usual way of getting data from HBase is with the help of its API,
mainly Scan objects. To accomplish the task I'll use just them. I'll
specify startRow and stopRow, so that each Scan request will be looking
through only part of the key space.

It is crucial to note, that this whole solution works because of key
sorting properties in HBase. So, HBase scans a table according to ascending key
values. Since keys are of String type, key with value "1" is smaller
than "2", because they are sorted lexicographicly. So, also key with value "12345" is smaller than "2". I've
leveraged this property so that I've partitioned my whole key space according to
the first character of the key. In my case keys contain only digits. So I
have 10 ranges:

- null-1
- 1-2
- 2-3
- 3-4
- 4-5
- 5-6
- 6-7
- 7-8
- 8-9
- 9-null

The speedup comes from the fact, that each range resides in its own
partition. That's right, I've presplit the table to have 10 partitions.
This corresponds rather nicely with my cluster's setup, because I have
more than 10 RegionServers. So every partition should be on different
RegionServer. It will allow the code to do the requested scan operations
in parallel - giving me this exact performance boost.

How I've created the input table:

<code>

$ create 'tariff_changes', { NAME => 'cf', SPLITS_FILE => 'splits.txt', VERSIONS => 50, MAX_FILESIZE => 1073741824 }

$ alter 'tariff_changes', { NAME => 'cf', SPLITS_FILE => 'splits.txt', VERSIONS => 50, MAX_FILESIZE => 1073741824 }

</code>

Split file is just something along this lines:

<code>
1
2
3
4
5
6
7
8
9
0
</code>

This tells HBase what are the rowKeys starting and ending each of the
partitions.

Ok, so after this rather lengthy introduction, what the actual code
does? It just spins of a few threads - one for each partition - and runs
a Scan request tailored to that partitions key space. This way, I got a
10x speedup for this particular scan. The execution time went down from
30 minutes to 3 for my use case.

I've created an example implementation of this idea. You can find it on
GitHub:
[https://github.com/zygm0nt/hbase-distributed-search](https://github.com/zygm0nt/hbase-distributed-search).

Any ideas on how to speed things up even more with HBase?
