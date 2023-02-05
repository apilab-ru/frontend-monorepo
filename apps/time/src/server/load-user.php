<?php
include_once 'helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, GET, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: *');

$data = getRequestData();
$cred = $data['cred'];

echo proxyRequest(
  'myself/',
  $cred
);
