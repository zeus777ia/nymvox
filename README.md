# Nymvox

AI destekli sosyal medya otomasyon platformu. Tek panelden hesap bağla, içerik üret, zamanla ve analitikleri takip et.

**Stack:** React 19 · Vite 7 · TypeScript · Tailwind · shadcn/ui · Supabase · Stripe · MCP

## Özellikler

- Landing, kayıt / giriş / şifre sıfırlama
- Dashboard, bağlı hesaplar, içerik oluşturma (AI), takvim, analitik, faturalama
- Plan limitleri (Free / Starter / Pro / Business)
- Supabase Auth + RLS
- Edge Functions: AI içerik, OAuth callback, Stripe
- MCP server (Business plan ajanları için)

## Hızlı başlangıç

```bash
git clone https://github.com/zeus777ia/nymvox.git
cd nymvox
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` içine kendi Supabase URL / anon key değerlerini yaz.

Uygulama varsayılan olarak `http://localhost:3000` adresinde açılır.

## Supabase kurulumu

1. [supabase.com](https://supabase.com) üzerinde proje oluştur.
2. SQL Editor'de [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) dosyasını çalıştır.
   - `profiles`, `social_accounts`, `posts`, `subscriptions` tabloları
   - Kayıt olunca profil + ücretsiz abonelik oluşturan trigger
   - RLS politikaları
3. Authentication > Providers: Email açık olsun.
4. (Opsiyonel) Edge Functions:

```bash
supabase functions deploy ai-generate
supabase functions deploy social-oauth
supabase functions deploy stripe-webhook
```

Edge Function secret'ları (Supabase dashboard > Edge Functions > Secrets):

| Secret | Açıklama |
| --- | --- |
| `OPENAI_API_KEY` | AI içerik (yoksa mock döner) |
| `STRIPE_SECRET_KEY` | Checkout / webhook |
| `STRIPE_WEBHOOK_SECRET` | Stripe imza doğrulama |

## MCP server

Business plan ajanları için Model Context Protocol sunucusu:

```bash
cd mcp-server
npm install
npm run build
npm start
```

Araçlar: `generate_post`, `schedule_post`, `get_analytics`, `suggest_hashtags`, `analyze_best_time`.

## Deploy (Vercel)

1. Bu repoyu Vercel'e bağla.
2. Environment variables: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_STRIPE_PUBLISHABLE_KEY`.
3. `vercel.json` SPA rewrite içerir.

## Proje yapısı

```
src/
  pages/            # Landing + auth + dashboard sayfaları
  components/       # layout, shared, shadcn/ui
  hooks/            # auth, posts, accounts, subscription, AI
  config/plans.ts   # fiyat ve limitler
  lib/supabase.ts
supabase/
  migrations/       # Postgres şeması
  functions/        # Deno edge functions
mcp-server/         # MCP ajan sunucusu
```

## Geliştirme notları

- `*.local` ve `.env` git'e **girmez**. Sırları asla commit etme.
- Stripe ve gerçek sosyal OAuth henüz mock'tur; canlıya almak için platform uygulama anahtarları gerekir.
- Auth e-posta onayı açıksa kayıt sonrası kullanıcıya doğrulama maili gider.

## Lisans

MIT
