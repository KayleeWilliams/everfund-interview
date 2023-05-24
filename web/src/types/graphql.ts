export interface Payment {
  id: string
  date: Date
  amountPaid: number
  status: string
  giftAided: boolean
  nonprofitId: string
}
