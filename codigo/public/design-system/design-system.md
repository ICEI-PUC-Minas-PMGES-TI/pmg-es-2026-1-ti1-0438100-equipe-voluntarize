# Design System Voluntarize

Documentação de referência para desenvolvimento. Antes de criar estilos novos, verifique se já existe uma classe aqui.

## Arquivos

| Arquivo | Descrição |
|---|---|
| `codigo/public/design-system/css/globals.css` | Fonte única de estilos — tokens, utilitários e componentes |
| `codigo/public/design-system/index.html` | Vitrine visual navegável com todos os componentes renderizados |

## Como usar em qualquer página

```html
<link rel="stylesheet" href="/design-system/css/globals.css" />
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
```

Ajuste o caminho do `globals.css` conforme a profundidade da página no projeto.

---

## Tokens (variáveis CSS)

Todos os tokens ficam em `:root` e devem ser usados via `var(--nome)` ao escrever CSS customizado.

### Cores

| Token | Valor | Uso |
|---|---|---|
| `--color-black` | `#1c1c1c` | Texto principal, bordas, sombras |
| `--color-white` | `#ffffff` | Fundos, superfícies |
| `--color-green` | `#c1ff72` | Ação primária, destaque |
| `--color-purple` | `#b18cfe` | Ação secundária, destaque alternativo |
| `--color-gray-100` | `#f6f6f6` | Fundo do body |
| `--color-gray-200` | `#ececec` | Divisores suaves |
| `--color-gray-300` | `#dadada` | Texto sutil |
| `--color-gray-400` | `#b8b8b8` | Texto desabilitado / placeholder |

### Tipografia

| Token | Valor |
|---|---|
| `--font-main` | `'Oxygen Mono'` — fonte padrão do sistema, usada em títulos, botões e corpo |
| `--font-alt` | `'Oxygen'` — fonte alternativa, use com a classe `font-alt` para textos corridos mais legíveis |

### Espaçamento

| Token | Valor |
|---|---|
| `--space-1` | `8px` |
| `--space-2` | `12px` |
| `--space-3` | `16px` |
| `--space-4` | `24px` |
| `--space-5` | `32px` |
| `--space-6` | `48px` |

### Radius

| Token | Valor |
|---|---|
| `--radius-xs` | `4px` |
| `--radius-sm` | `8px` |
| `--radius-md` | `12px` |
| `--radius-pill` | `999px` |

### Sombras

As sombras são sólidas (estilo neobrutalist), sem blur.

| Token | Valor |
|---|---|
| `--shadow-xs` | `1px 1px 0 0 #1c1c1c` |
| `--shadow-sm` | `2px 2px 0 0 #1c1c1c` |
| `--shadow-md` | `3px 3px 0 0 #1c1c1c` |
| `--shadow-lg` | `5px 5px 0 0 #1c1c1c` |

### Outros

| Token | Valor | Uso |
|---|---|---|
| `--border` | `2px solid #1c1c1c` | Borda padrão do sistema |
| `--container-max` | `1120px` | Largura máxima do container |
| `--header-footer-height` | `72px` | Altura do header e footer |
| `--transition-fast` | `0.15s ease` | Transição padrão para hover/active |

---

## Tipografia

### Tamanhos

| Classe | Tamanho |
|---|---|
| `text-2xs` | `0.65rem` |
| `text-xs` | `0.72rem` |
| `text-sm` | `0.82rem` |
| `text-md` | `0.95rem` |
| `text-base` | `1rem` |
| `text-lg` | `1.05rem` |
| `text-xl` | `1.25rem` |
| `text-2xl` | `1.5rem` |
| `text-3xl` | `1.875rem` |
| `text-tiny` | `0.75rem` |

Títulos semânticos (`h1`–`h4`) e classes `.h1`–`.h4` usam tamanhos responsivos com `clamp()`.

### Peso

`text-regular` · `text-semibold` · `text-bold` · `text-thick`

### Alinhamento

`text-left` · `text-center` · `text-right` · `text-justify`

### Transformação

`text-uppercase` · `text-lowercase` · `text-capitalize`

### Cores de texto

`text-black` · `text-white` · `text-green` · `text-purple` · `text-gray-100` · `text-gray-200` · `text-gray-300` · `text-gray-400` · `text-muted` · `text-subtle` · `text-emphasis` · `text-inherit` · `text-current`

### Fonte alternativa

```html
<p class="font-alt text-md">Texto com Oxygen (mais legível para parágrafos longos)</p>
```

### Exemplos

```html
<h1>Título principal</h1>
<h2>Subtítulo</h2>
<p class="text-lg text-semibold">Texto em destaque</p>
<p class="text-sm text-muted">Texto auxiliar</p>
<p class="text-xs text-uppercase text-bold">Label de categoria</p>
```

---

## Layout

### Container e seção

```html
<div class="container"><!-- max-width 1120px, centralizado --></div>
<div class="container section"><!-- adiciona padding vertical --></div>
```

### Grid

Responsivo: 1 coluna em mobile, expande a partir de 768px.

