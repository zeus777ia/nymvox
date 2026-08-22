# @nymvox/mcp-server

Nymvox Business plan MCP (Model Context Protocol) sunucusu.

```bash
npm install
npm run build
npm start
```

Claude Desktop / Cursor `mcp.json` örneği:

```json
{
  "mcpServers": {
    "nymvox": {
      "command": "node",
      "args": ["/absolute/path/to/nymvox/mcp-server/dist/index.js"]
    }
  }
}
```

## Tools

| Tool | Açıklama |
| --- | --- |
| `generate_post` | Konu + platform için post üretir |
| `schedule_post` | Postu zamanlar |
| `get_analytics` | Hesap özeti |
| `suggest_hashtags` | Hashtag önerir |
| `analyze_best_time` | En iyi yayın saatini önerir |
