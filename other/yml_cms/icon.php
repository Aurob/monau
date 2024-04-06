<?php
// header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if(isset($_GET['q'])) {
    $q = strtolower($_GET['q']);
    $icons = 'https://www.irasutoya.com/search?q='.$q;
    system('python3 icon.py 地球'.$q, $retval);
}
?>