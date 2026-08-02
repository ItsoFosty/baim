# Game Server Operations

The normal `npm run dev` command stays attached to its shell and is intended for active development.
For a server that survives closing Codex, SSH, or the terminal, use the detached lifecycle commands.
They provide nohup-style behavior without requiring multiline shell commands.

## Start Detached

```bash
npm run server:start
```

The command records the process under `target/server/`, writes output to
`target/server/dev-server.log`, checks that the process survived startup, and then returns to the
shell. It is safe to close the shell afterward.

## Check Status

```bash
npm run server:status
```

Status checks both the recorded process and the local HTTP endpoint. A healthy server reports its
PID and `HTTP 200`. The public URL depends on the deployment host and its firewall or reverse proxy.

## Stop Cleanly

```bash
npm run server:stop
```

This sends `SIGTERM`, waits for the recorded server process to exit, and removes its PID file.

## Restart

```bash
npm run server:restart
```

## Read Logs

```bash
tail -n 100 target/server/dev-server.log
```

These commands survive terminal closure, but not a machine reboot. Use a system service if automatic
startup after reboot becomes necessary.

## HTTPS With An IP Certificate

The certificate renewal helper is host-agnostic and requires its deployment values through the
environment:

```bash
sudo env \
  BAIM_PUBLIC_IP=203.0.113.10 \
  BAIM_SERVER_USER=baim \
  BAIM_PROJECT_ROOT=/srv/baim \
  tools/renew-ip-certificate.sh
```

Optional variables are `BAIM_SERVER_GROUP`, `BAIM_HTTPS_PORT`, `BAIM_LEGO_ROOT`, and
`BAIM_LEGO_BIN`. Copy
`tools/baim-ip-certificate.cron` to `/etc/cron.d/` and replace its example paths, address, and user.
