'use client'

import { useQuery } from '@tanstack/react-query'
import apiClient from '@/lib/axios'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Wallet, CreditCard, ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import type { Transaction } from '@/types/api'

export default function WalletPage() {
  const [topUpAmount, setTopUpAmount] = useState('')

  const { data: balance, isLoading: balanceLoading } = useQuery<number>({
    queryKey: ['wallet-balance'],
    queryFn: async () => {
      const response = await apiClient.get<{ balance: number }>('/wallet/balance')
      return response.data.balance
    },
    refetchInterval: 30000,
  })

  const { data: transactions, isLoading: transactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['wallet-transactions'],
    queryFn: async () => {
      const response = await apiClient.get<Transaction[]>('/wallet/transactions')
      return response.data
    },
  })

  const handleTopUp = () => {
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }
    // This would integrate with Stripe in production
    toast.info('Stripe integration coming soon')
  }

  const getTransactionBadge = (type: Transaction['type']) => {
    switch (type) {
      case 'Deposit':
        return <Badge variant="success">Deposit</Badge>
      case 'Payment':
        return <Badge variant="default">Payment</Badge>
      case 'Refund':
        return <Badge variant="secondary">Refund</Badge>
      default:
        return <Badge>{type}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wallet</h1>
        <p className="text-muted-foreground">
          Manage your account balance and transactions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Current Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            {balanceLoading ? (
              <Skeleton className="h-12 w-32" />
            ) : (
              <p className="text-4xl font-bold text-primary">
                ${balance?.toFixed(2) || '0.00'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Top Up
            </CardTitle>
            <CardDescription>
              Add funds to your wallet using Stripe
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Amount"
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              <Button onClick={handleTopUp}>Pay with Stripe</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            View all your deposits, payments, and refunds
          </CardDescription>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{getTransactionBadge(transaction.type)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'Deposit' ? (
                            <ArrowUpCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span
                            className={
                              transaction.type === 'Deposit'
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            {transaction.type === 'Deposit' ? '+' : '-'}$
                            {Math.abs(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No transactions yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


