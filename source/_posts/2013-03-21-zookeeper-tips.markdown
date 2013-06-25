---
layout: post
title: "Operational problems with Zookeeper"
date: 2013-03-21 23:56
comments: true
categories: 
    - zookeeper
    - java
    - tips
    - hadoop
    - touk
---

This post is a summary of what has been presented by Kathleen Ting on
StrangeLoop conference. You can watch the original here:
<http://www.infoq.com/presentations/Misconfiguration-ZooKeeper>

I've decided to put this selection here for quick reference.

Connection mismanagement
-----------------------

* too many connections 

        WARN [NIOServerCxn.Factory: 0.0.0.0/0.0.0.0:2181:NIOServerCnxn$Factory@247] - Too many connections from /xx.x.xx.xxx - max is 60

 - running out of ZK connections?
    - set `maxClientCnxns=200` in `zoo.cfg`
 - HBase client leaking connections?
    - fixed in HBASE-3777, HBASE-4773, HBASE-5466
    - manually close connections

* connection closes prematurely

        ERROR: org.apache.hadoop.hbase.ZooKeeperConnectionException: HBase is able to connect to ZooKeeper but the connection closes immediately.
 - in `hbase-site.xml` set `hbase.zookeeper.recoverable.waittime=30000ms`

* pig hangs connecting to HBase

        WARN org.apache.zookeeper.ClientCnxn: Session 0x0 for server null, unexpected error, closing socket connection and attempting reconnect java.net.ConnectionException: Connection refused!

    **CAUSE:** location of ZK quorum is not known to Pig

    - use Pig 10, which includes PIG-2115
    - if there is an overlap between TaskTrackers and ZK quorum nodes
        - set `hbase.zookeeper.quorum` to final in `hbase-site.xml`
        - otherwise add `hbaze.zoopeeker.quorum=hadoophbasemaster.lan:2181` in `pig.properties`

Time mismanagement
------------------

* client session timed out

        INFO org.apache.zookeeper.server.ZooKeeperServer: Expiring session <id>, timeout of 40000ms exceeded

    - ZK and HBase need the same session timeout values
        - `zoo.cfg`: `maxSession=Timeout=180000`
        - `hbase-site.xml`: `zookeeper.session.timeout=180000`
    - don't co-locate ZK with IO-intense DataNode or RegionServer
    - specify right amount of heap and tune GC flags
        - turn on parallel/CMS/incremental GC

* clients lose connections

        WARN org.apache.zookeeper.ClientCnxn - Session <id> for server <name>, unexpected error, closing socket connection and attempting reconnect java.io.IOException: Broken pipe

    - don't use SSD drive for ZK transaction log

Disk management
---------------

* unable to load database - unable to run quorum server

        FATAL Unable to load database on disk !  java.io.IOException: Failed to process transaction type: 2 error: KeeperErrorCode = NoNode for <file> at org.apache.zookeeper.server.persistence.FileTxnSnapLog.restore(FileTxnSnapLog.java:152)!

    - archive and wipe `/var/zookeeper/version-2` if other two ZK servers
      are running

* unable to load database - unreasonable length exception

        FATAL Unable to load database on disk java.io.IOException: Unreasonable length = 1048583 at org.apache.jute.BinaryInputArchive.readBuffer(BinaryInputArchive.java:100)

    - server allows a client to set data larger than the server can read from disk
    - if a znode is not readable, increase `jute.maxbuffer`
        - look for `"Packet len <xx> is out of range"` in the client log
        - increase it by 20%
        - set in `JVMFLAGS="-Djute.maxbuffer=yy" bin/zkCli.sh`
        - fixed in ZOOKEEPER-1513

* failure to follow leader

        WARN org.apache.zookeeper.server.quorum.Learner: Exception when following the leader java.net.SocketTimeoutException: Read timed out 

    **CAUSE:**
    - disk IO contention, network issues
    - ZK snapshot is too large (lots of ZK nodes)

    **SOLVE:**
    - reduce IO contention by putting dataDir on dedicated spindle
    - increase initLimit on all ZK servers and restart, see
      ZOOKEEPER-1521
    - monitor network


Best Practices
-------------
**DOs**

* separate spindles for dataDir & dataLogDir
* allocate 3 or 5 ZK servers
* tune garbage collection
* run zkCleanup.sh script via cron

**DON'Ts**

* dont' co-locate ZK with I/O intense DataNode or RegionServer
* don't use SSD drive for ZK transaction log


You may use Zookeeper as an observer - a non-voting member:

* in zoo.cfg

        peerType=observer
