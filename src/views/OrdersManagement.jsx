import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  ShoppingCart,
  RefreshCw,
  Package,
  Calendar,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "sonner";
import { fetchOrders, updateOrderStatus } from "@/mockdata/mockApi";

const OrdersManagement = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filterOrders = () => {
    let result = [...orders];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.userEmail?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((order) => order.status === statusFilter);
    }

    // Sort by date, newest first
    result.sort((a, b) => new Date(b.date) - new Date(a.date));

    setFilteredOrders(result);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const updatedOrder = await updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? updatedOrder : o))
      );
      toast.success(`Order ${orderId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const toggleRowExpand = (orderId) => {
    setExpandedRows((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusStats = () => {
    return {
      total: orders.length,
      completed: orders.filter((o) => o.status === "completed").length,
      pending: orders.filter((o) => o.status === "pending").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
      revenue: orders
        .filter((o) => o.status === "completed")
        .reduce((sum, o) => sum + o.total, 0),
    };
  };

  const stats = getStatusStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-gray-500 mt-1">
            View and manage customer orders
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadOrders}
          disabled={loading}
          className="border-gray-300"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-emerald-600">
              {formatCurrency(stats.revenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by order ID or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Orders ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No orders found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "No orders have been placed yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <button
                          onClick={() => viewOrderDetails(order)}
                          className="font-medium text-emerald-600 hover:text-emerald-700"
                        >
                          {order.id}
                        </button>
                      </TableCell>
                      <TableCell>
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{order.items?.length || 0} items</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(order.total)}
                      </TableCell>
                      <TableCell>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value)
                          }
                          disabled={updatingStatus === order.id}
                          className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewOrderDetails(order)}
                          className="text-emerald-600 hover:text-emerald-700"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Order Details
            </DialogTitle>
            <DialogDescription>
              Order {selectedOrder?.id} - {new Date(selectedOrder?.date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">
                    {new Date(selectedOrder.date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{selectedOrder.userEmail || "Guest"}</span>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status.charAt(0).toUpperCase() +
                    selectedOrder.status.slice(1)}
                </span>
              </div>

              {/* Items List */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-12 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {item.title}
                          </p>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {item.isFree ? "Free" : formatCurrency(item.price)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(selectedOrder.total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersManagement;
