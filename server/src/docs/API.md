# WEB-BDS-01 — API.md (Docs for FE)

Base URL: `http://localhost:4000/api`

Auth type: **Bearer JWT**  
Header:
`Authorization: Bearer <accessToken>`

---

## 0) Response Conventions

### Success
- `200 OK` (GET/PUT/POST actions thông thường)
- `201 Created` (POST create)

### Error (global format)
Backend có middleware `errorHandler` trả về:
```json
{
  "message": "Route not found: GET /xxx",
  "code": "NOT_FOUND | INTERNAL_ERROR | BAD_REQUEST | ...",
  "details": null,
  "requestId": "uuid"
}

1) Auth
-POST /auth/login

Login bằng email/password.

Body:

{
  "email": "admin@local.dev",
  "password": "Admin@123"
}

Response 200
{
  "user": {
    "id": "cuid",
    "email": "admin@local.dev",
    "role": "ADMIN"
  },
  "accessToken": "jwt",
  "refreshToken": "jwt"
}


Common errors:

400 Validation error (Zod) / Body sai
401 Invalid credentials
500 INTERNAL_ERROR

-POST /auth/refresh

Đổi refreshToken lấy accessToken mới.

Body

{ "refreshToken": "jwt" }


Response 200

{ "accessToken": "jwt" }

2) Health
GET /health

Ping server.

Response 200

{ "ok": true }

3) Public Properties (FE Listing / Detail)

Routes file: src/routes/property.routes.js
Prefix: /api/properties

GET /properties/__ping

Check route.

Response 200

{ "ok": true, "route": "properties" }

GET /properties

Danh sách tin public (chỉ PUBLISHED).

Endpoint này có validateQuery(propertyListQuerySchema) và backend sẽ chuẩn hoá query thành req.queryNormalized.

Query params (đã chuẩn hoá)

page?: number default 1

limit?: number default 12 (max theo schema, thường 50)

all?: boolean default false

true => backend trả nhiều (take lớn), thường bỏ count

sort?: string default createdAt_desc

createdAt_desc | createdAt_asc | price_asc | price_desc | area_asc | area_desc

match?: string default all
all => AND các filter
any => OR các filter (q terms vẫn AND theo term)
q?: string keyword search

backend normalize => qNormalized + tách qTerms (AND theo từng term)

transactionType?: SALE|RENT
typeId?: string
locationId?: string
locationSlug?: string
includeChildren?: boolean default true
priceMin?: number
priceMax?: number
areaMin?: number
areaMax?: number
bedroomsMin?: number
bathroomsMin?: number
tagIds?: string CSV: id1,id2
tagSlugs?: string CSV: mat-tien,gan-truong
tagsMode?: any|all default any

Example

GET /properties?page=1&limit=12&q=chung%20cu%20ha%20dong&locationSlug=ha-noi&includeChildren=true&priceMin=1000000000&sort=price_desc

Response 200 (list item “card”)
{
  "items": [
    {
      "id": "cuid",
      "title": "Căn hộ ...",
      "slug": "can-ho-...",
      "transactionType": "SALE",
      "currency": "VND",
      "price": "1500000000",
      "area": "65",
      "bedrooms": 2,
      "bathrooms": 2,
      "address": "Hà Đông, Hà Nội",
      "createdAt": "2025-12-28T00:00:00.000Z",
      "publishedAt": "2025-12-28T00:00:00.000Z",
      "location": { "id": "cuid", "name": "Hà Nội", "slug": "ha-noi" },
      "type": { "id": "cuid", "name": "Chung cư", "slug": "chung-cu" },
      "images": [{ "id": "cuid", "url": "https://...", "alt": null }]
    }
  ],
  "paging": { "page": 1, "limit": 12, "total": 100, "totalPages": 9 },
  "applied": {
    "qNormalized": "chung cu ha dong",
    "qTerms": ["chung", "cu", "ha", "dong"],
    "sort": "price_desc"
  }
}

Notes for FE

FE nên dùng slug để đi detail.
Images list endpoint thường chỉ take: 1 (cover).

GET /properties/:slug

Chi tiết tin theo slug (public).

Example
GET /properties/can-ho-ha-dong-1

Response 200

{
  "id": "cuid",
  "title": "...",
  "slug": "...",
  "description": "...",
  "transactionType": "SALE",
  "currency": "VND",
  "price": "1500000000",
  "area": "65",
  "bedrooms": 2,
  "bathrooms": 2,
  "address": "...",
  "status": "PUBLISHED",
  "images": [{ "id": "cuid", "url": "...", "sortOrder": 0 }],
  "location": { "id": "...", "name": "...", "slug": "..." },
  "type": { "id": "...", "name": "...", "slug": "..." },
  "tags": [{ "tag": { "id": "...", "slug": "...", "name": "..." } }]
}


Errors:

404 Not found

4) Admin Properties (CRUD + Publish)

Routes file: src/routes/admin/properties.routes.js
Prefix: /api/admin/properties
Auth required: requireAuth

RBAC:

ADMIN được CRUD + publish/archive theo permissions.js

SUPER_ADMIN: *

GET /admin/properties

List tin cho admin (có filter/paging trong controller).

Headers
Authorization: Bearer <token>

Query (controller)

page?: number default 1

limit?: number default 20 max 100

status?: DRAFT|PUBLISHED|ARCHIVED|...

q?: string

authorId?: string

typeId?: string

locationId?: string

sort?: createdAt_desc | createdAt_asc | price_asc | price_desc

Response 200

{
  "items": [ /* property items */ ],
  "paging": { "page": 1, "limit": 20, "total": 100, "totalPages": 5 },
  "applied": { "page": 1, "limit": 20, "status": "DRAFT", "q": "..." }
}

GET /admin/properties/:id

Detail theo id (admin).

Headers
Authorization: Bearer <token>

Response 200

{
  "id": "cuid",
  "title": "...",
  "slug": "...",
  "images": [],
  "location": {},
  "type": {},
  "tags": [{ "tag": { "id": "...", "name": "...", "slug": "..." } }]
}

POST /admin/properties

Tạo tin mới (admin). Status mặc định DRAFT.

Headers
Authorization: Bearer <token>

Body (basic)

{
  "title": "Bán nhà ...",
  "transactionType": "SALE",
  "price": 1500000000,
  "area": 65,
  "bedrooms": 2,
  "bathrooms": 2,
  "address": "Hà Đông",
  "locationId": "cuid",
  "typeId": "cuid"
}


Response 201

{
  "message": "Created",
  "item": { "id": "cuid", "status": "DRAFT" }
}


Errors

401 Missing/invalid token

403 Forbidden (không có permission CREATE)

400 thiếu title hoặc transactionType

PUT /admin/properties/:id

Update tin.

Headers
Authorization: Bearer <token>

Body
Gửi field cần update, ví dụ:

{
  "title": "Update title",
  "price": 2000000000
}


Response 200

{
  "message": "Updated",
  "item": { "id": "cuid" }
}

DELETE /admin/properties/:id

Xoá tin.

Headers
Authorization: Bearer <token>

Response 200

{ "ok": true }

POST /admin/properties/:id/publish

Đăng bài (status = PUBLISHED, set publishedAt).

Headers
Authorization: Bearer <token>

Response 200

{
  "message": "Published",
  "item": { "id": "cuid", "status": "PUBLISHED" }
}

POST /admin/properties/:id/unpublish

Gỡ bài (status = DRAFT).

Headers
Authorization: Bearer <token>

Response 200

{
  "message": "Unpublished",
  "item": { "id": "cuid", "status": "DRAFT" }
}

POST /admin/properties/:id/archive

Lưu kho (status = ARCHIVED).

Headers
Authorization: Bearer <token>

Response 200

{
  "message": "Archived",
  "item": { "id": "cuid", "status": "ARCHIVED" }
}

5) Admin Users (SUPER_ADMIN)

Route mounted: /api/admin/users
Bạn chưa gửi file routes/controller cuối nên FE lưu ý:

SUPER_ADMIN mới được dùng

ADMIN không có quyền quản lý admin

Khuyến nghị UI:

Ẩn menu “Quản lý admin” nếu role != SUPER_ADMIN

6) Taxonomy

Mounted: /api/taxonomy
(Chưa có spec chi tiết vì chưa gửi routes)

Thường FE cần:

locations tree

property types

tags

amenities

7) Leads

Mounted: /api/leads
(Chưa có spec chi tiết vì chưa gửi routes)

FE admin thường cần:

list lead

update status

filter by status/date

8) FE Integration Quick Guide
Public pages

Home/List: GET /api/properties (filters + paging)

Detail: GET /api/properties/:slug

Admin pages

Login: POST /api/auth/login

Store accessToken

CRUD: /api/admin/properties/* với header Bearer

Role-based UI

If role == ADMIN:

show “Quản lý tin”

If role == SUPER_ADMIN:

show “Quản lý tin” + “Quản lý admin”