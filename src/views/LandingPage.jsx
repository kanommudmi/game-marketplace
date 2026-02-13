import Sidebar from "@/components/Sidebar";
import TrendingSection from "../components/TrendingSection";
import BrowseByCategories from "@/components/BrowseByCategories";
import Cart from "@/components/Cart";

export default function LandingPage() {
  return (
    <>
      <div className="min-h-screen bg-linear-to-br from-[#0b0f1a] to-[#141a2a] text-white">
        <div className="flex flex-col md:flex-row">
          <div className="hidden md:flex">
            <Sidebar />
          </div>

          <section className="flex-1 p-4 md:p-8 space-y-10 w-full">
            <TrendingSection />
            <BrowseByCategories />
          </section>

          <div className="hidden md:block p-4 md:p-6">
            <Cart />
          </div>
        </div>
      </div>
    </>
  );
}
