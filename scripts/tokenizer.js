#!/usr/bin/node

"use strict";

const util = require('util');
const strenc = new util.TextEncoder('utf-8');
const {subtle} = require('crypto').webcrypto;

var readline = require('readline');
var reader = readline.createInterface({input: process.stdin, output: process.stdout, terminal: true});
var prompt = (query) => new Promise((resolve) => reader.question(query, resolve));

(async () => {

	const buff2hex = function(buffer) { return [...new Uint8Array(buffer)].map(x => x.toString(16).padStart(2, '0')).join(''); }

	const buff2pin = function(token_buffer)
	{
		var hex_data = buff2hex(token_buffer);
		var hex_word = hex_data.match(/(.{1,6})/g);			
		var hexpin = parseInt(hex_word.shift(), 16);

		for (var i=0; i < hex_word.length; i++) hexpin = (hexpin ^ parseInt(hex_word[i], 16));
		return hexpin;
	}

	const tokenizer = function(auth, host, key)
	{
		const pbkdf2_pref = {name: 'PBKDF2', hash: 'SHA-256', salt: strenc.encode(key), iterations: 300000};
		const hmac_pref = {name: 'HMAC', hash: 'SHA-512'};

		return new Promise(function(resolve)
		{
			subtle.importKey('raw', strenc.encode(auth), 'PBKDF2', false, ['deriveBits'])
			.then(pbkdf2_key => subtle.deriveBits(pbkdf2_pref, pbkdf2_key, 64*8))
			.then(pbkdf2_hash => subtle.importKey('raw', strenc.encode(buff2hex(pbkdf2_hash)), hmac_pref, false, ['sign']))
			.then(hmac_key => subtle.sign('HMAC', hmac_key, strenc.encode(host)))
			.then(hmac_hash => subtle.digest('SHA-1', hmac_hash))
			.then(function(token_sha1)
			{
				var token = btoa(String.fromCharCode(...new Uint8Array(token_sha1)));
				var pin = token.substring(token.length - 4) + buff2pin(token_sha1);

				resolve({token: token, pin: pin});
			});
		})
	}

	const digest = async function(user, login, server, password)
	{
		const key = await subtle.digest('SHA-512', strenc.encode(password));
		const host = await subtle.digest('SHA-512', strenc.encode(login + server));
		const auth = await subtle.digest('SHA-512', strenc.encode(user + buff2hex(host)));

		return {auth: auth, host: host, key: key};
	}

	//--[ User inputs ]-----------------------------------------------

	const user = await prompt("User: ");

	console.log("Password:");

	reader._writeToOutput = function(input){this.output.write('')};
	const password = await prompt("\n");
	reader._writeToOutput = function(input){this.output.write(input)};

	const login = await prompt("\nLogin: ");
	const server = await prompt("Server: ");

	//--[ SHA512 digest + Tokenize with PBKDF2 / HMAC ]---------------

	digest(user, login, server, password)
	.then(hash => tokenizer(buff2hex(hash.auth), buff2hex(hash.host), buff2hex(hash.key)))
	.then(function(results)
	{
		console.log("\nToken: !" + results.token);
		console.log("PIN: !" + results.pin);
	});

	reader.close();
})()
