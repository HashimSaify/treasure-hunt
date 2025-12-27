import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3">
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600">HT</span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Hatim Technologies</h1>
          <a 
            href="https://hatimtechnologies.in" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline"
          >
            https://hatimtechnologies.in
          </a>
        </div>
      </div>
    </div>
  </header>
  );
}
