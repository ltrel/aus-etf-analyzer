import { PieChart } from '@mui/x-charts';
import Color from 'color';
import { useQueries } from '@tanstack/react-query';
import { Portfolio, fetchEtf, portfolioSectorWeights } from './data';
import { allOrNothing } from './util';

const baseColor = '#DF5648';
const colorCount = 11;
const palette = new Array(colorCount).fill(0).map((_, i) => Color(baseColor).rotate((360 / colorCount) * i).hex());

interface SectorWeightsPieProps {
  assets: Array<{ symbol: string, quantity: number }>
}
export default function SectorWeightsPie({ assets }: SectorWeightsPieProps) {
  const queries = assets.map((asset) => ({ queryKey: ['etf', asset.symbol], queryFn: () => fetchEtf(asset.symbol) }));
  const { data, isPending, error } = useQueries({
    queries,
    combine: (results) => ({
      data: allOrNothing(results.map((x) => x.data)),
      isPending: results.some((x) => x.isPending),
      error: results.some((x) => x.error),
    }),
  });
  if (assets.length === 0) return 'No data.';

  if (isPending) {
    return 'Loading...';
  } if (error) {
    return 'Error.';
  } if (!data) {
    return 'Error.';
  }

  const portfolio: Portfolio = data.map((asset, index) => ({
    etf: asset,
    quantity: assets[index].quantity,
  }));
  const portfolioWeights = portfolioSectorWeights(portfolio);
  const chartData = Object.entries(portfolioWeights).map(([sectorName, weight], index) => ({
    id: index,
    label: sectorName,
    value: weight,
  }));

  return (
    <PieChart
      colors={palette}
      series={[
        {
          arcLabel: (item) => `${item.value.toFixed(2)}%`,
          data: chartData,
          valueFormatter: (x) => `${x.value.toFixed(2)}%`,
          arcLabelMinAngle: 21,
        },
      ]}
      height={400}
    />
  );
}
