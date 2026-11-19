"""Gera llms-full.txt: o llms.txt seguido do texto principal de cada página do sitemap.
Rodar da raiz do repositório: python3 scripts/gerar-llms-full.py"""
import re, html, os
BASE = "https://www.lsconfex.com.br"
urls = re.findall(r"<loc>([^<]+)</loc>", open("sitemap.xml", encoding="utf-8").read())
pular = ("/politica-de-privacidade", "/termos-de-uso", "/mapa-do-site", "/obrigado", "/404")
def texto(s):
    m = re.search(r"<main\b.*?</main>", s, re.S)
    s = m.group(0) if m else s
    s = re.sub(r"<(script|style|svg|noscript|form|nav)\b.*?</\1>", " ", s, flags=re.S)
    s = re.sub(r"<(h[1-6])\b[^>]*>", lambda m: "\n\n" + "#" * (int(m.group(1)[1]) + 1) + " ", s)
    s = re.sub(r"</h[1-6]>", "\n", s)
    s = re.sub(r"<li\b[^>]*>", "\n- ", s)
    s = re.sub(r"<(p|br|tr|div|section|article)\b[^>]*>", "\n", s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s)
    s = re.sub(r"[ \t ]+", " ", s)
    s = re.sub(r" +([.,;:!?])", r"\1", s)
    s = re.sub(r" *\n *", "\n", s)
    s = re.sub(r"\n{3,}", "\n\n", s)
    return s.strip()
partes = [open("llms.txt", encoding="utf-8").read().strip(), "\n---\n\n# Conteúdo completo das páginas\n"]
for u in urls:
    caminho = u.replace(BASE, "").rstrip("/") or "/index"
    if caminho.startswith(pular): continue
    arq = caminho.lstrip("/") + ".html"
    if not os.path.exists(arq): continue
    s = open(arq, encoding="utf-8").read()
    t = re.search(r"<title>([^<]*)</title>", s)
    partes.append(f"\n## {html.unescape(t.group(1)) if t else caminho}\nURL: {u}\n\n{texto(s)}\n")
open("llms-full.txt", "w", encoding="utf-8").write("\n".join(partes))
print("llms-full.txt", os.path.getsize("llms-full.txt"), "bytes")
