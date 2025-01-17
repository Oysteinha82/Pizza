import PromotionsSlider from "@/components/promotions/PromotionsSlider";
import PizzaSection from "@/components/menu/PizzaSection";
import PastaSection from "@/components/menu/PastaSection";
import SaladSection from "@/components/menu/SaladSection";
import DessertSection from "@/components/menu/DessertSection";
import DrinksSection from "@/components/menu/DrinksSection";
import DipsSection from "@/components/menu/DipsSection";

export default function Home() {
  return (
    <main>
      <div id="promotion" className="scroll-mt-16">
        <PromotionsSlider />
      </div>

      {/* Pizza Section */}
      <div
        id="pizza"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full p-4 shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-60"></div>
            <span className="text-4xl relative z-10">🍕</span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="-mt-8">
        <PizzaSection />
      </div>

      {/* Pasta Section */}
      <div
        id="pasta"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full p-4 shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-60"></div>
            <span className="text-4xl relative z-10">🍝</span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="-mt-4">
        <PastaSection />
      </div>

      {/* Salad Section */}
      <div
        id="salad"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full p-4 shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-60"></div>
            <span className="text-4xl relative z-10">🥗</span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="-mt-4">
        <SaladSection />
      </div>

      {/* Dessert Section */}
      <div
        id="dessert"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full p-4 shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-60"></div>
            <span className="text-4xl relative z-10">🍰</span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="-mt-4">
        <DessertSection />
      </div>

      {/* Drinks Section */}
      <div
        id="drinks"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full p-4 shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-60"></div>
            <span className="text-4xl relative z-10">🥤</span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="-mt-4">
        <DrinksSection />
      </div>

      {/* Dips Section */}
      <div
        id="dips"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-16"
      >
        <div className="flex items-center justify-center gap-6 pt-4">
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 rounded-full p-4 shadow-xl border border-amber-500/20 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-60"></div>
            <span className="text-4xl relative z-10">🥣</span>
          </div>
          <div className="flex items-center gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400"
              />
            ))}
          </div>
        </div>
      </div>
      <div className="-mt-4">
        <DipsSection />
      </div>
    </main>
  );
}
