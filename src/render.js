const encrypt = require('./encrypt/encrypt')

let btn_show_key = document.getElementById('btn-show-key')
let btn_go = document.getElementById('btn-go')
let field_key = document.getElementById('field-key')
let field_file = document.getElementById('field-file')

btn_show_key.addEventListener('click', () => {
    if(field_key.type == "password")
        field_key.type = "text"
    else
        field_key.type = "password"
})

btn_go.addEventListener('click', () => {
    if(field_file.files.length > 0){
        const file = field_file.files[0]
        encrypt.Cipher(file.path,field_key.value,null) ? alert('Arquivo criptografado com sucesso!') : alert('Falha ao criptografar o arquivo')
    }
    else 
        alert('Você não selecionou nenhum arquivo!')
})