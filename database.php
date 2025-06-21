<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

?>
<?php

$db_name = "ecommerce";
$db_host = "localhost";
$db_user = "eshop_user";
$db_pass = "Eshop@1234";  


$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
