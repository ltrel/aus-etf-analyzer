import { Delete, Search } from "@mui/icons-material";
import { Paper, Typography, Stack, TextField, Button, IconButton, InputAdornment, Collapse, Box } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useState } from "react";

const equalSizedFlexItems = {flex: "1 1 0", width: 0}
const smallButtonStyle = {width: "3ch", minWidth: "3ch", maxWidth: "3ch"}
const itemPaperStyle = {padding: 2, display: "flex", justifyContent: "space-between", alignItems: "center"}

export interface PortfolioCardListProps {
  data: Array<{symbol: string, quantity: number}>
  onQuantityChange(index: number, newQuantity: number): void
  onDelete(index: number): void
  onAdd(symbol: string): void
}
export default function PortfolioCardList({data, onQuantityChange, onDelete, onAdd} : PortfolioCardListProps) {
  const [symbolSearchText, setSymbolSearchText] = useState("")

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
      <TransitionGroup component={Box}>
        {data.map((asset, index) => {
          return (
            <Collapse key={asset.symbol}>
              <Paper sx={[itemPaperStyle, {marginBottom: 2}]}>
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
                <IconButton onClick={() => onDelete(index)}>
                  <Delete/>
                </IconButton>
              </Paper>
            </Collapse>
          )
        })}
      </TransitionGroup>
      <Paper sx={[itemPaperStyle, {padding: 0, marginTop: -2}]}>
        <TextField
          sx={equalSizedFlexItems}
          value={symbolSearchText}
          onChange={(event) => setSymbolSearchText(event.target.value.toUpperCase())}
          onKeyUp={(event) => {
            if(event.key === "Enter" && symbolSearchText) {
              onAdd(symbolSearchText)
              setSymbolSearchText("")
            }
          }}
          InputProps={{placeholder: "Add ETF by Symbol...", endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => {
                if(symbolSearchText) {
                  onAdd(symbolSearchText)
                  setSymbolSearchText("")
                }
              }}>
                <Search/>
              </IconButton>
            </InputAdornment>
          )}}
        />
      </Paper>
    </Stack>
  )
}