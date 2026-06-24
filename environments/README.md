# Ambientes — LS Confecções

```
environments/
├── producao/          ← Cópia do site estático pronta para produção
│   ├── index.html
│   ├── produtos.html
│   ├── brindes.html
│   ├── obrigado.html
│   ├── css/style.css
│   ├── js/main.js
│   ├── favicon.*
│   ├── robots.txt
│   ├── sitemap.xml
│   └── vercel.json    ← Security headers + cache + rewrites
│
├── staging/           ← Configuração do CMS para testes
│   ├── .env.staging   ← Preencher com credenciais do Supabase de staging
│   └── vercel.json    ← noindex + headers de staging
│
├── deploy.sh          ← Script de deploy
└── README.md          ← Este arquivo
```

## Como usar

### 1. Sincronizar site estático (após editar HTML/CSS/JS)
```bash
./environments/deploy.sh site producao
```

### 2. Deploy do CMS em staging (testes)
```bash
# Primeiro: preencher environments/staging/.env.staging com credenciais reais
./environments/deploy.sh cms staging
```

### 3. Deploy do CMS em produção
```bash
./environments/deploy.sh cms producao
```

### 4. Tudo de uma vez em staging
```bash
./environments/deploy.sh all staging
```

## Setup do ambiente de staging

1. Crie um **projeto separado** no [supabase.com](https://supabase.com) para staging
2. Execute o schema: `cms/database/schema.sql` no SQL Editor do Supabase de staging
3. Preencha `environments/staging/.env.staging` com as credenciais do projeto de staging
4. Execute `./environments/deploy.sh cms staging`

## Diferenças entre ambientes

| | Produção | Staging |
|---|---|---|
| Supabase | Projeto real | Projeto separado |
| Domínio | lsconfex.com.br | cms-staging.lsconfex.com.br |
| Google indexing | ✅ | ❌ (noindex) |
| Analytics | ✅ | ❌ |
| HSTS | ✅ | ✅ |
| Security headers | ✅ | ✅ |

## Pré-requisitos

```bash
npm i -g vercel
vercel login
```
