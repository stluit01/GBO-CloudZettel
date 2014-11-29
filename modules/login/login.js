/**
 * Created by Jens on 12.11.2014.
 */


/* token decodieren um z.b. username zu erhalten
function url_base64_decode(str) {
    var output = str.replace('-', '+').replace('_', '/');
    switch (output.length % 4) {
        case 0:
            break;
        case 2:
            output += '==';
            break;
        case 3:
            output += '=';
            break;
        default:
            throw 'Illegal base64url string!';
    }
    return window.atob(output); //polifyll https://github.com/davidchambers/Base64.js
}
*/

var login = angular.module('login', ['login.config'])