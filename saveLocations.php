<?php
	$name = $_POST["name"];
	$data = $_POST["data"];
	
	file_put_contents('locations/'.$name.'.loc', $data);
?>