import camelcaseKeys from 'camelcase-keys';
import { z } from 'zod';

export const SectorWeightsSchema = z.record(z.string(), z.number());
export type SectorWeights = z.infer<typeof SectorWeightsSchema>;

export const EtfDataSchema = z.object({
  dateUpdated: z.coerce.date(),
  etfSymbol: z.string(),
  etfName: z.string(),
  marketPrice: z.number(),

  sectorWeights: SectorWeightsSchema,
});
export type EtfData = z.infer<typeof EtfDataSchema>;

export async function fetchEtf(key: string): Promise<EtfData> {
  const res = await fetch(`http://localhost:8000/etfs/${key}`);
  const json = await res.json();
  const camelJson = camelcaseKeys(json);

  return EtfDataSchema.parse(camelJson);
}

export const AssetsSchema = z.array(z.object({
  symbol: z.string(),
  quantity: z.number(),
}));
export type Assets = z.infer<typeof AssetsSchema>;

export interface PortfolioAsset {
  etf: EtfData,
  quantity: number,
}
export type Portfolio = Array<PortfolioAsset>;
export function portfolioSectorWeights(portfolio: Portfolio): SectorWeights {
  const totalValue = portfolio.reduce((acc, asset) => (
    acc + asset.etf.marketPrice * asset.quantity), 0);
  const result: SectorWeights = {};
  portfolio.forEach((asset) => {
    const assetWeight = (asset.etf.marketPrice * asset.quantity) / totalValue;
    Object.entries(asset.etf.sectorWeights).forEach(([sectorName, sectorWeight]) => {
      if (result[sectorName] === undefined) {
        result[sectorName] = sectorWeight * assetWeight;
      } else {
        result[sectorName] += sectorWeight * assetWeight;
      }
    });
  });
  return result;
}
