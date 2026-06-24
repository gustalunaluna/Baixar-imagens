# UX Principles — LS Confecções

## 1. Clareza antes de criatividade

O visitante B2B quer saber rapidamente: **O que vocês fazem? Posso confiar? Como peço?**

Cada página deve responder essas 3 perguntas na dobra (sem scroll):
- **O que**: headline clara + imagem do produto
- **Confiança**: logos de clientes, anos de mercado, número de modelos
- **Ação**: botão de orçamento visível, WhatsApp acessível

## 2. Uma ação por seção

Cada seção tem um único objetivo. Se uma seção tem 3 CTAs diferentes, o usuário não clica em nenhum.

```
Hero          → "Solicitar Orçamento"
Produtos      → "Ver catálogo completo"
Como funciona → "Falar com um especialista"
Clientes      → (nenhum CTA — é prova social, deixar respirar)
Contato       → "Enviar mensagem"
```

## 3. Prova social antes do CTA principal

Sempre colocar evidências de confiança **antes** de pedir uma ação:
- Logos de marcas conhecidas (Flamengo, Vasco, Thug Nine, Bolovo)
- Número de anos no mercado
- Número de modelos produzidos
- Depoimentos com foto + nome da marca

## 4. Friction zero no contato

O caminho até o WhatsApp deve ter 0 cliques extras:
- Botão WhatsApp fixo no rodapé mobile
- Número no header (desktop)
- Formulário com campos mínimos (nome + WhatsApp é suficiente para primeiro contato)

## 5. Imagens > texto

Para produto físico, uma foto boa converte mais do que 3 parágrafos descritivos. Regras:
- Hero: foto de produto em uso ou lifestyle, não fundo branco
- Cards de produto: foto real, bem iluminada, enquadramento consistente
- Sem stock photos genéricas de "negócios"

## 6. Velocidade percebida

- Skeleton loaders em listas de produtos (não spinner centralizado)
- Feedback imediato em formulários (botão muda para "Enviando..." ao clicar)
- Progressive loading: conteúdo above-the-fold carrega primeiro

## 7. Mobile é o primeiro dispositivo

O público streetwear/fashion navega majoritariamente pelo celular. Testar sempre:
- Botão WhatsApp acessível com polegar (posição inferior direita)
- Texto legível sem zoom (mínimo 16px)
- Imagens não cortadas em telas 360px
- Formulários fáceis de preencher com teclado virtual

## 8. Consistência entre páginas

- Header e footer idênticos em todas as páginas
- Mesma paleta, mesmos componentes
- Se o estilo do `index.html` mudar, `produtos.html` e `brindes.html` devem refletir

## Padrões a evitar

| Padrão ruim | Por quê | Alternativa |
|---|---|---|
| Pop-up imediato | Irrita antes do usuário ver o conteúdo | Trigger após 30s ou scroll 70% |
| Autoplay de vídeo com som | Assustar o usuário | Muted + controles visíveis |
| Formulário com 8+ campos | Taxa de abandono alta | Máximo 4 campos no 1º contato |
| Texto justificado | Difícil de ler, especialmente mobile | Align left |
| Todas as fontes em caps | Cansa a visão, parece grito | Caps apenas em badges e labels curtos |
| Carrossel com autoplay rápido | Usuário não consegue ler | Autoplay lento (5s+) ou sem autoplay |
