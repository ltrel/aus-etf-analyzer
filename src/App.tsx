import { Flex, Text, Button } from "@radix-ui/themes"

function App() {
  return (
    <Flex direction="column" gap="2">
      <Flex direction="row" gap="1">
        <Text>Item 1</Text>
        <Button>Button 1</Button>
      </Flex>
    </Flex>
  )
}

export default App
