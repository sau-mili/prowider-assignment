"use client";
import { useState } from 'react';

export default function RequestService() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', serviceId: '1', description: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/leads', { method: 'POST', body: JSON.stringify(form) });
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setMsg("Lead generated and distributed successfully.");
        setForm({ name: '', phone: '', city: '', serviceId: '1', description: '' }); // Reset
      } else {
        setStatus('error');
        setMsg(data.error);
      }
    } catch (err) {
      setStatus('error');
      setMsg("Network error occurred.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Form Header */}
        <div className="bg-gray-900 px-8 py-10 text-white text-center">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Submit New Enquiry</h1>
          <p className="text-gray-400">This lead will be automatically assigned to eligible providers.</p>
        </div>

        {/* Form Body */}
        <form onSubmit={submit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900" 
                placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Phone Number</label>
              <input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 font-mono" 
                placeholder="9999999999" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">City</label>
              <input required value={form.city} onChange={e => setForm({...form, city: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900" 
                placeholder="New York" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Service Required</label>
              <select value={form.serviceId} onChange={e => setForm({...form, serviceId: e.target.value})} 
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 cursor-pointer">
                <option value="1">Service Type 1</option>
                <option value="2">Service Type 2</option>
                <option value="3">Service Type 3</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Enquiry Description</label>
            <textarea required value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 resize-none" 
              placeholder="How can we help you?" />
          </div>

          {/* Submit Button */}
          <button 
            disabled={status === 'loading'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {status === 'loading' ? (
              <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/> Processing...</>
            ) : 'Distribute Lead'}
          </button>

          {/* Status Message */}
          {status === 'success' && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <span className="text-green-500 text-xl leading-none">✓</span>
              <p className="text-sm font-medium">{msg}</p>
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-start gap-3">
              <span className="text-red-500 text-xl leading-none">⚠</span>
              <p className="text-sm font-medium">{msg}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}