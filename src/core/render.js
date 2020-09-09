const ALGORTITHM= 'aes-192-cbc'
const DEFAULT_KEY = 'justencrypt'

const MONGO_URL = 'mongodb+srv://user01:genericUser2020@mycluster-fs6m4.mongodb.net/just-encrypt?retryWrites=true&w=majority'

//import the libs
const crypto = require('crypto')
const fs = require('fs')
const os = require('os')
const path = require('path')
const { dialog } = require('electron').remote
const { shell } = require('electron')

// connect to MongoDB
const mongoose = require('mongoose')
mongoose.connect(MONGO_URL, {
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

const algorithm = ALGORTITHM;
const default_key = DEFAULT_KEY;

const homedir = os.homedir()
const username = os.userInfo().username
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

    const keys_folder = createKeyFolder() + path.sep

    const key_file = 'key_' + Date.now() + '.pem'

    writeFile(keys_folder, key_file, key)

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

function writeFile(output_path, output_file, text){
    const final_path = output_path + output_file
    fs.writeFile(final_path, text, err => {
        if (err) throw err
        dialog.showMessageBox({
            message: `Arquivo ${output_file} gerado com sucesso!`,
            title: 'AVISO',
            buttons: ['OK']
        }).then(() => {
            shell.openPath(output_path)
        })
    })
}

function readFile(input_path){
    return fs.readFileSync(input_path).toString()
}

function run(selected_files=[], key_pass, option){
    selected_files.forEach( file => {
        const output_file = createOutputPath(file, option)
        const cipher = builderCipher(key_pass, option)
        readAndWriteStream(file, output_file, cipher)
        saveLog(username,file,output_file,option,key_pass)
    })
    dialog.showMessageBox({
        title: 'CONCLUÍDO',
        message: 'Todos os arquivos foram encriptados/desencriptados com sucesso!'
    })
}

function createOutputPath(input_file='', option=''){
    const file_dir = path.dirname(input_file)
    const file_ext = path.extname(input_file)
    const file_name = path.basename(input_file, file_ext)
    let new_name = ''
    if(option == 'cipher')
        new_name = file_name + '_enc'
    else
        new_name = file_name + '_dec' 

    return file_dir + path.sep + new_name + file_ext
}

//manusear o botão usando JS puro (não é muito usual hoje em dia)
const btn_key_gen = document.getElementById('btn-key-gen')
const btn_upload_key = document.getElementById('btn-key-upload')
const txt_key = document.getElementById('txt-key')
const txt_new_key = document.getElementById('txt-new-key')
const files = document.getElementById('files')
const btn_go = document.getElementById('btn-go')
const check_option = document.getElementById('check-option')
let key_path = ''
let option = 'cipher'

check_option.addEventListener('change', el => {
    el.target.checked == false ? option = 'cipher' : option = 'decipher'
})

btn_upload_key.addEventListener('click', () => {
    dialog.showOpenDialog({
        title: 'ESCOLHA O ARQUIVO CHAVE',
        filters: [
            {
                name: 'Keys',
                extensions: ['pem']
            }
        ]
    }).then(value => {
        key_path = value.filePaths[0]
    }).catch( err => {
        console.error(err)
    })
})

//gerar uma nova senha
btn_key_gen.addEventListener('click', () => {
    let new_key = txt_new_key.value
    if(new_key.length < 1)
        new_key = default_key
    generateKey(new_key)
})

btn_go.addEventListener('click', () => {
    
    if(files.files.length > 0){
        const selected_files = files.files

        let selected_files_clean = []

        for(let i = 0; i < selected_files.length; i++){
            selected_files_clean.push(selected_files[i].path)
        }

        let key_pass = ''

        if(key_path != '')
            key_pass = decipherKey(key_path)

        if(txt_key.value.length > 0)
            key_pass = txt_key.value

        run(selected_files_clean,key_pass, option)
    }
})