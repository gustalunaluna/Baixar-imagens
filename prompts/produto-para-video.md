# Prompt: uma foto de produto → filme de moda

Transcrito de um Reel do Instagram de **@kimberlypoliakov** ("product to final
video" / "This entire video started with ONE product photo"). Entrada: **1
imagem de produto**. Saída: um filme curto que vai da matéria-prima ao produto
acabado, terminando com o produto em uso.

O produto de referência é uma bolsa de ombro em jacquard indigo com corrente
prateada. A cena final é dentro de um elevador.

**Nove blocos numerados.** O que ficou cortado nos prints está marcado como
cortado — não preenchi nada de cabeça.

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

### 03 / [título e primeira linha cortados — é o bloco de MATERIAIS]

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

*O final desta frase ficou cortado. Pelo bloco 06, a cena é num elevador.*

### 05 / CAMERA & LENSES

> Use a 100 mm macro look for needle, fibers, stitching and metal details. Shift
> to an 85 mm product lens for the complete silhouette, then a 50 mm editorial
> lens for the elevator scene. Motion is controlled: slow lateral slides, short
> push-ins and deliberate focus pulls. Cut on hand movement and the direction of
> the chain. Maintain natural perspective and realistic depth of field. Avoid
> exaggerated lens distortion or unstable camera drift.

### 06 / [título cortado — é o bloco de LUZ E COR]

> Shape the [...] scenes with soft directional window light and deep, clean
> shadows. Add narrow specular highlights to the silver hardware without
> clipping reflections. Preserve rich indigo and slate-blue tones in the denim;
> avoid crushed detail. The product reveal uses a warm neutral surface against a
> subdued dark background. In the elevator, cooler overhead light and
> brushed-metal reflections create a contemporary editorial mood. Skin tones
> stay natural.

### 07 / MOTION & CONTINUITY

> Hands apply credible pressure to the fabric. The needle reciprocates
> vertically while the material feeds forward. Scissors articulate around their
> pivot. Chain links remain connected and settle under gravity. The strap
> carries the weight of the bag without stretching or changing length. During
> the shoulder shot, the bag moves subtly with the wearer. Maintain consistent
> product identity, material scale and attachment points throughout.

### 08 / EDIT & SOUND

> Build a concise, confident rhythm: tactile process details, polished hardware,
> full product reveal, then the final styling moment. Use clean cuts and
> motivated transitions. Let sewing-machine clicks, fabric movement, scissor
> cuts and restrained metallic chain sounds support the imagery. Keep the final
> product readable before the film ends. Deliver crisp, natural motion and a
> refined fashion-campaign finish.

### 09 / QUALITY CONSTRAINTS

> No altered monogram, extra chain, missing clasp, floating hardware or
> distorted bag silhouette. No melting fabric, plastic-looking denim,
> oversmoothed leather, impossible reflections, warped hands or inconsistent
> stitching. Do not add titles, captions or new branding inside the generated
> footage. Preserve the supplied product design in every frame.

---

## POR QUE ESTE PROMPT FUNCIONA

A estrutura é o valor, não as palavras. Cada bloco resolve um problema
específico de IA de vídeo:

| Bloco | Problema que resolve |
|---|---|
| **01 Direção** | Gênero e acabamento. `Every shot must feel physically photographed` é o que tira a cara de render 3D. |
| **02 Identidade** | **O bloco mais importante.** Impede a IA de entregar um produto *parecido*. Silhueta, material, ferragem, lado de cada peça — e a ordem de preservar escala do padrão, proporção, costura e contagem de ferragem em todos os cortes. |
| **03 Materiais** | Estampa tecida no pano e não flutuando sobre ele; metal com peso e microarranhão; textura estável quando o foco e a câmera mudam. |
| **04 Planos** | Verbos em caixa alta (OPEN, CUT, MOVE, REVEAL, PULL BACK, FINISH) ditando ordem e movimento, em vez de deixar a IA escolher. |
| **05 Câmera** | Lente por tipo de plano: **100 mm macro** no detalhe, **85 mm** no produto inteiro, **50 mm** na cena com pessoa. E manda cortar no movimento da mão — regra de montagem de verdade. |
| **06 Luz e cor** | Luz de janela direcional, brilho especular estreito no metal sem estourar, preservar o azul sem "esmagar" o detalhe. Muda a luz entre oficina e cena final. |
| **07 Movimento** | **Física.** Mão faz pressão crível, agulha sobe e desce enquanto o tecido avança, tesoura gira no pino, elo de corrente fica conectado e cai com a gravidade, alça não estica. É o bloco que separa vídeo de IA de vídeo filmado. |
| **08 Montagem e som** | Ritmo e áudio diegético: clique de máquina, tecido, tesoura, corrente contida. E `keep the final product readable before the film ends` — o produto tem que dar pra ler antes de acabar. |
| **09 Restrições** | Lista do que **não** pode: monograma alterado, corrente a mais, fecho faltando, ferragem flutuando, tecido derretendo, jeans com cara de plástico, couro liso demais, reflexo impossível, mão torta, costura inconsistente. E: **não inventar texto nem marca dentro do vídeo**. |

A narrativa é sempre a mesma, e é a que vende bolsa:
**matéria-prima → mão de obra → detalhe da ferragem → produto inteiro → produto sendo usado.**

---

## ADAPTADO PARA A LS CONFECÇÕES

Molde completo. Trocar o que está entre colchetes.

**01 / DIREÇÃO CRIATIVA**
> Create a photorealistic product film from the supplied reference. Follow the
> journey from raw [lona / nylon 600 / poliéster] to a finished [mochila /
> bolsa térmica / sacola], ending with the bag being used in [academia /
> escritório / rua]. The visual language is tactile, precise and cinematic:
> authentic workshop craftsmanship, [ferragem / zíper / fita] and [textura].
> Every shot must feel physically photographed.

**02 / IDENTIDADE DO PRODUTO**
> Match the reference bag exactly. Preserve its [silhueta], [formato da
> abertura], [base] and [cantos]. Retain the [cor e tecido], [acabamento de
> borda] and [tipo de alça]. Keep [zíper / fivela / logo bordado] on the correct
> side. Preserve the pattern scale, proportions, stitching and hardware count
> across every cut.

**03 / MATERIAIS**
> The [logo] is [bordado no tecido / estampado na superfície], never floating
> above it. [Tecido] has [textura] and a [fosco / acetinado] sheen. Seams follow
> the construction of the bag. [Zíper / ferragem] shows believable weight and
> crisp reflected light. Keep textile texture stable as focus and camera
> position change.

**04 / SEQUÊNCIA DE PLANOS**
> OPEN on an extreme macro of a sewing machine needle piercing [tecido]. The
> presser foot advances the fabric in small, physically accurate steps. CUT to
> scissors travelling along a marked curve. MOVE into a shallow-focus glide
> across the [logo bordado]. CUT to the [zíper / fivela], with a narrow
> highlight moving across the metal. REVEAL the [etiqueta da marca]. PULL BACK
> to the complete bag on a [fundo]. FINISH with the bag [worn by / carried by]
> [pessoa] in [cenário].

**05 / CÂMERA E LENTES**
> Use a 100 mm macro look for needle, fibers, stitching and hardware details.
> Shift to an 85 mm product lens for the complete silhouette, then a 50 mm
> editorial lens for the [cenário final]. Motion is controlled: slow lateral
> slides, short push-ins and deliberate focus pulls. Cut on hand movement.
> Maintain natural perspective and realistic depth of field. Avoid exaggerated
> lens distortion or unstable camera drift.

**06 / LUZ E COR**
> Shape the workshop scenes with soft directional window light and deep, clean
> shadows. Add narrow specular highlights to the [ferragem] without clipping
> reflections. Preserve rich [cor do tecido] tones; avoid crushed detail. The
> product reveal uses a [fundo] against a subdued background. In the [cenário
> final], [qualidade da luz] creates a contemporary editorial mood. Skin tones
> stay natural.

**07 / MOVIMENTO E CONTINUIDADE**
> Hands apply credible pressure to the fabric. The needle reciprocates
> vertically while the material feeds forward. Scissors articulate around their
> pivot. [Zíper corre / fivela trava] believably. The strap carries the weight
> of the bag without stretching or changing length. During the final shot, the
> bag moves subtly with the wearer. Maintain consistent product identity,
> material scale and attachment points throughout.

**08 / MONTAGEM E SOM**
> Build a concise, confident rhythm: tactile process details, hardware, full
> product reveal, then the final moment. Use clean cuts and motivated
> transitions. Let sewing-machine clicks, fabric movement and scissor cuts
> support the imagery. Keep the final product readable before the film ends.
> Deliver crisp, natural motion and a refined campaign finish.

**09 / RESTRIÇÕES DE QUALIDADE**
> No altered logo, extra hardware, missing [zíper / fivela], floating hardware
> or distorted bag silhouette. No melting fabric, plastic-looking [tecido],
> impossible reflections, warped hands or inconsistent stitching. Do not add
> titles, captions or new branding inside the generated footage. Preserve the
> supplied product design in every frame.

---

## NOTAS PRÁTICAS

- **02 e 09 são o par que segura o produto.** O 02 diz o que preservar, o 09
  lista o que não pode acontecer. Sem os dois, a IA entrega "uma bolsa
  parecida" — e bolsa parecida não vende a nossa.
- **O 07 é o bloco que quase ninguém escreve, e é o que mais engana o olho.**
  Descrever física (agulha sobe e desce, tecido avança, alça não estica, peça
  cai com a gravidade) é o que separa vídeo de IA de vídeo filmado.
- **Frases que valem para qualquer produto nosso:**
  `Every shot must feel physically photographed` ·
  `Keep textile texture stable as focus and camera position change` ·
  `Do not add titles, captions or new branding inside the generated footage`.
- O `Do not add... new branding` é prático além de estético: evita que a IA
  carimbe logo inventado na nossa peça, que depois vira retrabalho.
- **A escada de lentes (100 → 85 → 50 mm)** é reaproveitável em qualquer vídeo
  de produto: macro no detalhe, produto inteiro, pessoa usando.
- A referência usa produto de marca registrada. O molde serve — **o produto tem
  que ser o nosso, com a nossa marca**.
