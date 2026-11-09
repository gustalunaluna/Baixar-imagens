# LS Confecções (LS CONFEX): instruções do projeto

Site estático (HTML/CSS/JS) em lsconfex.com.br, hospedado na Vercel. Fábrica de bolsas, mochilas e acessórios personalizados, a partir de 20 peças por modelo e cor.

## Deploy e Git
- Trabalhe só na branch `claude/optimistic-gauss-7f5apn`. Ela vai para produção.
- Nunca abra PR sem o usuário pedir.
- Commit com autor `noreply@anthropic.com` (e-mail válido; a Vercel já bloqueou um commit com e-mail errado) e termine a mensagem com as linhas de atribuição do ambiente.
- PNG na raiz é ignorado pelo `.gitignore`: use `git add -f`.
- `.vercelignore` exclui `.claude/`, `*.md`, `tests/` e `scripts/` do deploy.

## Mapa do site
HTML estático sem template: cabeçalho, rodapé e botão de WhatsApp (`wa.me/5511999370418`) se repetem em cada página. Mudança neles = editar as 24 páginas da raiz e as 20 do blog. URLs saem sem `.html` (`vercel.json`).
- Home e institucionais: `index.html`, `sobre.html`, `produtos.html` (catálogo), `private-label.html`, `brindes.html`, `blog.html`, `mapa-do-site.html`, `sitemap.xml`, `robots.txt`, `llms.txt`.
- Páginas de produto (SEO): `fabricante-de-bolsas-personalizadas`, `fabricante-de-mochilas-personalizadas`, `bolsas-termicas-personalizadas`, `ecobags-personalizadas`, `necessaires-personalizadas`, `pochetes-personalizadas`, `malotes-personalizados`, `pastas-executivas`, `bolsas-de-viagem`, `bolsas-fitness-academia`, `bolsas-streetwear-personalizadas` (todas `.html` na raiz).
- Ferramentas: `calculadora-preco-marca.html`, `calculadora-orcamento-brindes.html`.
- Sistema: `obrigado.html` (passagem para o WhatsApp, dispara o Lead), `404.html`, `politica-de-privacidade.html`, `termos-de-uso.html`.
- Blog: `blog/*.html` (20 artigos); capas em `imagens/og/`.
- Estilo e scripts: `css/style.css` (minificado, poucas linhas longas: procure com grep, não leia inteiro), `js/main.js` (interações e eventos de clique), `js/consent.js` (Consent Mode, no `<head>`), `js/pixel.js` (Meta Pixel), `api/meta-capi.js` (API de Conversões da Meta, função da Vercel).
- Imagens: `imagens/` (fotos em `.webp` com `.jpg` de reserva; subpastas por linha: `mochilas/`, `malas/`, `pochetes/`, `sholderbags/`, `og/`). Fontes em `fonts/`. Marca em `brand/`.
- Fora do ar ou internos: `site-teste/` (rascunhos, bloqueado no robots), `tests/site.spec.js` (Playwright, `npm test`), `scripts/seo-audit.sh`.
- Documentos de apoio (só abrir se a tarefa pedir): `PADRAO-ATENDIMENTO.md` (conversas reais, base da skill `responder-lead`), `AUDITORIA-SITE.md` e `RESUMO-SESSAO.md` (histórico de julho/2026, podem estar desatualizados).

## Como trabalhar (economia)
- Não leia o projeto inteiro. Use este mapa, depois `grep -n` e leia só o trecho da página envolvida.
- Para mudança repetida em várias páginas, faça por script (sed/python) e confira com grep, em vez de abrir página por página.

## Padrão dos artigos do blog (modelo: guias da Printi)
Piloto aplicado em `blog/tipos-de-tecido-para-mochilas.html` (estilos no `<style>` da própria página).
1. Introdução curta e, logo depois, caixa "Leia também" com 3 artigos internos (`.leia-tambem`).
2. Um H2 em forma de pergunta ("Quais são os tipos de...?") com cada opção em H3: descrição, "Melhor uso" e ficha (`.ficha-tecido`: ponto forte, atenção, personalização).
3. Tabela comparativa (`.blog-tabela`).
4. H2 "Como escolher...?" com cada critério em H3.
5. "Produtos relacionados" com 4 cartões para páginas de produto (`.produtos-relacionados`), antes das perguntas frequentes.
6. Perguntas frequentes, fontes e o bloco final de WhatsApp. Uma imagem real por item quando houver; sem foto real, ícone, nunca foto de outro produto.

## Regras do site
- Não mude o visual sem pedido explícito. Não comprima a logo do topo. Não altere as fotos de clientes publicadas.
- Não invente dados, números, depoimentos ou preços. Depoimentos da home ficam como estão.
- Sem travessão (—) nos textos do site.
- Fundada em 2017. Fábrica em Guarulhos/SP, escritório na Vila Carrão, São Paulo/SP.
- Não mencione couro nem couro sintético no site. Se o cliente pedir, o Gustavo decide pelo WhatsApp. Não fazemos logo em metal.
- Trabalhamos com oxford resinado e etiqueta tecida.
- Títulos até 60 caracteres, descrições de 120 a 155. Sitemap e mapa do site atualizados quando uma página mudar.
- Antes de publicar mudança grande: comparar prints (Playwright em `/opt/pw-browsers/chromium`) e validar o JSON-LD.
- Analytics e Meta Pixel carregam sem banner de cookies (uso só agregado).

## Atendimento (respostas a leads)
- Estilo do Gustavo: mensagens curtas, uma ideia por linha, uma pergunta por vez, espaço antes de "?", sem emoji, sem travessão.
- Use a skill `responder-lead`. Nunca passe preço final nem prazo menor que o padrão: pedido mínimo 20 peças, piloto em até 15 dias, produção cerca de 30 dias após a aprovação, 50% de entrada e 50% na entrega.
- Fornecedores, clientes e orçamentos ficam no Supabase (projeto `jltjhjasydsosstskkna`). Pode rodar SQL sem perguntar, mas pergunte antes de apagar dados.

## Skills
- Mantidas de propósito: atendimento (`responder-lead`, `captar-clientes`, `analisar-edital`), SEO e texto (`seo*`, `schema`, `ai-seo`, `copywriting`, `copy-editing`, `link-building`), Instagram (`ig-*`) e design do site (`design-taste-frontend`, `frontend-design`).
- `brandkit` (só um aviso de mudança), `cold-email` (repetia `captar-clientes`) e `directory-submissions` (repetia `link-building`) também foram removidas para encurtar a lista carregada em toda sessão.
- Skills de vídeo e variantes de design foram removidas e estão só no histórico do git (commit anterior a esta limpeza).

## task-observer
- Em sessões com várias etapas, invoque a skill `task-observer` no início e registre observações (correções do usuário, padrões repetidos).
- Os logs ficam em `.claude/skill-observations/` (dentro de `.claude/`, que não vai para o ar).
- Só registrar. Não altere skills nem instruções por conta das observações sem o usuário aprovar.
