export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            SJ Shelter & Opportunity Hub
          </h1>
          <p className="text-lg text-center text-gray-700 mb-8">
            Caseworker portal for connecting individuals with shelters and micro-task opportunities in San Jose.
          </p>

          {/* Placeholder for where the main content (like the map) will eventually go */}
          <div className="bg-gray-100 p-10 rounded-lg shadow text-center">
            <p className="text-gray-500">(Main Content Area - Map/Dashboard will load here)</p>
            {/* We'll replace this div with actual components soon */}
          </div>

          {/* You can add placeholders for other sections if needed, e.g., Task List link */}
          <div className="mt-8 text-center">
            <a href="#" className="text-blue-600 hover:underline">View Available Tasks (Placeholder Link)</a>
          </div>
        </div>

      </main >
    </div>
  );
}
