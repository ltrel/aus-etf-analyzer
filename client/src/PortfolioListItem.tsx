import { Typography, Paper, Button, Stack, IconButton, TextField } from "@mui/material"
import { Delete, PieChart } from "@mui/icons-material"
import { equalSizedFlexItems, itemPaperStyle, smallButtonStyle } from "./styles"
import { fetchEtf } from "./data"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export interface PortfolioListItemProps {
  asset: {
    symbol: string
    quantity: number
  }
  onQuantityChange(newQuantity: number): void
  onDelete(): void
  onGraph(): void
}
export default function PortfolioListItem({asset, onQuantityChange, onDelete, onGraph}: PortfolioListItemProps) {
  const {data, error, isLoading, status} = useQuery({queryKey: ['etf', asset.symbol], queryFn: () => fetchEtf(asset.symbol)})
  useEffect(() => {
    if (status === 'error') onDelete()
  }, [status, onDelete])

  function validateQuantityInput(newInput: string) {
    const number = Number(newInput)
    if(!isNaN(number) && Number.isInteger(number) && number >= 0) {
      onQuantityChange(number) 
    }
  }

  function incrementQuantity(amount: number) {
    onQuantityChange(Math.max(asset.quantity + amount, 1))
  }

  let unitPriceText
  let totalValueText
  if(data) {
    unitPriceText = "$" + data.marketPrice 
    totalValueText = "$" + (data.marketPrice * asset.quantity).toFixed(2)
  } else if (isLoading) {
    unitPriceText = "Loading..."
    totalValueText = "Loading..."
  } else if (error) {
    unitPriceText = "Error."
    totalValueText= "Error."
  }

  return (
    <Paper sx={[itemPaperStyle, {marginBottom: 2}]}>
      <Typography sx={equalSizedFlexItems}>{asset.symbol}</Typography>
      <Stack direction="row" gap={1} sx={[equalSizedFlexItems, {alignItems: "center"}]}>
        <TextField
          variant="standard"
          sx={{width: "6ch"}}
          value={asset.quantity}
          inputProps={{style: {textAlign: "center"}}}
          onChange={(event) => validateQuantityInput(event.target.value)}
          onBlur={() => onQuantityChange(1)}
        />
        <Button
          sx={smallButtonStyle}
          onClick={() => incrementQuantity(-1)}
        >
          &#8211;
        </Button>
        <Button
          sx={smallButtonStyle}
          onClick={() => incrementQuantity(1)}
        >
          +
        </Button>
      </Stack>
      <Typography sx={equalSizedFlexItems}>{unitPriceText}</Typography>
      <Typography sx={equalSizedFlexItems}>{totalValueText}</Typography>
      <IconButton onClick={() => onGraph()}>
        <PieChart/>
      </IconButton>
      <IconButton onClick={() => onDelete()}>
        <Delete/>
      </IconButton>
    </Paper>
  )
}