import { AppBar, CssBaseline, ThemeProvider, Toolbar, Typography, Container, createTheme, Divider, Box, Stack } from "@mui/material"
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

  function handleDelete(index: number) {
    setAssets((prev) => [...prev.filter((_, i) => i !== index)])
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
        <Stack gap={4} sx={{pt: 4}}>
          <PortfolioList
            data={assets}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
            onAdd={handleAdd}
            onGraph={(index) => setGraphSymbol(assets[index].symbol)}
          />
          <Box>
            <Typography variant="h5">
              {graphSymbol} 
            </Typography>
            <Divider />
          </Box>
          <SectorWeightsPie symbol={graphSymbol}/>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}

export default App
