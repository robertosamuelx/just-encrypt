/* const crypto = require('crypto');
const fs = require('fs');
const key_enc = fs.readFileSync('key.pem').toString();
const algorithm = 'aes-192-cbc';
console.log(key_enc);
const decipher = crypto.createDecipheriv(algorithm,crypto.scryptSync('a','salt',24),Buffer.alloc(16,0));
const key = decipher.update(key_enc,'hex','utf8') + decipher.final('utf8');
const sync = crypto.scryptSync(key,'salt',24);
const iv = Buffer.alloc(16,0);
console.log(key);
const cipher = crypto.createCipheriv(algorithm,sync,iv);

const input = fs.createReadStream('base_email.csv');
const output = fs.createWriteStream('base_email_enc.csv');

input.pipe(cipher).pipe(output);

const crypto = require('crypto');
const fs = require('fs');

const algorithm = 'aes-192-cbc';
const key = 'adin';
const sync = crypto.scryptSync('a','salt',24);
const iv = Buffer.alloc(16,0);


const cipher = crypto.createCipheriv(algorithm,sync,iv);

let encrypted = cipher.update(key,'utf8','hex')+ cipher.final('hex');
console.log(encrypted);

fs.writeFile('key.pem',encrypted, err => {
    if (err) throw err;
    console.log('the file has been saved');
}); */

module.exports = {
    generateKey(key_pass){

    },
    Cipher(path_input, path_key, key_pass){
        return true
    },
    Decipher(path_input, path_key, key_pass){
        return true
    }
}