<?php
require_once('include/config.php');
require_once('include/feeds.php');

$index = $_REQUEST['i'];
$feed1 = $_REQUEST['f1'];
$feed2 = $_REQUEST['f2']; // optional

try
{
   $db = new PDO("mysql:host=$host;dbname=$database", $user);
   $statement = $db->prepare($base_sql_range);
   $statement_combine = $db->prepare($base_sql_combine_range);
}
catch(PDOException $e)
{
   print $e->getMessage();
   die();
}

//Facebook
if($feed1 == $facebook_share_feed || $feed1 == $facebook_status_feed)
{
	try
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

	    print "<ul>\n";
	    foreach($result as $row)
	    {
	       // Add style between share entry and status entry
	       print "<li class='rel'>";
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $title = preg_replace("/^Mark /","",$data['title']);
	       $desc = $data['description'];
	       $date = date($date_format,$data['date']);
	       preg_match("%</span><span>(.*)</span><span>%s", $desc, $comments);
	       preg_match("%<a href=\"(.*?)\" %s",$desc,$real_link);
	       if(isset($comments[1]))
	       		print "<p><a href='".$real_link[1]."'>$title</a> :: <span class='em'>".$comments[1]."</span></p>";
	       else
	       		print "<p><a href='$link'>$title</a></p>";
	       print "<span class='date'>$date</span>";
	       print "</li>\n";
	    }
	    print "</ul>";
	    
	    print "<div class='more'><a href='ajax.php?i=$end&f1=$facebook_share_feed&f2=$facebook_status_feed'>&laquo;more&raquo;</a></div>";
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
}

?>