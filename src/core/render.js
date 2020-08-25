//import the libs
const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');

const algorithm = process.env.algorithm;
const default_key = process.env.default_key;

const homedir = os.homedir()
const rootFolder = homedir + path.sep + 'JustEncrypt';

function createRootFolder(){
    if(!existRootFolder())
        fs.mkdir(rootFolder, err => {
            if (err) throw err
        })
}

function existRootFolder(){
    return fs.existsSync(rootFolder)
}

function createKeyFolder(){
    createRootFolder()
    const key_folder = rootFolder + path.sep + 'Keys'
    if(!existKeyFolder(key_folder))
        fs.mkdirSync(key_folder)
    return key_folder
}

function existKeyFolder(key_folder=''){
    return fs.existsSync(key_folder)
}

function generateKey(key_pass=''){
    const cipher = builderCipher(key_pass, 'cipher')

    const key = cipher.update(default_key, 'utf8','hex') + cipher.final('hex')

    const keys_folder = createKeyFolder()

    const key_file = keys_folder + path.sep + 'key_' + Math.random(256) + '.pem'

    writeFile(key_file, key)

    return true
}

function builderCipher(key_pass, option){
    const buffer = Buffer.alloc(16,0)

    const sync = crypto.scryptSync(key_pass, '.', 24)

    if (option == 'cipher')
        return crypto.createCipheriv(algorithm, sync, buffer)
    else
        return crypto.createDecipheriv(algorithm, sync, buffer)
}

function run(){
    
    return true
}

function readAndWriteStream(input_path='', output_path='', cipher){
    const input = fs.createReadStream(input_path)

    const output = fs.createWriteStream(output_path)

    input.pipe(cipher).pipe(output)
}

function writeFile(output_path='', text=''){
    fs.writeFile(output_path, text, err => {
        if (err) throw err
        alert('Arquivo gerado com sucesso!')
    })
}

/*
const key_enc = fs.readFileSync('key.pem').toString();

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


//manusear o botão usando JS puro (não é muito usual hoje em dia)
const btn_key_gen = document.getElementById('btn-key-gen')

btn_key_gen.addEventListener('click', () => {
    generateKey('amem')
    alert('chave gerada')
})