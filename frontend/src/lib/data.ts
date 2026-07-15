import type {
  Business,
  Captain,
  School,
  Religious,
  Precinct,
  Turnout,
} from '../types';

const BASE = '/data';

async function fetchJSON<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

let _businessesCache: Business[] | null = null;
let _captainsCache: Captain[] | null = null;
let _schoolsCache: School[] | null = null;
let _religiousCache: Religious[] | null = null;
let _precinctsCache: Precinct[] | null = null;
let _turnoutCache: Turnout[] | null = null;

export async function getBusinesses(): Promise<Business[]> {
  if (_businessesCache) return _businessesCache;
  _businessesCache = await fetchJSON<Business[]>('businesses.json');
  return _businessesCache!;
}

export async function getCaptains(): Promise<Captain[]> {
  if (_captainsCache) return _captainsCache;
  _captainsCache = await fetchJSON<Captain[]>('captains.json');
  return _captainsCache!;
}

export async function getSchools(): Promise<School[]> {
  if (_schoolsCache) return _schoolsCache;
  _schoolsCache = await fetchJSON<School[]>('schools.json');
  return _schoolsCache!;
}

export async function getReligious(): Promise<Religious[]> {
  if (_religiousCache) return _religiousCache;
  _religiousCache = await fetchJSON<Religious[]>('religious.json');
  return _religiousCache!;
}

export async function getPrecincts(): Promise<Precinct[]> {
  if (_precinctsCache) return _precinctsCache;
  _precinctsCache = await fetchJSON<Precinct[]>('precincts.json');
  return _precinctsCache!;
}

export async function getTurnout(): Promise<Turnout[]> {
  if (_turnoutCache) return _turnoutCache;
  _turnoutCache = await fetchJSON<Turnout[]>('turnout.json');
  return _turnoutCache!;
}

export function extractCategories(businesses: Business[]): string[] {
  const cats = new Set<string>();
  for (const b of businesses) {
    if (b.category) cats.add(b.category);
  }
  return Array.from(cats).sort();
}

export function searchBusinesses(
  businesses: Business[],
  query: string,
  category: string | null,
): Business[] {
  let results = businesses;
  const q = query.toLowerCase().trim();

  if (q) {
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        (b.address && b.address.toLowerCase().includes(q)) ||
        (b.neighborhood && b.neighborhood.toLowerCase().includes(q)) ||
        (b.precinct && b.precinct.toLowerCase().includes(q)),
    );
  }

  if (category) {
    results = results.filter((b) => b.category === category);
  }

  return results;
}

export function searchCaptains(
  captains: Captain[],
  query: string,
): Captain[] {
  const q = query.toLowerCase().trim();
  if (!q) return captains;
  return captains.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      String(c.precinct).includes(q) ||
      c.polling_location.toLowerCase().includes(q),
  );
}

export function searchSchools(schools: School[], query: string): School[] {
  const q = query.toLowerCase().trim();
  if (!q) return schools;
  return schools.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      (s.type && s.type.toLowerCase().includes(q)) ||
      (s.address && s.address.toLowerCase().includes(q)),
  );
}

export function searchReligious(
  items: Religious[],
  query: string,
): Religious[] {
  const q = query.toLowerCase().trim();
  if (!q) return items;
  return items.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      (r.religion && r.religion.toLowerCase().includes(q)) ||
      (r.address && r.address.toLowerCase().includes(q)),
  );
}

export function sortBusinesses(
  businesses: Business[],
  sortBy: string,
): Business[] {
  const sorted = [...businesses];
  switch (sortBy) {
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'category':
      sorted.sort((a, b) => a.category.localeCompare(b.category));
      break;
    case 'precinct':
      sorted.sort((a, b) => a.precinct.localeCompare(b.precinct));
      break;
    default:
      break;
  }
  return sorted;
}
