<?php
	echo "BONJOUR<br/>";
	//$host = 'ec2-13-231-7-166.ap-northeast-1.compute.amazonaws.com';
	$host = 'localhost';
	//$port = '3306';
	$db = 'test';
	$user = 'phpmyadmin';
	$password = 'limu828';
	//$charset = 'utf8';

	echo "bonjour<br/>";


	$dsn = "mysql:host=$host;dbname=$db";

	$opt = [
		PDO::ATTR_ERRMODE		=> PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE	=> PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES	=> false,
	];

	$conn = new PDO($dsn, $user, $password, $opt);
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$query = $conn->prepare('SELECT NAME FROM tableTest');
	$query->execute();
	$results = $query->fetchAll();
	//print_r($result);
	foreach($results as $row){
		echo $row['NAME']."<br/>";
	}
?>