```html
<div class="grid grid-2">...</div> <!-- 2 colunas no desktop -->
<div class="grid grid-3">...</div> <!-- 3 colunas no desktop -->
<div class="grid grid-4">...</div> <!-- 4 colunas no desktop -->
```

### Stack

Coluna com gap padrão (`--space-3`).

```html
<div class="stack">
  <p>Item 1</p>
  <p>Item 2</p>
</div>
```

---

## Flex e alinhamento

| Grupo | Classes |
|---|---|
| Display | `flex` · `inline-flex` |
| Direção | `flex-row` · `flex-col` · `flex-row-reverse` · `flex-col-reverse` |
| Wrap | `flex-wrap` · `flex-nowrap` |
| Align items | `items-start` · `items-center` · `items-end` · `items-stretch` |
| Justify content | `justify-start` · `justify-center` · `justify-end` · `justify-between` · `justify-around` · `justify-evenly` |
| Align content | `content-start` · `content-center` · `content-end` · `content-between` |
| Align self | `self-start` · `self-center` · `self-end` · `self-stretch` |
| Grow / Shrink | `grow` · `grow-0` · `shrink` · `shrink-0` |
| Gap | `gap-0` · `gap-1` · `gap-2` · `gap-3` · `gap-4` |

```html
<div class="flex items-center justify-between gap-2">
  <span>Título</span>
  <span>Ação</span>
</div>
```

---

## Surface (superfícies / cards)

A classe `surface` é a base para qualquer agrupamento de conteúdo.

```html
<div class="surface">Card padrão</div>
```

### Variações de cor

`surface-white` · `surface-green` · `surface-purple`

### Variações de tamanho/estilo

| Classe | Descrição |
|---|---|
| `surface-xs` | Radius xs, sombra xs, padding pequeno |
| `surface-sm` | Radius sm, sombra sm |
| `surface-md` | Radius md, sombra md |
| `surface-lg` | Radius 18px, sombra lg, padding grande |
| `surface-flat` | Sem radius, sombra sm |
| `surface-soft` | Radius 18px, sombra suave |
| `surface-heavy` | Radius 10px, sombra 7px (mais pesada) |

```html
<section class="surface surface-green stack">
  <h2>Bloco verde</h2>
  <p>Conteúdo interno.</p>
</section>
```

---

## Header e Footer

Use a estrutura abaixo em todas as páginas para manter consistência.

```html
<!-- Espaçador para compensar o header fixo -->
<div class="container header-shell">
  <header class="site-header">
    <img class="brand-logo" src="/assets/images/logo/logo-horizontal.png" alt="Voluntarize" />
    <nav class="site-nav" aria-label="Navegação">
      <a href="/pagina">Link</a>
    </nav>
    <button class="btn btn-secondary btn-icon-only btn-rounded-full btn-shadow-sm" aria-label="Usuário">
      <i class="fa-regular fa-user"></i>
    </button>
  </header>
</div>

<!-- Footer -->
<div class="container mb-4">
  <footer class="site-footer">
    <img class="brand-logo" src="/assets/images/logo/logo-horizontal.png" alt="Voluntarize" />
    <p class="text-sm">Plataforma de voluntários @ 2026</p>
  </footer>
</div>
```

- O header é `position: fixed` e flutua no topo da página.
- `header-shell` garante que o conteúdo não fique escondido atrás do header fixo.
- Em telas menores que 840px, o header empilha os itens e o footer centraliza.

---

## Botões

Classe base obrigatória: `btn`

### Variações de cor

| Classe | Aparência |
|---|---|
| `btn-primary` | Fundo verde |
| `btn-secondary` | Fundo roxo |
| `btn-outline` | Fundo branco, borda preta |
| `btn-ghost` | Sem fundo, sem borda, sem sombra |

### Modificadores

| Grupo | Classes |
|---|---|
| Padding | `btn-pad-xs` · `btn-pad-sm` · `btn-pad-md` · `btn-pad-lg` |
| Radius | `btn-rounded-sm` · `btn-rounded-md` · `btn-rounded-lg` · `btn-rounded-full` |
| Borda | `btn-border-thin` · `btn-border-base` · `btn-border-thick` |
| Sombra | `btn-shadow-none` · `btn-shadow-xs` · `btn-shadow-sm` · `btn-shadow-md` · `btn-shadow-lg` · `btn-shadow-xl` |
| Ícone | `btn-icon` (com texto) · `btn-icon-only` (42×42px) · `btn-icon-only-xs` (32×32px) |

### Exemplos

```html
<!-- Botão primário com ícone -->
<button class="btn btn-primary btn-icon">
  <i class="fa-solid fa-heart"></i>
  Doar agora
</button>

<!-- Botão circular apenas com ícone -->
<button class="btn btn-secondary btn-icon-only btn-rounded-full" aria-label="Usuário">
  <i class="fa-regular fa-user"></i>
</button>

<!-- Botão desabilitado -->
<button class="btn btn-primary" disabled>Indisponível</button>
```

---

## Inputs

### Estrutura padrão

