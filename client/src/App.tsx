import { AppBar, CssBaseline, ThemeProvider, Toolbar, Typography, Container, createTheme, Divider, Box, Stack } from "@mui/material"
import SectorWeightsPie from "./SectorWeightsPie"
import useSWR from "swr"
import { EtfDataSchema, fetchEtf } from "./data";
import camelFetch from "./camelFetch";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

function App() {
  const {data, error, isLoading} = useSWR('etfs/vas', fetchEtf)
  if(isLoading) return "Loading..."
  if(error) return "Error!"
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
          <Box>
            <Typography variant="h5">
              VAS - Vanguard Australian Shares Index ETF
            </Typography>
            <Divider />
          </Box>
          <SectorWeightsPie etfData={EtfDataSchema.parse(data)}/>
        </Stack>
      </Container>
    </ThemeProvider>
  )
}

export default App
