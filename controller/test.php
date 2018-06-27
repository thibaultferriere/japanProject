<?php
	echo "BONJOUR<br/>";
	//$host = 'ec2-13-231-7-166.ap-northeast-1.compute.amazonaws.com';
	$host = 'localhost';
	//$port = '3306';
	$db = 'test';
	$user = 'phpmyadmin';
	$password = 'limu828';
	//$charset = 'utf8';

	echo "bonjour";

	/*
	$dsn = "mysql:host=$host;port=$port;dbname=$db";

	$opt = [
		PDO::ATTR_ERRMODE		=> PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE	=> PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES	=> false,
	];

	$conn = new PDO($dsn, $user, $password, $opt);
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$stmt = $pdo->prepare('SELECT NAME FROM tableTest');
	$stmt->execute();
	$user = $stmt->fetch();
	print_r($user);
	echo $user;
	*/
?>
