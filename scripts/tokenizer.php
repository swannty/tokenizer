#!/usr/bin/php
<?php if ( php_sapi_name() !== 'cli' ) die('This script should not be run remotely.');

#------------------------------------------------------------------------------------------

function tokenizer($auth, $host, $key)
{
	$pbkdf2 = hash_pbkdf2('sha256', $auth, $key, 300000, 128);
	$hmac = hash_hmac('sha512', $host, $pbkdf2);

	return base64_encode(hash('sha1', hex2bin($hmac), true));
}

function token2pin($token)
{
	$hex_data = strtoupper(bin2hex(base64_decode($token)));
	$hex_word = explode(':', chunk_split($hex_data, 6, ':'));

	print_r($hex_data);
	print_r($hex_word);
	
	$hex_pin = hexdec(array_shift($hex_word)); 

	foreach($hex_word as $word) if (!empty($word)) $hex_pin = $hex_pin ^ hexdec($word);
	return(substr($token, -4) . $hex_pin);
}

#------------------------------------------------------------------------------------------

$user = readline('User: ');

echo 'Password: ';
system('stty -echo');
$password = trim(fgets(STDIN));
system('stty echo');
echo "\n\n";

$login = readline('Login: ');
$server = readline('Server: ');

#------------------------------------------------------------------------------------------

$host = hash('sha512', $login . $server);
$auth = hash('sha512', $user . $host);
$key = hash('sha512', $password);

#------------------------------------------------------------------------------------------

$token = tokenizer($auth, $host, $key);
$pin = token2pin($token);

echo "\nToken: !$token";
echo "\nPIN: $pin\n";

?>
