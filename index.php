<?php

// config.php contains the variables required to connect to the database:
// $host, $database, $user, $pass
require_once('include/config.php');

$blog_feed = 19;
$flickr_feed = 12;
$facebook_share_feed = 6;
$facebook_status_feed = 18;
$delicious_feed = 7;
$twitter_feed = 11;
$goodreads_feed = 13;
$github_feed = 16;
$googlereader_feed = 5;

$db;
$base_sql = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id where t2.id = :feed order by t1.timestamp desc limit :limit";
$base_sql_combine = "select t1.*, t2.feed, t2.options from wp_lifestream_event as t1 inner join wp_lifestream_feeds as t2 on t1.feed_id = t2.id where t2.id = :feed1 or t2.id = :feed2 order by t1.timestamp desc limit :limit";
$statement;
$statment_combine;

try
{
   $db = new PDO("mysql:host=$host;dbname=$database", $user);
   $statement = $db->prepare($base_sql);
   $statement_combine = $db->prepare($base_sql_combine);
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
   <script type="text/javascript" src="lib/jquery-1.4.1.min.js"></script>
   <script type="text/javascript" src="lib/jquery-lightbox-0.5/js/jquery.lightbox-0.5.js"></script>
   <link rel="stylesheet" type="text/css" href="lib/jquery-lightbox-0.5/css/jquery.lightbox-0.5.css" media="screen" />
</head>

<body>

<script type="text/javascript">
$(function() {
	$('#flickr a').lightBox({
			imageLoading: 'lib/jquery-lightbox-0.5/images/lightbox-ico-loading.gif',
			imageBtnClose: 'lib/jquery-lightbox-0.5/images/lightbox-btn-close.gif'
	}); // Select all links in object with gallery ID
});
</script>

   <div id="content">
      <div id="header">
	 <div id="logo" class="description">
	    <h1>markphilpot.net</h1>
	 </div> <!-- end logo -->
	 <div id="bio" class="content">
	    <p>My name is Mark Philpot and I'm a software engineer in the San Francisco, Bay Area.</p>
	    <p>Fill empty space</p>
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

      <div id="facebook">
	 <div class="description">
	    <h4>Facebook</h4>
	    <p>Share & Share Alike</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement_combine->bindParam(':feed1', $facebook_share_feed, PDO::PARAM_INT);
	    $statement_combine->bindParam(':feed2', $facebook_status_feed, PDO::PARAM_INT);
	    $statement_combine->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement_combine->execute();
	    $result = $statement_combine->fetchAll();

	    print "<ul>\n";
	    foreach($result as $row)
	    {
	       // Add style between share entry and status entry
	       print "<li>";
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $title = $data['title'];
	       $desc = $data['description'];
	       print "<p><a href='$link'>$title</a></p>";
	       print "</li>\n";
	    }
	    print "</ul>";
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end facebook -->

      <div id="twitter">
	 <div class="description">
	    <h4>Twitter</h4>
	    <p>One hundred forty character thoughts...</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $twitter_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    print "<ul>\n";
	    foreach($result as $row)
	    {
	       print "<li>";
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $title = $data['title'];
	       $desc = $data['description'];
	       print "<p>$title</p>";
	       print "</li>\n";
	    }
	    print "</ul>";
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end twitter -->

      <div id="flickr">
	 <div class="description">
	    <h4>Photography</h4>
	    <p>Aspiring amature photographer</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 21;
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
	       $img = $data['image'];
	       $img = preg_replace("/_s/","",$thumb);
	       //print_r($data);
	       print "<a href='$img' title='$title'>\n";
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

      <div id="delicous">
	 <div class="description">
	    <h4>Delicious</h4>
	    <p>My link collection...</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $delicious_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    print "<ul>";
	    foreach($result as $row)
	    {
	       print "<li>";
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $title = $data['title'];
	       $desc = $data['description'];
	       print "<p><a href='$link'>$title</a> $desc</p>";
	       print "</li>";
	    }
	    print "</ul>";
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end delicious -->

      <div id="goodreads">
	 <div class="description">
	    <h4>Goodreads</h4>
	    <p>What I'm reading</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 22;
	    $statement->bindParam(':feed', $goodreads_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    foreach($result as $row)
	    {
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $thumb = $data['thumbnail'];
	       $title = $data['title'];
	       $desc = $data['description'];
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
      </div> <!-- end goodreads -->
      
      <div id="github">
	 <div class="description">
	    <h4>Development</h4>
	    <p>Personal development streams from github</p>
	 </div>
	 <div class="content">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $github_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    print "<ul>\n";
	    foreach($result as $row)
	    {
	       print "<li>";
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $title = $data['title'];
	       $desc = $data['description'];
	       $rep_bak;
	       preg_match("%github\.com/(.*)/commits.*%",$link,$rep_back);
	       $rep = isset($data['repository']) ? $data['repository'] : $rep_back[1];
	       print "<p>Commited <a href='$link'>$title</a> to <a href='http://github.com/$rep'>$rep</a></p>";
	       print "</li>\n";
	    }
	    print "</ul>";
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end github -->

   </div> <!-- end content -->
</body>

</html>

<?php
$db = null;
?>
