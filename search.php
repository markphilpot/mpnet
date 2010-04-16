<?php

require_once('include/config.php');

try
{
	$q = strtolower($_GET["q"]);
	$limit = (int)$_GET["limit"];
	if (!$q) return;
	
	if($q == "sit" || $q == "site") return;
	
	$site_query = "select * from wp_lifestream_search where feed = :feed and data like :match order by id desc limit :limit";
	$feed_query = "select distinct feed from wp_lifestream_feeds where feed like :match order by feed limit :limit";
	$query = "select * from wp_lifestream_search where data like :match order by id desc limit :limit";
	
	$db = new PDO("mysql:host=$host;dbname=$database", $user);
   	$site_stmt = $db->prepare($site_query);
   	$feed_stmt = $db->prepare($feed_query);
   	$query_stmt = $db->prepare($query);
	
	if(preg_match("/^site:([\w]+?) ([\w]+)/", $q, $match))
	{
		$m = "%".$match[2]."%";
		$site_stmt->bindParam(":feed", $match[1], PDO::PARAM_STR, 32);
		$site_stmt->bindParam(":match", $m, PDO::PARAM_STR, 75);
		$site_stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
		$site_stmt->execute();
		
		if($site_stmt->rowCount() == 0) return;
		
		$result = $site_stmt->fetchAll();
		
		foreach($result as $row)
		{
			$data = unserialize($row['data']);
			$link = $data['link'];
			$title = $data['title'];
			
			print $title."|".$link."\n";
		}
	}
	elseif(preg_match("/^site:([\w]+?)/", $q, $match))
	{
		$m = $match[1]."%";
		$feed_stmt->bindParam(":match", $m, PDO::PARAM_STR);
		$feed_stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
		$feed_stmt->execute();
		
		if($feed_stmt->rowCount() == 0) return;
		
		$result = $feed_stmt->fetchAll();
		
		foreach($result as $row)
		{
			print "site:".$row['feed']."\n";
		}
	}
	elseif(preg_match("/^site:/", $q, $match))
	{
		foreach($db->query("select distinct feed from wp_lifestream_feeds") as $row)
		{
			print "site:".$row['feed']."\n";
		}
	}
	else
	{
		$m = "%".$q."%";
		$query_stmt->bindParam(":match", $m, PDO::PARAM_STR);
		$query_stmt->bindParam(":limit", $limit, PDO::PARAM_INT);
		$query_stmt->execute();

		if($query_stmt->rowCount() == 0) return;
		
		$result = $query_stmt->fetchAll();
		
		foreach($result as $row)
		{
			$data = unserialize($row['data']);
			$link = $data['link'];
			$title = $data['title'];
			
			print $title."|".$link."\n";
		}

	}
	
	$db = null;
}
catch(PDOException $e)
{
   	print "<h3>This is a test of the emergency broadcast system. This is only a test</h3>";
   	die();
}

?>