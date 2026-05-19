"use client";
import { useState } from 'react';

export default function TestTools() {
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => setLog(prev => [msg, ...prev]);

  const resetQuota = async () => {
    const eventId = "evt_" + Math.random().toString(36).substring(7);
    const res = await fetch('/api/webhook', { method: 'POST', body: JSON.stringify({ eventId, providerId: 1 }) });
    const data = await res.json();
    addLog(`Webhook: ${data.message}`);
  };

  const testIdempotency = async () => {
    const eventId = "evt_static_id_12345"; 
    addLog(`Sending Webhook 1 (ID: ${eventId})...`);
    await fetch('/api/webhook', { method: 'POST', body: JSON.stringify({ eventId, providerId: 2 }) });
    
    addLog(`Sending Webhook 2 (ID: ${eventId})...`);
    const res2 = await fetch('/api/webhook', { method: 'POST', body: JSON.stringify({ eventId, providerId: 2 }) });
    const data = await res2.json();
    addLog(`Idempotency Result: ${data.message}`);
  };

  const generateTenLeads = async () => {
    addLog("Firing 10 simultaneous leads...");
    const promises = Array.from({ length: 10 }).map((_, i) => 
      fetch('/api/leads', {
        method: 'POST',
        body: JSON.stringify({
          name: `Concurrency Lead ${Math.floor(Math.random() * 1000)}`,
          phone: `555000${Math.floor(Math.random() * 10000)}`,
          city: "Load Test City",
          serviceId: (i % 3) + 1,
          description: "Testing database locking"
        })
      })
    );
    await Promise.all(promises);
    addLog("All 10 leads fired! Check dashboard to verify quota limits were respected.");
  };

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Evaluator Testing Tools</h1>
      
      <div className="flex flex-col gap-4 mb-8">
        <button onClick={resetQuota} className="bg-green-600 hover:bg-green-700 text-white font-bold p-3 rounded">
          1. Simulate Payment Webhook (Reset Provider 1 Quota)
        </button>
        
        <button onClick={testIdempotency} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold p-3 rounded">
          2. Test Webhook Idempotency (Provider 2)
        </button>
        
        <button onClick={generateTenLeads} className="bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded">
          3. Generate 10 Leads Instantly (Concurrency Test)
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded font-mono h-64 overflow-y-auto">
        <p className="text-gray-500 mb-2">--- Execution Logs ---</p>
        {log.map((l, i) => <p key={i}>{'>'} {l}</p>)}
      </div>
    </div>
  );
}