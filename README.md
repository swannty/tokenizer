# T0k3n!z3R

**Quick & dirty password key derivation tool.**

> _« One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. »_ — J.R.R. Tolkien


```
HOST_HASH = SHA512( LOGIN + SERVER )

USER_HASH = SHA512( USER_NAME + HOST_HASH )

PWD_HASH = SHA512( PASSWORD )

KEY = PBKDF2( USER_HASH, PWD_HASH )

DIGEST = HMAC512( HOST_HASH, KEY )

TOKEN = BASE64( SHA1(DIGEST) )
```

Web version requires **Crypto-JS** library.

- https://cryptojs.gitbook.io
- https://github.com/brix/crypto-js
- https://cdnjs.com/libraries/crypto-js
- https://code.google.com/archive/p/crypto-js/downloads

Shell version requires **Nettle** and **OpenSSL**.

`# apt install nettle-bin openssl`

Mirror: https://termbin.com/nunr

Talk: https://crypto.stackexchange.com/questions/98173/diy-password-key-derivation-tool-using-pbkdf2-hmac
