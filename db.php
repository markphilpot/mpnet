<?php

require_once('include/config.php');

try
{
	$query = "select e.id, e.feed, e.data from wp_lifestream_event e left outer join wp_lifestream_search s on e.id = s.id where s.id is null";
	$insert = "insert into wp_lifestream_search values (:id, :feed, :data)";
	
   	$db = new PDO("mysql:host=$host;dbname=$database", $user);
   	$query_stmt = $db->prepare($query);
   	$insert_stmt = $db->prepare($insert);
   	
   	$query_stmt->execute();
	$result = $query_stmt->fetchAll();
	
	foreach($result as $row)
	{
		$id = $row['id'];
		$feed = $row['feed'];
		$data = $row['data'];
		
		$insert_stmt->bindParam(':id', $id, PDO::PARAM_INT);
		$insert_stmt->bindParam(':feed', $feed, PDO::PARAM_STR, 32);
	    $insert_stmt->bindParam(':data', $data, PDO::PARAM_STR, 1000);
	    
	    $insert_stmt->execute();
	}
	
	$db = null;
}
catch(PDOException $e)
{
   	print "<h3>This is a test of the emergency broadcast system. This is only a test</h3>";
   	die();
}

?>