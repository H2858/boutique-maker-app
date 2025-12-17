import { useState } from "react";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import HeroBanner from "@/components/home/HeroBanner";
import Categories from "@/components/home/Categories";
import FlashDeals from "@/components/home/FlashDeals";
import ProductGrid from "@/components/home/ProductGrid";
import SettingsPage from "@/components/settings/SettingsPage";
import FavoritesPage from "@/components/favorites/FavoritesPage";
import { useLanguage } from "@/contexts/LanguageContext";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { dir } = useLanguage();

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

  const renderContent = () => {
    switch (activeTab) {
      case "settings":
        return <SettingsPage />;
      case "favorites":
        return <FavoritesPage />;
      case "categories":
        return <ProductGrid searchQuery={searchQuery} onClearFilter={clearFilter} />;
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
    <div className="min-h-screen bg-background pb-20" dir={dir}>
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      
      <main className="animate-fade-in">
        {renderContent()}
      </main>

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Home;