import { AppBar, CssBaseline, ThemeProvider, Toolbar, Typography, Container, createTheme, Divider, Box, Stack } from "@mui/material"
import SectorWeightsPie from "./SectorWeightsPie"
import useSWR from "swr"
import { EtfDataSchema, fetchEtf } from "./data";
import PortfolioCardList from "./PortfolioCardList";
import { useState } from "react";

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  const {data, error, isLoading} = useSWR('etfs/vas', fetchEtf)
  const [assets, setAssets] = useState([
    {
      symbol: 'VAS',
      quantity: 11,
    },
    {
      symbol: 'IHVV',
      quantity: 3,
    },
  ])

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

  let sectorWeightsPie;
  if (data) {
    sectorWeightsPie = <SectorWeightsPie etfData={EtfDataSchema.parse(data)}/>
  } else if (error) {
    sectorWeightsPie = <Typography variant="body1">
      An error occurred whie fetching data.
    </Typography>
  } else if (isLoading) {
    sectorWeightsPie = <Typography variant="body1">
      Loading...
    </Typography>
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
          <PortfolioCardList
            data={assets}
            onQuantityChange={handleQuantityChange}
            onDelete={handleDelete}
            onAdd={handleAdd}
          />
          <Box>
            <Typography variant="h5">
              VAS - Vanguard Australian Shares Index ETF
            </Typography>
            <Divider />
          </Box>
          {sectorWeightsPie}
        </Stack>
      </Container>
    </ThemeProvider>
  )
}

export default App
