'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Bell, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [clubName, setClubName] = useState('SkillDev Coding Club');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-[#C9A227]" /> Admin System Settings
        </h1>
        <p className="text-sm text-zinc-400 mt-1">
          Configure platform branding, Judge0 API endpoints, and admin security credentials.
        </p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          Settings saved successfully!
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C9A227]" /> Coding Club Branding
          </h3>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Organization Name</label>
            <input
              type="text"
              value={clubName}
              onChange={(e) => setClubName(e.target.value)}
              className="w-full bg-[#111113] border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-zinc-300 block mb-1">Admin Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || 'admin@skilldev.dev'}
              className="w-full bg-[#111113]/50 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-zinc-400 cursor-not-allowed"
            />
          </div>
        </Card>

        <Card className="space-y-4">
          <h3 className="text-base font-bold text-white border-b border-white/10 pb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#C9A227]" /> Platform Notifications
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">Email Task Reminders</span>
              <span className="text-[11px] text-zinc-400">Receive automated daily submission summaries</span>
            </div>
            <input
              type="checkbox"
              checked={emailNotifs}
              onChange={(e) => setEmailNotifs(e.target.checked)}
              className="w-4 h-4 rounded text-[#C9A227]"
            />
          </div>
        </Card>

        <Button type="submit" variant="gold">
          Save Configuration Changes
        </Button>
      </form>
    </div>
  );
}
