import { Table } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

import { ResponseData } from './api/hello'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function Home() {
  const [data, setData] = useState<ResponseData>()

  const options = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderWidth: 2
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const
      },
      title: {
        display: true,
        text: 'Percentual de Crescimento das Empresas'
      }
    }
  }

  const labels = data?.topGrowth?.map(company => company.nomeEmpresa) || []

  const dataSet = {
    labels,
    datasets: [
      {
        label: 'Percentual',
        data: data?.topGrowth?.map(company => company.crescimento),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  }

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => {
        setData(data)
      })
  }, [])

  if (!data) {
    return <div>Não possui dados!</div>
  }

  return (
    <>
      <Bar options={options} data={dataSet} />
      <Table
        aria-label="Top empresas"
        css={{
          height: 'auto',
          minWidth: '100%'
        }}
      >
        <Table.Header>
          <Table.Column>Nome</Table.Column>
          <Table.Column>Crescimento</Table.Column>
        </Table.Header>
        <Table.Body>
          {!data.topGrowth && <Table.Row key="1"></Table.Row>}
          {!!data.topGrowth &&
            data.topGrowth.map(company => {
              return (
                <Table.Row key={company.nomeEmpresa}>
                  <Table.Cell>{company.nomeEmpresa}</Table.Cell>
                  <Table.Cell>
                    {company.crescimento.toLocaleString('PT-BR')}%
                  </Table.Cell>
                </Table.Row>
              )
            })}
        </Table.Body>
      </Table>
    </>
  )
}
