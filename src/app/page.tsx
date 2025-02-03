import PromotionsSlider from "@/components/promotions/PromotionsSlider";
import PizzaSection from "@/components/menu/PizzaSection";
import PastaSection from "@/components/menu/PastaSection";
import SaladSection from "@/components/menu/SaladSection";
import DessertSection from "@/components/menu/DessertSection";
import DrinksSection from "@/components/menu/DrinksSection";
import DipsSection from "@/components/menu/DipsSection";
import SectionHeader from "@/components/ui/SectionHeader";

export default function Home() {
  return (
    <main>
      <div className="bg-white">
        <div className="relative">
          <PromotionsSlider />
        </div>
      </div>

      {/* Pizza Section */}
      <div id="pizza" className="scroll-mt-16">
        <PizzaSection />
      </div>

      {/* Pasta Section */}
      <div id="pasta" className="scroll-mt-16">
        <SectionHeader emoji="🍝" />
        <PastaSection />
      </div>

      {/* Salad Section */}
      <div id="salad" className="scroll-mt-16">
        <SectionHeader emoji="🥗" />
        <SaladSection />
      </div>

      {/* Dessert Section */}
      <div id="dessert" className="scroll-mt-16">
        <SectionHeader emoji="🍰" />
        <DessertSection />
      </div>

      {/* Drinks Section */}
      <div id="drinks" className="scroll-mt-16">
        <SectionHeader emoji="🥤" />
        <DrinksSection />
      </div>

      {/* Dips Section */}
      <div id="dips" className="scroll-mt-16">
        <SectionHeader emoji="🥣" />
        <DipsSection />
      </div>
    </main>
  );
}
