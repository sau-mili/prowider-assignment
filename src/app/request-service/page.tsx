"use client";
import { useState } from 'react';

export default function RequestService() {
  const [form, setForm] = useState({ name: '', phone: '', city: '', serviceId: '1', description: '' });
  const [msg, setMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("Submitting...");
    const res = await fetch('/api/leads', {
      method: 'POST', body: JSON.stringify(form)
    });
    const data = await res.json();
    if (data.success) setMsg("✅ Lead Submitted Successfully!");
    else setMsg("❌ Error: " + data.error);
  };

  return (
    <div className="p-10 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit Enquiry</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <input required placeholder="Name" className="border p-2 rounded text-black" onChange={e => setForm({...form, name: e.target.value})} />
        <input required placeholder="Phone (e.g. 9999999999)" className="border p-2 rounded text-black" onChange={e => setForm({...form, phone: e.target.value})} />
        <input required placeholder="City" className="border p-2 rounded text-black" onChange={e => setForm({...form, city: e.target.value})} />
        <select className="border p-2 rounded text-black" onChange={e => setForm({...form, serviceId: e.target.value})}>
          <option value="1">Service 1</option>
          <option value="2">Service 2</option>
          <option value="3">Service 3</option>
        </select>
        <textarea required placeholder="Description" className="border p-2 rounded text-black" onChange={e => setForm({...form, description: e.target.value})} />
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-2 rounded transition-colors">Submit Lead</button>
      </form>
      {msg && <p className="mt-4 font-bold">{msg}</p>}
    </div>
  );
}