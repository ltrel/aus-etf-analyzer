import { Delete } from "@mui/icons-material";
import { Paper, Typography, Stack, TextField, Button, IconButton, } from "@mui/material";

const equalSizedFlexItems = {flex: "1 1 0", width: 0}
const smallButtonStyle = {width: "3ch", minWidth: "3ch", maxWidth: "3ch"}
const itemPaperStyle = {padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}

interface PortfolioCardListProps {
  data: Array<{symbol: string, quantity: number}>
  onQuantityChange(index: number, newQuantity: number): void
}
export default function PortfolioCardList({data, onQuantityChange} : PortfolioCardListProps) {
  function validateQuantityInput(index: number, newInput: string) {
    const number = Number(newInput)
    if(!isNaN(number) && Number.isInteger(number) && number >= 0) {
      onQuantityChange(index, number) 
    }
  }
  function incrementQuantity(index: number, amount: number) {
    const newValue = Math.max(data[index].quantity + amount, 1)
    onQuantityChange(index, newValue)
  }

  return (
    <Stack gap={2}>
      <Paper sx={itemPaperStyle}>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Symbol</Typography>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Quantity</Typography>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Unit Price</Typography>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Total Value</Typography>
        <IconButton sx={{opacity: 0, height: 0}} disabled>
          <Delete/>
        </IconButton>
      </Paper>
      {data.map((asset, index) => {
        return (
          <Paper sx={itemPaperStyle}>
            <Typography sx={equalSizedFlexItems}>{asset.symbol}</Typography>
            <Stack direction="row" gap={1} sx={[equalSizedFlexItems, {alignItems: "center"}]}>
              <TextField
                variant="standard"
                sx={{width: "6ch"}}
                value={asset.quantity}
                inputProps={{style: {textAlign: "center"}}}
                onChange={(event) => validateQuantityInput(index, event.target.value)}
                onBlur={() => onQuantityChange(index, 1)}
              />
              <Button
                sx={smallButtonStyle}
                onClick={() => incrementQuantity(index, -1)}
              >
                &#8211;
              </Button>
              <Button
                sx={smallButtonStyle}
                onClick={() => incrementQuantity(index, 1)}
              >
                +
              </Button>
            </Stack>
            <Typography sx={equalSizedFlexItems}>$37.21 (PLACEHOLDER)</Typography>
            <Typography sx={equalSizedFlexItems}>${asset.quantity*37.21}</Typography>
            <IconButton>
              <Delete/>
            </IconButton>
          </Paper>
        )
      })}
    </Stack>
  )
}