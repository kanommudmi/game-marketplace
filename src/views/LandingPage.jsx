import Sidebar from "@/components/Sidebar";
import TrendingSection from "../components/TrendingSection";
import BrowseByCategories from "@/components/BrowseByCategories";
import Cart from "@/components/Cart";

export default function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-[#0b0f1a] to-[#141a2a] text-white p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          <section className="flex-1 p-6 space-y-10 w-full">
            <TrendingSection />
            <BrowseByCategories />
          </section>

          <div className="hidden md:block">
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
}
