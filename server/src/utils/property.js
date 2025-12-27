const SENSITIVE_FIELDS = [
  "title",
  "description",
  "price",
  "priceMin",
  "priceMax",
  "area",
  "bedrooms",
  "bathrooms",
  "address",
  "locationId",
  "typeId",
];

exports.needReapprove = (oldData, newData) => {
  return SENSITIVE_FIELDS.some(
    (field) => newData[field] !== undefined && newData[field] !== oldData[field]
  );
};