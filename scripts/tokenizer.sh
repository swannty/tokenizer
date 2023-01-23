#!/bin/bash

set +o allexport

#--[ User inputs ]------------------------------------------------------------------------------

read -p "User: " USER
read -s -p "Password: " PASS

echo -e "\n"

read -p "Login: " LOGIN
read -p "Server: " HOST

#--[ SHA512 digest inputs ]---------------------------------------------------------------------

PASS=$(echo -n "$PASS" | sha512sum | cut -d ' ' -f 1)
HOST=$(echo -n "$LOGIN$HOST" | sha512sum | cut -d ' ' -f 1)
USER=$(echo -n "$USER$HOST" | sha512sum | cut -d ' ' -f 1)

#--[ Tokenize with PBKDF2 / HMAC ]--------------------------------------------------------------

PBKDF2=$(echo -n "$USER" | nettle-pbkdf2 --iterations=300000 --length=64 "$PASS" | sed 's/ //g')
HMAC512=$(echo -n "$HOST" | openssl dgst -sha512 -hmac "$PBKDF2" | cut -d ' ' -f 2)

#--[ SHA1 + BASE64 for convenient output ]------------------------------------------------------

TOKEN=$(echo -n "$HMAC512" | xxd -r -p | sha1sum -b | cut -d ' ' -f 1 | xxd -r -p | base64 -w 0)

#--[ User output ]------------------------------------------------------------------------------

echo -e "\nToken: !$TOKEN"

#--[ PIN alternative ]--------------------------------------------------------------------------

HEXA=$(echo "$TOKEN" | base64 -d | xxd -p -u)
HWORD=$(for ((i=0; i<=$(( ${#HEXA} / 6 )); i++)); do echo "$HEXA" | cut -c $(( i * 6 + 1 ))-$(( i * 6 + 6 )); done)
XWORD=$(echo $HWORD | sed 's/ / ^ 0x/g')

echo -e "PIN: ${TOKEN: -4}$(( 0x$XWORD ))"
