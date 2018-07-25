<?php
	echo "BONJOUR<br/>";
	//$host = 'ec2-13-231-7-166.ap-northeast-1.compute.amazonaws.com';
	$host = 'localhost';
	//$port = '3306';
	$db = 'campusanalytics';
	$user = 'student';
	$password = 'crw2018';
	//$charset = 'utf8';

	echo "bonjour<br/><br/>";


	$dsn = "mysql:host=$host;dbname=$db";

	$opt = [
		PDO::ATTR_ERRMODE		=> PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE	=> PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES	=> false,
	];

	$conn = new PDO($dsn, $user, $password, $opt);
	//$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	$query = $conn->prepare('SELECT timestamp, day_of_week, unit_from, unit_to, total FROM movecount_10m limit 10');
	$query->execute();
	$results = $query->fetchAll();
	//print_r($result);
	foreach($results as $row){
		echo "TIME: ".$row['timestamp']."<br/>";
		echo "DAY: ".$row['day_of_week']."<br/>";
		echo "FROM: ".$row['unit_from']."<br/>";
		echo "TO: ".$row['unit_to']."<br/>";
		echo "TOTAL: ".$row['total']."<br/>";
        echo "<br/>";
	}

	//header('Location: http://ec2-13-231-7-166.ap-northeast-1.compute.amazonaws.com/data_visualization.php');
?>
