<?php
    $host = 'localhost';
	$db = 'campustraffic';
	$user = 'student';
	$password = 'crw2018';

    $dsn = "mysql:host=$host;dbname=$db";

	$opt = [
		PDO::ATTR_ERRMODE		=> PDO::ERRMODE_EXCEPTION,
		PDO::ATTR_DEFAULT_FETCH_MODE	=> PDO::FETCH_ASSOC,
		PDO::ATTR_EMULATE_PREPARES	=> false,
	];

	$conn = new PDO($dsn, $user, $password, $opt); //connection to the database    

    //Query to show congestion for a certain spot over time
    $query = $conn->prepare('SELECT * FROM (SELECT id, congestion, calculated_at 
                            FROM campus_nowcasts_scaled 
                            WHERE spot_id=1 
                            ORDER BY calculated_at DESC
                            LIMIT 100) sub
                            ORDER BY calculated_at ASC');
    $query->execute();
    $result = $query->fetchAll();
    foreach($result as  $index => $cell){
//        var_dump($cell);
        $result[$index]['calculated_at'] = date('m/d/y H:i', $result[$index]['calculated_at']);
//        var_dump($cell);
//        print_r("<br/>");
    }
//    var_dump($result);
    echo json_encode($result);
?>