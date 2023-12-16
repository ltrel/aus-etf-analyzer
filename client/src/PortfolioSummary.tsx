import { Stack, Typography, Paper, IconButton } from "@mui/material"
import { PieChart } from "@mui/icons-material"
import { itemPaperStyle } from "./styles"
import { useQueries } from "@tanstack/react-query"
import { fetchEtf } from "./data"

export interface PortfolioSummaryProps {
  data: Array<{symbol: string, quantity: number}>
}
export default function PortfolioSummary({data}: PortfolioSummaryProps) {
  const queries = data.map((asset) => {
    return { queryKey: ['etf', asset.symbol], queryFn: () => fetchEtf(asset.symbol)}
  })
  const results = useQueries({queries: queries})
  const totalUnits = data.reduce((prev, asset) => prev + asset.quantity, 0)
  const uniqueSymbols = data.length
  
  const sum = results.reduce((prev: number | 'error' | 'loading', result, index) => {
    if (result.isError || prev === 'error') return 'error'
    else if (result.isLoading || prev === 'loading') return 'loading'
    // This shouldn't happen...
    else if (result.data === undefined) {
      console.log(result.status)
      return 'error'
    }
    return prev + result.data.marketPrice * data[index].quantity
  }, 0)
  let totalValue
  if (sum === 'error') totalValue = "Error."
  else if (sum === 'loading') totalValue = "Loading..."
  else totalValue = `$${sum}`

  return (
    <Paper sx={itemPaperStyle}>
      <Stack>
        <Typography sx={{fontWeight: 'bold'}}>Total Portfolio Value</Typography>
        <Typography>{totalValue}</Typography>
      </Stack>
      <Stack>
        <Typography sx={{fontWeight: 'bold'}}>Total Units Held</Typography>
        <Typography>{totalUnits}</Typography>
      </Stack>
      <Stack>
        <Typography sx={{fontWeight: 'bold'}}>Unique Symbols</Typography>
        <Typography>{uniqueSymbols}</Typography>
      </Stack>
      <IconButton>
        <PieChart/>
      </IconButton>
    </Paper>
  )
}
