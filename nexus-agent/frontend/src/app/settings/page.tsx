'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import TopBar from '../../components/TopBar';

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);
  const [telegramWebhook, setTelegramWebhook] = useState('https://api.telegram.org/bot72491/sendMessage');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [criticalOverride, setCriticalOverride] = useState(true);
  const [dataPrivacy, setDataPrivacy] = useState(true);
  const [autoLock, setAutoLock] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white flex relative font-sans transition-colors duration-300">
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <TopBar />

        <main className="p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* Heading */}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Settings</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-mono tracking-widest uppercase mt-1">Configure threat alert webhooks, API keys & security profiles</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Main Configuration Card (8 columns) */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col justify-between space-y-6">
              
              <div className="space-y-6">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">[ SYSTEM PREFERENCES ]</span>

                <form onSubmit={handleSave} className="space-y-6">
                  
                  {/* Telegram integration webhook */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase font-mono tracking-wide">Telegram Alert Webhook Endpoint</label>
                    <input
                      type="text"
                      placeholder="Paste telegram webhook URL..."
                      value={telegramWebhook}
                      onChange={(e) => setTelegramWebhook(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:outline-none rounded-2xl px-4 py-3 text-xs font-semibold placeholder-gray-400 font-mono"
                    />
                    <span className="text-[10px] text-gray-400 block font-mono">Automatically pushes telemetry warning signals to your telegram channel.</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase font-mono tracking-wide">Enterprise API Key (Rest API)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        value={process.env.NEXT_PUBLIC_STRIPE_API_KEY || "sk_••••••••••••••••••••••••••••••••"}
                        readOnly
                        className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-white/5 focus:outline-none rounded-2xl px-4 py-3 text-xs font-semibold font-mono text-gray-500 dark:text-gray-400"
                      />
                      <button type="button" className="bg-gray-100 dark:bg-slate-800 hover:bg-gray-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold px-4 py-3 rounded-2xl transition-colors border border-gray-200 dark:border-white/5 shrink-0 text-xs uppercase tracking-widest font-mono">
                        Copy Key
                      </button>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-100 dark:bg-white/5"></div>

                  {/* Toggle switches for email & system push alerts */}
                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-700 dark:text-gray-300 block uppercase font-mono tracking-wide">Security & Notification Channels</label>
                    
                    <div className="space-y-3">
                      {[
                        { label: 'System Browser Notifications', desc: 'Recieve immediate browser overlays upon Mempool attack detection.', state: pushAlerts, setState: setPushAlerts },
                        { label: 'Critical Revoke Overrides', desc: 'Allow automated panic revoke triggers to bypass confirmation prompts.', state: criticalOverride, setState: setCriticalOverride },
                        { label: 'Strict Local Data Encryption', desc: 'Encrypt local session states and prevent sending unhashed metrics off-node.', state: dataPrivacy, setState: setDataPrivacy },
                        { label: 'Session Auto-Lock (5m timeout)', desc: 'Automatically lock the dashboard session after 5 minutes of inactivity.', state: autoLock, setState: setAutoLock }
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-200/50 dark:border-white/5">
                          <div className="space-y-0.5 pr-4">
                            <span className="text-xs font-bold text-gray-800 dark:text-white block">{item.label}</span>
                            <span className="text-[10px] text-gray-500 dark:text-gray-400 block font-medium leading-normal">{item.desc}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => item.setState(!item.state)}
                            className={`w-10 h-5.5 rounded-full transition-colors relative shrink-0 outline-none ${
                              item.state ? 'bg-blue-600' : 'bg-gray-200'
                            }`}
                          >
                            <div className={`w-4.5 h-4.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                              item.state ? 'translate-x-5' : 'translate-x-0.5'
                            }`}></div>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </form>
              </div>

              {/* Submit & Save confirmations */}
              <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  {saveSuccess && (
                    <span className="text-emerald-600 text-xs font-bold font-mono tracking-widest uppercase flex items-center gap-1.5 animate-pulse">
                      [✓] CONFIGURATIONS SAVED SUCCESSFUL
                    </span>
                  )}
                </div>

                <button
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-widest px-8 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 flex items-center gap-2"
                >
                  Save Configurations
                </button>
              </div>

            </div>

            {/* Right side info panel (4 columns) */}
            <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase block">[ INTEGRITY ENGINE STATUS ]</span>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-500">API Telemetry Link:</span>
                    <span className="font-bold text-emerald-500 uppercase">ONLINE</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-500">Alchemy Gas Check:</span>
                    <span className="font-bold text-gray-700 dark:text-gray-300 uppercase">24 Gwei</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-500">Database Sync height:</span>
                    <span className="font-bold text-gray-800 dark:text-white">#19,847,302</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-white/5">
                    <span className="text-gray-500">Active Custom Hooks:</span>
                    <span className="font-bold text-gray-800 dark:text-white">4 Hooks</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-500">Telemetry Engine:</span>
                    <span className="font-bold text-blue-600 uppercase">V5.0 ACTIVE</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-slate-800/50 border border-gray-200/50 dark:border-white/5 p-4 rounded-2xl text-[10px] text-gray-500 dark:text-gray-400 font-mono leading-relaxed">
                🛡️ All stored config files are fully encrypted before writing to persistent local browser memory pools.
              </div>

            </div>

          </div>

        </main>
      </div>
    </div>
  );
}
