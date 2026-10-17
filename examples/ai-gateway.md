# AI Gateway (route any cloud/frontier preset through one proxy)

A gateway that sits in front of your provider accounts (Cloudflare AI Gateway,
or anything with a similar OpenAI-compatible pass-through) lets every cloud
preset share one auth token, one cost/log view, and one place to hold the
real provider keys (BYOK) instead of scattering them across `models.yaml`.
Crew Chief talks to it the same way it talks to any OpenAI-compatible
endpoint — `base_url` points at the gateway's per-provider path — with one
addition: `headers` sends whatever extra header the gateway needs, with
`${ENV}` expansion the same as `base_url`.

Env for the gateway: `CF_ACCOUNT_ID`, `CF_AIG_TOKEN` (the gateway's own auth
token — not a provider API key; the provider key is stored on the gateway
via BYOK, so `api_key_env` can be omitted entirely).

```yaml
models:
  # ---- Anthropic, via the gateway's OpenAI-compatible path -----------------
  - name: sonnet-5-ref
    base_url: https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/chaio-build/anthropic
    model_id: "claude-sonnet-5"
    omit_temperature: true          # Claude 4.6+ rejects temperature
    provider_class: frontier
    headers:
      cf-aig-authorization: "Bearer ${CF_AIG_TOKEN}"
      cf-aig-metadata: '{"app":"crewchief","preset":"sonnet-5-ref"}'

  # ---- xAI Grok, same gateway, different provider path ----------------------
  - name: grok-build
    base_url: https://gateway.ai.cloudflare.com/v1/${CF_ACCOUNT_ID}/chaio-build/grok
    model_id: "grok-4"
    provider_class: cloud
    headers:
      cf-aig-authorization: "Bearer ${CF_AIG_TOKEN}"
      cf-aig-metadata: '{"app":"crewchief","preset":"grok-build"}'

  # ---- Cloudflare Workers AI, gateway-tagged rather than gateway-routed -----
  # Workers AI is called directly (its API already is the account's own
  # endpoint); the gateway attaches by header instead of by path.
  - name: cf-gpt-oss-120b
    base_url: https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/ai
    model_id: "@cf/openai/gpt-oss-120b"
    health_path: /models/search
    provider_class: cloud
    headers:
      Authorization: "Bearer ${CF_AIG_TOKEN}"
      cf-aig-gateway-id: chaio-build
      cf-aig-metadata: '{"app":"crewchief","preset":"cf-gpt-oss-120b"}'
```

Notes:
- `headers` values are set after `api_key_env`'s Authorization header, so a
  header here can override it if a preset sets both — but the normal case,
  shown above, is to skip `api_key_env` entirely and send the gateway token
  as a header (`Authorization` for Workers AI, `cf-aig-authorization` for the
  gateway's provider paths).
- `cf-aig-metadata` is optional but worth setting per preset — it's what
  shows up as request tags in the gateway's own logs.
