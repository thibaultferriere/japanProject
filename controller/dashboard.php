<?php
    $host = 'localhost';
	$db = 'campustraffic';
	$user = 'phpmyadmin';
	$password = 'limu828';

    $dsn = "mysql:host=$host;dbname=$db";

	$opt = [
		PDO::ATTR_ERRMODE		=> PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE	=> PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES	=> false,
	];

	$conn = new PDO($dsn, $user, $password, $opt); //connection to the database

    $query = $conn->prepare('SELECT spot_id, congestion FROM campus_nowcasts_scaled LIMIT 500');    //preparation of the query
	$query->execute(); //execute the query
	$result = $query->fetchAll();  //fetching the results in an array
    echo json_encode($result);  //echo results in JSON
?>