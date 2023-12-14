import { Typography, Paper, Button, Stack, IconButton, TextField } from "@mui/material"
import { Delete } from "@mui/icons-material"
import { equalSizedFlexItems } from "./styles"

const smallButtonStyle = {width: "3ch", minWidth: "3ch", maxWidth: "3ch"}
export const itemPaperStyle = {padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}

export interface PortfolioListItemProps {
  asset: {
    symbol: string
    quantity: number
  }
  onQuantityChange(newQuantity: number): void
  onDelete(): void
}
export default function PortfolioListItem({asset, onQuantityChange, onDelete}: PortfolioListItemProps) {
  function validateQuantityInput(newInput: string) {
    const number = Number(newInput)
    if(!isNaN(number) && Number.isInteger(number) && number >= 0) {
      onQuantityChange(number) 
    }
  }

  function incrementQuantity(amount: number) {
    onQuantityChange(Math.max(asset.quantity + amount, 1))
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
      <Typography sx={equalSizedFlexItems}>$37.21 (PLACEHOLDER)</Typography>
      <Typography sx={equalSizedFlexItems}>${asset.quantity*37.21}</Typography>
      <IconButton onClick={() => onDelete()}>
        <Delete/>
      </IconButton>
    </Paper>
  )
}