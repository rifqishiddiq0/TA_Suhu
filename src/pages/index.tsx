// next
import Head from 'next/head'
// @chakra
import {
  Card,
  CardBody,
  Container,
  Grid,
  GridItem,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr
} from '@chakra-ui/react'
// utils
import { DateTime } from 'luxon'
import { useLogList } from '~/swrs/log.swr'

// ----------------------------------------------------------------

const getStatusColor = (status?: number): string => {
  if (status === 1) return 'red.500'
  if (status === -1) return 'blue.500'
  if (status === 0) return 'green.500'

  return 'gray.500'
}

const getStatusText = (status?: number): string => {
  if (status === 1) return 'HEATING'
  if (status === -1) return 'COOLING'
  if (status === 0) return 'OFF'

  return 'UNKNOWN'
}

// ----------------------------------------------------------------

export default function Home(): JSX.Element {
  const { data, isLoading } = useLogList()

  const lastData = data?.[0]

  return (
    <>
      <Head>
        <title>Smart Aquarium Dashboard</title>
      </Head>

      <main>
        <Container
          py={16}
          maxW='container.lg'
        >
          <Heading
            as='h1'
            marginBottom={6}
          >
            Smart Aquarium Dashboard
          </Heading>

          <Grid
            templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
            gap={6}
            marginBottom={6}
          >
            <GridItem>
              <HighlightCard
                title='Last Update'
                value={
                  lastData
                    ? DateTime.fromISO(lastData.createdAt).toLocaleString(
                        DateTime.DATETIME_SHORT
                      )
                    : undefined
                }
              />
            </GridItem>

            <GridItem>
              <HighlightCard
                title='Temperature'
                value={lastData?.temperature.toFixed(2)}
              />
            </GridItem>

            <GridItem>
              <HighlightCard
                title='Status'
                value={getStatusText(lastData?.status)}
                valueColor={getStatusColor(lastData?.status)}
              />
            </GridItem>
          </Grid>

          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Timestamp</Th>
                  <Th>Temperature</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>

              <Tbody>
                {isLoading ? (
                  <Tr>
                    <Td
                      colSpan={3}
                      textAlign='center'
                    >
                      Loading...
                    </Td>
                  </Tr>
                ) : !data || data.length === 0 ? (
                  <Tr>
                    <Td
                      colSpan={3}
                      textAlign='center'
                    >
                      No data
                    </Td>
                  </Tr>
                ) : (
                  data?.map((item) => {
                    return (
                      <Tr key={item.createdAt}>
                        <Td>
                          {DateTime.fromISO(item.createdAt).toLocaleString(
                            DateTime.DATETIME_SHORT
                          )}
                        </Td>

                        <Td>{item.temperature.toFixed(2)}&deg;C</Td>

                        <Td color={getStatusColor(item.status)}>
                          {getStatusText(item.status)}
                        </Td>
                      </Tr>
                    )
                  })
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Container>
      </main>
    </>
  )
}

// ----------------------------------------------------------------

type HighlightCardProps = {
  title: string
  value?: string
  valueColor?: string
}

function HighlightCard({
  title,
  value,
  valueColor
}: HighlightCardProps): JSX.Element {
  return (
    <Card>
      <CardBody>
        <Heading
          as='h2'
          fontSize='xs'
        >
          {title}
        </Heading>

        <Text
          fontSize='xl'
          color={valueColor}
        >
          {value ?? '-'}
        </Text>
      </CardBody>
    </Card>
  )
}
