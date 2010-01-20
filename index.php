<?php

require_once('include/config.php');
//select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id order by t1.timestamp desc limit 5

$blog_feed = 19;
$flickr_feed = 12;
$facebook_share_feed = 6;
$facebook_status_feed = 18;
$delicious_feed = 7;
$twitter_feed = 11;
$goodreads_feed = 13;

$db;
$base_sql = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id where t2.id = :feed order by t1.timestamp desc limit :limit";
$statement;

try
{
   $db = new PDO("mysql:host=$host;dbname=$database", $user, $pass);
   $statement = $db->prepare($base_sql);
}
catch(PDOException $e)
{
   print $e->getMessage();
   die();
}

?>

<!DOCTYPE html lang="en">
<head>
   <meta charset="utf-8">
   <link rel="stylesheet" href="style.css" type="text/css"/>
   <title>Mark Philpot</title>
</head>

<body>

   <div id="menu">
   </div> <!-- end menu -->

   <div id="content">
      <div id="header">
	 <div id="logo" class="description">
	    <h1>markphilpot.net</h1>
	 </div> <!-- end logo -->
	 <div id="bio" class="content">
	    <p>My name is Mark Philpot and I'm a software engineer in the San Francisco, Bay Area.</p>
	 </div> <!-- end bio -->
      </div> <!-- end header -->

      <div id="blog">
	 <div class="description">
	    <h4>Blog Posts</h4>
	    <p>Occasionally I need to write something longer than 140 characters, post a picture or comment on a video.</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $blog_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    foreach($result as $row)
	    {
	       $data = unserialize($row['data']);
	       $title = $data['title'];
	       $desc = $data['description'];
	       $link = $data['link'];
	       $thumb = $data['thumbnail'];
	       print "<h2><a href='$link' title='$title'>$title</a></h2>\n";
	       print "<p>$desc</p>\n";
	    }
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end blog -->

      <div id="flickr">
	 <div class="description">
	    <h4>Photography</h4>
	    <p>Aspiring amature photographer</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 10;
	    $statement->bindParam(':feed', $flickr_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    foreach($result as $row)
	    {
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $thumb = $data['thumbnail'];
	       $title = $data['title'];
	       print "<a href='$link' title='$title'>\n";
	       print "<img src='$thumb' alt='$title' />\n";
	       print "</a>";
	    }
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end flickr -->

   </div> <!-- end content -->
</body>

</html>

<?php
$db = null;
?>
