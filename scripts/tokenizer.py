#!/usr/bin/python3

import getpass
import hashlib
import base64
import hmac

#--[ User inputs ]------------------------------------------------------------------------------------------

user = input("User: ")
password = getpass.getpass()

login = input("\nLogin: ")
host = input("Server: ")

#--[ SHA512 digest inputs ]---------------------------------------------------------------------------------

hash_password = hashlib.sha512(password.encode('utf-8')).hexdigest()
hash_host = hashlib.sha512(login.encode('utf-8') + host.encode('utf-8')).hexdigest()
hash_user = hashlib.sha512(user.encode('utf-8') + hash_host.encode('utf-8')).hexdigest()

#--[ Tokenize with PBKDF2/HMAC ]----------------------------------------------------------------------------

pbkdf2 = hashlib.pbkdf2_hmac('sha256', hash_user.encode('utf-8'), hash_password.encode('utf-8'), 300000, 64)
hmac512 = hmac.new(pbkdf2.hex().encode('utf-8'), hash_host.encode('utf-8'), hashlib.sha512)

#--[ SHA1 + BASE64 for convenient output ]------------------------------------------------------------------

sha1_token = hashlib.sha1(hmac512.digest())
b64_token = base64.b64encode(sha1_token.digest()).decode('utf-8')

#--[ User output ]------------------------------------------------------------------------------------------

print("\nToken: !" + b64_token)

#--[ PIN alternative ]--------------------------------------------------------------------------------------

hex_word = []
hex_token = sha1_token.hexdigest().upper()

for i in range(0, len(hex_token), 6): hex_word.append(hex_token[i:i+6])

pin_eval = '^0x'.join(str(n) for n in hex_word)
pin_token = eval('0x' + pin_eval)

print("PIN: " + b64_token[-4:] + str(pin_token))
