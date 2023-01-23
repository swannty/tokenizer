# =T0k3n!z3R=

**Quick & dirty password key derivation tool.**

> _« One Ring to rule them all, One Ring to find them, One Ring to bring them all and in the darkness bind them. »_ — J.R.R. Tolkien

```
HOST_HASH = SHA512( LOGIN + SERVER )

USER_HASH = SHA512( USERNAME + HOST_HASH )

PWD_HASH = SHA512( PASSWORD )

KEY = PBKDF2( USER_HASH, PWD_HASH )

DIGEST = HMAC512( HOST_HASH, KEY )

TOKEN = BASE64( SHA1(DIGEST) )
```
👉 Available for JavaScript, PHP, Python & Linux shell 

Node.js & online version use **Web Crypto API / SubtleCrypto**.

- https://developer.mozilla.org/en-US/docs/Web/API/Crypto
- https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto

JavaScript and HTML standalone version requires **Crypto-JS** library 🐢.

- https://cryptojs.gitbook.io
- https://github.com/brix/crypto-js
- https://cdnjs.com/libraries/crypto-js
- https://code.google.com/archive/p/crypto-js/downloads

Shell version requires **Nettle** and **OpenSSL**.

- https://www.lysator.liu.se/~nisse/nettle
- https://www.openssl.org

`# apt install nettle-bin openssl`

Mirror: https://codeberg.org/swannty/tokenizer

Talk: https://crypto.stackexchange.com/questions/98173/diy-password-key-derivation-tool-using-pbkdf2-hmac

Live: https://jsfiddle.net/vm7ue0ns/2

Blank run: `!o3Y8dKaEoS3t56eiwHw8A7qTAZs=` (5414339)
