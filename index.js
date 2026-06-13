const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const { Knex } = require('knex');
const knex = require('./database/database');
const base64 = require('base-64');
const uniqid = require('uniqid'); 
const uid2 = require('uid2');
const cors = require('cors');
const path = require('path');
const dayjs = require('dayjs');

require('dotenv').config();
app.use(cors());

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));


app.use((req, res, next) => {
	//Qual site tem permissão de realizar a conexão, no exemplo abaixo está o "*" indicando que qualquer site pode fazer a conexão
    res.header("Access-Control-Allow-Origin", "*");
	//Quais são os métodos que a conexão pode realizar na API
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE');
    app.use(cors());
    next();
});

app.get('/', (req, res) => {
    res.render('login', { error: null });
})

app.get('/principal', (req, res) => {
    res.render('principal');
})

app.post('/login', async (req, res) => {
    try {
        const email = String(req.body.email || req.body.username || '').trim().toLowerCase();
        const senha = String(req.body.password || req.body.senha || '').trim();

        if (!email || !senha) {
            return res.status(400).render('login', { error: 'Informe seu email e sua senha.' });
        }

        let user = null;

        try {
            user = await knex('usuarios')
                .whereRaw('LOWER(email) = ?', [email])
                .first();
        } catch (error) {
            console.warn('Tabela usuarios não encontrada, usando credenciais padrão.', error.message);
        }

        const senhaValidaNoBanco = user && (
            user.senha === senha ||
            user.password === senha ||
            user.senha_hash === senha
        );

        const emailPadrao = String(process.env.LOGIN_EMAIL || 'admin@autoservicepro.com').toLowerCase();
        const senhaPadrao = String(process.env.LOGIN_PASSWORD || '123456');
        const credenciaisPadraoValidas = email === emailPadrao && senha === senhaPadrao;

        if (!senhaValidaNoBanco && !credenciaisPadraoValidas) {
            return res.status(401).render('login', { error: 'Email ou senha inválidos.' });
        }

        return res.redirect('/principal');
    } catch (error) {
        console.error('Erro ao autenticar:', error);
        return res.status(500).render('login', { error: 'Não foi possível realizar o login.' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})