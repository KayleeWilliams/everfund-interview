import type { QueryResolvers } from 'types/graphql'

import { db } from 'src/lib/db'

export const payments: QueryResolvers['payments'] = () => {
  return db.payment.findMany()
}

export const payment: QueryResolvers['payment'] = ({ id }) => {
  return db.payment.findUnique({
    where: { id },
    include: {
      nonprofit: true,
    },
  })
}

// Get sum of amountPaid, count of all payments, and count of giftAided payments
export const paymentStatsByNonprofit: QueryResolvers['paymentStatsByNonprofit'] =
  async ({ nonprofitId }) => {
    const result = await db.payment.aggregate({
      where: { nonprofitId },
      _sum: {
        amountPaid: true,
      },
      _count: {
        _all: true,
      },
    })

    // Percent gift aided
    const giftAided = await db.payment.count({
      where: {
        nonprofitId,
        giftAided: true,
      },
    })

    // Transform data
    const statistics = {
      totalAmount: result._sum.amountPaid,
      totalDonations: result._count._all,
      percentGiftAided: giftAided / result._count._all,
    }

    return statistics
  }

// Get the 20 most recent payments
export const recentPaymentsByNonprofit: QueryResolvers['recentPaymentsByNonprofit'] =
  async ({ nonprofitId }) => {
    const payments = await db.payment.findMany({
      where: { nonprofitId },
      orderBy: {
        date: 'desc',
      },
      take: 20,
    })

    return payments
  }
