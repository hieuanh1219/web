const cache = new Map();

function getCache(key) {
  const v = cache.get(key);
  if (!v) return null;
  if (v.exp < Date.now()) {
    cache.delete(key);
    return null;
  }
  return v.value;
}

function setCache(key, value, ttlMs = 5 * 60 * 1000) {
  cache.set(key, { value, exp: Date.now() + ttlMs });
}

module.exports = { getCache, setCache };
