# LS Confecções (LS CONFEX): instruções do projeto

Site estático (HTML/CSS/JS) em lsconfex.com.br, hospedado na Vercel. Fábrica de bolsas, mochilas e acessórios personalizados, a partir de 20 peças por modelo e cor.

## Deploy e Git
- Trabalhe só na branch `claude/optimistic-gauss-7f5apn`. Ela vai para produção.
- Nunca abra PR sem o usuário pedir.
- Commit com autor `noreply@anthropic.com` (e-mail válido; a Vercel já bloqueou um commit com e-mail errado) e termine a mensagem com as linhas de atribuição do ambiente.
- PNG na raiz é ignorado pelo `.gitignore`: use `git add -f`.
- `.vercelignore` exclui `.claude/`, `*.md`, `tests/` e `scripts/` do deploy.

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
- Skills de vídeo e variantes de design foram removidas e estão só no histórico do git (commit anterior a esta limpeza).

## task-observer
- Em sessões com várias etapas, invoque a skill `task-observer` no início e registre observações (correções do usuário, padrões repetidos).
- Os logs ficam em `.claude/skill-observations/` (dentro de `.claude/`, que não vai para o ar).
- Só registrar. Não altere skills nem instruções por conta das observações sem o usuário aprovar.
