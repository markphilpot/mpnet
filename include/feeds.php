<?php
$blog_feed = 19;
$flickr_feed = 12;
$facebook_share_feed = 6;
$facebook_status_feed = 18;
$delicious_feed = 7;
$twitter_feed = 11;
$goodreads_feed = 13;
$github_feed = 16;
$greader_feed = 5;
$youtube_feed = 10;
$visualizeus_feed = 4;

$db;
$base_sql = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id where t2.id = :feed order by t1.timestamp desc limit :limit";
$base_sql_range = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id where t2.id = :feed order by t1.timestamp desc limit :limit1, :limit2";
$base_sql_combine = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id where t2.id = :feed1 or t2.id = :feed2 order by t1.timestamp desc limit :limit";
$base_sql_combine_range = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id where t2.id = :feed1 or t2.id = :feed2 order by t1.timestamp desc limit :limit1, :limit2";
$statement;
$statment_combine;

$date_format = "n.j.Y";
?>