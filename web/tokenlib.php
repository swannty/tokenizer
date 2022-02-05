
<?php

	# $host = hash('sha512', $login . $server);
	# $auth = hash('sha512', $username . $host);
	# $key = hash('sha512', $password);

	function tokenizer($auth, $host, $key)
	{
		$pbkdf2 = hash_pbkdf2('sha256', $auth, $key, 300000, 128);
		$hmac = hash_hmac('sha512', $host, $pbkdf2);

 		return '!' . base64_encode(hash('sha1', hex2bin($hmac), true)); //-- token
	}

	function token2pin($token)
	{
		$hex_data = strtoupper(bin2hex(base64_decode($token)));
		$hex_word = explode(':', chunk_split($hex_data, 6, ':'));
		$hex_pin = hexdec(array_shift($hex_word)); 

		foreach($hex_word as $word) if (!empty($word)) $hex_pin = $hex_pin ^ hexdec($word);
		return(substr($token, -4) . $hex_pin);
	}
?>
