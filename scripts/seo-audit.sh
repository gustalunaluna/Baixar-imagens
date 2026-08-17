#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Auditoria SEO periódica — LS Confecções
# Roda uma bateria de checagens on-page no site estático e
# imprime um relatório em Markdown (stdout).
#
# Uso:  bash scripts/seo-audit.sh
#       bash scripts/seo-audit.sh > relatorio-seo.md
# ─────────────────────────────────────────────────────────────
# -e propositalmente omitido: grep sem match retorna 1 e isso é esperado num relatório
set -uo pipefail
cd "$(dirname "$0")/.."

pages() { ls ./*.html blog/*.html 2>/dev/null; }
today="$(date +%Y-%m-%d 2>/dev/null || echo 'data indisponível')"

echo "# Relatório SEO — LS Confecções"
echo
echo "_Gerado em: ${today}_"
echo

# ── 1. Contagens gerais ───────────────────────────────────────
total_pages=$(pages | wc -l | tr -d ' ')
total_blog=$(ls blog/*.html 2>/dev/null | wc -l | tr -d ' ')
echo "## Visão geral"
echo
echo "- Páginas HTML: **${total_pages}**"
echo "- Artigos de blog: **${total_blog}**"
echo

# ── 2. Títulos longos (> 70) ──────────────────────────────────
echo "## Títulos com mais de 70 caracteres (truncam no Google)"
echo
found=0
for f in $(pages); do
  t=$(grep -o '<title>[^<]*</title>' "$f" | head -1 | sed 's/<[^>]*>//g')
  n=${#t}
  if [ "$n" -gt 70 ]; then echo "- \`$f\` — ${n} chars"; found=1; fi
done
[ "$found" = 0 ] && echo "- ✅ Nenhum."
echo

# ── 3. Meta descriptions ausentes ou longas (> 160) ───────────
echo "## Meta descriptions ausentes ou > 160 caracteres"
echo
found=0
for f in $(pages); do
  d=$(grep -o 'name="description" content="[^"]*"' "$f" | head -1 | sed 's/.*content="//;s/"$//')
  if [ -z "$d" ]; then
    # ignora páginas noindex
    grep -q 'noindex' "$f" || { echo "- \`$f\` — **sem meta description**"; found=1; }
  elif [ "${#d}" -gt 160 ]; then
    echo "- \`$f\` — ${#d} chars"; found=1
  fi
done
[ "$found" = 0 ] && echo "- ✅ Nenhum."
echo

# ── 4. H1 diferente de 1 ──────────────────────────────────────
echo "## Páginas com número de H1 diferente de 1"
echo
found=0
for f in $(pages); do
  n=$(grep -o '<h1' "$f" | wc -l | tr -d ' ')
  [ "$n" != "1" ] && { echo "- \`$f\` — H1=${n}"; found=1; }
done
[ "$found" = 0 ] && echo "- ✅ Todas com exatamente 1 H1."
echo

# ── 5. Imagens sem alt (ignora pixels de tracking) ────────────
echo "## Imagens sem atributo alt"
echo
n=$(grep -rho '<img [^>]*>' ./*.html blog/*.html 2>/dev/null | grep -v 'alt=' | grep -v 'facebook.com/tr' | wc -l | tr -d ' ')
if [ "$n" = 0 ]; then echo "- ✅ Nenhuma (fora pixels de tracking)."; else echo "- ⚠️ ${n} imagem(ns) sem alt."; fi
echo

# ── 6. Consistência de marca "Confeccoes" sem cedilha ─────────
echo "## Marca escrita sem cedilha (\"Confeccoes\")"
echo
n=$(grep -rho 'Confeccoes' ./*.html blog/*.html 2>/dev/null | wc -l | tr -d ' ')
if [ "$n" = 0 ]; then echo "- ✅ Nenhuma ocorrência."; else echo "- ⚠️ ${n} ocorrência(s) — padronizar para \"Confecções\"."; fi
echo

# ── 7. Logo em PNG (deveria ser WebP) ─────────────────────────
echo "## Logo do cabeçalho em PNG (deveria ser WebP)"
echo
files=$(grep -rl 'logo-icon.png' ./*.html blog/*.html 2>/dev/null || true)
if [ -z "$files" ]; then echo "- ✅ Todos em WebP."; else echo "$files" | sed 's/^/- ⚠️ /'; fi
echo

# ── 8. Links internos quebrados ───────────────────────────────
echo "## Links internos quebrados (.html inexistente)"
echo
found=0
for l in $(grep -rhoE 'href="[a-zA-Z0-9/_.-]+\.html' ./*.html blog/*.html 2>/dev/null | sed 's/href="//' | sort -u); do
  [ -f "$l" ] || [ -f "blog/$l" ] || [ -f "${l#blog/}" ] || { echo "- ⚠️ \`$l\`"; found=1; }
done
[ "$found" = 0 ] && echo "- ✅ Nenhum."
echo

# ── 9. Páginas fora do sitemap ────────────────────────────────
echo "## Páginas indexáveis fora do sitemap.xml"
echo
found=0
if [ -f sitemap.xml ]; then
  for f in $(pages | grep -vE '404|obrigado'); do
    base="${f#./}"
    [ "$base" = "index.html" ] && continue   # raiz entra como /
    # site usa cleanUrls: o sitemap lista as URLs sem .html
    clean="${base%.html}"
    grep -q "/${clean}<" sitemap.xml || grep -q "${clean}<" sitemap.xml || { echo "- ⚠️ \`$base\`"; found=1; }
  done
  [ "$found" = 0 ] && echo "- ✅ Todas cobertas."
else
  echo "- ⚠️ sitemap.xml não encontrado."
fi
echo

# ── 10. Artigos de blog rasos (< 800 palavras) ────────────────
echo "## Artigos de blog com menos de 800 palavras"
echo
found=0
for f in blog/*.html; do
  w=$(sed 's/<[^>]*>//g' "$f" | tr -s ' \n' ' ' | wc -w | tr -d ' ')
  [ "$w" -lt 800 ] && { echo "- \`$f\` — ${w} palavras"; found=1; }
done
[ "$found" = 0 ] && echo "- ✅ Todos com 800+ palavras."
echo

# ── 11. Imagens não-WebP referenciadas ────────────────────────
echo "## Imagens referenciadas fora do formato WebP"
echo
n=$(grep -rhoE 'src="(\.\./)?imagens/[^"]+\.(jpg|jpeg|png)"' ./*.html blog/*.html 2>/dev/null | sort -u | wc -l | tr -d ' ')
if [ "$n" = 0 ]; then echo "- ✅ Todas em WebP."; else echo "- ⚠️ ${n} referência(s) a JPG/PNG (considerar WebP)."; fi
echo

echo "---"
echo "_Lembrete: o principal gargalo de ranking segue sendo **autoridade/backlinks** (DR baixo). Este audit cobre on-page; para dados de acesso (cliques, impressões) conceda acesso ao Google Search Console._"
