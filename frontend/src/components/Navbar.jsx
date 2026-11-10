import React, { useState } from 'react';
import { Volume2, ShieldCheck, Key, BookOpen, Cpu, Sparkles } from 'lucide-react';
import { updateApiKey } from '../services/api';

export default function Navbar({ health, onKeyUpdated, openGuide }) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);

  const handleSaveKey = async (e) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) return;
    setSaving(true);
    try {
      const res = await updateApiKey(apiKeyInput.trim());
      setSaveStatus('API Key updated successfully!');
      if (onKeyUpdated) onKeyUpdated();
      setTimeout(() => {
        setShowKeyModal(false);
        setSaveStatus(null);
      }, 1200);
    } catch (err) {
      setSaveStatus('Failed to update key: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            
            {/* Brand Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-bharat-saffron to-amber-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Volume2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl tracking-tight text-stone-900">KisanSetu <span className="text-bharat-saffron">AI</span></span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full border border-emerald-300">
                    Sovereign Stack
                  </span>
                </div>
                <p className="text-xs text-stone-500 hidden sm:block">Sovereign Indic AI Voice Platform for Agriculture & Mandi Commerce</p>
              </div>
            </div>

            {/* Navigation & Controls */}
            <div className="flex items-center gap-2 sm:gap-4">
              
              {/* API Key Modal Button */}
              <button
                onClick={() => setShowKeyModal(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-colors ${
                  health?.has_api_key
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
                title="Configure your Gnani AI API Key"
              >
                <Key className="w-3.5 h-3.5" />
                <span>{health?.has_api_key ? 'Gnani API Live' : 'API Key / Simulation'}</span>
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* API Key Config Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95">
            <h3 className="text-lg font-bold text-stone-900 mb-1 flex items-center gap-2">
              <Key className="w-5 h-5 text-bharat-saffron" />
              Configure Gnani AI API Key
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter your API key from <a href="https://app.gnani.ai/voice" target="_blank" rel="noreferrer" className="text-bharat-saffron underline font-semibold">app.gnani.ai/voice</a>. If blank, KisanSetu operates in full sovereign offline simulation mode.
            </p>

            <form onSubmit={handleSaveKey}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  X-API-Key-ID
                </label>
                <input
                  type="text"
                  placeholder="e.g. gna_live_xxxxxxxxxxxx"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-bharat-saffron focus:border-transparent font-mono"
                />
              </div>

              {health?.api_key_masked && (
                <div className="text-xs text-stone-500 mb-3 bg-stone-50 p-2.5 rounded-lg border border-stone-200">
                  Current Status: <span className="font-semibold text-stone-800">{health.api_key_masked}</span>
                </div>
              )}

              {saveStatus && (
                <div className={`text-xs p-2.5 rounded-lg mb-3 ${saveStatus.includes('success') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800'}`}>
                  {saveStatus}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-200 rounded-lg hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 text-xs font-medium text-white bg-bharat-saffron hover:bg-bharat-saffronHover rounded-lg transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Connect'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
