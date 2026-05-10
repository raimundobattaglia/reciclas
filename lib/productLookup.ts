import localDb from '@/data/local-products.json';
import type { MaterialId } from './data';

export interface Product {
  barcode: string;
  name?: string;
  brand?: string;
  image?: string;
  source: 'local' | 'openfoodfacts' | 'upcitemdb';
  packagingRaw?: string;
  notes?: string;
  inferredMaterials: MaterialId[];
}

const TAG_TO_MATERIAL: Record<string, MaterialId> = {
  'en:plastic': 'pet',
  'en:pet-1-polyethylene-terephthalate': 'pet',
  'en:pet': 'pet',
  'en:hdpe-2-high-density-polyethylene': 'hdpe',
  'en:hdpe': 'hdpe',
  'en:pvc-3-polyvinyl-chloride': 'pvc',
  'en:pvc': 'pvc',
  'en:ldpe-4-low-density-polyethylene': 'ldpe',
  'en:ldpe': 'ldpe',
  'en:pp-5-polypropylene': 'pp',
  'en:pp': 'pp',
  'en:ps-6-polystyrene': 'ps',
  'en:ps': 'ps',
  'en:other-plastics-7': 'otros',
  'en:glass': 'vidrio',
  'en:glass-bottle': 'vidrio',
  'en:glass-jar': 'vidrio',
  'en:paper': 'papel',
  'en:cardboard': 'carton',
  'en:carton': 'carton',
  'en:tetra-pak': 'tetrapak',
  'en:brick': 'tetrapak',
  'en:aluminium': 'latas_aluminio',
  'en:aluminium-can': 'latas_aluminio',
  'en:can': 'latas_acero',
  'en:steel': 'latas_acero',
  'en:tin': 'latas_acero',
};

function inferFromText(raw: string): MaterialId[] {
  const r = raw.toLowerCase();
  const found = new Set<MaterialId>();
  if (r.includes('vidrio') || r.includes('glass') || r.includes('botella vidrio')) found.add('vidrio');
  if (r.includes('cartón') || r.includes('carton') || r.includes('cardboard') || r.includes('caja')) found.add('carton');
  if (r.includes('papel') || r.includes('paper')) found.add('papel');
  if (r.includes('tetra') || r.includes('brick')) found.add('tetrapak');
  if (r.includes('aluminio') || r.includes('aluminium') || r.includes('lata de bebida') || r.includes('beverage can')) found.add('latas_aluminio');
  if (r.includes('lata') || r.includes('can') || r.includes('tin')) found.add('latas_acero');
  if (r.includes('plástico') || r.includes('plastic') || r.includes('pet') || r.includes('botella')) found.add('pet');
  if (r.includes('hdpe') || r.includes('pead') || r.includes('polietileno alta')) found.add('hdpe');
  if (r.includes('ldpe') || r.includes('pebd') || r.includes('bolsa')) found.add('ldpe');
  if (r.includes('polipropileno') || r.includes('polypropylene')) found.add('pp');
  return Array.from(found);
}

function tryLocal(barcode: string): Product | null {
  const productos = (localDb as any).productos as Record<
    string,
    { name: string; brand?: string; materials: MaterialId[]; notes?: string }
  >;
  const hit = productos[barcode];
  if (!hit) return null;
  return {
    barcode,
    name: hit.name,
    brand: hit.brand,
    source: 'local',
    notes: hit.notes,
    inferredMaterials: hit.materials,
  };
}

async function tryOpenFoodFacts(barcode: string): Promise<Product | null> {
  const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(
    barcode,
  )}.json?fields=product_name,brands,image_front_small_url,packaging,packaging_tags,categories`;
  const res = await fetch(url, { headers: { 'User-Agent': 'RecicLas/0.1 (Chile)' } });
  if (!res.ok) return null;
  const data = await res.json();
  if (data.status !== 1 || !data.product) return null;
  const p = data.product;
  const tags: string[] = p.packaging_tags || [];
  const found = new Set<MaterialId>();
  for (const tag of tags) {
    const m = TAG_TO_MATERIAL[tag];
    if (m) found.add(m);
  }
  inferFromText(`${p.packaging || ''} ${p.categories || ''}`).forEach((m) => found.add(m));
  return {
    barcode,
    name: p.product_name,
    brand: p.brands,
    image: p.image_front_small_url,
    source: 'openfoodfacts',
    packagingRaw: p.packaging,
    inferredMaterials: Array.from(found),
  };
}

async function tryUpcItemDb(barcode: string): Promise<Product | null> {
  const url = `https://api.upcitemdb.com/prod/trial/lookup?upc=${encodeURIComponent(barcode)}`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const item = data?.items?.[0];
  if (!item) return null;
  const corpus = `${item.title || ''} ${item.description || ''} ${item.category || ''} ${item.brand || ''}`;
  return {
    barcode,
    name: item.title,
    brand: item.brand,
    image: item.images?.[0],
    source: 'upcitemdb',
    packagingRaw: item.description,
    inferredMaterials: inferFromText(corpus),
  };
}

export async function lookupProduct(barcode: string): Promise<Product | null> {
  const local = tryLocal(barcode);
  if (local) return local;
  try {
    const off = await tryOpenFoodFacts(barcode);
    if (off) return off;
  } catch {}
  try {
    const upc = await tryUpcItemDb(barcode);
    if (upc) return upc;
  } catch {}
  return null;
}
