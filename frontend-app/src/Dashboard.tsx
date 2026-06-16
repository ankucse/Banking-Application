import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Building2, CreditCard, LayoutDashboard, Settings, User, LogOut } from 'lucide-react';

const MOCK_UUID = "123e4567-e89b-12d3-a456-426614174000"; // Mock ID for testing

// Simple fetch function
const fetchProfile = async () => {
  // In a real app, this would use a proper API client with interceptors for JWT
  const res = await fetch(`http://localhost:8080/api/v1/cif/profile/${MOCK_UUID}`);
  if (!res.ok) {
    if (res.status === 404) {
      // Mock data if not found (since we don't have real data seeded yet)
      return {
        id: MOCK_UUID,
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phoneNumber: '***-***-5555',
        status: 'ACTIVE',
        memberSince: '2023-01-15'
      };
    }
    throw new Error('Failed to fetch profile');
  }
  return res.json();
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile
  });

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-800">
          <Building2 className="w-6 h-6 text-indigo-500 mr-3" />
          <span className="text-white font-bold text-lg tracking-wide">Antigravity</span>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'overview' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3 opacity-75" />
            Overview
          </button>
          
          <button 
            onClick={() => setActiveTab('accounts')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'accounts' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <CreditCard className="w-5 h-5 mr-3 opacity-75" />
            Accounts
          </button>
          
          <button 
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-indigo-600 text-white' : 'hover:bg-slate-800 hover:text-white'}`}
          >
            <User className="w-5 h-5 mr-3 opacity-75" />
            Profile (CIF)
          </button>
        </nav>
        
        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
            <Settings className="w-5 h-5 mr-3 opacity-75" />
            Settings
          </button>
          <button className="w-full flex items-center px-3 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors mt-1">
            <LogOut className="w-5 h-5 mr-3 opacity-75" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <h1 className="text-xl font-semibold text-slate-800 capitalize">{activeTab}</h1>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
              {profile ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : '..'}
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-8">
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200">
                  <h3 className="text-lg font-medium leading-6 text-slate-900">Customer Information</h3>
                  <p className="mt-1 max-w-2xl text-sm text-slate-500">Golden record fetched from the CIF service.</p>
                </div>
                
                {isLoading ? (
                  <div className="p-12 flex justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <div className="px-6 py-5">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-slate-500">First name</dt>
                        <dd className="mt-1 text-sm text-slate-900">{profile?.firstName}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-slate-500">Last name</dt>
                        <dd className="mt-1 text-sm text-slate-900">{profile?.lastName}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-slate-500">Email address</dt>
                        <dd className="mt-1 text-sm text-slate-900">{profile?.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-slate-500">Phone number</dt>
                        <dd className="mt-1 text-sm text-slate-900">{profile?.phoneNumber}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-slate-500">Customer UUID</dt>
                        <dd className="mt-1 text-sm text-slate-900 font-mono text-xs bg-slate-50 p-2 rounded">{profile?.id}</dd>
                      </div>
                    </dl>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {activeTab !== 'profile' && (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <LayoutDashboard className="w-12 h-12 mb-4 opacity-20" />
              <p>This module is under construction.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
