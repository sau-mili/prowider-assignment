import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 bg-gray-50">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Prowider Lead System</h1>
      <p className="text-lg text-gray-600 mb-10 text-center max-w-md">
        Backend Engineering Assignment. Please navigate to one of the modules below to evaluate the system.
      </p>
      
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link href="/dashboard" className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-4 rounded-lg text-center shadow-md transition-colors">
          📊 View Provider Dashboard
        </Link>
        <Link href="/request-service" className="bg-green-600 hover:bg-green-700 text-white font-bold p-4 rounded-lg text-center shadow-md transition-colors">
          📝 Submit a New Lead
        </Link>
        <Link href="/test-tools" className="bg-purple-600 hover:bg-purple-700 text-white font-bold p-4 rounded-lg text-center shadow-md transition-colors">
          🛠️ Evaluator Test Tools
        </Link>
      </div>
    </div>
  );
}