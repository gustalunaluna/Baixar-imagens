#!/usr/bin/env python3
"""Gera o catálogo comercial da LS Confecções (HTML -> PDF A4).

Uso (a partir da raiz do repositório):
    python3 brand/catalogo/build.py
    node brand/catalogo/pdf.cjs
Lê os produtos de produtos.html, prepara as fotos em brand/catalogo/img/
e escreve brand/catalogo/catalogo.html.
"""
import base64, html, os, re, sys
from PIL import Image, ImageStat
import qrcode

RAIZ = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
OUT = os.path.dirname(os.path.abspath(__file__))
IMG = os.path.join(OUT, "img")
os.makedirs(IMG, exist_ok=True)

# Fotos com cara de anúncio (texto, colagem) ou resolução baixa demais para impressão
FORA = {"Mochila Tática 45L", "Mochila Sapateira", "Bolsa Maternidade Soft", "Kit Maternidade Completo",
        "Raqueteira Beach Tennis", "Pochete Crossbody Cotelê", "Cooler Bag"}

LINHAS = [
    dict(id="mochilas", nome="Mochilas", resumo="Peças estruturadas para uso diário, esporte, trabalho e viagem. Você escolhe tecido, compartimentos e acabamento de acordo com o posicionamento da sua marca.",
         pers=["Bordado", "Silk", "Sublimação", "Etiqueta tecida e tag", "Compartimentos", "Tecido e forro"], preco="R$ 90 a R$ 250 por peça"),
    dict(id="pochetes", nome="Pochetes", resumo="Compactas, leves e de alto giro. Funcionam bem em coleções streetwear, linhas esportivas e kits de brinde, com ótimo custo por peça.",
         pers=["Bordado", "Silk", "Patch emborrachado", "Etiqueta tecida", "Cores do tecido", "Zíper e fivela"], preco="R$ 40 a R$ 95 por peça"),
    dict(id="shoulder", nome="Shoulder Bags", resumo="Formato compacto e urbano, usado cruzado ou no ombro. Um item essencial em coleções streetwear, com várias opções de tamanho e fechamento.",
         pers=["Bordado", "Silk", "Patch emborrachado", "Aba e fecho", "Alça ajustável", "Cores do tecido"], preco="R$ 45 a R$ 120 por peça"),
    dict(id="sling", nome="Sling e Crossbody", resumo="Bolsas de uso cruzado no peito ou nas costas, do visual técnico ao acolchoado. Ideais para marcas urbanas, outdoor e de lifestyle.",
         pers=["Estampa exclusiva", "Bordado", "Patch personalizado", "Fita bordada", "Fivelas táticas", "Cores do tecido"], preco="R$ 50 a R$ 110 por peça"),
    dict(id="tote", nome="Tote Bags e Ecobags", resumo="Grande área frontal para a sua arte. Funcionam em coleções de moda, eventos, feiras e kits corporativos, do canvas cru ao jeans.",
         pers=["Silk", "Bordado", "Transfer", "Lona ou jeans", "Alças e ferragens", "Forro interno"], preco="R$ 50 a R$ 130 por peça"),
    dict(id="viagem", nome="Viagem e Esporte", resumo="Malas de mão, bolsas de viagem, gym bags e peças para a rotina de treino. Estrutura reforçada para carregar peso com conforto.",
         pers=["Bordado", "Silk", "Etiqueta tecida", "Compartimento para calçado", "Alça transversal", "Tecido resistente à água"], preco="Sob consulta, conforme modelo e lote"),
    dict(id="acessorios", nome="Acessórios", resumo="Necessaires, carteiras, porta-moedas e mini bags que completam a coleção ou o kit de brinde, com baixo custo por peça.",
         pers=["Bordado", "Silk", "Patch emborrachado", "Etiqueta tecida", "Zíper e ferragens", "Cores e tecidos"], preco="R$ 20 a R$ 180 por peça"),
]


def linha_de(cats, tag, nome):
    c = cats.split()
    if nome in ("Tote Bag Skull Vintage",): return "tote"
    if "mochilas" in c: return "mochilas"
    if "pochetes" in c: return "pochetes"
    if "shoulder" in c: return "shoulder"
    if "slingbag" in c: return "sling"
    if "tote" in c or "ecobag" in c: return "tote"
    if "mala" in c or "esportivo" in c or "maternidade" in c: return "viagem"
    if "bolsas" in c: return "sling"
    return "acessorios"


