const { z } = require("zod");

const SortEnum = z.enum([
  "createdAt_desc",
  "createdAt_asc",
  "price_asc",
  "price_desc",
  "area_asc",
  "area_desc",
]);

const MatchEnum = z.enum(["all", "any"]);
const TagsModeEnum = z.enum(["any", "all"]);

function toInt(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = parseInt(String(v), 10);
  return Number.isFinite(n) ? n : undefined;
}

function toNumber(v) {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function toBool(v, defaultValue) {
  if (v === undefined || v === null || v === "") return defaultValue;
  const s = String(v).toLowerCase().trim();
  return ["1", "true", "yes", "y", "on"].includes(s);
}

function parseCsv(v) {
  if (!v) return [];
  return String(v)
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * Query schema cho GET /api/properties
 * Normalize ở transform để controller dùng luôn.
 */
const propertyListQuerySchema = z
  .object({
    page: z.any().optional(),
    limit: z.any().optional(),
    all: z.any().optional(),

    sort: z.any().optional(),
    match: z.any().optional(),

    q: z.string().optional(),

    typeId: z.string().optional(),
    transactionType: z.string().optional(),

    priceMin: z.any().optional(),
    priceMax: z.any().optional(),
    areaMin: z.any().optional(),
    areaMax: z.any().optional(),

    bedroomsMin: z.any().optional(),
    bathroomsMin: z.any().optional(),

    locationId: z.string().optional(),
    locationSlug: z.string().optional(),
    includeChildren: z.any().optional(),

    tagIds: z.any().optional(),
    tagSlugs: z.any().optional(),
    tagsMode: z.any().optional(),
  })
  .transform((raw) => {
    const page = Math.max(1, toInt(raw.page) ?? 1);
    const limit = Math.min(50, Math.max(1, toInt(raw.limit) ?? 12));
    const all = toBool(raw.all, false);

    const sort = SortEnum.safeParse(raw.sort ?? "createdAt_desc").success
      ? raw.sort ?? "createdAt_desc"
      : "createdAt_desc";

    const match = MatchEnum.safeParse(raw.match ?? "all").success ? raw.match ?? "all" : "all";

    const priceMin = toNumber(raw.priceMin);
    const priceMax = toNumber(raw.priceMax);
    const areaMin = toNumber(raw.areaMin);
    const areaMax = toNumber(raw.areaMax);

    const bedroomsMin = toInt(raw.bedroomsMin);
    const bathroomsMin = toInt(raw.bathroomsMin);

    const includeChildren = toBool(raw.includeChildren, true);

    const tagIds = parseCsv(raw.tagIds);
    const tagSlugs = parseCsv(raw.tagSlugs);

    const tagsMode = TagsModeEnum.safeParse(raw.tagsMode ?? "any").success
      ? raw.tagsMode ?? "any"
      : "any";

    return {
      page,
      limit,
      all,
      sort,
      match,

      q: (raw.q || "").toString().trim() || undefined,
      typeId: raw.typeId || undefined,
      transactionType: raw.transactionType || undefined,

      priceMin,
      priceMax,
      areaMin,
      areaMax,
      bedroomsMin,
      bathroomsMin,

      locationId: raw.locationId || undefined,
      locationSlug: (raw.locationSlug || "").toString().trim() || undefined,
      includeChildren,

      tagIds,
      tagSlugs,
      tagsMode,
    };
  })
  .superRefine((q, ctx) => {
    if (q.priceMin !== undefined && q.priceMax !== undefined && q.priceMin > q.priceMax) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "priceMin must be <= priceMax", path: ["priceMin"] });
    }
    if (q.areaMin !== undefined && q.areaMax !== undefined && q.areaMin > q.areaMax) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "areaMin must be <= areaMax", path: ["areaMin"] });
    }
    if (q.locationId && q.locationSlug) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Use only one of locationId or locationSlug",
        path: ["locationSlug"],
      });
    }
  });

module.exports = { propertyListQuerySchema };
