import {
  AppBar, CssBaseline, ThemeProvider, Toolbar, Typography, Container, createTheme, Divider, Stack,
} from '@mui/material';
import { useState, useRef } from 'react';
import SectorWeightsPie from './SectorWeightsPie';
import PortfolioList from './PortfolioList';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const initialAssets = [
  {
    symbol: 'VAS',
    quantity: 11,
  },
  {
    symbol: 'IHVV',
    quantity: 3,
  },
  {
    symbol: 'NDQ',
    quantity: 2,
  },
];

function App() {
  const [assets, setAssets] = useState(initialAssets);
  const [graphIndex, setGraphIndex] = useState(-1);
  const graphRef = useRef<HTMLDivElement>(null);

  function handleQuantityChange(index: number, newQuantity: number) {
    setAssets(prev => {
      const newAssets = [...prev];
      newAssets[index].quantity = newQuantity;
      return newAssets
    });
  }

  function handleDelete(symbol: string) {
    setAssets((prev) => [...prev.filter((x) => x.symbol !== symbol)]);
  }

  function handleAdd(symbol: string) {
    setAssets(prev => [...prev, { symbol, quantity: 1 }]);
  }

  function changeGraph(index: number) {
    setGraphIndex(index);
    graphRef.current?.scrollIntoView({ behavior: 'smooth' });
  }

  let graphData;
  if (graphIndex === -1) {
    graphData = assets;
  } else {
    graphData = [assets[graphIndex]];
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            ASX ETF Analyzer
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ paddingBottom: 4 }}>
        <Stack gap={3} sx={{ pt: 4 }}>
          <Stack gap={1}>
            <Typography variant="h5">
              Portfolio Composition
            </Typography>
            <Divider />
          </Stack>
          <PortfolioList
            data={assets}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onGraph={changeGraph}
          />
          <Stack gap={1}>
            <Typography variant="h5">
              {graphIndex === -1 ? 'Portfolio Sector Breakdown' : assets[graphIndex].symbol}
            </Typography>
            <Divider />
          </Stack>
          <div ref={graphRef}>
            <SectorWeightsPie assets={graphData} />
          </div>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;
