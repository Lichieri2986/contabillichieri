// ---- PROTOCOLO DE SEGURANÇA: VARIÁVEIS DE AMBIENTE ----
require('dotenv').config();

const express = require('express');
const compression = require('compression');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ---- CONFIGURAÇÕES DO SERVIDOR (MIDDLEWARES) ----
app.use(compression());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- FUNÇÃO AUXILIAR BLINDADA PARA O BLOG ----
const carregarArtigos = () => {
    try {
        const caminhoArquivo = path.join(__dirname, 'artigos.json');
        
        if (!fs.existsSync(caminhoArquivo)) {
            console.log("[AVISO] O arquivo artigos.json não foi encontrado. Criando uma base vazia...");
            fs.writeFileSync(caminhoArquivo, '[]', 'utf-8');
            return [];
        }

        const data = fs.readFileSync(caminhoArquivo, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error("❌ ERRO CRÍTICO AO LER ARTIGOS.JSON:", error.message);
        return [];
    }
};

// ---- ROTAS PÚBLICAS DO PORTAL ----

// Rota 1: Home Principal (Injeta o WhatsApp e os Artigos do Blog de forma dinâmica)
app.get('/', (req, res) => {
    const artigos = carregarArtigos();
    // Pegamos apenas os 3 primeiros artigos mais recentes para exibir na Home
    const artigosHome = artigos.slice(0, 3); 
    
    res.render('home', { 
        whatsappNumero: process.env.COMERCIAL_WHATSAPP || '551147592113',
        artigos: artigosHome
    });
});

// Rota 2: Trilha Interna - Abertura de Empresa
app.get('/abrir-empresa', (req, res) => {
    res.render('abertura', { title: 'Abertura de Empresa sem Burocracia | Lichieri' });
});

// Rota 3: Trilha Interna - Simples Nacional / Blindagem Fiscal
app.get('/blindagem-fiscal', (req, res) => {
    res.render('blindagem', { title: 'Blindagem Fiscal - Especialistas em Simples Nacional' });
});

// Rota 4: Painel de Listagem de Artigos do Blog
app.get('/blog', (req, res) => {
    const artigos = carregarArtigos();
    res.render('blog-lista', { artigos });
});

// Rota 5: Template Dinâmico de Leitura do Artigo
app.get('/blog/:slug', (req, res) => {
    const artigos = carregarArtigos();
    const artigo = artigos.find(a => a.slug === req.params.slug);
    
    if (artigo) {
        res.render('blog-artigo', { artigo });
    } else {
        res.status(404).send('<h1>Artigo não encontrado.</h1><a href="/blog">Voltar ao Blog</a>');
    }
});

// ---- ROTAS DE API (BACK-END) ----

// Rota da API para Captura de Leads do Formulário Inteligente
app.post('/api/captura-lead', (req, res) => {
    const { nome, whatsapp, momento, faturamento } = req.body;
    
    if (!nome || !whatsapp) {
        return res.status(400).json({ success: false, erro: 'Nome e WhatsApp são obrigatórios.' });
    }

    console.log('[LEAD CAPTURADO]', req.body);

    res.status(200).json({ 
        success: true, 
        message: 'Inteligência Lichieri ativada! Direcionando você para o nosso consultor especializado...' 
    });
});

// ---- INICIALIZAÇÃO DO SERVIDOR ----
app.listen(PORT, () => {
    console.log(`[STATUS] Servidor Contabil Lichieri operando na porta ${PORT}`);
});