import { Shirt, Watch, Footprints, Gem, Sparkles, Baby, Home as HomeIcon, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { id: 1, name: "ملابس", icon: Shirt, color: "bg-pink-100 text-pink-600" },
  { id: 2, name: "ساعات", icon: Watch, color: "bg-blue-100 text-blue-600" },
  { id: 3, name: "أحذية", icon: Footprints, color: "bg-amber-100 text-amber-600" },
  { id: 4, name: "مجوهرات", icon: Gem, color: "bg-purple-100 text-purple-600" },
  { id: 5, name: "تجميل", icon: Sparkles, color: "bg-rose-100 text-rose-600" },
  { id: 6, name: "أطفال", icon: Baby, color: "bg-cyan-100 text-cyan-600" },
  { id: 7, name: "منزل", icon: HomeIcon, color: "bg-green-100 text-green-600" },
  { id: 8, name: "إلكترونيات", icon: Smartphone, color: "bg-slate-100 text-slate-600" },
];

const Categories = () => {
  return (
    <section className="px-4 py-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">الأقسام</h2>
        <button className="text-sm text-primary font-medium hover:underline">
          عرض الكل
        </button>
      </div>
      
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              className="flex flex-col items-center gap-2 group animate-fade-in-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-medium",
                category.color
              )}>
                <Icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default Categories;
