<?php
date_default_timezone_set('Asia/Tokyo');

define('DSN','mysql:host=localhost;dbname=campustraffic;charset=utf8');
define('DB_USER','student');
define('DB_PASSWORD','crw2018');

function connectDb() {
  try {
    error_reporting(E_ALL & ~E_NOTICE);
    $options = array(PDO::MYSQL_ATTR_INIT_COMMAND=>"SET CHARACTER SET 'utf8'");
    $con = new PDO(DSN, DB_USER, DB_PASSWORD, $options);
    $con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $con->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    return $con;
  } catch (PDOException $e) {
    echo $e->getMessage();
    exit;
  }
}

$dbh = connectDb();


$first_time = $_REQUEST['start_time'];
$total_day = $_REQUEST['days'];
$time_interval = $_REQUEST['time_interval'];


for($day_f_time = $first_time; $day_f_time <= ($first_time + ($time_interval*($total_day-1))); $day_f_time +=86400){
 for($time = $day_f_time; $time <= ($day_f_time + $time_interval); $time += 600){
   $sql = "select count(distinct(uuid)) from alldata where (({$time}-600) <= timestamp) and (timestamp < {$time}) and rssi < 75 and randomized = 0 and unit_id IN(\"10000001\", \"10000002\")";
 }
}


#OUTPUT JSON STYLE
header('Content-type: application/json');
echo json_encode($dbh->query($sql)->fetchAll(PDO::FETCH_ASSOC));

?>
