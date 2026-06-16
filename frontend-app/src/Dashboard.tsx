import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, CreditCard, LayoutDashboard, Settings, User, LogOut, Bell, Search, ChevronRight, ShieldCheck, Moon, Sun, Users, SendHorizontal, Wallet, QrCode } from 'lucide-react';
import BeneficiariesView from './BeneficiariesView';
import ExternalTransferView from './ExternalTransferView';

const MOCK_UUID = "123e4567-e89b-12d3-a456-426614174000"; // Mock ID for testing

// Simple fetch function
const fetchProfile = async () => {
  // In a real app, this would use a proper API client with interceptors for JWT
  const res = await fetch(`http://localhost:8080/api/v1/cif/profile/${MOCK_UUID}`);
  if (!res.ok) {
    if (res.status === 404) {
      // Mock data if not found
      return {
        id: MOCK_UUID,
        firstName: 'Subramanian',
        lastName: 'Swamy',
        email: 'subbu@example.com',
        phoneNumber: '+91 98765 43210',
        status: 'ACTIVE',
        memberSince: '2023-01-15',
        kycLevel: 'Tier 3 (Verified)'
      };
    }
    throw new Error('Failed to fetch profile');
  }
  return res.json();
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#1A1D2D] transition-colors duration-300 flex font-sans selection:bg-teal-500/30 selection:text-teal-200">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-[#15172b] flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.2)] transition-colors duration-300 border-r border-slate-100 dark:border-white/5">
        {/* Brand Header */}
        <div className="h-24 flex items-center px-8 border-b border-slate-100 dark:border-white/5 transition-colors duration-300">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-rose-500 flex items-center justify-center shadow-lg shadow-teal-500/20 dark:shadow-teal-500/10 mr-4 flex-shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-slate-900 dark:text-white font-bold text-lg tracking-tight transition-colors duration-300">SBI<span className="text-sm font-medium opacity-60 ml-1">(Subbu Bank)</span></span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-rose-400 font-bold text-[0.6rem] tracking-[0.15em] uppercase mt-1">All The Bubu Needs</span>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Main Menu</p>
          
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'overview' ? 'bg-gradient-to-r from-teal-400/10 to-rose-400/10 dark:from-teal-400/20 dark:to-rose-400/5 text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <LayoutDashboard className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'overview' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            Overview
            {activeTab === 'overview' && <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('accounts')}
            className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'accounts' ? 'bg-gradient-to-r from-teal-400/10 to-rose-400/10 dark:from-teal-400/20 dark:to-rose-400/5 text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <CreditCard className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'accounts' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            Accounts
            {activeTab === 'accounts' && <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${activeTab === 'profile' ? 'bg-gradient-to-r from-teal-400/10 to-rose-400/10 dark:from-teal-400/20 dark:to-rose-400/5 text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {activeTab === 'profile' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-teal-400 to-rose-400 rounded-r-full shadow-[0_0_12px_rgba(20,184,166,0.8)]" />}
            <User className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'profile' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            Golden Record
            {activeTab === 'profile' && <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
          </button>

          <p className="px-4 pt-6 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">Payments Hub</p>

          <button 
            onClick={() => setActiveTab('beneficiaries')}
            className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group relative overflow-hidden ${activeTab === 'beneficiaries' ? 'bg-gradient-to-r from-teal-400/10 to-rose-400/10 dark:from-teal-400/20 dark:to-rose-400/5 text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {activeTab === 'beneficiaries' && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-gradient-to-b from-teal-400 to-rose-400 rounded-r-full shadow-[0_0_12px_rgba(20,184,166,0.8)]" />}
            <Users className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'beneficiaries' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            Beneficiaries
            {activeTab === 'beneficiaries' && <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
          </button>

          <button 
            onClick={() => setActiveTab('external-transfer')}
            className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'external-transfer' ? 'bg-gradient-to-r from-teal-400/10 to-rose-400/10 dark:from-teal-400/20 dark:to-rose-400/5 text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <SendHorizontal className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'external-transfer' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            External Transfer
            {activeTab === 'external-transfer' && <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
          </button>

          <button 
            onClick={() => setActiveTab('wallet')}
            className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'wallet' ? 'bg-gradient-to-r from-teal-400/10 to-rose-400/10 dark:from-teal-400/20 dark:to-rose-400/5 text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <Wallet className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'wallet' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            Wallet
            {activeTab === 'wallet' && <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
          </button>

          <button 
            onClick={() => setActiveTab('upi-payments')}
            className={`w-full flex items-center px-5 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${activeTab === 'upi-payments' ? 'bg-gradient-to-r from-teal-400/10 to-rose-400/10 dark:from-teal-400/20 dark:to-rose-400/5 text-teal-600 dark:text-teal-400' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'}`}
          >
            <QrCode className={`w-5 h-5 mr-4 transition-colors ${activeTab === 'upi-payments' ? 'text-teal-500 dark:text-teal-400' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} />
            UPI Payments
            {activeTab === 'upi-payments' && <div className="ml-auto w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]" />}
          </button>
        </nav>
        
        {/* Footer Navigation */}
        <div className="p-6 border-t border-slate-100 dark:border-white/5 transition-colors duration-300 space-y-2">
          <button className="w-full flex items-center px-4 py-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 rounded-2xl transition-all duration-300 group">
            <Settings className="w-5 h-5 mr-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
            Settings
          </button>
          <button className="w-full flex items-center px-4 py-3.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-all duration-300 group">
            <LogOut className="w-5 h-5 mr-4 text-slate-400 group-hover:text-rose-500 dark:group-hover:text-rose-400 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Top Header */}
        <header className="h-24 px-10 shrink-0 sticky top-0 z-10 flex items-center justify-between transition-colors duration-300">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight capitalize transition-colors duration-300">{activeTab.replace('-', ' ')}</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search here..." 
                className="w-72 pl-11 pr-4 py-3 bg-white dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-2xl text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all duration-300 placeholder:text-slate-400 dark:placeholder:text-slate-600 shadow-sm dark:shadow-none"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="relative p-3 text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 bg-white dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-none"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <button className="relative p-3 text-slate-400 hover:text-teal-500 dark:hover:text-teal-400 bg-white dark:bg-[#15172b] border border-slate-200 dark:border-white/5 rounded-2xl transition-all duration-300 shadow-sm dark:shadow-none">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_6px_rgba(244,63,94,0.6)]"></span>
            </button>
            
            <div className="flex items-center cursor-pointer group pl-2">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-teal-400 to-rose-500 p-[2px] shadow-sm">
                <div className="w-full h-full rounded-[14px] bg-white dark:bg-[#1A1D2D] flex items-center justify-center text-slate-900 dark:text-white font-bold text-sm transition-colors duration-300">
                  {profile ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : '..'}
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto">
          {activeTab === 'profile' && (
            <div className="min-h-full flex flex-col items-center justify-center p-10 pb-20">
              <div className="w-full max-w-4xl space-y-8 -mt-16">
                
                {isLoading ? (
                  <div className="bg-white dark:bg-[#15172b] rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 dark:border-white/5 p-16 flex flex-col items-center justify-center min-h-[450px] transition-all duration-300">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-teal-500 dark:border-t-teal-400 animate-spin"></div>
                    </div>
                    <p className="mt-6 text-slate-500 dark:text-slate-400 font-medium animate-pulse tracking-wide">Decrypting secure records...</p>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-[#15172b] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-white/5 overflow-hidden relative transition-all duration-300">
                    {/* Decorative Background Glows in Dark Mode */}
                    {isDarkMode && (
                      <>
                        <div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-500/20 rounded-full blur-[80px]"></div>
                        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px]"></div>
                      </>
                    )}

                    {/* Card Header Banner */}
                    <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-r from-teal-400/20 via-indigo-500/10 to-rose-400/20 dark:from-teal-500/20 dark:via-indigo-500/10 dark:to-rose-500/10 border-b border-white/10"></div>
                    
                    {/* Card Content Header */}
                    <div className="relative px-12 pt-12 pb-8 sm:flex sm:items-end sm:justify-between z-10">
                      <div className="flex items-end space-x-8">
                        <div className="w-32 h-32 rounded-[2rem] bg-white dark:bg-[#1A1D2D] p-2 shadow-xl shadow-slate-200/50 dark:shadow-black/40 border border-slate-100 dark:border-white/10 flex-shrink-0 transition-colors duration-300">
                          <div className="w-full h-full rounded-[1.5rem] bg-gradient-to-br from-teal-400 to-rose-500 flex items-center justify-center text-white text-4xl font-bold shadow-inner">
                            {profile?.firstName.charAt(0)}{profile?.lastName.charAt(0)}
                          </div>
                        </div>
                        <div className="pb-3">
                          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight transition-colors duration-300">{profile?.firstName} {profile?.lastName}</h3>
                          <div className="flex items-center mt-3 space-x-4 text-sm font-semibold text-slate-500 dark:text-slate-400 transition-colors duration-300">
                            <span className="flex items-center text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-400/10 px-3 py-1 rounded-xl border border-teal-100 dark:border-teal-400/20">
                              <ShieldCheck className="w-4 h-4 mr-2" />
                              {profile?.status}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                            <span>Member since {profile?.memberSince}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 sm:mt-0 pb-3">
                        <button className="px-6 py-3 bg-gradient-to-r from-teal-400 to-rose-400 hover:from-teal-500 hover:to-rose-500 text-white font-bold rounded-2xl text-sm shadow-lg shadow-teal-500/25 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/50">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                    
                    {/* Profile Details Grid */}
                    <div className="relative px-12 py-10 bg-white dark:bg-[#15172b] border-t border-slate-100 dark:border-white/5 transition-colors duration-300 z-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
                        {/* Identity Group */}
                        <div className="space-y-8 p-8 rounded-3xl bg-slate-50 dark:bg-[#1A1D2D] border border-slate-100 dark:border-white/5 transition-colors duration-300">
                          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                            <span className="w-8 h-px bg-slate-300 dark:bg-slate-700 mr-3"></span>
                            Identity Details
                          </h4>
                          <div className="space-y-6">
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">First Name</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{profile?.firstName}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Last Name</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{profile?.lastName}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">KYC Level</p>
                              <div className="flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)] mr-3"></span>
                                <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{profile?.kycLevel || 'Verified'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contact Group */}
                        <div className="space-y-8 p-8 rounded-3xl bg-slate-50 dark:bg-[#1A1D2D] border border-slate-100 dark:border-white/5 transition-colors duration-300">
                          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center">
                            <span className="w-8 h-px bg-slate-300 dark:bg-slate-700 mr-3"></span>
                            Contact Information
                          </h4>
                          <div className="space-y-6">
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Email Address</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{profile?.email}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Phone Number</p>
                              <p className="text-lg font-bold text-slate-900 dark:text-white transition-colors duration-300">{profile?.phoneNumber}</p>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">System UUID</p>
                              <div className="flex items-center mt-1">
                                <code className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-400/10 px-3 py-1.5 rounded-lg border border-teal-100 dark:border-teal-400/20">
                                  {profile?.id}
                                </code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'beneficiaries' && <BeneficiariesView isDarkMode={isDarkMode} />}
          {activeTab === 'external-transfer' && <ExternalTransferView isDarkMode={isDarkMode} />}
          
          {activeTab !== 'profile' && activeTab !== 'beneficiaries' && activeTab !== 'external-transfer' && (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-500 pb-20 transition-colors duration-300">
              <div className="w-24 h-24 rounded-3xl bg-white dark:bg-[#15172b] border border-slate-200 dark:border-white/5 shadow-sm dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex items-center justify-center mb-8 transition-colors duration-300">
                <LayoutDashboard className="w-10 h-10 text-slate-300 dark:text-slate-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-3 transition-colors duration-300">Module Under Construction</h2>
              <p className="text-slate-500 dark:text-slate-500 max-w-md text-center leading-relaxed">The {activeTab} dashboard is currently being built by the engineering team. Check back soon for updates.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
