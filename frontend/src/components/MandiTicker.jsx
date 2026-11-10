import React, { useState, useEffect } from 'react';
import { TrendingUp, Search, MapPin, Tag, ArrowUpRight, ShieldCheck, Volume2 } from 'lucide-react';
import { fetchMandiPrices } from '../services/api';

export default function MandiTicker({ onSelectCropForVoice }) {
  const [prices, setPrices] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPrices();
  }, []);

  const loadPrices = async (q = '') => {
    setLoading(true);
    try {
      const data = await fetchMandiPrices(q);
      setPrices(data);
    } catch (err) {
      console.error("Error loading mandi prices:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    loadPrices(val);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t border-stone-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-stone-900">
              Live Bharat APMC Mandi Desk
            </h2>
          </div>
          <p className="text-xs text-stone-500">
            Real-time daily arrivals, modal prices, and MSP benchmarks verified across state agriculture portals • <strong>Click any crop card to hear live voice reasoning</strong>
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search crop or mandi (e.g. Tomato, Kolar)"
            value={search}
            onChange={handleSearchChange}
            className="w-full text-xs pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-bharat-saffron shadow-xs"
          />
        </div>
      </div>

      {/* Grid of Mandi Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {prices.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectCropForVoice && onSelectCropForVoice(item)}
            className="bg-white rounded-2xl border border-stone-200 hover:border-orange-400 p-4 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <h3 className="font-bold text-base text-stone-900 group-hover:text-bharat-saffron transition">
                    {item.crop}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-stone-500 mt-0.5">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{item.market}, {item.state}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  item.status === 'above_msp' 
                    ? 'bg-emerald-100 text-emerald-800'
                    : item.status === 'volatile'
                    ? 'bg-orange-100 text-orange-800'
                    : 'bg-stone-100 text-stone-700'
                }`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>

              {/* Price Details */}
              <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-100 group-hover:bg-orange-50/40 transition">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-stone-500 font-medium">Modal Price:</span>
                  <span className="text-lg font-black text-stone-900">₹{item.modal_price}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                  <span>Range: ₹{item.min_price} - ₹{item.max_price}</span>
                  <span className="text-stone-400">({item.unit})</span>
                </div>
              </div>

              {/* Trend */}
              <div className="mt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{item.trend}</span>
              </div>
            </div>

            {/* Quick Voice Ask Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectCropForVoice && onSelectCropForVoice(item);
              }}
              className="mt-4 w-full py-2.5 bg-stone-100 group-hover:bg-bharat-saffron group-hover:text-white text-stone-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs border border-stone-200 group-hover:border-transparent"
            >
              <Volume2 className="w-3.5 h-3.5 text-bharat-saffron group-hover:text-white" />
              <span>Ask Voice Bot About This Crop →</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
