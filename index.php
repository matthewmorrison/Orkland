<html>
<head>
	<!--<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.css" />
	<script src="http://cdn.leafletjs.com/leaflet-0.7.5/leaflet.js"></script>-->
    
	<script src="leaflet.js"></script>
	<script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>
	<script src="https://code.jquery.com/ui/1.11.4/jquery-ui.min.js"></script>
	<script src="site.js"></script>
	<link rel="stylesheet" href="leaflet.css" />
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.11.4/themes/black-tie/jquery-ui.css" />
	<link rel="stylesheet" href="styles.css" />
</head>
<body>
	<div id="map"></div>
	<div id="menu">
		<div id="menu-top">
			<div id="menu-search">
				<input type="text" placeholder="Search Locations" />
			</div>
			<div id="menu-displayer">
				<a href="#menu" onclick="">show locations</a>
			</div>
		</div>
		<div id="menu-body">
			<ul id="locations">
			
			</ul>
		</div>
	</div>
	<div id="location-dialog">
		<div class="location-edit">
			<div>Location: <span id="location-edit-coordinates"></span></div>
			<div class="location-form">
				<div><input id="location-name" type="text" placeholder="Location Name" /></div>
				<div><textarea id="location-description" placeholder="Location Description"></textarea></div>
				<div><input id="location-tags" type="text" placeholder="tags" /></div>
				<div class="location-save-button"><input type="button" onclick="saveLocation()" value="Save" /></div>
			</div>
		</div>
		<div class="location-saving">
			Saving...
		</div>
	</div>
	<div id="location-template">
		<li class="location-details" data-name="">
			<div class="location-coordinates" >Position: <span data-x="" data-y="" ></span></div>
			<div class="location-name"></div>
			<div class="location-description"></div>
			<div class="location-tags"></div>
		</li>
	</div>

		<?php
			echo '<script>
				var locations = {';
			$dir = new DirectoryIterator('./locations');
			$first = true;
			foreach ($dir as $fileinfo) {
				if (!$fileinfo->isDot()) {
					if(!$first) {
						echo ',';
					}
					else {
						$first = false;
					}
					echo '"'.substr($dir, 0, -4).'": ';
					echo file_get_contents('./locations/'.$fileinfo->getFilename());
				}
			}
			echo '}
			</script>';
		?>	
</body>
</html>