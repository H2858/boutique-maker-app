import ProductCard from "@/components/product/ProductCard";

const products = [
  {
    id: 5,
    name: "قميص قطني كاجوال",
    price: 79,
    originalPrice: 120,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    rating: 4.5,
    sold: 1234,
    discount: 34,
  },
  {
    id: 6,
    name: "حذاء رياضي أنيق",
    price: 199,
    originalPrice: 350,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    rating: 4.8,
    sold: 876,
    discount: 43,
  },
  {
    id: 7,
    name: "عطر فاخر للرجال",
    price: 159,
    originalPrice: 280,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=400&h=400&fit=crop",
    rating: 4.9,
    sold: 2341,
    discount: 43,
  },
  {
    id: 8,
    name: "محفظة جلدية أصلية",
    price: 89,
    originalPrice: 150,
    image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=400&fit=crop",
    rating: 4.6,
    sold: 567,
    discount: 41,
  },
  {
    id: 9,
    name: "فستان سهرة أنيق",
    price: 299,
    originalPrice: 500,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    rating: 4.7,
    sold: 432,
    discount: 40,
  },
  {
    id: 10,
    name: "سوار ذهبي مميز",
    price: 129,
    originalPrice: 200,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&h=400&fit=crop",
    rating: 4.8,
    sold: 789,
    discount: 35,
  },
  {
    id: 11,
    name: "نظارات طبية أنيقة",
    price: 149,
    originalPrice: 250,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&h=400&fit=crop",
    rating: 4.4,
    sold: 321,
    discount: 40,
  },
  {
    id: 12,
    name: "حقيبة ظهر عصرية",
    price: 119,
    originalPrice: 180,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    rating: 4.6,
    sold: 654,
    discount: 34,
  },
];

interface ProductGridProps {
  title?: string;
}

const ProductGrid = ({ title = "منتجات مميزة" }: ProductGridProps) => {
  return (
    <section className="px-4 py-6" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <button className="text-sm text-primary font-medium hover:underline">
          عرض الكل
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {products.map((product, index) => (
          <div 
            key={product.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;
