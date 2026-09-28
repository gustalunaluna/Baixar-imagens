# Prompt: uma foto de produto → filme de moda

Transcrito de um Reel do Instagram de **@kimberlypoliakov** ("product to final
video" / "This entire video started with ONE product photo"). Entrada: **1
imagem de produto**. Saída: um filme curto que vai da matéria-prima ao produto
acabado, terminando com o produto em uso.

O produto de referência do exemplo é uma bolsa de ombro em jacquard indigo com
corrente prateada.

---

## O ORIGINAL (em inglês, como estava no post)

### 01 / CREATIVE DIRECTION

> Create a photorealistic luxury fashion film from the supplied product
> reference. Follow the journey from raw indigo denim to a finished shoulder
> bag, ending with an effortless city styling moment. The visual language is
> tactile, precise and cinematic: authentic atelier craftsmanship, sculptural
> silver hardware and dark blue woven texture. Every shot must feel physically
> photographed.

### 02 / PRODUCT IDENTITY

> Match the reference bag exactly. Preserve its compact shoulder silhouette,
> gently curved top opening, straight lower edge and rounded corners. Retain the
> dark indigo signature C jacquard, navy leather piping and slim leather
> shoulder strap. A polished silver curb chain drapes across the front in a soft
> U shape. Keep the silver swivel clasps, navy leather hangtag and small silver
> C charm on the correct side. Preserve the pattern scale, proportions,
> stitching and hardware count across every cut.

### 03 / [título não capturado — pelo conteúdo, é a seção de MATERIAIS]

*O começo desta seção ficou fora do print. O que apareceu:*

> [...] repeated monogram is woven into the cloth, never floating above the
> surface. Navy leather has subtle grain and a restrained satin sheen. Edge
> paint remains clean and continuous. Silver links show believable weight, micro
> scratches and crisp reflected light. Seams follow the construction of the bag.
> Keep textile texture stable as focus and camera position change.

### 04 / SHOT SEQUENCE

> OPEN on an extreme macro of a sewing machine needle piercing indigo denim. The
> presser foot advances the fabric in small, physically accurate steps. CUT to
> scissors travelling along a marked curve, revealing a clean fabric edge. MOVE
> into a shallow-focus glide across the stitched monogram surface. CUT to a
> polished clasp and chain connection, with a narrow highlight moving across the
> metal. REVEAL the navy hangtag and silver C charm. PULL BACK to the complete
> bag on a warm neutral plinth. FINISH with the bag worn on the shoulder of a
> woman dressed in [...]

*Cortou aqui. O post provavelmente segue com mais seções (iluminação, câmera,
áudio, negative prompt) que não entraram nos prints.*

---

## POR QUE ESTE PROMPT FUNCIONA

A estrutura é o ponto, não as palavras. Quatro blocos, cada um resolvendo um
problema diferente de IA de vídeo:

| Bloco | Problema que resolve |
|---|---|
| **01 Direção criativa** | Define gênero e acabamento. "Every shot must feel physically photographed" é o que tira o aspecto de render 3D. |
| **02 Identidade do produto** | **O bloco mais importante.** É o que impede a IA de inventar um produto parecido. Descreve silhueta, material, ferragem, posição de cada peça, e manda preservar *escala de padrão, proporção, costura e contagem de ferragem* em todos os cortes. |
| **03 Materiais** | Ataca os erros típicos: estampa "flutuando" sobre o tecido em vez de tecida nele, metal sem peso, textura que muda quando a câmera mexe. |
| **04 Sequência de planos** | Verbos em caixa alta (OPEN, CUT, MOVE, REVEAL, PULL BACK, FINISH) dando ordem e movimento de câmera plano a plano — em vez de deixar a IA escolher. |

A narrativa é sempre a mesma e é a que vende bolsa: **matéria-prima → mão de
obra → detalhe da ferragem → produto inteiro → produto sendo usado.**

---

## ADAPTADO PARA A LS CONFECÇÕES

Molde para uma bolsa/mochila nossa. Trocar o que está entre colchetes.

### 01 / DIREÇÃO CRIATIVA

> Create a photorealistic product film from the supplied reference. Follow the
> journey from raw [lona/nylon 600/poliéster] to a finished [mochila /
> bolsa térmica / sacola], ending with the bag being used by a real person in
> [contexto: academia, escritório, rua]. The visual language is tactile, precise
> and cinematic: authentic workshop craftsmanship, [ferragem / zíper / fita] and
> [textura do tecido]. Every shot must feel physically photographed.

### 02 / IDENTIDADE DO PRODUTO

> Match the reference bag exactly. Preserve its [silhueta], [formato da
> abertura], [base], [cantos]. Retain the [cor e tecido], [detalhe de acabamento]
> and [tipo de alça]. Keep [zíper / fivela / logo bordado] on the correct side.
> Preserve the pattern scale, proportions, stitching and hardware count across
> every cut.

### 03 / MATERIAIS

> The [logo/serigrafia] is [bordado no tecido / estampado na superfície], never
> floating above it. [Tecido] has [textura] and [brilho: fosco/acetinado]. Seams
> follow the construction of the bag. [Zíper/ferragem] shows believable weight
> and crisp reflected light. Keep textile texture stable as focus and camera
> position change.

### 04 / SEQUÊNCIA DE PLANOS

> OPEN on an extreme macro of a sewing machine needle piercing [tecido]. The
> presser foot advances the fabric in small, physically accurate steps. CUT to
> scissors travelling along a marked curve. MOVE into a shallow-focus glide
> across the [logo bordado]. CUT to the [zíper/fivela], with a narrow highlight
> moving across the metal. REVEAL the [etiqueta/tag da marca]. PULL BACK to the
> complete bag on a [fundo]. FINISH with the bag worn by [pessoa] in [cenário].

---

## NOTAS PRÁTICAS

- **O bloco 02 é onde o dinheiro está.** Sem ele a IA entrega "uma bolsa
  parecida", e bolsa parecida não vende a nossa. Quanto mais específico
  (quantos zíperes, de que lado fica a etiqueta, quantos pontos de costura
  aparecem), menos a IA inventa.
- **"Every shot must feel physically photographed"** e **"keep texture stable as
  focus and camera position change"** são as duas frases que mais derrubam o
  aspecto de IA. Valem para qualquer produto.
- A referência usa produto de marca registrada (monograma). Para publicar, o
  molde serve — **o produto tem que ser o nosso**, com a nossa marca.
