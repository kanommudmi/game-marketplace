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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Loader2,
  Users,
  RefreshCw,
  Shield,
  User,
  AlertCircle,
  Trash2,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { fetchUsers, updateUserRole, deleteUser } from "@/mockdata/mockApi";
import { Switch } from "@/components/ui/switch";

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, users]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let result = [...users];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.displayName.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.id.toLowerCase().includes(query)
      );
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(result);
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    setUpdatingRole(userId);
    try {
      const updatedUser = await updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updatedUser : u))
      );
      toast.success(
        `${updatedUser.displayName} is now ${newRole === "admin" ? "an Admin" : "a User"}`
      );
    } catch (error) {
      console.error("Failed to update user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setUpdatingRole(null);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      await deleteUser(userToDelete.id);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      toast.success(`${userToDelete.displayName} has been deleted`);
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error(error.message || "Failed to delete user");
    } finally {
      setIsDeleting(false);
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const viewUserDetails = (user) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const getStats = () => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === "admin").length,
      users: users.filter((u) => u.role === "user").length,
      totalSpent: users.reduce((sum, u) => sum + (u.totalSpent || 0), 0),
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-500 mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <Button
          variant="outline"
          onClick={loadUsers}
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
            <p className="text-sm text-gray-500">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.admins}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Regular Users</p>
            <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Total Spent</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(stats.totalSpent)}
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
                placeholder="Search by name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins Only</option>
              <option value="user">Users Only</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            User Accounts ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <span className="ml-2 text-gray-600">Loading users...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No users found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "No users registered yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Games Owned</TableHead>
                    <TableHead>Total Spent</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatarUrl}
                            alt={user.displayName}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <button
                              onClick={() => viewUserDetails(user)}
                              className="font-medium text-gray-900 hover:text-emerald-600"
                            >
                              {user.displayName}
                            </button>
                            <p className="text-sm text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(user.joinDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{user.totalGamesOwned || 0}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(user.totalSpent || 0)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {user.role === "admin" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                              <Crown className="w-3 h-3 mr-1" />
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              <User className="w-3 h-3 mr-1" />
                              User
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.role === "admin"}
                              onCheckedChange={() =>
                                handleRoleToggle(user.id, user.role)
                              }
                              disabled={updatingRole === user.id}
                            />
                            <span className="text-xs text-gray-500">
                              {updatingRole === user.id ? "Updating..." : "Admin"}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteClick(user)}
                            disabled={user.role === "admin"}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">User Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedUser?.displayName}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              {/* User Header */}
              <div className="flex items-center gap-4">
                <img
                  src={selectedUser.avatarUrl}
                  alt={selectedUser.displayName}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedUser.displayName}
                  </h3>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="mt-2">
                    {selectedUser.role === "admin" ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700">
                        <Crown className="w-4 h-4 mr-1" />
                        Administrator
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                        <User className="w-4 h-4 mr-1" />
                        User
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* User Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-medium text-gray-900">
                    {new Date(selectedUser.joinDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.location || "Not specified"}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Games Owned</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.totalGamesOwned || 0}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Wallet Balance</p>
                  <p className="font-medium text-gray-900">
                    {formatCurrency(selectedUser.walletBalance || 0)}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bio</p>
                  <p className="text-gray-700 text-sm">{selectedUser.bio}</p>
                </div>
              )}

              {/* Total Spent */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Spent</span>
                  <span className="text-2xl font-bold text-emerald-600">
                    {formatCurrency(selectedUser.totalSpent || 0)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{userToDelete?.displayName}"? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete User
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
