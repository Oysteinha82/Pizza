export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-gray-900">Pizza Restaurant</h1>
        </div>

        <nav className="flex items-center space-x-8">
          <a href="#" className="text-gray-600 hover:text-red-600">
            Meny
          </a>
          <a href="#" className="text-gray-600 hover:text-red-600">
            Om oss
          </a>
          <a href="#" className="text-gray-600 hover:text-red-600">
            Kontakt
          </a>
          <button className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500">
            Bestill nå
          </button>
        </nav>
      </div>
    </header>
  );
}
