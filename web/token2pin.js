function token2pin(token_b64)
{
    var hex_data = CryptoJS.enc.Base64.parse(token_b64).toString();
    
    //-- echo "token_b64" | base64 -d | xxd -p -u
    
    var hex_word = hex_data.match(/(.{1,6})/g);
    
    //-- for ((i=0; i<=$(( ${#hex_data} / 6 )); i++)); do echo "hex_data" | cut -c $(( i * 6 + 1 ))-$(( i * 6 + 6 )); done
    
    var hexpin = parseInt(hex_word.shift(), 16);

    for (var i=0; i<hex_word.length; i++) hexpin = (hexpin ^ parseInt(hex_word[i], 16));

    return token_b64.substring(token_b64.length - 4) + hexpin;
}
