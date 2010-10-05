<?php

// config.php contains the variables required to connect to the database:
// $host, $database, $user, $pass
require_once('include/config.php');
require_once('include/feeds.php');
require_once('include/content.php');


try
{
   $db = new PDO("mysql:host=$host;dbname=$database", $user);
   $statement = $db->prepare($base_sql);
   $statement_combine = $db->prepare($base_sql_combine);
}
catch(PDOException $e)
{
   print "<h3>This is a test of the emergency broadcast system. This is only a test</h3>";
   die();
}

?>

<!DOCTYPE html>
<head>
   <meta charset="utf-8">
   <link rel="stylesheet" href="style.css" type="text/css"/>
   <title>Mark Philpot</title>
   <script type="text/javascript" src="lib/jquery-1.4.1.min.js"></script>
   <script type="text/javascript" src="lib/jquery-lightbox-0.5/js/jquery.lightbox-0.5.js"></script>
   <script type="text/javascript" src="lib/jquery.preview.js"></script>
   <script type="text/javascript" src="lib/jquery-autocomplete/jquery.autocomplete.js"></script>
   <script type="text/javascript" src="lib/ContentFlow/contentflow_src.js" load="white"></script>
   <link rel="stylesheet" type="text/css" href="lib/jquery-lightbox-0.5/css/jquery.lightbox-0.5.css" media="screen" />
   <link rel="stylesheet" type="text/css" href="lib/jquery-autocomplete/jquery.autocomplete.css"/>
   
   <link rel="alternate" type="application/atom+xml" href="http://www.markphilpot.net/atom"/>
</head>

