export function toObject(rawResponse) {
  return Object.fromEntries(
    rawResponse.map(([key, value]) => {
      if (!isNaN(value)) {
        return [key, Number(value)];
      }
      return [key, value];
    }),
  );
}

export function toFlatArray(rows) {
  return rows.filter((row) => row && row[0]).map((row) => Number(row[0]));
}

export function calculatePending(total, paid) {
  const all = Array.from({ length: total }, (_, i) => i + 1);
  const paidSet = new Set(paid);

  return all.filter((h) => !paidSet.has(h));
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(value);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(date);
}
