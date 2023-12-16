import { PieChart } from "@mui/x-charts"
import { fetchEtf } from "./data"
import Color from "color"
import { useQuery } from "@tanstack/react-query"

const baseColor = "#DF5648"
const palette = new Array(11).fill(0).map((_, i) => {
  return Color(baseColor).rotate(360 / 11 * i).hex()
})

interface SectorWeightsPieProps {
  symbol: string
}
export default function SectorWeightsPie({symbol}: SectorWeightsPieProps) {
  const {data, error, isLoading} = useQuery({queryKey: ['etf', symbol], queryFn: () => fetchEtf(symbol)})

  if (isLoading) {
    return "Loading..."
  } else if (error) {
    return "Error."
  } else if (!data) {
    return
  }

  const chartData = Object.entries(data.sectorWeights).map(([sectorName, weight], index) => {
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