```html
<label class="stack input-group">
  <span class="ml-2 text-md text-semibold">Nome</span>
  <div class="field">
    <span class="field-icon" aria-hidden="true">
      <i class="fa-regular fa-user"></i>
    </span>
    <input class="field-input" type="text" placeholder="Digite seu nome" />
  </div>
</label>
```

### Textarea

```html
<label class="stack input-group">
  <span class="ml-2 text-md text-semibold">Descrição</span>
  <div class="field field-textarea">
    <span class="field-icon" aria-hidden="true">
      <i class="fa-regular fa-comment"></i>
    </span>
    <textarea class="field-input" placeholder="Digite uma descrição"></textarea>
  </div>
</label>
```

- `field` — container do input com borda e sombra
- `field-icon` — coluna esquerda com ícone e separador vertical
- `field-input` — o `<input>` ou `<textarea>` em si
- `field-textarea` — modificador para textarea (altura mínima + resize vertical)
- `input-group` — gap reduzido entre label e field

---

## Ícones (icon-token)

Para ícones isolados ou avatares com letra.

```html
<span class="icon-token icon-md icon-green icon-shadow-sm">
  <i class="fa-solid fa-leaf"></i>
</span>

<!-- Com letra -->
<span class="icon-token icon-lg icon-purple icon-square">A</span>
```

### Modificadores

| Grupo | Classes |
|---|---|
| Tamanho | `icon-xs` (28px) · `icon-sm` (34px) · `icon-md` (40px) · `icon-lg` (48px) |
| Cor | `icon-black` · `icon-white` · `icon-green` · `icon-purple` |
| Forma | padrão circular · `icon-square` (quadrado com radius sm) |
| Sombra | `icon-shadow-none` · `icon-shadow-sm` · `icon-shadow-md` · `icon-shadow-lg` |

O `header-avatar` é uma variação pré-configurada (42×42px, circular) usada no header.

---

## Tags

Para categorias, filtros e labels curtas.

### Tag removível

```html
<span class="tag tag-green tag-sm tag-removable">
  <span class="tag-text">Saúde</span>
  <button class="tag-remove" type="button" aria-label="Remover Saúde">
    <i class="fa-solid fa-xmark"></i>
  </button>
</span>
```

### Tag estática

```html
<span class="tag tag-white tag-static tag-xs">Educação</span>
```

### Modificadores

| Grupo | Classes |
|---|---|
| Tamanho | `tag-sm` · `tag-xs` |
| Cor | `tag-green` · `tag-purple` · `tag-white` |
| Sombra | `tag-shadow-none` · `tag-shadow-xs` · `tag-shadow-sm` · `tag-shadow-md` |
| Tipo | `tag-removable` (com botão de remover) · `tag-static` (somente leitura) |

---

## Divisores

### Divisor com label

```html
<div class="divider-label">
  <span>Seção</span>
</div>
```

### Divisor com prisma

```html
<!-- Prisma só na esquerda -->
<div class="divider-line divider-black prism-left" aria-hidden="true"></div>

<!-- Prisma só na direita -->
<div class="divider-line divider-green prism-right" aria-hidden="true"></div>

<!-- Prisma nos dois lados -->
<div class="divider-line divider-purple prism-both" aria-hidden="true"></div>
```

| Grupo | Classes |
|---|---|
| Cor | `divider-black` · `divider-green` · `divider-purple` |
| Tamanho do prisma | `divider-prism-sm` · `divider-prism-md` · `divider-prism-lg` |
| Posição do prisma | `prism-left` · `prism-right` · `prism-both` |

---

## Espaçamento e dimensões

### Margem

`mt-1`–`mt-4` · `mb-1`–`mb-4` · `ml-1`–`ml-4`

### Padding

`p-1`–`p-6` · `pt-1`–`pt-4` · `pb-1`–`pb-4` · `pl-1`–`pl-4` · `pr-1`–`pr-4`

### Largura

`w-full`

### Radius utilitário

`rounded-none` · `rounded-xs` · `rounded-sm` · `rounded-md` · `rounded-lg` · `rounded-full`

### Sombra utilitária

`shadow-none` · `shadow-sm` · `shadow-md` · `shadow-lg` · `shadow-xl`

---

## Responsividade

O sistema tem dois breakpoints:

- **≥ 768px** — grids de 2, 3 e 4 colunas são ativados
- **≤ 840px** — header e footer adaptam layout (empilhamento, centralização)

Não há classes responsivas utilitárias (ex: `md:flex`). Para comportamento responsivo customizado, use media queries no CSS da página.

---

## Boas práticas

- Componha com classes existentes antes de criar CSS novo.
- Use `surface` para agrupamentos de conteúdo, `btn` para ações, `tag` para categorias.
- Sempre inclua `aria-label` em botões que só têm ícone (`btn-icon-only`).
- Use `font-alt` (Oxygen) para textos corridos longos — `font-main` (Oxygen Mono) é melhor para títulos e labels curtas.
- Consulte o `index.html` para ver todos os componentes renderizados antes de implementar.

## Onde editar

| O que mudar | Arquivo |
|---|---|
| Tokens, componentes, utilitários | `css/globals.css` |
| Vitrine visual de exemplos | `index.html` |
| Esta documentação | `design-system.md` |