def quadrada(src, dst, lado=640):
    im = Image.open(src).convert("RGB")
    w, h = im.size
    borda = Image.new("RGB", (4, 1))
    px = [im.getpixel(p) for p in ((2, 2), (w - 3, 2), (2, h - 3), (w - 3, h - 3), (w // 2, 2), (2, h // 2), (w - 3, h // 2))]
    claro = sum(1 for p in px if min(p) > 232) >= 5
    if claro:
        # produto em fundo claro: mantém inteiro, com margem
        m = max(w, h)
        c = Image.new("RGB", (m, m), tuple(sorted(px)[len(px) // 2]))
        c.paste(im, ((m - w) // 2, (m - h) // 2))
        im = c
    else:
        m = min(w, h)
        topo = 0 if h <= w else int((h - m) * 0.25)
        im = im.crop(((w - m) // 2, topo, (w - m) // 2 + m, topo + m))
    im.resize((lado, lado), Image.LANCZOS).save(dst, "JPEG", quality=86)
    return claro


def ler_produtos():
    s = open(os.path.join(RAIZ, "produtos.html"), encoding="utf-8").read()
    prods = []
    for m in re.finditer(r'(?s)<div class="catalog-product-card[^"]*" data-category="([^"]+)">(.*?)</a>', s):
        b = m.group(2)
        nome = html.unescape(re.search(r"<h3>(.*?)</h3>", b).group(1))
        if nome in FORA: continue
        img = re.search(r'<img src="imagens/([^"?]+)', b).group(1)
        desc = html.unescape(re.search(r"<p>(.*?)</p>", b, re.S).group(1)).replace(" Modelo produzido para cliente.", "")
        tag = re.search(r'product-tag">([^<]*)', b).group(1)
        slug = re.sub(r"[^a-z0-9]+", "-", os.path.splitext(os.path.basename(img))[0].lower()).strip("-")
        dst = os.path.join(IMG, slug + ".jpg")
        claro = quadrada(os.path.join(RAIZ, "imagens", img), dst)
        prods.append(dict(nome=nome, desc=desc, img="img/" + slug + ".jpg", linha=linha_de(m.group(1), tag, nome), claro=claro))
    return prods


def foto(src, nome, tam, corte=None):
    im = Image.open(os.path.join(RAIZ, "imagens", src)).convert("RGB")
    if corte: im = im.crop(corte)
    im.thumbnail(tam, Image.LANCZOS)
    im.save(os.path.join(IMG, nome), "JPEG", quality=88)
    return "img/" + nome


def logo_marca():
    s = open(os.path.join(RAIZ, "favicon.svg")).read()
    b = re.search(r"base64,([^\"]+)", s).group(1)
    open(os.path.join(IMG, "marca.png"), "wb").write(base64.b64decode(b))
    return "img/marca.png"


def qr(url, nome):
    q = qrcode.QRCode(border=1, box_size=12, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(url); q.make(fit=True)
    q.make_image(fill_color="#0a0a0a", back_color="#e8ff00").save(os.path.join(IMG, nome))
    return "img/" + nome


def e(t): return html.escape(t, quote=True)


def main():
    prods = ler_produtos()
    marca = logo_marca()
    capa = foto("hero-campanha.jpeg", "capa.jpg", (1800, 1800))
    sobre = foto("hero-fabricante-bolsas-mochilas-personalizadas.webp", "sobre.jpg", (1200, 1200), (170, 120, 730, 815))
    parede = foto("hero-catalogo.webp", "parede.jpg", (1200, 1200))
    zap = "https://wa.me/5511999370418?text=" + "Ol%C3%A1%21%20Vi%20o%20cat%C3%A1logo%20da%20LS%20Confec%C3%A7%C3%B5es%20e%20quero%20um%20or%C3%A7amento."
    qrcode_img = qr(zap, "qr.png")
    clientes = []
    for f, n in [("logo-bolovo.png", "Bolovo"), ("logo-thugnine.png", "Thug Nine"), ("logo-dubs.png", "Dubs"), ("logo-disturb.png", "Disturb"),
                 ("logo-alfa.png", "Alfa"), ("logo-coroa.png", "Coroa"), ("logo-flamengo.png", "Flamengo"), ("logo-vasco.png", "Vasco")]:
        Image.open(os.path.join(RAIZ, "imagens", f)).convert("RGBA").save(os.path.join(IMG, f))
        clientes.append(("img/" + f, n))

    pg = []  # (classe, html)
    rodape_n = [0]

    def pagina(conteudo, classe=""):
        pg.append((classe, conteudo))

    # 1. Capa
    pagina(f'''
      <div class="capa-topo"><img src="{marca}" alt=""><span>LS CONFEX</span><em>LS Confecções</em></div>
      <div class="capa-titulo"><small>Catálogo de produtos · 2026/27</small><h1>Bolsas, mochilas e acessórios <b>com a sua marca</b></h1>
        <p>Fábrica própria em Guarulhos (SP). Private label e brindes corporativos a partir de 20 peças por modelo e cor.</p></div>
      <div class="capa-foto" style="background-image:url({capa})"></div>
      <div class="capa-base"><span>Desde 2017</span><span>Fabricação B2B</span><span>lsconfex.com.br</span></div>''', "capa escura")

    # 2. Quem somos
    pagina(f'''
      <header class="cab"><small>Quem somos</small><h2>Uma fábrica para marcas que querem produto próprio</h2></header>
      <div class="duas">
        <div class="texto">
          <p class="lead">A LS Confecções, marca LS CONFEX, é uma fábrica B2B que produz do zero, com a marca do cliente, bolsas, mochilas, pochetes, ecobags, necessaires e outros acessórios de tecido.</p>
          <p>Atendemos marcas próprias em private label e empresas que procuram brindes corporativos com acabamento de produto de loja. Cada projeto começa por uma peça piloto: você aprova a peça física antes de produzirmos o lote.</p>
          <p>A produção acontece na nossa fábrica própria em Guarulhos (SP). O atendimento comercial fica na Vila Carrão, em São Paulo (SP).</p>
          <div class="pessoas">
            <div><b>Gustavo</b><span>Comercial. Recebe o briefing, prepara o orçamento e acompanha o seu pedido.</span></div>
            <div><b>Antônio</b><span>Produção e pilotagem. Desenvolve a peça piloto e conduz o lote.</span></div>
          </div>
        </div>
        <div class="foto-alta" style="background-image:url({sobre})"></div>
      </div>
      <div class="numeros">
        <div><b>2017</b><span>ano de fundação</span></div>
        <div><b>+500</b><span>clientes atendidos</span></div>
        <div><b>20</b><span>peças de pedido mínimo, por modelo e cor</span></div>
        <div><b>15 dias</b><span>prazo máximo da peça piloto</span></div>
      </div>
      <div class="confiam"><small>Quem confia na gente</small><div class="logos">{''.join(f'<img src="{a}" alt="{e(n)}">' for a, n in clientes)}</div>
        <p>Produzimos para marcas de moda, clubes de futebol e empresas de todo o Brasil.</p></div>''')

    # 3. O que fazemos
    pagina(f'''
      <header class="cab"><small>O que fazemos</small><h2>Três formas de produzir com a LS</h2></header>
      <div class="frentes">
        <article><i>01</i><h3>Private label</h3><p>Você traz a sua marca e nós fabricamos a coleção: modelagem, tecido, aviamentos, personalização e acabamento, com etiqueta e tag suas.</p><ul><li>Coleções de marcas de moda e streetwear</li><li>Linhas esportivas e outdoor</li><li>Produto próprio para lojas e e-commerces</li></ul></article>
        <article><i>02</i><h3>Brindes corporativos</h3><p>Peças úteis, que as pessoas usam de verdade, com a identidade da sua empresa. Do kit de boas-vindas ao brinde de evento.</p><ul><li>Kits de onboarding e fim de ano</li><li>Eventos, feiras e corridas de rua</li><li>Ações com clientes e parceiros</li></ul></article>
        <article><i>03</i><h3>Modelo exclusivo</h3><p>Não encontrou no catálogo? Desenvolvemos a partir de uma foto de referência e do seu briefing, sem necessidade de desenho técnico.</p><ul><li>Peça piloto antes do lote</li><li>Ajustes de medida, bolsos e fechos</li><li>Materiais definidos junto com você</li></ul></article>
      </div>
      <div class="faixa-foto" style="background-image:url({parede})"><div><small>Do briefing à entrega</small><p>Um único parceiro para modelar, costurar e personalizar a sua linha.</p></div></div>''')

    # 4. Materiais e personalização
    tecidos = ["Nylon", "Poliéster", "Oxford", "Oxford resinado", "Cordura", "Ripstop", "Lona", "Sarja", "Tactel", "Algodão cru", "Nylon emborrachado", "Tela", "Sherpa", "Cotelê"]
    tecnicas = [("Bordado", "Relevo e durabilidade. Indicado para logos em lona, sarja e nylon."),
                ("Silk (serigrafia)", "Cores chapadas com ótimo custo em volume."),
                ("Patch emborrachado", "Aplicação em relevo, resistente e com cara de produto de marca."),
                ("Etiqueta tecida", "Acabamento discreto, costurado na peça."),
                ("Sublimação", "Estampa em toda a peça, com cores ilimitadas, em tecidos de poliéster."),
                ("Hot stamp", "Marcação a quente para detalhes pontuais."),
                ("Sua etiqueta", "Aplicamos a etiqueta ou a tag que você fornecer.")]
    pagina(f'''
      <header class="cab"><small>Materiais e personalização</small><h2>Do tecido ao último detalhe</h2></header>
      <div class="bloco"><h3>Tecidos com que trabalhamos</h3><div class="chips">{''.join(f'<span>{e(t)}</span>' for t in tecidos)}</div>
        <p class="nota">A escolha do tecido define peso, toque, resistência e a técnica de personalização. Indicamos a melhor combinação para o uso e para o preço-alvo da sua peça, e você confirma tudo na peça piloto.</p></div>
      <div class="bloco"><h3>Como a sua marca entra na peça</h3><div class="tecnicas">{''.join(f'<div><b>{e(a)}</b><span>{e(b)}</span></div>' for a, b in tecnicas)}</div></div>
      <div class="bloco destaque"><h3>O que você pode definir</h3><div class="defs">
        <div><b>Modelo</b><span>Medidas, bolsos, compartimentos e fechos</span></div><div><b>Cores</b><span>Tecido, forro, zíper, fitas e fivelas</span></div>
        <div><b>Acabamento</b><span>Alças, reforços, puxadores e aviamentos</span></div><div><b>Embalagem</b><span>Tag, etiqueta interna e identificação do lote</span></div></div></div>''')

    # 5. Como funciona
    passos = [("Referência", "Você envia a sua ideia, um modelo deste catálogo ou uma foto de referência, com tecido, cores e personalização desejados.", "Pelo WhatsApp"),
              ("Orçamento", "Analisamos o projeto e enviamos a proposta com valores e prazo.", "Resposta em até 24h úteis"),
              ("Peça piloto", "Produzimos uma peça piloto para a sua aprovação. O lote só começa depois do seu ok.", "Em até 15 dias"),
              ("Produção", "Fabricação na nossa fábrica, a partir de 20 peças por modelo e cor, com controle de qualidade em cada etapa.", "Cerca de 30 dias após a aprovação"),
              ("Entrega", "Seu lote pronto, com a sua marca, para vender, presentear ou lançar a sua coleção.", "Envio para todo o Brasil")]
    pagina(f'''
      <header class="cab"><small>Como funciona</small><h2>Nosso processo, em cinco etapas</h2></header>
      <ol class="passos">{''.join(f'<li><i>{n:02d}</i><div><h3>{e(a)}</h3><p>{e(b)}</p></div><span>{e(c)}</span></li>' for n, (a, b, c) in enumerate(passos, 1))}</ol>
      <div class="condicoes">
        <div><small>Pedido mínimo</small><b>20 peças</b><span>por modelo e cor</span></div>
        <div><small>Peça piloto</small><b>Até 15 dias</b><span>aprovada por você antes do lote</span></div>
        <div><small>Produção</small><b>Cerca de 30 dias</b><span>após a aprovação da piloto</span></div>
        <div><small>Pagamento</small><b>50% + 50%</b><span>entrada e saldo na entrega</span></div>
      </div>
      <div class="garantia"><div class="g-num"><b>1 ano</b><span>de garantia</span></div><div><h3>Todos os nossos produtos têm 1 ano de garantia.</h3><p>Confiamos no que fabricamos. Cada peça passa por controle de qualidade antes de sair da fábrica, para que a sua marca chegue ao cliente com segurança.</p></div></div>''')

    # 6. Linhas (índice): preenchido depois de calcular as páginas
    indice_pos = len(pg)
    pagina("", "indice")

    # 7+. Linhas
    POR = 9
    inicio = {}
    for n, L in enumerate(LINHAS, 1):
        itens = [p for p in prods if p["linha"] == L["id"]]
        L["itens"] = itens
        inicio[L["id"]] = len(pg) + 1
        partes = [itens[i:i + POR] for i in range(0, len(itens), POR)]
        for k, parte in enumerate(partes):
            ultimo = k == len(partes) - 1
            cards = "".join(f'<figure><div class="ph{" claro" if p["claro"] else ""}"><img src="{p["img"]}" alt=""></div><figcaption><b>{e(p["nome"])}</b><span>{e(p["desc"])}</span></figcaption></figure>' for p in parte)
            painel = ""
            if ultimo:
                fundo = next((p["img"] for p in itens if not p["claro"]), itens[0]["img"])
                painel = f'''<aside class="painel" style="--f:url({fundo})"><div class="p-esq"><small>Personalize esta linha</small><p>{e(L["resumo"])}</p></div>
                  <div class="p-dir"><div><small>Personalizações</small><div class="chips">{''.join(f'<span>{e(x)}</span>' for x in L["pers"])}</div></div>
                  <div class="p-info"><div><small>Pedido mínimo</small><b>20 peças por modelo e cor</b></div><div><small>Faixa de referência</small><b>{e(L["preco"])}</b></div></div></div></aside>'''
            cont = f' <em>continuação</em>' if k else ""
            pagina(f'''<header class="cab linha"><small>Linha {n:02d}{cont}</small><h2>{e(L["nome"])}</h2><span class="fantasma">{n:02d}</span></header>
              <div class="grade{' quatro' if len(itens) <= 8 else ''}">{cards}</div>{painel}''', "linha-pg")

    # Índice
    CAPAS = {"mochilas": "Mochila Color Block", "pochetes": "Pochete Bicolor Canvas", "shoulder": "Shoulder Bag Zíper Duplo", "sling": "Sling Bag Tático",
             "tote": "Tote Bag Good Day", "viagem": "Mala Explorer", "acessorios": "Necessaire Travel"}
    for L in LINHAS:
        L["capa"] = next(p for p in L["itens"] if p["nome"] == CAPAS[L["id"]])
    tiles = "".join(f'<a><div class="t-img{" claro" if L["capa"]["claro"] else ""}" style="background-image:url({L["capa"]["img"]})"></div><div class="t-txt"><i>{n:02d}</i><b>{e(L["nome"])}</b><span>{len(L["itens"])} modelos · página {inicio[L["id"]]:02d}</span></div></a>' for n, L in enumerate(LINHAS, 1))
    total = sum(len(L["itens"]) for L in LINHAS)
    pg[indice_pos] = ("", f'''<header class="cab"><small>Nossas linhas</small><h2>{total} modelos para a sua marca</h2></header>
      <p class="lead estreito">Todos os modelos podem ser produzidos com o seu tecido, as suas cores e a sua marca. As fotos mostram peças fabricadas por nós para clientes e servem como ponto de partida para o seu projeto.</p>
      <div class="tiles">{tiles}<a class="t-cta"><div><small>Não encontrou?</small><b>Criamos o seu modelo a partir de uma referência.</b><span>Fale com o nosso comercial</span></div></a></div>''')

    # Contracapa
    pagina(f'''
      <div class="capa-topo"><img src="{marca}" alt=""><span>LS CONFEX</span><em>LS Confecções</em></div>
      <div class="fim"><small>Vamos conversar</small><h2>Pronto para produzir <b>a sua linha?</b></h2>
        <p>Envie a referência do modelo, a quantidade e a sua logo. Você recebe uma proposta sob medida em até 24h úteis.</p></div>
      <div class="contato">
        <div class="qr"><img src="{qrcode_img}" alt="QR Code do WhatsApp"><span>Aponte a câmera e fale com o Gustavo no WhatsApp</span></div>
        <dl><dt>WhatsApp</dt><dd>(11) 99937-0418 · Gustavo</dd><dt>E-mail</dt><dd>ls_confeccoes@hotmail.com</dd><dt>Site</dt><dd>lsconfex.com.br</dd><dt>Instagram</dt><dd>@lsconfex</dd>
        <dt>Escritório</dt><dd>Rua Biguaçu, 286, Vila Carrão, São Paulo/SP</dd><dt>Fábrica</dt><dd>Guarulhos/SP</dd></dl>
      </div>
      <div class="capa-base"><span>LS Confecções · CNPJ 32.200.335/0001-40</span><span>Fundada em 2017</span></div>''', "capa escura fim-pg")

    n = len(pg)
    corpo = ""
    for i, (classe, c) in enumerate(pg, 1):
        rod = "" if "capa" in classe else f'<footer class="rod"><span><b>LS Confecções</b> · Fabricação B2B · Guarulhos/SP</span><span>lsconfex.com.br · @lsconfex · (11) 99937-0418</span><span>{i:02d} / {n:02d}</span></footer>'
        corpo += f'<section class="page {classe}">{c}{rod}</section>\n'
    css = open(os.path.join(OUT, "catalogo.css"), encoding="utf-8").read()
    doc = f'<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Catálogo LS Confecções 2026/27</title><style>{css}</style></head><body>{corpo}</body></html>'
    assert "—" not in doc
    open(os.path.join(OUT, "catalogo.html"), "w", encoding="utf-8").write(doc)
    print(n, "páginas ·", total, "modelos ·", {L["nome"]: len(L["itens"]) for L in LINHAS})


if __name__ == "__main__":
    main()