<body>
	
	<div id="spinner"></div>

   <div id="content">
      <div id="header">
	 <div id="logo" class="description">
	    <h1>markphilpot.net</h1>
	 </div> <!-- end logo -->
	 <div id="bio" class="content">
	    <p>My name is Mark Philpot and I'm a software engineer in the San Francisco, Bay Area.</p>
	    <p>This space is my social networking footprint (lifestream).</p>
	 </div> <!-- end bio -->
      </div> <!-- end header -->
      
      <div id="search">
        <div class="description">&nbsp;</div>
        <div class="content"><input type="text" id="search_box" size="100"/></div>
      </div>

      <div id="blog">
	 <div class="description">
	    <h4>Blog Posts</h4>
	    <p>Occasionally I need to write something longer than 140 characters, post a picture or comment on a video.</p>
	    <p><a href="http://blog.mcstudios.net">turn on | tune in | strung out</a></p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $blog_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    blog($result, $limit);
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end blog -->
      
      <div id="greader">
	 <div class="description">
	    <h4>Feed Reader</h4>
	    <p>Things I find interesting in my daily feeds</p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $greader_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    greader($result, $limit);
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end greader -->

      <div id="facebook">
	 <div class="description">
	    <h4>Facebook</h4>
	    <p>Essential social networking</p>
	    <p><a href="http://www.facebook.com/mark.philpot">Facebook Profile</a></p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement_combine->bindParam(':feed1', $facebook_share_feed, PDO::PARAM_INT);
	    $statement_combine->bindParam(':feed2', $facebook_status_feed, PDO::PARAM_INT);
	    $statement_combine->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement_combine->execute();
	    $result = $statement_combine->fetchAll();

	    facebook($result, $limit);
	    
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
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $twitter_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	 	twitter($result, $limit);   	 
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
	    <p><a href="http://flickr.com/photos/markphilpot">Flickr Gallery</a></p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 21;
	    $statement->bindParam(':feed', $flickr_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    flickr($result, $limit);
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end flickr -->
      
      <div id="youtube">
	 <div class="description">
	    <h4>Video</h4>
	    <p>My uploads and favorites</p>
	    <p><a href="http://www.youtube.com/user/griphiam">Youtube Profile</a></p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 8;
	    $statement->bindParam(':feed', $youtube_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    youtube($result, $limit);
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end flickr -->

      <div id="delicious">
	 <div class="description">
	    <h4>Delicious</h4>
	    <p>My link collection</p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 5;
	    $statement->bindParam(':feed', $delicious_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    delicious($result, $limit);
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
	    <p>What I've recently read</p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 20;
	    $statement->bindParam(':feed', $goodreads_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    goodreads($result, $limit);
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end goodreads -->
      
    <div id="netflix">
	 <div class="description">
	    <h4>Movies</h4>
	    <p>What's current going through my queue...</p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 30; // large enough to have 16 entries
	    $statement->bindParam(':feed', $netflix_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    netflix($result, $limit);
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end netflix -->
      
      <div id="github">
	 <div class="description">
	    <h4>Development</h4>
	    <p>Personal development streams from my <a href="http://github.com/griphiam">github</a> repositories</p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 7;
	    $statement->bindParam(':feed', $github_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();

	    github($result, $limit);
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end github -->

    <div id="steam">
        <div class="description">
            <h4>Gaming</h4>
            <p>Letting the steam out...</p>
        </div>
        <div class="content rel">
        <?php
        try
        {
            $limit = 5;
            $statement->bindParam(':feed', $steam_feed, PDO::PARAM_INT);
            $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

            $statement->execute();
            $result = $statement->fetchAll();

            steam($result, $limit);
        }
     catch(PDOException $e)
     {
        print "<h2>DB Error</h2>";
     }
        ?>
        </div>
    </div> <!-- end steam -->
      
      <div id="visualizeus">
	 <div class="description">
	    <h4>Image Bookmarking</h4>
	    <p>Help hone my own photography by studing the works of others via <a href="http://vi.sualize.us/griphiam">vi.sualize.us</a>. In general tagging interesting images around the net.</p>
	 </div>
	 <div class="content rel">
	 <?php
	 try
	 {
	    $limit = 20;
	    $statement->bindParam(':feed', $visualizeus_feed, PDO::PARAM_INT);
	    $statement->bindParam(':limit', $limit, PDO::PARAM_INT);

	    $statement->execute();
	    $result = $statement->fetchAll();
	    
	    $date;
	    $first = true;

	    print "<div id='myflow' class='ContentFlow'>";
	    print "<div class='flow'>\n";
	    foreach($result as $row)
	    {
	    	
	       $data = unserialize($row['data']);
	       $link = $data['link'];
	       $thumb = $data['thumbnail'];
	       $title = $data['title'];
	       $img = $data['image'];
	       $img = preg_replace("/_s/","",$thumb);
	       $title = preg_replace("/'/","",$title); // Firefox doesn't like ' character
	       if($first)
	       {
	       		$first = false;
	       		$date = date($date_format,$data['date']);
	       }
	       
	       //print_r($data);
	       //print "<a href='$img' title='$title'>\n";
	       print "<div class='item'>";
	       print "<img class='flowcontent' src='$thumb' alt='$title' href='$link' target='_blank'/>\n";
	       print "<div class='caption'>$title</div>\n";
	       //print "</a>";
	       print "</div>\n";
	    }
	    print "</div><div class='globalCaption'></div>
	    <div class='scrollbar'>
                <div class='slider'><div class='position'></div></div>
            </div>
	    </div>\n";
	    print "<span class='datebottom'>Last updated: $date</span>";
	 }
	 catch(PDOException $e)
	 {
	    print "<h2>DB Error</h2>";
	 }
	 ?>
	 </div>
      </div> <!-- end flickr -->
      
      <div id="copyright">
      	<p>Copyright 1998-2010 <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/us/"><img alt="Creative Commons License" src="http://i.creativecommons.org/l/by-sa/3.0/us/80x15.png" /></a>
      	 <a href="http://github.com/griphiam/mpnet">src</a> <a href="http://www.markphilpot.net/atom"><img src="images/feed-icon-14x14.png"/></a></p>
      </div> <!-- end copyright -->

</div> <!-- end content -->
      
<script type="text/javascript">

  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-9149255-4']);
  _gaq.push(['_trackPageview']);

  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(ga);
  })();

</script>

<script type="text/javascript">
$(function() {
	lightbox();
	imgPreview();
});

function lightbox()
{
	$('#flickr div.content a').not('div.more a').lightBox({
		imageLoading: 'lib/jquery-lightbox-0.5/images/lightbox-ico-loading.gif',
		imageBtnClose: 'lib/jquery-lightbox-0.5/images/lightbox-btn-close.gif'
	}); // Select all links in object with gallery ID
}

function imgPreview()
{
	$('a.preview').imgPreview({
	    containerID: 'img-preview',
	    distanceFromCursor: {top:-200, left:10},
	    srcAttr: 'rel',
	    // When container is shown:
	    onShow: function(link){
	    	// Animate link:
	    	$(link).stop().animate({opacity:0.4});
	    	// Reset image:
	    	$('img', this).stop().css({opacity:0});
		},
		// When image has loaded:
		onLoad: function(){
	    	// Animate image
	    	$(this).animate({opacity:1}, 400);
		},
		// When container hides: 
		onHide: function(link){
	    	// Animate link:
	    	$(link).stop().animate({opacity:1});
		}
	});
}

var myNewFlow = new ContentFlow('myflow',{
	maxItemHeight : 184,
	startItem : 'first',
	visibleItems : 3
});

$(document).ready(function(){
	$("div.more a").live('click', function(i){
		var div = $(this).parent();
		var link = $(this);
		$.get( this.href, function(data) {
			div.replaceWith(data);
			// Rebind lightbox
			lightbox();
			// Rebind imgPreview
			imgPreview();
		});
		return false;
	});

	// Load search DB
	$("#spinner").show();
	$.ajax({
		  url: "db.php",
		  cache: false,
		  success: function(html){
		    $("#spinner").hide();
		}
	});

	$("#search_box").autocomplete("search.php", {
		minChars: 3,
		formatItem: function(item) {
	    	return item[0];
	    }
	  }).result(
			function(event, item) {
				if(item[1] != undefined) {
					//alert(item[1]);
		  			//location.href = item[1];
		  			window.open(item[1], "_blank");
				}
	});
	
			
	
});

</script>

</body>
</html>

<?php
$db = null;
?>
