import { Delete, Search, PieChart } from '@mui/icons-material';
import {
  Paper, Typography, Stack, TextField, IconButton, InputAdornment, Collapse, Box,
} from '@mui/material';
import { TransitionGroup } from 'react-transition-group';
import { useState } from 'react';
import { useSnackbar } from 'notistack';
import PortfolioListItem from './PortfolioListItem';
import { equalSizedFlexItems, itemPaperStyle, phantomButtonStyle } from './styles';
import PortfolioSummary from './PortfolioSummary';

export interface PortfolioListProps {
  data: Array<{ symbol: string, quantity: number }>
  onQuantityChange(index: number, newQuantity: number): void
  onDelete(symbol: string): void
  onAdd(symbol: string): void
  onGraph(index: number): void
}
export default function PortfolioList({
  data, onQuantityChange, onDelete, onAdd, onGraph,
} : PortfolioListProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [symbolSearchText, setSymbolSearchText] = useState('');

  function handleAdd(symbol: string) {
    if (data.some((x) => x.symbol === symbol)) {
      enqueueSnackbar({ variant: 'error', message: 'Symbol already exists in portfolio.' });
    } else {
      onAdd(symbol);
    }
    setSymbolSearchText('');
  }

  return (
    <Stack gap={2}>
      <Paper sx={itemPaperStyle}>
        <Typography sx={[equalSizedFlexItems, { fontWeight: 'bold' }]}>Symbol</Typography>
        <Typography sx={[equalSizedFlexItems, { fontWeight: 'bold' }]}>Quantity</Typography>
        <Typography sx={[equalSizedFlexItems, { fontWeight: 'bold' }]}>Unit Price</Typography>
        <Typography sx={[equalSizedFlexItems, { fontWeight: 'bold' }]}>Total Value</Typography>
        <IconButton sx={phantomButtonStyle} disabled>
          <Delete />
        </IconButton>
        <IconButton sx={phantomButtonStyle} disabled>
          <PieChart />
        </IconButton>
      </Paper>
      <TransitionGroup component={Box}>
        {data.map((asset, index) => (
          <Collapse key={asset.symbol}>
            <PortfolioListItem
              asset={asset}
              onQuantityChange={(newQuantity) => onQuantityChange(index, newQuantity)}
              onDelete={() => onDelete(asset.symbol)}
              onGraph={() => onGraph(index)}
            />
          </Collapse>
        ))}
      </TransitionGroup>
      <Paper sx={[itemPaperStyle, { padding: 0, marginTop: -2 }]}>
        <TextField
          sx={equalSizedFlexItems}
          value={symbolSearchText}
          onChange={(event) => setSymbolSearchText(event.target.value.toUpperCase())}
          onKeyUp={(event) => {
            if (event.key === 'Enter' && symbolSearchText) {
              handleAdd(symbolSearchText);
            }
          }}
          InputProps={{
            placeholder: 'Add ETF by Symbol...',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => {
                  if (symbolSearchText) {
                    handleAdd(symbolSearchText);
                  }
                }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      <PortfolioSummary data={data} onGraph={() => onGraph(-1)} />
    </Stack>
  );
}
