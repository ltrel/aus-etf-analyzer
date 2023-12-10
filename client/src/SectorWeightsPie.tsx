import { PieChart } from "@mui/x-charts"
import { EtfData } from "./data"

interface SectorWeightsPieProps {
  etfData: EtfData
}
export default function SectorWeightsPie({etfData}: SectorWeightsPieProps) {
  const chartData = Object.entries(etfData.sectorWeights).map(([sectorName, weight], index) => {
    return {id: index, label: sectorName, value: weight}
  })

  return (
    <PieChart
      series={[
        {
          arcLabel: 'label',
          data: chartData,
        }
      ]}
      height={400}
    />
  )
}