import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SendHorizontal, Zap, ArrowRight, Clock, CheckCircle2, XCircle, RefreshCw, AlertCircle, Building2 } from 'lucide-react';

const MOCK_UUID = "123e4567-e89b-12d3-a456-426614174000";

const transferSchema = z.object({
  beneficiaryId: z.string().min(1, 'Please select a beneficiary'),
  amount: z.number().min(1, 'Amount must be greater than 0').max(1000000, 'Amount exceeds daily limit'),
  paymentType: z.enum(['IMPS', 'NEFT'])
});

type TransferFormValues = z.infer<typeof transferSchema>;

export default function ExternalTransferView({ isDarkMode }: { isDarkMode: boolean }) {
  const queryClient = useQueryClient();

  // Fetch ACTIVE Beneficiaries
  const { data: beneficiaries } = useQuery({
    queryKey: ['beneficiaries', MOCK_UUID],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/v1/beneficiaries/${MOCK_UUID}`);
      if (!res.ok) throw new Error('Failed to fetch beneficiaries');
      const data = await res.json();
      return data.filter((b: any) => b.status === 'ACTIVE');
    }
  });

  // Fetch Transactions with Polling
  const { data: transactions, isLoading: isLoadingTx } = useQuery({
    queryKey: ['payments', MOCK_UUID],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/v1/payments/${MOCK_UUID}`);
      if (!res.ok) throw new Error('Failed to fetch payments');
      return res.json();
    },
    refetchInterval: 2000, // Poll to catch processing -> completed
  });

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<TransferFormValues>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      paymentType: 'IMPS'
    }
  });

  const selectedPaymentType = watch('paymentType');

  const initiatePaymentMutation = useMutation({
    mutationFn: async (data: TransferFormValues) => {
      const payload = { ...data, cifId: MOCK_UUID };
      const res = await fetch(`http://localhost:8080/api/v1/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to initiate payment');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments', MOCK_UUID] });
      reset({ paymentType: 'IMPS', beneficiaryId: '', amount: undefined });
    }
  });

  const onSubmit = (data: TransferFormValues) => {
    initiatePaymentMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'COMPLETED':
        return <span className="flex items-center text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-400/10 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-400/20 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> COMPLETED</span>;
      case 'PROCESSING':
        return <span className="flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-400/20 text-xs font-bold"><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> PROCESSING</span>;
      case 'FAILED':
        return <span className="flex items-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-400/20 text-xs font-bold"><XCircle className="w-3.5 h-3.5 mr-1.5" /> FAILED</span>;
      default:
        return <span className="text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="p-10 pb-20 max-w-7xl mx-auto transition-colors duration-300">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">External Transfer Switch</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Initiate IMPS or NEFT transfers to your verified beneficiaries.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Payment Form */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#15172b] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-300 p-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Initiate Transfer</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Select Payee</label>
                <select 
                  {...register('beneficiaryId')} 
                  className="w-full px-4 py-3.5 bg-slate-50 dark:bg-[#1A1D2D] border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 appearance-none font-semibold"
                >
                  <option value="">-- Choose Beneficiary --</option>
                  {beneficiaries?.map((b: any) => (
                    <option key={b.id} value={b.id}>{b.payeeName} ({b.bankName} - {b.accountNumber.slice(-4)})</option>
                  ))}
                </select>
                {errors.beneficiaryId && <p className="text-rose-500 text-xs mt-1">{errors.beneficiaryId.message}</p>}
                
                {beneficiaries?.length === 0 && (
                  <p className="text-amber-500 text-xs mt-2 flex items-center"><AlertCircle className="w-3 h-3 mr-1"/> No active payees found. Please add a payee first.</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Amount (INR)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                  <input 
                    type="number" 
                    {...register('amount', { valueAsNumber: true })} 
                    className="w-full pl-8 pr-4 py-3.5 bg-slate-50 dark:bg-[#1A1D2D] border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-bold text-lg" 
                    placeholder="0.00" 
                  />
                </div>
                {errors.amount && <p className="text-rose-500 text-xs mt-1">{errors.amount.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Payment Network</label>
                <div className="grid grid-cols-2 gap-4">
                  <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center transition-all ${selectedPaymentType === 'IMPS' ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-500/10' : 'border-slate-200 dark:border-white/5 hover:border-teal-200 dark:hover:border-teal-500/30'}`}>
                    <input type="radio" value="IMPS" {...register('paymentType')} className="sr-only" />
                    <Zap className={`w-8 h-8 mb-2 ${selectedPaymentType === 'IMPS' ? 'text-teal-500' : 'text-slate-400'}`} />
                    <span className={`font-bold ${selectedPaymentType === 'IMPS' ? 'text-teal-700 dark:text-teal-400' : 'text-slate-500'}`}>IMPS</span>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Instant</span>
                  </label>
                  
                  <label className={`cursor-pointer rounded-xl border-2 p-4 flex flex-col items-center justify-center transition-all ${selectedPaymentType === 'NEFT' ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-slate-200 dark:border-white/5 hover:border-indigo-200 dark:hover:border-indigo-500/30'}`}>
                    <input type="radio" value="NEFT" {...register('paymentType')} className="sr-only" />
                    <Clock className={`w-8 h-8 mb-2 ${selectedPaymentType === 'NEFT' ? 'text-indigo-500' : 'text-slate-400'}`} />
                    <span className={`font-bold ${selectedPaymentType === 'NEFT' ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-500'}`}>NEFT</span>
                    <span className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">Batched</span>
                  </label>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={initiatePaymentMutation.isPending || beneficiaries?.length === 0} 
                className="w-full py-4 bg-gradient-to-r from-teal-400 to-rose-400 hover:from-teal-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50 flex justify-center items-center"
              >
                {initiatePaymentMutation.isPending ? 'Processing...' : 'Send Money'}
                {!initiatePaymentMutation.isPending && <ArrowRight className="w-5 h-5 ml-2" />}
              </button>

            </form>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#15172b] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-300 h-full flex flex-col">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-[#1A1D2D]/50">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Recent Transactions</h3>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-[#1A1D2D] border-b border-slate-100 dark:border-white/5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                    <th className="px-8 py-4">Reference</th>
                    <th className="px-8 py-4">Type</th>
                    <th className="px-8 py-4 text-right">Amount</th>
                    <th className="px-8 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {isLoadingTx ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400">Loading transactions...</td>
                    </tr>
                  ) : transactions?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-16 text-center text-slate-500 dark:text-slate-400">
                        <SendHorizontal className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                        <p className="text-lg font-medium">No transactions yet</p>
                        <p className="text-sm">Your outbound payments will appear here.</p>
                      </td>
                    </tr>
                  ) : (
                    transactions?.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-[#1A1D2D]/50 transition-colors">
                        <td className="px-8 py-4">
                          <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">{tx.referenceNumber}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(tx.createdAt).toLocaleString()}</p>
                        </td>
                        <td className="px-8 py-4">
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider ${tx.paymentType === 'IMPS' ? 'bg-teal-100 text-teal-800 dark:bg-teal-500/20 dark:text-teal-300' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300'}`}>
                            {tx.paymentType}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-right">
                          <p className="font-bold text-slate-900 dark:text-white">₹{tx.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                        </td>
                        <td className="px-8 py-4 flex justify-center">
                          {getStatusBadge(tx.status)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
