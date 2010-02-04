<?php
require_once('include/config.php');

// Used to see what keys are available in the feed data

$base_sql = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id order by t1.timestamp desc limit 100";

try
{
   	$db = new PDO("mysql:host=$host;dbname=$database", $user);
   	$statement = $db->prepare($base_sql);
   
   	$feed_seen = array();
   
   	$statement->execute();
	$result = $statement->fetchAll();
	
	foreach($result as $row)
	{
		//if(!array_key_exists($row['feed'], $feed_seen))
		{
			$feed_seen[$row['feed']] = true;
			echo "<h1>".$row['feed']."</h1>\n";
			//print_r(array_keys(unserialize($row['data'])));
			foreach(unserialize($row['data']) as $key=>$val)
			{
				echo "<b>$key</b> : $val<br/>\n";
			}
		}
	}
}
catch(PDOException $e)
{
   print $e->getMessage();
   die();
}



?>