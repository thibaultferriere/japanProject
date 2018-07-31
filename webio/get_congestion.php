<?php
date_default_timezone_set('Asia/Tokyo');

define('DSN','mysql:host=localhost;dbname=campustraffic;charset=utf8');  #define("定数名","定数の値")
define('DB_USER','student');
define('DB_PASSWORD','crw2018');

function connectDb() {
  try {
    error_reporting(E_ALL & ~E_NOTICE);  #E_ALL:すべてのエラーが含まれる, E_NOTICE:実行時の警告。スクリプト実行時に何かエラーが発生したが通常のスクリプト実行を継続できることを示す
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
$sql = 'select calculated_at as time, spot_id as spot, congestion as congestion from campus_nowcasts_scaled where calculated_at = (select MAX(calculated_at) from campus_nowcasts_scaled) order by spot_id';

#OUTPUT JSON STYLE
header('Content-type: application/json');
echo json_encode($dbh->query($sql)->fetchAll(PDO::FETCH_ASSOC));

?>