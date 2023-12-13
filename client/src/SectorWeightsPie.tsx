import { PieChart } from "@mui/x-charts"
import { EtfData } from "./data"
import Color from "color"

const baseColor = "#DF5648"
const palette = new Array(11).fill(0).map((_, i) => {
  return Color(baseColor).rotate(360 / 11 * i).hex()
})

interface SectorWeightsPieProps {
  etfData: EtfData
}
export default function SectorWeightsPie({etfData}: SectorWeightsPieProps) {
  const chartData = Object.entries(etfData.sectorWeights).map(([sectorName, weight], index) => {
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