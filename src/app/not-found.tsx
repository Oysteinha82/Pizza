export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">404 - Siden ble ikke funnet</h2>
        <p className="text-gray-600 mb-4">
          Beklager, men siden du leter etter eksisterer ikke.
        </p>
        <a
          href="/"
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors inline-block"
        >
          Gå til forsiden
        </a>
      </div>
    </div>
  );
}
