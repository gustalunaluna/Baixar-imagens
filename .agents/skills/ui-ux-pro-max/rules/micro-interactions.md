# Micro-interações — LS Confecções

## Princípios

1. **Propósito:** cada animação comunica algo (estado, feedback, direção)
2. **Velocidade:** 150–300ms para respostas, 400–600ms para entradas, nunca mais de 800ms
3. **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` para a maioria; `cubic-bezier(0.34, 1.56, 0.64, 1)` para elementos que "saltam"
4. **Respeitar `prefers-reduced-motion`**

## Botões

```css
.btn {
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 150ms cubic-bezier(0.4, 0, 0.2, 1),
              background-color 150ms ease;
}

/* Hover — leve elevação */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

/* Active — "pressionar" */
.btn:active {
  transform: translateY(0px) scale(0.98);
  box-shadow: 0 2px 8px rgba(0,0,0,0.10);
  transition-duration: 80ms;
}

/* Loading state */
.btn--loading {
  pointer-events: none;
  opacity: 0.8;
  position: relative;
}
.btn--loading::after {
  content: '';
  width: 16px; height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  position: absolute; right: 16px; top: 50%;
  transform: translateY(-50%);
}
@keyframes spin { to { transform: translateY(-50%) rotate(360deg); } }
```

## Cards de produto

```css
.product-card {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: transform;
}
.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.14);
}
.product-card__image img {
  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
.product-card:hover .product-card__image img {
  transform: scale(1.06);
}
/* CTA dentro do card: aparece no hover */
.product-card__cta {
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 200ms ease, transform 200ms ease;
}
.product-card:hover .product-card__cta {
  opacity: 1;
  transform: translateY(0);
}
```

## Inputs de formulário

```css
.form-input {
  border: 1.5px solid #E5E7EB;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}
.form-input:focus {
  border-color: #0D1B2A;
  box-shadow: 0 0 0 3px rgba(13, 27, 42, 0.08);
  outline: none;
}
.form-input:valid:not(:placeholder-shown) {
  border-color: #16A34A;
}
.form-input:invalid:not(:placeholder-shown):not(:focus) {
  border-color: #DC2626;
}

/* Shake em erro de submit */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-6px); }
  40% { transform: translateX(6px); }
  60% { transform: translateX(-4px); }
  80% { transform: translateX(4px); }
}
.form-input--error { animation: shake 0.4s ease; }
```

## Scroll animations (Intersection Observer)

```js
// Fade up ao entrar na viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(el => {
    if (el.isIntersecting) {
      el.target.classList.add('in-view');
      observer.unobserve(el.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
```

```css
[data-animate] {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 500ms ease, transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
}
[data-animate].in-view {
  opacity: 1;
  transform: translateY(0);
}
/* Stagger em listas */
[data-animate]:nth-child(2) { transition-delay: 100ms; }
[data-animate]:nth-child(3) { transition-delay: 200ms; }
[data-animate]:nth-child(4) { transition-delay: 300ms; }

@media (prefers-reduced-motion: reduce) {
  [data-animate] { opacity: 1; transform: none; transition: none; }
}
```

## Logos de clientes — grayscale → color no hover

```css
.client-logo {
  filter: grayscale(1) opacity(0.5);
  transition: filter 300ms ease;
}
.client-logo:hover { filter: grayscale(0) opacity(1); }
```

## Número counter (stats)

```js
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1200;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    el.textContent = Math.round(eased * target).toLocaleString('pt-BR');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
// Trigger quando entra na viewport
```

```html
<span class="stat__number" data-target="800" data-animate-counter>0</span>
```

## WhatsApp button (fixo mobile)

```css
.whatsapp-fab {
  position: fixed;
  bottom: 24px; right: 20px;
  width: 56px; height: 56px;
  border-radius: 50%;
  background: #25D366;
  box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
  display: flex; align-items: center; justify-content: center;
  z-index: 50;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1),
              box-shadow 200ms ease;
}
.whatsapp-fab:hover {
  transform: scale(1.12);
  box-shadow: 0 6px 28px rgba(37, 211, 102, 0.5);
}
/* Pulse de atenção (após 3s) */
@keyframes pulse-green {
  0%, 100% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
  50% { box-shadow: 0 4px 36px rgba(37, 211, 102, 0.7), 0 0 0 8px rgba(37, 211, 102, 0.1); }
}
.whatsapp-fab { animation: pulse-green 2s ease-in-out 3s infinite; }
```
