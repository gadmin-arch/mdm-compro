# API Documentation

## Contract
OpenAPI 3.1 YAML is stored at:

```bash
docs/openapi.yaml
```

Copy it into the backend docs folder with:

```bash
make openapi
```

## Run API Locally

```bash
docker compose up --build api postgres
```

Health check:

```bash
curl http://localhost:8080/healthz
```

Public navigation:

```bash
curl http://localhost:8080/api/v1/public/navigation
```

Login:

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"irfanzuhdiabdillah@gmail.com","password":"admin123"}'
```

Protected dashboard:

```bash
TOKEN="<accessToken>"
curl http://localhost:8080/api/v1/admin/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## Navigation Menu

The public menu tree is stored in the `settings` table under the key `navigation` and managed from `/admin/navigation`.

- `GET /api/v1/public/navigation` returns `{ services, products, menu }`. `menu` is the visible menu tree (defaults are served when nothing is saved). Items with `auto: "services" | "products"` fill their dropdowns from the content trees.
- `GET /api/v1/admin/navigation` returns `{ items, version }` including hidden items.
- `PUT /api/v1/admin/navigation` accepts `{ items, version }` with optimistic locking (`version_conflict` on stale saves). Item shape:

```json
{
  "id": "services",
  "label": "Services",
  "href": "/services",
  "kind": "system | page | custom",
  "pageKey": "only-for-page-kind",
  "auto": "services | products (optional)",
  "visible": true,
  "children": []
}
```

Rules: two levels max, `system` items cannot be deleted, `page` items link to a CMS page key, `custom` items accept `/path`, `http(s)://`, `mailto:` or `tel:` URLs.

## Section Pages

Pages built with the admin page builder store `content.sections` as an ordered list of `{ id, type, props }`. The section catalog (types, editable fields, defaults) lives in `FrontEnd/lib/sections.ts` and renders through `FrontEnd/components/cms/section-renderer.tsx`. Pages without `sections` keep the legacy `blocks` + custom-fields rendering.

## Swagger UI
Run a temporary Swagger UI container:

```bash
docker run --rm -p 8081:8080 \
  -e SWAGGER_JSON=/openapi.yaml \
  -v "$PWD/docs/openapi.yaml:/openapi.yaml:ro" \
  swaggerapi/swagger-ui
```

Open `http://localhost:8081`.

## Error Format

```json
{
  "error": "validation_error",
  "message": "Request validation failed.",
  "fields": {
    "email": "A valid email is required."
  }
}
```
