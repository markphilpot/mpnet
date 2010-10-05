<?php

include("include/FeedWriter/FeedWriter.php");
require_once("include/config.php");

ini_set('display_errors', '0');

$Feed = new FeedWriter(ATOM);

$Feed->setTitle("Mark Philpot's Lifestream");
$Feed->setLink('http://www.markphilpot.net/atom');

$Feed->setChannelElement('updated', date(DATE_ATOM , time()));
$Feed->setChannelElement('author', array('name'=>'Mark Philpot'));

try
{
	$base_sql = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id order by t1.timestamp desc limit 20";
	
   	$db = new PDO("mysql:host=$host;dbname=$database", $user);
   	$statement = $db->prepare($base_sql);
   	
   	$statement->execute();
	$result = $statement->fetchAll();
	
	foreach($result as $row)
	{
		$item = $Feed->createNewItem();
		
		$data = unserialize($row['data']);
		
		$item->setTitle(trim($data['title']));
		
		if($row['feed'] == "goodreads" || $row['feed'] == "facebook")
		{
			$link = trim($data['link']);
			$link = preg_replace('/\?.*/','',$link); // remove query parameters from url
			$item->setLink($link);
		}
		else
			$item->setLink(trim($data['link']));
		$item->setDescription(trim($data['description']));
		$item->setDate($data['date']);
		
		$Feed->addItem($item);
	}
	
	$db = null;
}
catch(PDOException $e)
{
   	print $e->getMessage();
   	die();
}

$Feed->genarateFeed();

?>
