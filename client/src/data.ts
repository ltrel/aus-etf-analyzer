import camelcaseKeys from 'camelcase-keys';
import { z } from 'zod';

export const EtfDataSchema = z.object({
  dateUpdated: z.coerce.date(),
  etfSymbol: z.string(),
  etfName: z.string(),
  marketPrice: z.number(),

  sectorWeights: z.record(z.string(), z.number())
});

export type EtfData = z.infer<typeof EtfDataSchema>;

export async function fetchEtf() {
  const res = await fetch('http://localhost:8000/etfs/vas')
  const json = await res.json()
  const camelJson = camelcaseKeys(json)

  return EtfDataSchema.parse(camelJson)
}