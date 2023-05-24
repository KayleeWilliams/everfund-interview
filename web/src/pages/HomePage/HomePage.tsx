import { useQuery } from '@apollo/client'
import { CurrencyPoundIcon } from '@heroicons/react/24/outline'

import { MetaTags } from '@redwoodjs/web'

import Stats from 'src/components/Stats/Stats'
import Table from 'src/components/Table/Table'
import { useNonProfitContext } from 'src/layouts/MainLayout/MainLayout.context'

const HomePage = () => {
  // Get non profit from context
  const { nonprofit, setNonProfit } = useNonProfitContext()

  // Queries for the homepage
  const queries = gql`
    query mergedQuery($nonprofitId: Int!) {
      paymentStatsByNonprofit(nonprofitId: $nonprofitId) {
        totalDonations
        totalAmount
        percentGiftAided
      }
      recentPaymentsByNonprofit(nonprofitId: $nonprofitId) {
        id
        date
        amountPaid
        giftAided
        status
      }
    }
  `

  // Run the Queries
  const { data, error, loading } = useQuery(queries, {
    variables: { nonprofitId: nonprofit?.id ?? 0 },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  // Convert the amount to pounds
  function toPounds(amount: number) {
    return amount / 100
  }

  // Set the statistics for the homepage
  const homepageStats = [
    {
      name: 'Total Donations',
      statistic: data.paymentStatsByNonprofit.totalDonations,
    },
    {
      name: 'Total Donations Amount',
      statistic: toPounds(data.paymentStatsByNonprofit.totalAmount),
    },
    {
      name: 'Donations with Gift Aid',
      statistic: `${(
        data.paymentStatsByNonprofit.percentGiftAided * 100
      ).toFixed(2)} %`,
    },
  ]

  return (
    <>
      <MetaTags title="Home" description="Home page" />

      <div className="mx-auto mb-4 max-w-7xl pb-2">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Stats
        </h2>
      </div>

      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {homepageStats.map((item) => (
          <Stats key={item.name} {...item} />
        ))}
      </dl>

      <div className="relative my-4 pb-8">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>

      <div className="mx-auto mb-4 max-w-7xl pb-2">
        <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Donations
        </h2>
      </div>

      <div className="relative h-max rounded-xl border border-dashed border-gray-400 opacity-75">
        <Table.table className="min-w-full divide-y divide-gray-300">
          <Table.thead>
            <Table.tr>
              <Table.th>ID</Table.th>
              <Table.th className="flex flex-row items-center gap-2">
                <CurrencyPoundIcon className="h-6 w-6" />
                Amount Paid
              </Table.th>
              <Table.th className="">Date</Table.th>
              <Table.th className="">Gift Aided</Table.th>
            </Table.tr>
          </Table.thead>
          <Table.tbody>
            {data.recentPaymentsByNonprofit.map((payment) => (
              <Table.tr key={payment.id}>
                <Table.td>{payment.id}</Table.td>
                <Table.td>
                  £{toPounds(payment.amountPaid).toLocaleString()}
                </Table.td>
                <Table.td>
                  {new Date(payment.date).toLocaleString('en-GB', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </Table.td>
                <Table.td className="capitalize">
                  {payment.giftAided.toString()}
                </Table.td>
              </Table.tr>
            ))}
          </Table.tbody>
        </Table.table>
      </div>
    </>
  )
}

export default HomePage
