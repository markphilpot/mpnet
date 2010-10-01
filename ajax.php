<?php
require_once('include/config.php');
require_once('include/feeds.php');
require_once('include/content.php');

$index = $_REQUEST['i'];
$feed1 = $_REQUEST['f1'];
$feed2 = isset($_REQUEST['f2']) ? $_REQUEST['f2'] : "" ; // optional

try
{
   $db = new PDO("mysql:host=$host;dbname=$database", $user);
   $statement = $db->prepare($base_sql_range);
   $statement_combine = $db->prepare($base_sql_combine_range);

	//Facebook
	if($feed1 == $facebook_share_feed || $feed1 == $facebook_status_feed)
	{
	    $limit = 5;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement_combine->bindParam(':feed1', $facebook_share_feed, PDO::PARAM_INT);
	    $statement_combine->bindParam(':feed2', $facebook_status_feed, PDO::PARAM_INT);
	    $statement_combine->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement_combine->bindParam(':limit2', $limit, PDO::PARAM_INT);

	    $statement_combine->execute();
	    $result = $statement_combine->fetchAll();

	    facebook($result, $end);
	 }
	 else if($feed1 == $twitter_feed)
	 {
	 	$limit = 5;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $twitter_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    twitter($result, $end);
	    
	 }
	 else if($feed1 == $greader_feed)
	 {
	 	$limit = 5;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $greader_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    greader($result, $end);
	    
	 }
	 else if($feed1 == $blog_feed)
	 {
	 	$limit = 5;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $blog_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    blog($result, $end);
	    
	 }
	 else if($feed1 == $flickr_feed)
	 {
	 	$limit = 21;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $flickr_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    flickr($result, $end);
	    
	 }
	 else if($feed1 == $youtube_feed)
	 {
	 	$limit = 8;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $youtube_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    youtube($result, $end);
	    
	 }
	 else if($feed1 == $delicious_feed)
	 {
	 	$limit = 5;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $delicious_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    delicious($result, $end);
	    
	 }
	 else if($feed1 == $goodreads_feed)
	 {
	 	$limit = 20;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $goodreads_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    goodreads($result, $end);
	    
	 }
	 else if($feed1 == $github_feed)
	 {
	 	$limit = 5;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $github_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    github($result, $end);
	    
	 }
	 else if($feed1 == $steam_feed)
	 {
	 	$limit = 5;
	    $start = (int)$index;
	    $end = $start+$limit;
	    $statement->bindParam(':feed', $steam_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit1', $start, PDO::PARAM_INT);
	    $statement->bindParam(':limit2', $limit, PDO::PARAM_INT);
	    
	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    steam($result, $end);
	    
	 }
}
catch(PDOException $e)
{
   print "<h2>DB Error</h2>";
}

$db = null;

?>
