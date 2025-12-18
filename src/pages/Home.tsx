import { useState, useRef } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import FlashDeals from "@/components/home/FlashDeals";
import ProductGrid from "@/components/home/ProductGrid";
import SettingsPage from "@/components/settings/SettingsPage";
import OffersPage from "@/components/offers/OffersPage";
import CategoriesPage from "@/components/categories/CategoriesPage";
import NewArrivalsPage from "@/components/newArrivals/NewArrivalsPage";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { dir } = useLanguage();
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const tabs = ["home", "categories", "newArrivals", "offers", "settings"];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery("");
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setSelectedCategory(null);
  };

  const clearFilter = () => {
    setSelectedCategory(null);
    setSearchQuery("");
  };

  // Swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      const currentIndex = tabs.indexOf(activeTab);
      
      if (dir === 'rtl') {
        if (diff > 0 && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        } else if (diff < 0 && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        }
      } else {
        if (diff > 0 && currentIndex < tabs.length - 1) {
          setActiveTab(tabs[currentIndex + 1]);
        } else if (diff < 0 && currentIndex > 0) {
          setActiveTab(tabs[currentIndex - 1]);
        }
      }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return <SettingsPage />;
      case "offers":
        return <OffersPage />;
      case "categories":
        return <CategoriesPage />;
      case "newArrivals":
        return <NewArrivalsPage />;
      default:
        return (
          <>
            <HeroBanner />
            <Categories onCategorySelect={handleCategorySelect} />
            {!selectedCategory && !searchQuery && <FlashDeals />}
            <ProductGrid 
              categoryFilter={selectedCategory} 
              searchQuery={searchQuery}
              onClearFilter={clearFilter} 
            />
          </>
        );
    }
  };

  return (
    <div 
      className="min-h-screen bg-background pb-24" 
      dir={dir}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      <main className="animate-fade-in">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Home;