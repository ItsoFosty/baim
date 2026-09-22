#!/bin/sh
set -eu

SCRIPT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
PROJECT_ROOT=${BAIM_PROJECT_ROOT:-$(dirname "$SCRIPT_DIR")}
LEGO_ROOT=${BAIM_LEGO_ROOT:-/etc/lego}
PUBLIC_IP=${BAIM_PUBLIC_IP:?Set BAIM_PUBLIC_IP to the public IPv4 or IPv6 address}
SERVER_USER=${BAIM_SERVER_USER:?Set BAIM_SERVER_USER to the account running the game server}
SERVER_GROUP=${BAIM_SERVER_GROUP:-$(id -gn "$SERVER_USER")}
HTTPS_PORT=${BAIM_HTTPS_PORT:-5174}
LEGO_BIN=${BAIM_LEGO_BIN:-/usr/local/bin/lego}

if ! runuser -u "$SERVER_USER" -- env \
  HTTPS=1 \
  PORT="$HTTPS_PORT" \
  TLS_CERT=target/server/ip-cert.pem \
  TLS_KEY=target/server/ip-key.pem \
  /usr/bin/node "$PROJECT_ROOT/tools/server-control.mjs" status >/dev/null 2>&1; then
  exit 0
fi

close_validation_port() {
  ufw delete allow 443/tcp >/dev/null 2>&1 || true
}

trap close_validation_port EXIT INT TERM
ufw allow 443/tcp comment 'Temporary Lets Encrypt TLS-ALPN validation' >/dev/null

"$LEGO_BIN" run \
  --server https://acme-v02.api.letsencrypt.org/directory \
  --accept-tos \
  --path "$LEGO_ROOT" \
  --domains "$PUBLIC_IP" \
  --tls \
  --profile shortlived

install -o "$SERVER_USER" -g "$SERVER_GROUP" -m 0644 "$LEGO_ROOT/certificates/$PUBLIC_IP.crt" "$PROJECT_ROOT/target/server/ip-cert.pem"
install -o "$SERVER_USER" -g "$SERVER_GROUP" -m 0600 "$LEGO_ROOT/certificates/$PUBLIC_IP.key" "$PROJECT_ROOT/target/server/ip-key.pem"

runuser -u "$SERVER_USER" -- env \
  HTTPS=1 \
  PORT="$HTTPS_PORT" \
  TLS_CERT=target/server/ip-cert.pem \
  TLS_KEY=target/server/ip-key.pem \
  /usr/bin/node "$PROJECT_ROOT/tools/server-control.mjs" restart
