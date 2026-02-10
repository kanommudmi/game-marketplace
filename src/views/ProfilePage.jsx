import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate } from "@/mockdata/user";
import { 
  ArrowLeft, 
  User, 
  ShoppingBag, 
  Heart, 
  Settings, 
  MapPin, 
  Calendar,
  Gamepad2,
  DollarSign,
  Package,
  ChevronRight,
  Trash2
} from "lucide-react";

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "orders", label: "Order History", icon: ShoppingBag },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "edit", label: "Edit Profile", icon: Settings },
];

const ProfilePage = () => {
  const { user, orders, wishlist, updateProfile, removeFromWishlist } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    displayName: user.displayName,
    email: user.email,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    location: user.location,
  });

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
  };

  const stats = [
    { label: "Games Owned", value: user.totalGamesOwned || orders.reduce((sum, order) => sum + order.items.length, 0), icon: Gamepad2 },
    { label: "Total Spent", value: formatCurrency(user.totalSpent || orders.reduce((sum, order) => sum + order.total, 0)), icon: DollarSign },
    { label: "Orders", value: orders.length, icon: Package },
    { label: "Wishlist", value: wishlist.length, icon: Heart },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            className="text-lime-400 hover:text-lime-300"
          >
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">My Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-[#151921] border-white/10 sticky top-6">
              <CardContent className="p-4">
                {/* User Mini Profile */}
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                  <img
                    src={user.avatarUrl}
                    alt={user.displayName}
                    className="w-16 h-16 rounded-sm object-cover border-2 border-lime-400"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{user.displayName}</h3>
                    <p className="text-sm text-slate-400">{user.email}</p>
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-colors ${
                          activeTab === tab.id
                            ? "bg-lime-400 text-black font-medium"
                            : "text-slate-300 hover:bg-white/5"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Profile Card */}
                <Card className="bg-[#151921] border-white/10">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        className="w-24 h-24 rounded-sm object-cover border-4 border-lime-400/30"
                      />
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold mb-1">{user.displayName}</h2>
                        <p className="text-slate-400 mb-3">{user.bio}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-lime-400" />
                            {user.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-lime-400" />
                            Member since {formatDate(user.joinDate)}
                          </span>
                        </div>
                      </div>
                      <Button
                        onClick={() => setActiveTab("edit")}
                        className="bg-lime-400 text-black font-semibold"
                      >
                        Edit Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={index} className="bg-[#151921] border-white/10">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-lime-400/10 rounded-sm">
                              <Icon className="w-6 h-6 text-lime-400" />
                            </div>
                            <div>
                              <p className="text-2xl font-bold">{stat.value}</p>
                              <p className="text-sm text-slate-400">{stat.label}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Recent Orders Preview */}
                {orders.length > 0 && (
                  <Card className="bg-[#151921] border-white/10">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Recent Orders</CardTitle>
                      <Button
                        variant="ghost"
                        className="text-lime-400 hover:text-lime-300"
                        onClick={() => setActiveTab("orders")}
                      >
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {orders.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="flex items-center gap-4 p-3 bg-black/30 rounded-sm"
                          >
                            <div className="flex -space-x-2">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <img
                                  key={idx}
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-10 h-10 rounded-sm object-cover border-2 border-[#151921]"
                                />
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-10 h-10 rounded-sm bg-slate-700 flex items-center justify-center text-xs border-2 border-[#151921]">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{order.id}</p>
                              <p className="text-sm text-slate-400">
                                {formatDate(order.date)} • {order.items.length} items
                              </p>
                            </div>
                            <span className="text-lime-400 font-semibold">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Edit Profile Tab */}
            {activeTab === "edit" && (
              <Card className="bg-[#151921] border-white/10">
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                  <CardDescription className="text-slate-400">
                    Update your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleEditSubmit} className="space-y-6">
                    {/* Avatar Preview */}
                    <div className="flex items-center gap-4">
                      <img
                        src={editForm.avatarUrl}
                        alt="Avatar preview"
                        className="w-20 h-20 rounded-sm object-cover border-2 border-lime-400"
                      />
                      <div className="flex-1">
                        <label className="text-sm font-medium block mb-2">
                          Avatar URL
                        </label>
                        <Input
                          value={editForm.avatarUrl}
                          onChange={(e) =>
                            setEditForm({ ...editForm, avatarUrl: e.target.value })
                          }
                          placeholder="https://example.com/avatar.jpg"
                          className="bg-black/30 border-white/10 text-white"
                        />
                      </div>
                    </div>

                    {/* Display Name */}
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Display Name
                      </label>
                      <Input
                        value={editForm.displayName}
                        onChange={(e) =>
                          setEditForm({ ...editForm, displayName: e.target.value })
                        }
                        placeholder="Your display name"
                        className="bg-black/30 border-white/10 text-white"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Email Address
                      </label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        placeholder="your@email.com"
                        className="bg-black/30 border-white/10 text-white"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="text-sm font-medium block mb-2">
                        Location
                      </label>
                      <Input
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                        placeholder="Your location"
                        className="bg-black/30 border-white/10 text-white"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="text-sm font-medium block mb-2">Bio</label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself..."
                        rows={4}
                        className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-lime-400"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        className="bg-lime-400 text-black font-semibold"
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditForm({
                            displayName: user.displayName,
                            email: user.email,
                            avatarUrl: user.avatarUrl,
                            bio: user.bio,
                            location: user.location,
                          });
                          setActiveTab("overview");
                        }}
                        className="border-white/20 text-white hover:bg-white/5"
                      >
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Order History Tab */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <Card className="bg-[#151921] border-white/10">
                  <CardHeader>
                    <CardTitle>Order History</CardTitle>
                    <CardDescription className="text-slate-400">
                      View all your past purchases and order details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <ShoppingBag className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                        <p className="text-slate-400 mb-4">
                          Start shopping to see your order history here
                        </p>
                        <Button
                          onClick={() => navigate("/")}
                          className="bg-lime-400 text-black font-semibold"
                        >
                          Browse Games
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="bg-black/30 rounded-sm p-4 space-y-4"
                          >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
                              <div>
                                <p className="font-semibold text-lg">{order.id}</p>
                                <p className="text-sm text-slate-400">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`px-3 py-1 rounded-sm text-sm font-medium ${
                                    order.status === "completed"
                                      ? "bg-green-500/20 text-green-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}
                                >
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </span>
                                <span className="text-xl font-bold text-lime-400">
                                  {formatCurrency(order.total)}
                                </span>
                              </div>
                            </div>

                            {/* Order Items */}
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center gap-4"
                                >
                                  <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-16 h-16 rounded-sm object-cover"
                                  />
                                  <div className="flex-1">
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-sm text-slate-400">
                                      Qty: {item.quantity}
                                    </p>
                                  </div>
                                  <span className="font-semibold">
                                    {formatCurrency(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === "wishlist" && (
              <div className="space-y-6">
                <Card className="bg-[#151921] border-white/10">
                  <CardHeader>
                    <CardTitle>My Wishlist</CardTitle>
                    <CardDescription className="text-slate-400">
                      Games you're interested in purchasing later
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {wishlist.length === 0 ? (
                      <div className="text-center py-12">
                        <Heart className="w-16 h-16 text-slate-500 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2">
                          Your wishlist is empty
                        </h3>
                        <p className="text-slate-400 mb-4">
                          Save games you want to buy later
                        </p>
                        <Button
                          onClick={() => navigate("/")}
                          className="bg-lime-400 text-black font-semibold"
                        >
                          Browse Games
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {wishlist.map((game) => (
                          <div
                            key={game.id}
                            className="bg-black/30 rounded-sm p-4 flex gap-4 group"
                          >
                            <img
                              src={game.imageUrl}
                              alt={game.title}
                              className="w-24 h-32 rounded-sm object-cover"
                            />
                            <div className="flex-1 flex flex-col">
                              <h4 className="font-semibold text-lg mb-1">
                                {game.title}
                              </h4>
                              <p className="text-sm text-slate-400 mb-2">
                                {game.category}
                              </p>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-yellow-400">★</span>
                                <span className="text-sm">{game.rating}</span>
                              </div>
                              <div className="mt-auto flex items-center justify-between">
                                <span className="text-xl font-bold text-lime-400">
                                  {game.price === 0
                                    ? "Free"
                                    : formatCurrency(game.price)}
                                </span>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => removeFromWishlist(game.id)}
                                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
