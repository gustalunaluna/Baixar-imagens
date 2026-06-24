#!/usr/bin/env bash
# ──────────────────────────────────────────────────────────────────
# deploy.sh — Sincroniza e faz deploy dos ambientes de staging e produção
# Uso:
#   ./deploy.sh site staging    → atualiza cópia do site estático para staging
#   ./deploy.sh site producao   → atualiza cópia do site estático para produção
#   ./deploy.sh cms staging     → prepara e faz deploy do CMS em staging
#   ./deploy.sh cms producao    → faz deploy do CMS em produção
#   ./deploy.sh all staging     → site + cms em staging
# ──────────────────────────────────────────────────────────────────

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENVS="$ROOT/environments"

# Cores
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

info()    { echo -e "${GREEN}[INFO]${NC}  $*"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $*"; }
err()     { echo -e "${RED}[ERRO]${NC}  $*"; exit 1; }

TARGET="${1:-}"
ENV="${2:-}"

[[ -z "$TARGET" || -z "$ENV" ]] && {
  echo "Uso: $0 <site|cms|all> <staging|producao>"
  exit 1
}
[[ "$ENV" != "staging" && "$ENV" != "producao" ]] && err "Ambiente deve ser 'staging' ou 'producao'"

# ── Função: sincronizar site estático ──────────────────────────────
sync_site() {
  local dest="$ENVS/producao"
  info "Sincronizando site estático → $dest"

  for f in index.html produtos.html brindes.html obrigado.html robots.txt sitemap.xml favicon.svg favicon.png; do
    [[ -f "$ROOT/$f" ]] && cp "$ROOT/$f" "$dest/" && info "  ✓ $f"
  done

  cp "$ROOT/css/style.css" "$dest/css/"
  cp "$ROOT/js/main.js"    "$dest/js/"
  info "  ✓ css/style.css  ✓ js/main.js"
  info "Site estático sincronizado."
}

# ── Função: deploy site ────────────────────────────────────────────
deploy_site() {
  local dest="$ENVS/producao"
  sync_site

  if command -v vercel &>/dev/null; then
    info "Deploy do site estático no Vercel ($ENV)..."
    cd "$dest"
    if [[ "$ENV" == "producao" ]]; then
      vercel --prod
    else
      vercel
    fi
  else
    warn "Vercel CLI não instalado. Para fazer deploy:"
    warn "  npm i -g vercel && vercel login"
    warn "  cd $dest && vercel $([ "$ENV" = "producao" ] && echo "--prod")"
  fi
}

# ── Função: deploy CMS ─────────────────────────────────────────────
deploy_cms() {
  local cms_src="$ROOT/cms"
  local env_file="$ENVS/staging/.env.staging"

  [[ ! -d "$cms_src" ]] && err "Diretório $cms_src não encontrado"

  if [[ "$ENV" == "staging" ]]; then
    [[ ! -f "$env_file" ]] && err "Arquivo $env_file não encontrado. Preencha-o antes de continuar."

    # Verificar se ainda tem placeholder
    if grep -q "SEU-PROJETO-STAGING" "$env_file"; then
      err "O .env.staging ainda tem valores placeholder. Preencha com credenciais reais antes de fazer deploy."
    fi

    info "Copiando .env.staging para cms/.env.local ..."
    cp "$env_file" "$cms_src/.env.local"
    info "  ✓ .env.local atualizado"

    info "Instalando dependências e buildando CMS..."
    cd "$cms_src"
    npm install --silent
    npm run build

    if command -v vercel &>/dev/null; then
      info "Deploy do CMS em staging..."
      cp "$ENVS/staging/vercel.json" "$cms_src/vercel.json"
      vercel
    else
      warn "Vercel CLI não instalado. Para fazer deploy do CMS em staging:"
      warn "  npm i -g vercel && vercel login"
      warn "  cd $cms_src && vercel"
    fi

  elif [[ "$ENV" == "producao" ]]; then
    warn "Deploy em PRODUÇÃO. Tem certeza? (s/N)"
    read -r confirm
    [[ "$confirm" != "s" && "$confirm" != "S" ]] && { info "Cancelado."; exit 0; }

    info "Deploy do CMS em produção..."
    cd "$cms_src"
    npm install --silent
    npm run build

    if command -v vercel &>/dev/null; then
      vercel --prod
    else
      warn "Vercel CLI não instalado: npm i -g vercel && cd $cms_src && vercel --prod"
    fi
  fi
}

# ── Roteamento ─────────────────────────────────────────────────────
case "$TARGET" in
  site) deploy_site ;;
  cms)  deploy_cms ;;
  all)
    sync_site
    deploy_cms
    ;;
  *) err "Target inválido: use 'site', 'cms' ou 'all'" ;;
esac

info "Concluído ✓"
