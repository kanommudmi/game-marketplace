import { useState, useEffect } from "react";
import { fetchDashboardStats } from "@/mockdata/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Gamepad2,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  Package,
  ArrowRight,
  Star,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const StatCard = ({ title, value, icon: Icon, trend, onClick }) => (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-emerald-600" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">
          {loading ? <Skeleton className="h-8 w-24" /> : value}
        </div>
        {trend && (
          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-500" />
            {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">
          Welcome to your admin dashboard. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Games"
          value={stats?.totalGames}
          icon={Gamepad2}
          trend={`${stats?.freeGames || 0} free, ${stats?.paidGames || 0} paid`}
          onClick={() => navigate("/admin/games")}
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders}
          icon={ShoppingCart}
          trend="All time orders"
          onClick={() => navigate("/admin/orders")}
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers}
          icon={Users}
          trend="Registered users"
          onClick={() => navigate("/admin/users")}
        />
        <StatCard
          title="Total Revenue"
          value={loading ? "" : formatCurrency(stats?.totalRevenue || 0)}
          icon={DollarSign}
          trend={
            stats?.avgOrderValue
              ? `Avg. ${formatCurrency(stats.avgOrderValue)} per order`
              : ""
          }
          onClick={() => navigate("/admin/orders")}
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Orders
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/orders")}
              className="text-emerald-600 hover:text-emerald-700"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats?.recentOrders?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {order.id}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date).toLocaleDateString()} •{" "}
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {formatCurrency(order.total)}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          order.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : order.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No recent orders</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Rated Games */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Top Rated Games
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/admin/games")}
              className="text-emerald-600 hover:text-emerald-700"
            >
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : stats?.topRatedGames?.length > 0 ? (
              <div className="space-y-3">
                {stats.topRatedGames.map((game, index) => (
                  <div
                    key={game.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-12 h-16 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {game.title}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {game.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-900">
                        {game.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No games available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              onClick={() => navigate("/admin/games")}
              className="bg-emerald-600 hover:bg-emerald-700 h-auto py-4"
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-semibold">Manage Games</p>
                <p className="text-xs text-emerald-100">
                  Add, edit, or delete games
                </p>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/admin/orders")}
              variant="outline"
              className="border-gray-300 h-auto py-4"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-semibold text-gray-700">View Orders</p>
                <p className="text-xs text-gray-500">
                  Check order status and history
                </p>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/admin/users")}
              variant="outline"
              className="border-gray-300 h-auto py-4"
            >
              <Users className="w-5 h-5 mr-2" />
              <div className="text-left">
                <p className="font-semibold text-gray-700">Manage Users</p>
                <p className="text-xs text-gray-500">
                  View and manage user accounts
                </p>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
