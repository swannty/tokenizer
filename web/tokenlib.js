
function tokenizer(auth, host, key)
{
	var pbkdf2 = CryptoJS.PBKDF2(auth, key, {hasher: CryptoJS.algo.SHA256, keySize: 512/32, iterations: 300000});
	var hmac512 = CryptoJS.HmacSHA512(host, pbkdf2.toString());

	return CryptoJS.SHA1(hmac512).toString(CryptoJS.enc.Base64); //-- token
}

function token2pin(token)
{
    var hex_data = CryptoJS.enc.Base64.parse(token).toString();
    var hex_word = hex_data.match(/(.{1,6})/g);
    var hexpin = parseInt(hex_word.shift(), 16);

    for (var i=0; i<hex_word.length; i++) hexpin = (hexpin ^ parseInt(hex_word[i], 16));

    return token.substring(token.length - 4) + hexpin;
}
