import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import FlashDeals from "@/components/home/FlashDeals";
import ProductGrid from "@/components/home/ProductGrid";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [cartCount, setCartCount] = useState(3);

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header cartCount={cartCount} />
      
      <main className="animate-fade-in">
        <HeroBanner />
        <Categories />
        <FlashDeals />
        <ProductGrid />
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
