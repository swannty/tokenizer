
function buff2hex(buffer)
{
	return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join('');
}

async function digest(user, login, server, password)
{
	const strenc = new TextEncoder('utf-8');

	const key = await crypto.subtle.digest('SHA-512', strenc.encode(password));
	const host = await crypto.subtle.digest('SHA-512', strenc.encode(login + server));
	const auth = await crypto.subtle.digest('SHA-512', strenc.encode(user + buff2hex(host)));

	return {auth: auth, host: host, key: key};
}

//---------------------------------------------------------------------------------------------------------------

function tokenizer(auth, host, key)
{
	const strenc = new TextEncoder('utf-8');

	const pbkdf2_pref = {name: 'PBKDF2', hash: 'SHA-256', salt: strenc.encode(key), iterations: 300000};
	const hmac_pref = {name: 'HMAC', hash: 'SHA-512'};

	return new Promise(function(resolve)
	{
		crypto.subtle.importKey('raw', strenc.encode(auth), 'PBKDF2', false, ['deriveBits'])
		.then(pbkdf2_key => crypto.subtle.deriveBits(pbkdf2_pref, pbkdf2_key, 64*8))
		.then(pbkdf2_hash => crypto.subtle.importKey('raw', strenc.encode(buff2hex(pbkdf2_hash)), hmac_pref, false, ['sign']))
		.then(hmac_key => crypto.subtle.sign('HMAC', hmac_key, strenc.encode(host)))
		.then(hmac_hash => crypto.subtle.digest('SHA-1', hmac_hash))
		.then(function(token_sha1)
		{
			var token = btoa(String.fromCharCode(...new Uint8Array(token_sha1)));
			var pin = token.substring(token.length - 4) + buff2pin(token_sha1);

			resolve({token: token, pin: pin});
		});
	})
}

function buff2pin(token_buffer)
{
	var hex_data = buff2hex(token_buffer);
	var hex_word = hex_data.match(/(.{1,6})/g);			
	var hexpin = parseInt(hex_word.shift(), 16);

	for (var i=0; i<hex_word.length; i++) hexpin = (hexpin ^ parseInt(hex_word[i], 16));
	return hexpin;
}

//---------------------------------------------------------------------------------------------------------------

function interface()
{
	digest(user, login, server, password)
	.then(hash => tokenizer(buff2hex(hash.auth), buff2hex(hash.host), buff2hex(hash.key)))
	.then(function(output)
	{
		console.log(output.token);
		console.log(output.pin);
	});
}
