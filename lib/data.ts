import cleanPointsRaw from '@/data/clean-points.json';
import materialsRaw from '@/data/materials.json';

export type MaterialId =
  | 'papel'
  | 'carton'
  | 'pet'
  | 'hdpe'
  | 'pvc'
  | 'ldpe'
  | 'pp'
  | 'pp_rigido'
  | 'ps'
  | 'otros'
  | 'vidrio'
  | 'tetrapak'
  | 'latas_aluminio'
  | 'latas_acero'
  | 'aceite_cocina'
  | 'pilas'
  | 'electronicos_pequenos'
  | 'organico'
  | 'basura_comun';

export type CleanPointType = 'fijo' | 'punto_verde' | 'movil' | 'pilas' | 'organicos';

export interface CleanPoint {
  id: string;
  nombre: string;
  direccion: string;
  comuna: string;
  horario: string;
  lat: number;
  lng: number;
  materiales: MaterialId[];
  tipo: CleanPointType;
  notas?: string;
}

export interface MaterialInfo {
  id: MaterialId;
  nombre: string;
  nombre_largo?: string;
  ejemplos: string[];
  reciclable_chile: boolean | 'parcial';
  destino: string[];
  consejo: string;
  codigo_resina?: number;
}

// Importes JSON bajo Metro pueden venir frozen; clonamos profundo para que
// arrays/objetos sean mutables (FlatList, sort, spreads internos).
const deepClone = <T>(x: T): T => JSON.parse(JSON.stringify(x));

const cleanPoints = deepClone(cleanPointsRaw.puntos) as CleanPoint[];
const materialsData = deepClone(materialsRaw) as typeof materialsRaw;

export function getCleanPoints(): CleanPoint[] {
  return cleanPoints;
}

export function getCleanPoint(id: string): CleanPoint | undefined {
  return cleanPoints.find((p) => p.id === id);
}

export function getMaterials(): MaterialInfo[] {
  const list: MaterialInfo[] = [];

  for (const [code, info] of Object.entries(materialsData.codigos_resina)) {
    list.push({
      id: info.id as MaterialId,
      nombre: info.nombre,
      nombre_largo: info.nombre_largo,
      ejemplos: info.ejemplos,
      reciclable_chile: info.reciclable_chile as boolean | 'parcial',
      destino: info.destino,
      consejo: info.consejo,
      codigo_resina: Number(code),
    });
  }

  for (const info of Object.values(materialsData.categorias)) {
    list.push({
      id: info.id as MaterialId,
      nombre: info.nombre,
      ejemplos: info.ejemplos,
      reciclable_chile: ('reciclable_chile' in info ? (info as any).reciclable_chile : true) as
        | boolean
        | 'parcial',
      destino: info.destino,
      consejo: info.consejo,
    });
  }

  return list;
}

export function getMaterial(id: MaterialId): MaterialInfo | undefined {
  return getMaterials().find((m) => m.id === id);
}

export function getMaterialByResinCode(code: number): MaterialInfo | undefined {
  const entry = (materialsData.codigos_resina as Record<string, { id: string }>)[String(code)];
  if (!entry) return undefined;
  return getMaterial(entry.id as MaterialId);
}

export function findCleanPointsForMaterial(materialId: MaterialId): CleanPoint[] {
  const directMatches = cleanPoints.filter((p) => p.materiales.includes(materialId));
  if (directMatches.length > 0) return directMatches;

  // PET es la columna vertebral de los puntos limpios
  if (materialId === 'pet') {
    return cleanPoints.filter((p) => p.materiales.includes('pet'));
  }
  return [];
}
