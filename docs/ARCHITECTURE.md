# Architecture

## Runtime Topology
- `frontend`: Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui.
- `api`: Go REST API using chi router, pgx PostgreSQL pool, JWT auth.
- `postgres`: primary relational database.
- `minio`: S3-compatible local media storage.
- `nginx`: reverse proxy for frontend and API in Docker.

## Request Flow
1. Public user requests a page from Next.js.
2. Server Components fetch from `CMS_API_BASE_URL` with `next.revalidate`.
3. If API fetch fails during local development or preview, frontend fallbacks render stable content.
4. Contact form submits to `/api/v1/public/contacts`.
5. Admin user logs in through `/admin/login`, which proxies credentials to `/api/v1/auth/login` and stores HTTP-only cookies.
6. Protected admin routes call `/api/v1/admin/*` with a bearer token.

## Backend Layers
- `handler`: HTTP request parsing and response formatting.
- `service`: validation, auth logic, transaction orchestration.
- `repository`: PostgreSQL queries via pgx.
- `model`: public domain models and API response shapes.
- `storage`: S3-compatible presigned URL boundary.
- `mailer`: isolated notification boundary for future SMTP/queue integration.

## Frontend Layers
- `lib/cms.ts`: typed API client and fallback content.
- `lib/sections.ts`: section catalog (types, field schemas, defaults, page templates) shared by the renderer and the admin builder.
- `components/cms`: reusable CMS rendering primitives, including `section-renderer.tsx`.
- `components/sections`: presentational section components (image+text, stats, gallery, FAQ, embed, content grid).
- `components/admin/section-builder.tsx`: drag-and-drop page builder (dnd-kit) used inside the page editor.
- `components/admin/navigation-editor.tsx`: drag-and-drop menu tree editor for `/admin/navigation`.
- `app/*`: public App Router pages and slug routes.
- `app/admin/*`: protected admin shell.

## Page Building
- A page's `content.sections` array drives rendering; each entry is `{ id, type, props }` mapped to a component by `SectionRenderer`.
- Home (`page_key: home`), About (`about`), and every dynamic `[pageKey]` page render sections when present, falling back to the original static compositions or the legacy blocks layout otherwise.
- Dynamic sections (`contentGrid`) receive pre-resolved services/products/news data so the same renderer works in Server Components and in the admin live preview.
- The site header consumes the CMS menu from `/public/navigation`; Services/Products items auto-populate their dropdowns from content trees, and manual child links render below them.
- Admin mutations call `updateTag("cms")`, purging every tagged CMS fetch so published changes appear immediately.

## Rendering Strategy
- Public list/detail pages use Server Components and time-based revalidation.
- Contact form and mobile navigation are Client Components.
- Admin dashboard uses `cache: "no-store"` because it is authenticated operational data.

## Security
- JWT access token is short lived.
- Refresh token is stored hashed in PostgreSQL and rotated on refresh.
- Admin cookies are HTTP-only and `sameSite=lax`.
- RBAC is represented by roles and permissions; current scaffold reserves module routes behind auth.
