<?php
include_once 'helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, POST, GET, OPTIONS, PATCH');
header('Access-Control-Allow-Headers: *');

$data = getRequestData();

$send = $data['send'];
$task = $data['task'];
$cred = $data['cred'];

echo proxyRequest(
  'issue/'. $task .'/worklog?adjustEstimate=AUTO',
  $cred,
  $send,
  'POST'
);
