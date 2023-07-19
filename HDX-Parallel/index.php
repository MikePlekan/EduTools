
<!DOCTYPE html>
<html lang="en">
<?php

  if (!file_exists("tmlib/tmphpfuncs.php")) {
    echo "<h1 style='color: red'>Could not find file <tt>".__DIR__."/tmlib/tmphpfuncs.php</tt> on server.  <tt>".__DIR__."/tmlib</tt> should contain or be a link to a directory that contains a Travel Mapping <tt>lib</tt> directory.</h1>";
    exit;
  }

 require "tmlib/tmphpfuncs.php";


?>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>HDX Parallel</title>
  <link rel="icon" href="MetalBetaLogoSmall.png"/>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
    integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
    crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.8.0/dist/leaflet.js"
    integrity="sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ=="
    crossorigin=""></script>
  <link rel="stylesheet" href="HDXP-style.css" />
  <script src="HDXP-globals.js" type="text/javascript"></script>
  <script src="HDXP-partitioning.js" type="text/javascript"></script>
  <script src="HDXP-waypoint.js" type="text/javascript"></script>
  <script src="HDXP-edge.js" type="text/javascript"></script>
  <script src="HDXP-controlPanel.js" type="text/javascript"></script>
  <script src="HDXP-thread.js" type="text/javascript"></script>
  <script src="HDXP-scheduler.js" type="text/javascript"></script>
  <script src="HDXP-loader.js" type="text/javascript"></script>
  <script src="HDXP-pages.js" type="text/javascript"></script>
  <script src="HDXP-map.js" type="text/javascript"></script>
  <script src="HDXP-AVvxs.js" type="text/javascript"></script>
  <script src="HDXP-AVvds.js" type="text/javascript"></script>
  <script src="HDXP-script.js" type="text/javascript" defer></script>
</head>

<body>
  <!-- Header which holds a title to the left and a start/stop button to the right -->
  <header id="header"></header>

  <div id="controlPanel"></div>

  <div id="main-content" class="maps even"></div>
</body>

</html>
<?php tmdb_close();?>