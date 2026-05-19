"use client";
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function Dashboard() {
  // refreshInterval: 3000 polls the database every 3 seconds for real-time updates
  const { data, error } = useSWR('/api/providers', fetcher, { refreshInterval: 3000 });

  if (error) return <div className="p-10 text-red-500">Failed to load dashboard</div>;
  if (!data) return <div className="p-10 text-xl font-bold animate-pulse">Loading Live Dashboard...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
        Provider Dashboard 
        <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full animate-pulse">Live Updates Active</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((p: any) => (
          <div key={p.id} className="border p-5 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold text-gray-800 mb-2">{p.name}</h2>
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">Quota:</span>
              <span className={`font-bold text-lg ${p.quota === 0 ? 'text-red-500' : 'text-blue-600'}`}>{p.quota} / 10</span>
            </div>
            
            <div className="bg-gray-50 p-2 rounded border max-h-48 overflow-y-auto">
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Assigned Leads ({p.assignments.length})</p>
              {p.assignments.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No leads assigned yet.</p>
              ) : (
                p.assignments.map((a: any) => (
                  <div key={a.id} className="text-xs bg-white p-2 mb-2 border rounded shadow-sm">
                    <p className="font-bold text-gray-800">{a.lead.name}</p>
                    <p className="text-gray-600">{a.lead.phone}</p>
                    <p className="text-blue-600 mt-1">Service {a.lead.serviceId}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}