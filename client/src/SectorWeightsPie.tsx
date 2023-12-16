import { PieChart } from "@mui/x-charts"
import { Portfolio, fetchEtf, portfolioSectorWeights } from "./data"
import { allOrNothing } from "./util"
import Color from "color"
import { useQueries } from "@tanstack/react-query"

const baseColor = "#DF5648"
const palette = new Array(11).fill(0).map((_, i) => {
  return Color(baseColor).rotate(360 / 11 * i).hex()
})

interface SectorWeightsPieProps {
  assets: Array<{symbol: string, quantity: number}>
}
export default function SectorWeightsPie({assets}: SectorWeightsPieProps) {
  const queries = assets.map((asset) => {
    return { queryKey: ['etf', asset.symbol], queryFn: () => fetchEtf(asset.symbol)}
  })
  const {data, isPending, error} = useQueries({queries: queries, combine: (results) => {
    return {
      data: allOrNothing(results.map(x => x.data)),
      isPending: results.some(x => x.isPending),
      error: results.some(x => x.error),
    }
  }})
  if (assets.length === 0) return "No data."

  if (isPending) {
    return "Loading..."
  } else if (error) {
    return "Error."
  } else if (!data) {
    return
  }

  const portfolio: Portfolio = data.map((asset, index) => ({etf: asset, quantity: assets[index].quantity}))
  const portfolioWeights = portfolioSectorWeights(portfolio)
  const chartData = Object.entries(portfolioWeights).map(([sectorName, weight], index) => {
    return {
      id: index,
      label: sectorName,
      value: weight,
    }
  })

  return (
    <PieChart
      colors={palette}
      series={[
        {
          arcLabel: (item) => `${item.value.toFixed(2)}%`,
          data: chartData,
          valueFormatter: (x) => `${x.value.toFixed(2)}%`,
          arcLabelMinAngle: 21,
        }
      ]}
      height={400}
    />
  )
}