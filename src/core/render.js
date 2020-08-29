//import the libs
const crypto = require('crypto')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { dialog } = require('electron').remote

// connect to MongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
//model Mongo
const Log = mongoose.model('Log',{
    user: String,
    file_input: String,
    file_output: String,
    option: String,
    key: String,
    when: Date
});

const algorithm = process.env.ALGORTITHM;
const default_key = process.env.DEFAULT_KEY;

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
    const key_folder = rootFolder + path.sep + 'keys'
    if(!existKeyFolder(key_folder))
        fs.mkdirSync(key_folder)
    return key_folder
}

function existKeyFolder(key_folder=''){
    return fs.existsSync(key_folder)
}

function generateKey(key_pass=''){
    const cipher = builderCipher(default_key, 'cipher')

    const key = cipher.update(key_pass, 'utf8','hex') + cipher.final('hex')

    const keys_folder = createKeyFolder()

    const key_file = keys_folder + path.sep + 'key_' + Date.now() + '.pem'

    writeFile(key_file, key)

    return true
}

function decipherKey(file_input){
    const decipher = builderCipher(default_key, 'decipher')
    const key_enc = readFile(file_input)
    return decipher.update(key_enc, 'hex','utf8') + decipher.final('utf8');
}

function builderCipher(key_pass, option){
    const buffer = Buffer.alloc(16,0)

    const sync = crypto.scryptSync(key_pass, '.', 24)

    if (option == 'cipher')
        return crypto.createCipheriv(algorithm, sync, buffer)
    else
        return crypto.createDecipheriv(algorithm, sync, buffer)
}

function saveLog(user='',file_input='',file_output='',option='', key=''){
    const log = new Log({
        user: user,
        file_input: file_input,
        file_output: file_output,
        option: option,
        key: key,
        when: Date.now()
    });

    log.save().then(() => {console.log('done')})
}

function readAndWriteStream(input_path='', output_path='', cipher){
    const input = fs.createReadStream(input_path)

    const output = fs.createWriteStream(output_path)

    input.pipe(cipher).pipe(output)
}

function writeFile(output_path, text){
    fs.writeFile(output_path, text, err => {
        if (err) throw err
        dialog.showMessageBox({
            message: 'Arquivo gerado com sucesso!',
            title: 'AVISO',
            buttons: ['OK']
        })
    })
}

function readFile(input_path){
    return fs.readFileSync(input_path).toString()
}

function run(selected_files=[], key_pass){
    //saveLog('beto','a.csv','a_enc.csv','cipher','chave')
    
    return true
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
const btn_upload_key = document.getElementById('btn-small')
const txt_key = document.getElementById('txt-key')
const txt_new_key = document.getElementById('txt-new-key')
const files = document.getElementById('files')
const btn_go = document.getElementById('btn-large')

//gerar uma nova senha
btn_key_gen.addEventListener('click', () => {
    let new_key = txt_new_key.value
    if(new_key.length < 1)
        new_key = default_key
    generateKey(new_key)
})

btn_go.addEventListener('click', el => {
    
    if(files.files.length > 0){
        const selected_files = files.files

        let selected_files_clean = []

        for(let i = 0; i < selected_files.length; i++){
            selected_files_clean.push(selected_files[i].path)
        }
        let key_pass = ''

        if(txt_key.value.length > 0)
            key_pass = txt_key.value

        //implementar logica pra pegar o arquivo de chave, descriptografar e pegar a chave
        const key = decipherKey("C:/Users/rober/JustEncrypt/keys/key_1598739842049.pem")
        console.log(key)

        run(selected_files_clean,key_pass)
    }
})