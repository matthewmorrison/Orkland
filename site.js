var currentMarker = null;
var locationsFile = null;
var locationDialog = null;
var locationTemplate = null;
var map = null;

$(function() {
	initMap();
	initLocations();
	initLocationDialog();
	initSearch();
});

function initMap() {		
	map = L.map('map', {
		maxBounds: [
			[0, 0],
			[100, -180]
		]
	}).setView([12, -165], 5);

	map.on('click', function(e) {
		var x = e.latlng.lat.toFixed(3);
		var y = e.latlng.lng.toFixed(3);

		map.setView([x, y]);

		if(currentMarker) {
			map.removeLayer(currentMarker);
		}

		currentMarker = L.marker([x, y]);
		map.addLayer(currentMarker);

		currentMarker.bindPopup('<div>Position: ' + x + ',' + y + '</div><div><a href="#location-dialog" onclick="openLocationDialog(' + x + ', ' + y + ', null)">add location</a></div>').openPopup();
	});

	L.tileLayer('images/tiles/{z}/{x}/{y}.png?', { 
		minZoom: 0, 
		maxZoom: 6,
		noWrap: true
	}).addTo(map);
}

function initLocations() {
	locationTemplate = $('#location-template');
	
	$('#update-locations').on('click', function() {
		
	});

	$('#locations').on('click', 'li', function(e) {
		var li = $(e.currentTarget);
		var x = li.attr('data-x');
		var y = li.attr('data-y');

		map.setView([x, y]);

		if(currentMarker) {
			map.removeLayer(currentMarker);
		}

		currentMarker = L.marker([x, y]);
		map.addLayer(currentMarker);
		
		var popup = '<div class="location-popup">' + li.html() + '<div><a href="#location-template" onclick="openLocationDialog(null, null, \'' + li.find('.location-name').text() + '\')" >edit</div></div></div>';
		
		currentMarker.bindPopup(popup).openPopup();
	});
	
	var ul = $('#locations');
	
	for(var i = 0; i < locations.length; i++) {
		try {
			var li = buildLocation(locations[i].data);
			ul.append(li);
		}
		catch(e){ console.log(e); }
	}
	
	//refreshLocations();
}

function buildLocation(data) {
	var li = $(locationTemplate.html());
	li.attr('data-x', data.x);
	li.attr('data-y', data.y);
	li.attr('data-name', data.name);
	li.find('.location-name').text(data.name);
	li.find('.location-description').html(data.description);
	li.find('.location-tags').text('#' + data.tags);
	
	return li;
}

function initLocationDialog() {
	locationDialog = $( "#location-dialog" ).dialog({
	  autoOpen: false,
	  width: '600px',
	  modal: true
	});
	
	var allowedChars = /[a-zA-z0-9']/;
	
	$( "#location-dialog input, #location-dialog textarea" ).on('keypress', function(e) {
		
	});
}

var searchTimeout = null;

function initSearch() {
	$('#menu-search input').on('keyup', function() {		
		if(searchTimeout) {
			try {
				window.clearTimeout(searchTimeout);
			}
			catch(e){}
		}
		
		searchTimeout = window.setTimeout(function() {
			doSearch();
		}, 300);
	});
	
	$('#menu-displayer').on('click', function() {
		$this = $(this);
		
		if($this.attr('data-open') == 'true') {
			if(!$('#menu-search input').val().length) {
				$this.attr('data-open', 'false');
			}
			
			$('#locations li').css('display', 'block');
		}
		else {
			if(!$('#menu-search input').val().length) {
				$this.attr('data-open', 'true');
			}
			
			$('#locations li').css('display', 'block');
		}
		
		$('#menu-search input').val('');
		updateLocationState();
	});
}

function updateLocationState() {
	var searching = $('#menu-search input').val().length;
	
	if($('#menu-displayer').attr('data-open') == 'true' || searching) {
		$('#menu-body').css('display', 'block');
		
		if(searching) {
			$('#menu-displayer').text('end search');
		}
		else {
			$('#menu-displayer').text('hide locations');
		}
	}
	else {
		$('#menu-body').css('display', 'none');
		$('#menu-displayer').text('show locations');
	}
}

function doSearch() {
	var showAll = false;
	var q = $('#menu-search input').val();
	
	if(!q || q.length < 1) {
		
	}
	else {
		$('#menu-displayer').text('hide locations');
	}
	
	updateLocationState();
	
	$('#locations li').each(function(index, item) {
		var $item = $(item);
		var name = $item.find('.location-name').text().toLowerCase();
		var tags = $item.find('.location-tags').text().toLowerCase();
		
		if(name.indexOf(q) == -1 && tags.indexOf(q) == -1) {
			$item.css('display', 'none');
		}
		else {
			$item.css('display', 'block');
		}
	});
}

function refreshLocations() {
	$.ajax('locations.html').done(function(data) {
		$('#locations').html(data);
	});
}

function saveLocation() {	
	var name = $('#location-name').val();
	var x = $('#location-edit-coordinates').attr('data-x');
	var y = $('#location-edit-coordinates').attr('data-y');
	var description = $('#location-description').val();
	var tags = $('#location-tags').val();
	var duplicate = false;
	var added = false;
	var data = {
					'name': name,
					'x': x,
					'y': y,
					'description': description,
					'tags': tags
				};
				
	if (!/^([A-Z0-9'."]|\s)+$/gi.test(name + description + tags)) {
		return alert('Invalid characters.');
	}
	
	var lowerName = name.toLowerCase();
	var html = buildLocation(data);// '\r\n<li data-x="' + x + '" data-y="' + y + '"><div class="location-name">' + name + '</div><div class="location-description">' + description + '</div><div class="location-tags">' + tags + '</div></li>';
	
	$('#location-dialog .location-saving').css('display', 'block');
	
	$.ajax('saveLocations.php', {
		method: 'post',
		data: { 
				'name': name, 
				'data': JSON.stringify(data)
		}
	})
	.done(function() {
		locationDialog.dialog('close');
		var li = null;
		var before = null;
		
		$('#locations li').each(function(index, item) {
			var $item = $(item);
			var itemName = $item.find('.location-name').text().toLowerCase();
			
			if(lowerName < itemName) {
				before = html;
				added = true;
			}
			else if (lowerName == itemName) {
				duplicate = true;
				li = $item.replaceWith(html);
			}
		});
		
		if(!added && !duplicate) {
			$('#locations').append(html);
		}
		
		locations[name] = data;
		
		li = $('#locations li[data-name="' + name + '"]');
		
		if(li) {
			li.trigger('click');
		}
	})
	.fail(function(data) {
		alert('Error: ' + data);
	})
	.always(function() {
		$('#location-dialog .location-saving').css('display', 'none');
	});
}

function openLocationDialog(x, y, name) {
	if(typeof name == 'undefined') {
		name = null;
	}
	
	locationDialog.dialog('open');

	
	if(name) {
		var edit = $('#locations li[data-name="' + name + '"]');
		x = edit.attr('data-x');
		y = edit.attr('data-y');
		$('#location-name').val(edit.attr('data-name'));
		$('#location-description').val(edit.find('.location-description').html());
		$('#location-tags').val(edit.find('.location-tags').text().replace(/#/g, ''));
		$('#location-save-button').val('Update Location');
	}
	else {
		$('#location-name, #location-description, #location-tags').val('');
		$('#location-save-button').val('Add Location');
	}
	
	$('#location-name').focus();
	
	$('#location-edit-coordinates').attr('data-x', x).attr('data-y', y).text(x + ', ' + y);
}