const EMPTY_VALUES = new Set(['', 'null', 'undefined', 'n/a', 'na']);

export function normalizeRows(rows) {
  return rows.map((row) =>
    Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.trim(), typeof value === 'string' ? value.trim() : value]),
    ),
  );
}

export function detectColumns(rows) {
  if (!rows.length) return [];

  const columnNames = Object.keys(rows[0]);

  return columnNames.map((name) => {
    const values = rows.map((row) => row[name]).filter((value) => !isEmpty(value));
    const numericValues = values.filter((value) => isNumeric(value));
    const uniqueValues = new Set(values.map(String));
    const numericRatio = values.length ? numericValues.length / values.length : 0;

    return {
      name,
      type: values.length > 0 && numericRatio >= 0.85 ? 'number' : 'category',
      filled: values.length,
      missing: rows.length - values.length,
      unique: uniqueValues.size,
    };
  });
}

export function getNumericStats(rows, columns) {
  return columns
    .filter((column) => column.type === 'number')
    .map((column) => {
      const values = rows.map((row) => row[column.name]).filter(isNumeric).map(Number);
      const total = values.reduce((sum, value) => sum + value, 0);

      return {
        column: column.name,
        count: values.length,
        average: values.length ? total / values.length : 0,
        min: values.length ? Math.min(...values) : 0,
        max: values.length ? Math.max(...values) : 0,
      };
    });
}

export function getCategoricalChartData(rows, columnName, limit = 8) {
  const counts = rows.reduce((totals, row) => {
    const rawValue = row[columnName];
    const value = isEmpty(rawValue) ? 'Missing' : String(rawValue);
    totals[value] = (totals[value] || 0) + 1;
    return totals;
  }, {});

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

export function getNumericChartData(rows, columnName, bucketCount = 8) {
  const values = rows.map((row) => Number(row[columnName])).filter(Number.isFinite);
  if (!values.length) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (min === max) {
    return [{ name: formatNumber(min), value: values.length }];
  }

  const bucketSize = (max - min) / bucketCount;
  const buckets = Array.from({ length: bucketCount }, (_, index) => {
    const start = min + index * bucketSize;
    const end = index === bucketCount - 1 ? max : start + bucketSize;
    return {
      name: `${formatNumber(start)}-${formatNumber(end)}`,
      value: 0,
    };
  });

  values.forEach((value) => {
    const index = Math.min(Math.floor((value - min) / bucketSize), bucketCount - 1);
    buckets[index].value += 1;
  });

  return buckets;
}

export function generateInsights(rows, columns, stats) {
  if (!rows.length) return [];

  const insights = [
    `The file contains ${rows.length.toLocaleString()} rows and ${columns.length.toLocaleString()} columns.`,
  ];

  const numericColumns = columns.filter((column) => column.type === 'number');
  const categoryColumns = columns.filter((column) => column.type === 'category');

  insights.push(`${columnCountText(numericColumns.length)} numeric, and ${columnCountText(categoryColumns.length)} categorical.`);

  const widestRange = stats
    .map((item) => ({ ...item, range: item.max - item.min }))
    .sort((a, b) => b.range - a.range)[0];

  if (widestRange) {
    insights.push(
      `${widestRange.column} has the widest numeric range, from ${formatNumber(widestRange.min)} to ${formatNumber(widestRange.max)}.`,
    );
  }

  const mostUniqueCategory = [...categoryColumns].sort((a, b) => b.unique - a.unique)[0];
  if (mostUniqueCategory) {
    insights.push(`${mostUniqueCategory.name} has the most distinct values (${mostUniqueCategory.unique}).`);
  }

  const mostMissing = [...columns].sort((a, b) => b.missing - a.missing)[0];
  if (mostMissing?.missing > 0) {
    insights.push(`${mostMissing.name} has the most missing values (${mostMissing.missing}).`);
  }

  return insights;
}

export function formatNumber(value) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

function isEmpty(value) {
  return value === null || value === undefined || EMPTY_VALUES.has(String(value).trim().toLowerCase());
}

function isNumeric(value) {
  if (isEmpty(value)) return false;
  return Number.isFinite(Number(value));
}

function columnCountText(count) {
  return `${count} column${count === 1 ? ' looks' : 's look'}`;
}
