export const schema = gql`
  """
  Representation of Payment.
  """
  type Payment {
    "Description for id."
    id: Int!

    "Description for date."
    date: DateTime!

    "Description for amountPaid."
    amountPaid: Int!

    "Description for status."
    status: String!

    "Description for giftAided."
    giftAided: Boolean!

    "Description for nonprofitId."
    nonprofitId: Int!
  }

  type PaymentStats {
    "Description for totalDonations."
    totalDonations: String!

    "Description for totalAmount."
    totalAmount: Int!

    "Description for percentGiftAided."
    percentGiftAided: Float!
  }

  """
  About queries
  TODO: Add GraphQL query / queries to fetch payment statistics
  """
  type Query {
    "Fetch Payments."
    payments: [Payment!]! @requireAuth

    "Fetch a Payment by id."
    payment(id: Int!): Payment @requireAuth

    "Fetch Payments by nonprofitId, and sum total amount of donations, how much donated and % of gift aided."
    paymentStatsByNonprofit(nonprofitId: Int!): PaymentStats @requireAuth

    "Fetch the 20 most recent payments."
    recentPaymentsByNonprofit(nonprofitId: Int!): [Payment!]! @requireAuth
  }
`
