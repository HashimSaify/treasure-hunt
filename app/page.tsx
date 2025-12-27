export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gray-100">
      <h1 className="text-3xl font-bold">Select Your Team</h1>

      <a href="/team/jihaad" className="w-72 p-4 text-white text-center rounded bg-red-600">Jihaad</a>
      <a href="/team/adal" className="w-72 p-4 text-white text-center rounded bg-blue-600">Adal</a>
      <a href="/team/yakeen" className="w-72 p-4 text-white text-center rounded bg-green-600">Yakeen</a>
      <a href="/team/sabar" className="w-72 p-4 text-black text-center rounded bg-yellow-400">Sabar</a>
    </main>
  );
}
