<?php
	$name = $_POST["name"];
	$data = $_POST["data"];
	$original = isset($_POST["original"]) ? $_POST["original"] : null;

	if(preg_match('/[\\\\\/]/', $name)) {
		echo 'Invalid location name: '.$name;
		return;
	}
	
	file_put_contents('locations/'.$name.'.loc', $data) or die('Unable to save location.');
	
	if($original) {
		unlink('locations/'.$original.'.loc');
	}
	
	echo 'success';
?>