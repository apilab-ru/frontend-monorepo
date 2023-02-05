<?php

function getRequestData(): array
{
  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    die('ok');
  }

  $data = file_get_contents('php://input');
  if ($data) {
    return json_decode($data, 1);
  } else {
    print_r('Error');
    die('FAILED');
  }
}

/**
 * @param $url = string,
 * @param $cred = [
 *     'domain' => string,
 *     'login' => string,
 *     'password' => string
 * ]
 * @param $send = []
 * @param $method = string 'GET', 'POST'
 *
 * @return string
 */
function proxyRequest(string $url, array $cred, array $send = null, string $method = 'GET'): string
{
  $curl = curl_init();

  $params = [
    CURLOPT_URL => $cred['domain'] . '/rest/api/2/' . $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => '',
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 0,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_HTTPHEADER => array(
      'Content-Type: application/json',
      'Authorization: Basic ' . base64_encode($cred['login'] . ':' . $cred['password']),
    ),
  ];

  if ($send) {
    $params = array_merge($params, [
      CURLOPT_POSTFIELDS => json_encode($send),
    ]);
  }

  curl_setopt_array($curl, $params);

  $response = curl_exec($curl);

  curl_close($curl);
  return $response;
}
