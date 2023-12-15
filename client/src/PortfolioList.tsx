import { Delete, Search, PieChart } from "@mui/icons-material";
import { Paper, Typography, Stack, TextField, IconButton, InputAdornment, Collapse, Box } from "@mui/material";
import { TransitionGroup } from "react-transition-group";
import { useState } from "react";
import PortfolioListItem, {itemPaperStyle} from "./PortfolioListItem";
import { equalSizedFlexItems } from "./styles";

const phantomButtonStyle = {opacity: 0, height: 0}

export interface PortfolioListProps {
  data: Array<{symbol: string, quantity: number}>
  onQuantityChange(index: number, newQuantity: number): void
  onDelete(index: number): void
  onAdd(symbol: string): void
  onGraph(index: number): void
}
export default function PortfolioList({data, onQuantityChange, onDelete, onAdd, onGraph} : PortfolioListProps) {
  const [symbolSearchText, setSymbolSearchText] = useState("")

  return (
    <Stack gap={2}>
      <Paper sx={itemPaperStyle}>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Symbol</Typography>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Quantity</Typography>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Unit Price</Typography>
        <Typography sx={[equalSizedFlexItems, {fontWeight: 'bold'}]}>Total Value</Typography>
        <IconButton sx={phantomButtonStyle} disabled>
          <Delete/>
        </IconButton>
        <IconButton sx={phantomButtonStyle} disabled>
          <PieChart/>
        </IconButton>
      </Paper>
      <TransitionGroup component={Box}>
        {data.map((asset, index) => {
          return (
            <Collapse key={asset.symbol}>
              <PortfolioListItem
                asset={asset}
                onQuantityChange={(newQuantity) => onQuantityChange(index, newQuantity)}
                onDelete={() => onDelete(index)}
                onGraph={() => onGraph(index)}
              />
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