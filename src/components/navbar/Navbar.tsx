export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-red-600">🍕 Pizzeria</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-600 hover:text-red-600">
              Pizza
            </a>
            <a href="#" className="text-gray-600 hover:text-red-600">
              Pasta
            </a>
            <a href="#" className="text-gray-600 hover:text-red-600">
              Salat
            </a>
            <a href="#" className="text-gray-600 hover:text-red-600">
              Dessert
            </a>
            <a href="#" className="text-gray-600 hover:text-red-600">
              Drikke
            </a>
          </div>

          {/* Cart & Language */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-red-600">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </button>
            <button className="text-gray-600 hover:text-red-600">
              <span className="text-xl">🇳🇴</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
