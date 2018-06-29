<!DOCTYPE HTML>
<html>
	<body>
		<h1>DATA VISUALIZATION</h1>

		<?php
			$host = 'localhost';
			$db = 'aibeacon';
			$user = 'phpmyadmin';
			$password = 'limu828';

			$dsn = "mysql:host=$host;dbname=$db";
			$opt = [
				PDO::ATTR_ERRMODE		=> PDO::ERRMODE_EXCEPTION,
				PDO::ATTR_DEFAULT_FETCH_MODE	=> PDO::FETCH_ASSOC,
				PDO::ATTR_EMULATE_PREPARES	=> false,
			];
			$conn = new PDO($dsn, $user, $password, $opt);

			$query = $conn->prepare('SELECT unit_id, uuid FROM alldata LIMIT 10000');
			$query->execute();
			$results = $query->fetchAll();

			foreach($results as $row){
				echo "Unit ID: ".$row['unit_id']."<br/>";
                echo "UUID: ".$row['uuid']."<br/>";
                echo "<br/>";
            }
		?>
	</body>
</html>