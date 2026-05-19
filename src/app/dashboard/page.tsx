"use client";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Dashboard() {
  const { data, error } = useSWR('/api/providers', fetcher, { refreshInterval: 3000 });

  if (error) return <div className="text-center p-10 text-red-500 font-medium">Failed to load system data.</div>;
  if (!data) return (
    <div className="flex flex-col items-center justify-center py-20 space-y-4">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-500 font-medium">Syncing live dashboard...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Provider Overview</h1>
          <p className="text-gray-500 mt-1">Real-time lead distribution and quota tracking.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full border border-green-200">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-semibold text-green-700">Live Sync Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((p: any) => {
          // Dynamic styling based on quota health
          const quotaPercent = (p.quota / 10) * 100;
          const barColor = p.quota > 5 ? 'bg-emerald-500' : p.quota > 0 ? 'bg-amber-500' : 'bg-rose-500';
          const textColor = p.quota > 5 ? 'text-emerald-600' : p.quota > 0 ? 'text-amber-600' : 'text-rose-600';

          return (
            <div key={p.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md">
              
              {/* Card Header */}
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900">{p.name}</h2>
                
                {/* Quota Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining Quota</span>
                    <span className={`font-bold ${textColor}`}>{p.quota} / 10</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${barColor} transition-all duration-1000 ease-out`} 
                      style={{ width: `${quotaPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Assigned Leads List */}
              <div className="p-5 flex-1 bg-white">
                <p className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider flex justify-between">
                  Assigned Leads <span>{p.assignments.length} Total</span>
                </p>
                
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                  {p.assignments.length === 0 ? (
                    <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-lg">
                      <p className="text-sm text-gray-400 italic">Awaiting leads...</p>
                    </div>
                  ) : (
                    p.assignments.map((a: any) => (
                      <div key={a.id} className="group relative bg-white border border-gray-100 p-3 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all">
                        <p className="font-semibold text-gray-800 text-sm">{a.lead.name}</p>
                        <p className="text-gray-500 text-xs mt-0.5 font-mono bg-gray-50 inline-block px-1 rounded">{a.lead.phone}</p>
                        <span className="absolute top-3 right-3 text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-md border border-blue-100">
                          Svc {a.lead.serviceId}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}