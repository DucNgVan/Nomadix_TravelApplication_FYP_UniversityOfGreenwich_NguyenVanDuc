export const POPULAR_AIRPORTS = [
  { code: 'SGN', city: 'TP. Hồ Chí Minh', name: 'Sân bay Quốc tế Tân Sơn Nhất', aliases: ['sài gòn', 'saigon', 'hồ chí minh', 'ho chi minh', 'tp hcm', 'tphcm', 'sgn'] },
  { code: 'HAN', city: 'Hà Nội', name: 'Sân bay Quốc tế Nội Bài', aliases: ['hà nội', 'ha noi', 'nội bài', 'noi bai', 'han'] },
  { code: 'DAD', city: 'Đà Nẵng', name: 'Sân bay Quốc tế Đà Nẵng', aliases: ['đà nẵng', 'da nang', 'danang', 'dad'] },
  { code: 'PQC', city: 'Phú Quốc', name: 'Sân bay Quốc tế Phú Quốc', aliases: ['phú quốc', 'phu quoc', 'pqc'] },
  { code: 'CXR', city: 'Nha Trang', name: 'Sân bay Quốc tế Cam Ranh', aliases: ['nha trang', 'cam ranh', 'cxr'] },
  { code: 'DLI', city: 'Đà Lạt', name: 'Sân bay Liên Khương', aliases: ['đà lạt', 'da lat', 'liên khương', 'lien khuong', 'dli'] },
  { code: 'HUI', city: 'Huế', name: 'Sân bay Quốc tế Phú Bài', aliases: ['huế', 'hue', 'phú bài', 'phu bai', 'hui'] },
  { code: 'HPH', city: 'Hải Phòng', name: 'Sân bay Quốc tế Cát Bi', aliases: ['hải phòng', 'hai phong', 'cát bi', 'cat bi', 'hph'] },
  { code: 'UIH', city: 'Quy Nhơn', name: 'Sân bay Phù Cát', aliases: ['quy nhơn', 'quy nhon', 'phù cát', 'phu cat', 'uih'] },
  { code: 'VII', city: 'Vinh', name: 'Sân bay Quốc tế Vinh', aliases: ['vinh', 'nghệ an', 'nghe an', 'vii'] },
  { code: 'VCA', city: 'Cần Thơ', name: 'Sân bay Quốc tế Cần Thơ', aliases: ['cần thơ', 'can tho', 'vca'] },
  { code: 'SIN', city: 'Singapore', name: 'Sân bay Quốc tế Changi', aliases: ['singapore', 'changi', 'sin'] },
  { code: 'BKK', city: 'Bangkok', name: 'Sân bay Suvarnabhumi', aliases: ['bangkok', 'suvarnabhumi', 'bkk'] },
];

/**
 * Normalizes text to lowercase without diacritics for flexible fuzzy searching
 */
export function removeVietnameseTones(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim();
}

/**
 * Resolves a given city name, alias, or code to a standard 3-letter IATA code
 * E.g. "Hà Nội" -> "HAN", "Sài Gòn" -> "SGN", "dad" -> "DAD"
 */
export function resolveAirportCode(input = '') {
  if (!input) return '';
  const trimmed = input.trim();
  const normalized = removeVietnameseTones(trimmed);

  // Check direct 3-letter match
  if (trimmed.length === 3) {
    const directCode = trimmed.toUpperCase();
    const foundByCode = POPULAR_AIRPORTS.find((a) => a.code === directCode);
    if (foundByCode) return foundByCode.code;
  }

  // Check aliases
  for (const airport of POPULAR_AIRPORTS) {
    if (airport.code.toLowerCase() === normalized) {
      return airport.code;
    }
    const cityNorm = removeVietnameseTones(airport.city);
    if (cityNorm === normalized || normalized.includes(cityNorm) || cityNorm.includes(normalized)) {
      return airport.code;
    }
    for (const alias of airport.aliases) {
      const aliasNorm = removeVietnameseTones(alias);
      if (aliasNorm === normalized || normalized.includes(aliasNorm) || aliasNorm.includes(normalized)) {
        return airport.code;
      }
    }
  }

  // Fallback to uppercase input if 3 characters
  if (trimmed.length === 3) {
    return trimmed.toUpperCase();
  }

  return trimmed.toUpperCase();
}

/**
 * Searches airports matching query for autocomplete / quick suggestions
 */
export function searchAirports(query = '') {
  if (!query || !query.trim()) return POPULAR_AIRPORTS.slice(0, 6);
  const qNorm = removeVietnameseTones(query);

  return POPULAR_AIRPORTS.filter((airport) => {
    const codeMatch = airport.code.toLowerCase().includes(qNorm);
    const cityMatch = removeVietnameseTones(airport.city).includes(qNorm);
    const nameMatch = removeVietnameseTones(airport.name).includes(qNorm);
    const aliasMatch = airport.aliases.some((al) => removeVietnameseTones(al).includes(qNorm));
    return codeMatch || cityMatch || nameMatch || aliasMatch;
  });
}
