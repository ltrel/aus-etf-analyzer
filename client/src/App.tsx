import { AppBar, CssBaseline, ThemeProvider, Toolbar, Typography, Container, createTheme, Divider, Stack } from "@mui/material"
import SectorWeightsPie from "./SectorWeightsPie"
import PortfolioList from "./PortfolioList";
import { useState } from "react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  const [assets, setAssets] = useState([
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
      quantity: 2
    }
  ])
  const [graphSymbol, setGraphSymbol] = useState("VAS")

  function handleQuantityChange(index: number, newQuantity: number) {
    const newAssets = [...assets]
    newAssets[index].quantity = newQuantity
    setAssets(newAssets)
  }

  function handleDelete(symbol: string) {
    setAssets((prev) => [...prev.filter(x => x.symbol !== symbol)])
  }

  function handleAdd(symbol: string) {
    setAssets([...assets, {symbol: symbol, quantity: 1}])
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
      <Container maxWidth='lg'>
        <Stack gap={3} sx={{pt: 4}}>
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
            onGraph={(index) => setGraphSymbol(assets[index].symbol)}
          />
          <Stack gap={1}>
            <Typography variant="h5">
              {graphSymbol} 
            </Typography>
            <Divider />
          </Stack>
          <SectorWeightsPie symbol={graphSymbol}/>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}

export default App
