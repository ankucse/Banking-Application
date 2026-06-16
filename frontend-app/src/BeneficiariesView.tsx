import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Plus, CheckCircle2, Clock, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

const MOCK_UUID = "123e4567-e89b-12d3-a456-426614174000";

// Zod Schema for strict IFSC validation
const payeeSchema = z.object({
  payeeName: z.string().min(2, 'Name must be at least 2 characters'),
  accountNumber: z.string().min(8, 'Account number must be valid').max(18),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, 'Invalid Indian IFSC Code format (e.g., SBIN0001234)'),
  bankName: z.string().min(2, 'Bank name is required'),
  alias: z.string().optional()
});

type PayeeFormValues = z.infer<typeof payeeSchema>;

export default function BeneficiariesView({ isDarkMode }: { isDarkMode: boolean }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // Fetch Beneficiaries with TanStack Query Polling
  const { data: beneficiaries, isLoading } = useQuery({
    queryKey: ['beneficiaries', MOCK_UUID],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/v1/beneficiaries/${MOCK_UUID}`);
      if (!res.ok) throw new Error('Failed to fetch beneficiaries');
      return res.json();
    },
    refetchInterval: 2000, // Poll every 2 seconds to catch PENDING -> ACTIVE transition
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PayeeFormValues>({
    resolver: zodResolver(payeeSchema)
  });

  const addBeneficiaryMutation = useMutation({
    mutationFn: async (data: PayeeFormValues) => {
      const payload = { ...data, cifId: MOCK_UUID };
      const res = await fetch(`http://localhost:8080/api/v1/beneficiaries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to add beneficiary');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['beneficiaries', MOCK_UUID] });
      setIsModalOpen(false);
      reset();
    }
  });

  const onSubmit = (data: PayeeFormValues) => {
    addBeneficiaryMutation.mutate(data);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'ACTIVE':
        return <span className="flex items-center text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-400/10 px-3 py-1 rounded-full border border-teal-100 dark:border-teal-400/20 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> ACTIVE</span>;
      case 'PENDING':
        return <span className="flex items-center text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-400/10 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-400/20 text-xs font-bold"><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> PENDING</span>;
      case 'REJECTED':
        return <span className="flex items-center text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-400/10 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-400/20 text-xs font-bold"><XCircle className="w-3.5 h-3.5 mr-1.5" /> REJECTED</span>;
      default:
        return <span className="text-slate-500">{status}</span>;
    }
  };

  return (
    <div className="p-10 pb-20 max-w-6xl mx-auto transition-colors duration-300">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Beneficiary Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your saved payees for quick and secure transfers.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-5 py-2.5 bg-gradient-to-r from-teal-400 to-rose-400 hover:from-teal-500 hover:to-rose-500 text-white font-bold rounded-2xl shadow-lg shadow-teal-500/25 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Payee
        </button>
      </div>

      {/* Main Table Card */}
      <div className="bg-white dark:bg-[#15172b] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-white/5 overflow-hidden transition-all duration-300">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-[#1A1D2D] border-b border-slate-100 dark:border-white/5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                <th className="px-8 py-5">Payee Name</th>
                <th className="px-8 py-5">Account Number</th>
                <th className="px-8 py-5">Bank Details</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-12 text-center text-slate-500 dark:text-slate-400">Loading payees...</td>
                </tr>
              ) : beneficiaries?.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-slate-500 dark:text-slate-400">
                    <Users className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-4" />
                    <p className="text-lg font-medium">No beneficiaries found</p>
                    <p className="text-sm">Click "Add Payee" to set up your first beneficiary.</p>
                  </td>
                </tr>
              ) : (
                beneficiaries?.map((payee: any) => (
                  <tr key={payee.id} className="hover:bg-slate-50 dark:hover:bg-[#1A1D2D]/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400/20 to-rose-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold mr-4">
                          {payee.payeeName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{payee.payeeName}</p>
                          {payee.alias && <p className="text-xs text-slate-500 dark:text-slate-400">{payee.alias}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 font-mono text-sm text-slate-600 dark:text-slate-300">{payee.accountNumber}</td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{payee.bankName}</p>
                      <p className="text-xs font-mono text-slate-500 dark:text-slate-500">IFSC: {payee.ifscCode}</p>
                    </td>
                    <td className="px-8 py-5">
                      {getStatusBadge(payee.status)}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button className="text-sm font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300" disabled={payee.status !== 'ACTIVE'}>
                        {payee.status === 'ACTIVE' ? 'Transfer' : 'Pending Verification'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payee Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1A1D2D] w-full max-w-lg rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-white/10 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50 dark:bg-[#15172b]">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add New Payee</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <AlertCircle className="w-6 h-6 rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Payee Name</label>
                  <input {...register('payeeName')} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50" placeholder="John Doe" />
                  {errors.payeeName && <p className="text-rose-500 text-xs mt-1">{errors.payeeName.message}</p>}
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Account Number</label>
                  <input {...register('accountNumber')} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-mono" placeholder="0000123456789" />
                  {errors.accountNumber && <p className="text-rose-500 text-xs mt-1">{errors.accountNumber.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">IFSC Code</label>
                    <input {...register('ifscCode')} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 font-mono uppercase" placeholder="HDFC0001234" />
                    {errors.ifscCode && <p className="text-rose-500 text-xs mt-1">{errors.ifscCode.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Bank Name</label>
                    <input {...register('bankName')} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50" placeholder="HDFC Bank" />
                    {errors.bankName && <p className="text-rose-500 text-xs mt-1">{errors.bankName.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Alias (Optional)</label>
                  <input {...register('alias')} className="w-full px-4 py-3 bg-slate-50 dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50" placeholder="Rent Landlord" />
                </div>
              </div>

              <div className="bg-teal-50 dark:bg-teal-500/10 rounded-xl p-4 flex items-start border border-teal-100 dark:border-teal-500/20">
                <Clock className="w-5 h-5 text-teal-600 dark:text-teal-400 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-teal-800 dark:text-teal-200 leading-relaxed">
                  <strong>Penny Drop Simulation:</strong> Adding a payee will initiate a name-match verification. The status will remain PENDING until the external bank confirms the details.
                </p>
              </div>

              <div className="flex justify-end pt-4 space-x-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={addBeneficiaryMutation.isPending} className="px-6 py-3 bg-gradient-to-r from-teal-400 to-rose-400 hover:from-teal-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 transition-all disabled:opacity-50">
                  {addBeneficiaryMutation.isPending ? 'Verifying...' : 'Save & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
