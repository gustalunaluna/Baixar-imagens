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

# ── 12. lastmod do sitemap desatualizado ──────────────────────
echo "## URLs com \`lastmod\` mais antigo que a última alteração real"
echo
found=0
while read -r url; do
  p="${url#https://www.lsconfex.com.br}"; p="${p#/}"
  [ -z "$p" ] && p="index"
  f="${p}.html"; [ -f "$f" ] || f="$p"; [ -f "$f" ] || continue
  real=$(git log -1 --format=%ad --date=short -- "$f" 2>/dev/null)
  lm=$(grep -A2 "<loc>${url}</loc>" sitemap.xml | grep -oE '[0-9]{4}-[0-9]{2}-[0-9]{2}' | head -1)
  [ -n "$real" ] && [ -n "$lm" ] && [ "$real" \> "$lm" ] && {
    echo "- ⚠️ \`$f\` — sitemap diz $lm, alterada em $real"; found=1; }
done < <(grep -o '<loc>[^<]*' sitemap.xml | sed 's|<loc>||')
[ "$found" = 0 ] && echo "- ✅ Todos os \`lastmod\` em dia."
echo

# ── 13. Cache do CSS/JS: versao ?v= desatualizada ─────────────
echo "## Versão do CSS e JS em cache"
echo
python3 - <<'PYC'
import glob,re,subprocess
ok=True
for arq,pat in [('css/style.css',r'style\.css\?v=(\d{8})'),('js/main.js',r'main\.js\?v=(\d{8})'),('js/consent.js',r'consent\.js\?v=(\d{8})')]:
    vs=set()
    for f in glob.glob('*.html')+glob.glob('blog/*.html'):
        vs.update(re.findall(pat,open(f,encoding='utf-8').read()))
    last=subprocess.run(['git','log','-1','--format=%ad','--date=format:%Y%m%d','--',arq],capture_output=True,text=True).stdout.strip()
    if len(vs)>1: print(f"- ⚠️ `{arq}`: páginas pedem versões diferentes {sorted(vs)}"); ok=False
    elif vs and last and last>max(vs): print(f"- ⚠️ `{arq}` mudou em {last}, mas as páginas pedem `?v={max(vs)}`. Visitantes podem receber a versão antiga do cache."); ok=False
if ok: print("- ✅ Todas as páginas pedem a versão atual de CSS e JS.")
PYC
echo

# ── 14. Cabeçalho diferente do padrão ─────────────────────────
echo "## Cabeçalho fora do padrão"
echo
python3 - <<'PYC'
import glob,re,collections
g=collections.defaultdict(list)
for f in glob.glob('*.html')+glob.glob('blog/*.html'):
    m=re.search(r'<header class="header".*?</header>',open(f,encoding='utf-8').read(),re.S)
    if not m: continue
    h=re.sub(r' class="active"','',m.group(0))
    # posts ficam em blog/ e usam ../ ; equivale ao caminho da raiz
    def raiz(x):
        v=x.group(2)
        if v.startswith('../'):
            v=v[3:]
            v='/' if v=='' else ('/'+v if v.startswith('#') else v)
        return f'{x.group(1)}="{v}"'
    h=re.sub(r'(href|src)="([^"]*)"',raiz,h)
    g[h].append(f)
if len(g)<=1: print("- ✅ Cabeçalho igual em todas as páginas.")
else:
    base=max(g,key=lambda k:len(g[k]))
    for k,v in g.items():
        if k!=base: print(f"- ⚠️ Cabeçalho diferente em: {', '.join(sorted(v))}")
PYC
echo

echo "---"
echo "_Lembrete: o principal gargalo de ranking segue sendo **autoridade/backlinks** (DR baixo). Este audit cobre on-page; para dados de acesso (cliques, impressões) conceda acesso ao Google Search Console._"
