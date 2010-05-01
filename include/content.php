<?php
require_once('feeds.php');

function facebook($result, $end)
{
	global $date_format, $facebook_share_feed, $facebook_status_feed;
	
	print "<ul>\n";
	$last_date = "";
    foreach($result as $row)
    {
       // Add style between share entry and status entry
       $data = unserialize($row['data']);
       
       if($data['date'] == $last_date)
		continue;
       else
		$last_date = $data['date'];
		
       print "<li class='rel'>";
       
       $link = urldecode($data['link']);
       $title = preg_replace("/^Mark /","",$data['title']);
       $desc = $data['description'];
       $date = date($date_format,$data['date']);
       preg_match("%</span><span>(.*)</span><span>%s", $desc, $comments);
       preg_match("%<a href=\"(.*?)\" %s",$desc,$real_link);
       if(isset($comments[1]) && !preg_match("%<div>%", $comments[1]))
       		print "<p><a href='".urldecode($real_link[1])."'>$title</a> :: <span class='em'>".$comments[1]."</span></p>";
       else
       		print "<p><a href='$link'>$title</a></p>";
       print "<span class='date'>$date</span>";
       print "</li>\n";
    }
    print "</ul>";
    print "<div class='more'><a href='ajax.php?i=$end&f1=$facebook_share_feed&f2=$facebook_status_feed'>&laquo;more&raquo;</a></div>";
}

function twitter($result, $end)
{
	global $date_format, $twitter_feed;
	
	print "<ul>\n";
    foreach($result as $row)
    {
       print "<li class='rel'>";
       $data = unserialize($row['data']);
       $link = $data['link'];
       $title = $data['title'];
       $desc = $data['description'];
       $title = preg_replace("/griphiam:/","", $title);
       $title = preg_replace('@(https?://([-\w\.]+)+(:\d+)?(/([-\w/_\.]*(\?\S+)?)?)?)@', '<a href="$1">$1</a>', $title); // add links to links
       $title = preg_replace("/@([\w]*)/", "<a href='http://twitter.com/$1'>@$1</a>", $title); // add links to twitter users
       $date = date($date_format,$data['date']);
       print "<p><a href='$link'><img src='images/twitter_mini_profile.jpg'/></a> $title</p>";
       print "<span class='date'>$date</span>";
       print "</li>\n";
    }
    print "</ul>";
    print "<div class='more'><a href='ajax.php?i=$end&f1=$twitter_feed'>&laquo;more&raquo;</a></div>";
}

function greader($result, $end)
{
	global $date_format, $greader_feed;
	
	print "<ul>\n";
    foreach($result as $row)
    {
       print "<li class='rel'>";
       $data = unserialize($row['data']);
       $link = $data['link'];
       $title = $data['title'];
       $desc = $data['description'];
       $date = date($date_format,$data['date']);
       print "<p><a href='$link'>$title</a></p>";
       print "<span class='date'>$date</span>";
       print "</li>\n";
    }
    print "</ul>";
    print "<div class='more'><a href='ajax.php?i=$end&f1=$greader_feed'>&laquo;more&raquo;</a></div>";
}

function blog($result, $end)
{
	global $date_format, $blog_feed;
	
	print "<ul>\n";
    $last_title = "";
    foreach($result as $row)
    {
       $data = unserialize($row['data']);
       $title = $data['title'];
       if($title == $last_title)
		continue;
       else
		$last_title = $title;
       $desc = $data['description'];
       $link = $data['link'];
       $thumb = isset($data['thumbnail']) ? $data['thumbnail'] : "";
       
       print "<li class='rel'>";
       	if(preg_match('/add-to-any/', $thumb))
       		print "<h2><a href='$link' title='$title'>$title</a></h2>\n";
       	else
       		print "<h2><a href='$link' rel='$thumb' class='preview' title='$title'>$title</a></h2>\n";
       $date = date($date_format,$data['date']);
       	print "<p>$desc</p>";
       	print "<span class='date'>$date</span>";
       	print "</li>\n";
    }
    print "</ul>";
    print "<div class='more'><a href='ajax.php?i=$end&f1=$blog_feed'>&laquo;more&raquo;</a></div>";
}

function flickr($result, $end)
{
	global $flickr_feed;
	
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
    print "<div class='more'><a href='ajax.php?i=$end&f1=$flickr_feed'>&laquo;more&raquo;</a></div>";
}

function youtube($result, $end)
{
	global $youtube_feed;
	
	foreach($result as $row)
    {
       $data = unserialize($row['data']);
       $link = urldecode($data['link']);
       $thumb = isset($data['thumbnail']) ? $data['thumbnail'] : 'images/default.jpg';
       $title = $data['title'];
       //print_r($data);
       print "<a href='$link' title='$title'>\n";
       print "<img src='$thumb' alt='$title' />\n";
       print "</a>";
    }
    print "<div class='more'><a href='ajax.php?i=$end&f1=$youtube_feed'>&laquo;more&raquo;</a></div>";
}

function delicious($result, $end)
{
	global $delicious_feed;
	
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
    print "<div class='more'><a href='ajax.php?i=$end&f1=$delicious_feed'>&laquo;more&raquo;</a></div>";
}

function goodreads($result, $end)
{
	global $goodreads_feed;
	
	foreach($result as $row)
    {
       $data = unserialize($row['data']);
       $link = preg_replace('/\?.*/','',trim($data['link'])); // Remove query paramters from link
       $thumb = trim($data['thumbnail']);
       $title = trim($data['title']);
       $desc = trim($data['description']);
       $image = trim($data['image']);
       print "<a href='$link' rel='$image' class='preview' title=\"$title\">\n";
       print "<img src='$thumb' alt=\"$title\" />\n";
       print "</a>";
    }
    print "<div class='more'><a href='ajax.php?i=$end&f1=$goodreads_feed'>&laquo;more&raquo;</a></div>";
}

function github($result, $end)
{
	global $date_format, $github_feed;
	
	print "<ul>\n";
	$last_date = "";
    foreach($result as $row)
    {
       
       $data = unserialize($row['data']);
       $link = $data['link'];
       $title = $data['title'];
       if($data['date'] == $last_date)
		continue;
       else
		$last_date = $data['date'];
       $desc = $data['description'];
       $rep_bak;
       preg_match("%github\.com/(.*)/commits.*%",$link,$rep_back);
       $rep = isset($data['repository']) ? $data['repository'] : $rep_back[1];
       $date = date($date_format,$data['date']);
       print "<li>";
       print "<p>Commited <a href='$link'>$title</a> to <a href='http://github.com/$rep'>$rep</a> [$date]</p>";
       print "</li>\n";
    }
    print "</ul>";
    print "<div class='more'><a href='ajax.php?i=$end&f1=$github_feed'>&laquo;more&raquo;</a></div>";
}
?>
