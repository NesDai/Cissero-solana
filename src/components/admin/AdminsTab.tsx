"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import {
  AdminUser,
  getAllAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
  getCurrentAdmin,
  availablePermissions,
} from "@/services/adminService";
import { Search, Edit, Trash2, UserPlus, Shield } from "lucide-react";

export function AdminsTab() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null);

  // Form states for create/edit
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    role: "moderator",
    password: "",
    permissions: [] as string[],
    active: true,
  });

  useEffect(() => {
    const admin = getCurrentAdmin();
    setCurrentAdmin(admin);

    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await getAllAdmins();
      setAdmins(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAdmin = async () => {
    try {
      await createAdmin({
        username: formData.username,
        email: formData.email,
        name: formData.name,
        role: formData.role as "admin" | "super_admin" | "moderator",
        permissions: formData.permissions,
        active: formData.active,
        password: formData.password,
      });

      toast({
        title: "Success",
        description: "Admin user created successfully",
      });

      setShowCreateModal(false);
      resetForm();
      loadAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create admin",
        variant: "destructive",
      });
    }
  };

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      await updateAdmin(selectedAdmin.id, {
        username: formData.username,
        email: formData.email,
        name: formData.name,
        role: formData.role as "admin" | "super_admin" | "moderator",
        permissions: formData.permissions,
        active: formData.active,
      });

      toast({
        title: "Success",
        description: "Admin user updated successfully",
      });

      setShowEditModal(false);
      resetForm();
      loadAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update admin",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;

    try {
      await deleteAdmin(selectedAdmin.id);

      toast({
        title: "Success",
        description: "Admin user deleted successfully",
      });

      setShowDeleteConfirm(false);
      setSelectedAdmin(null);
      loadAdmins();
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete admin",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      name: "",
      role: "moderator",
      password: "",
      permissions: [],
      active: true,
    });
  };

  const openEditModal = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setFormData({
      username: admin.username,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      password: "",
      permissions: admin.permissions,
      active: admin.active,
    });
    setShowEditModal(true);
  };

  const openDeleteConfirm = (admin: AdminUser) => {
    setSelectedAdmin(admin);
    setShowDeleteConfirm(true);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-red-600 text-white";
      case "admin":
        return "bg-blue-600 text-white";
      case "moderator":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const canManageAdmin = (admin: AdminUser) => {
    if (!currentAdmin) return false;

    // Super admins can manage everyone except other super admins
    if (currentAdmin.role === "super_admin") {
      return admin.role !== "super_admin" || admin.id === currentAdmin.id;
    }

    // Admins with manage_admins permission can manage moderators and themselves
    if (currentAdmin.permissions.includes("manage_admins")) {
      return admin.role === "moderator" || admin.id === currentAdmin.id;
    }

    // Others can only manage themselves
    return admin.id === currentAdmin.id;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Admin Management</h2>
        {(currentAdmin?.role === "super_admin" ||
          currentAdmin?.permissions.includes("manage_admins")) && (
          <Button
            className="bg-green-500 text-black hover:bg-green-400"
            onClick={() => setShowCreateModal(true)}
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Create Admin
          </Button>
        )}
      </div>

      <Card className="bg-black bg-opacity-50 border-green-500 text-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-[20px] text-white">
              Admin Users
            </CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search admins..."
                className="pl-8 bg-gray-800 border-gray-700 text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Username</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Role</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Last Login</TableHead>
                <TableHead className="text-white">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-700">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-white"
                  >
                    Loading admin users...
                  </TableCell>
                </TableRow>
              ) : filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-4 text-white"
                  >
                    No admin users found
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin.id}>
                    <TableCell className="text-white font-medium">
                      {admin.name}
                    </TableCell>
                    <TableCell className="text-white">
                      {admin.username}
                    </TableCell>
                    <TableCell className="text-white">{admin.email}</TableCell>
                    <TableCell className="text-white">
                      <Badge className={getRoleBadgeColor(admin.role)}>
                        {admin.role.replace("_", " ").toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      <Badge
                        className={admin.active ? "bg-green-600" : "bg-red-600"}
                      >
                        {admin.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {admin.lastLogin instanceof Date
                        ? admin.lastLogin.toLocaleDateString()
                        : new Date(admin.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-blue-600 text-white border-blue-500 hover:bg-blue-500"
                          onClick={() => openEditModal(admin)}
                          disabled={!canManageAdmin(admin)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        {currentAdmin?.role === "super_admin" &&
                          admin.id !== currentAdmin.id && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-red-600 text-white border-red-500 hover:bg-red-500"
                              onClick={() => openDeleteConfirm(admin)}
                            >
                              <Trash2 className="h-3.5 w-3.5 mr-1" />
                              Delete
                            </Button>
                          )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Admin Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Create Admin User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Username
                </label>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Password
                </label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Full Name
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Role</label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-white">
                  <SelectItem value="moderator">Moderator</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  {currentAdmin?.role === "super_admin" && (
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Permissions
              </label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availablePermissions.map((permission) => (
                  <div
                    key={permission.id}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({
                            ...formData,
                            permissions: [
                              ...formData.permissions,
                              permission.id,
                            ],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            permissions: formData.permissions.filter(
                              (p) => p !== permission.id
                            ),
                          });
                        }
                      }}
                      className="border-gray-500"
                    />
                    <label
                      htmlFor={permission.id}
                      className="text-sm text-gray-300 cursor-pointer"
                    >
                      {permission.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked as boolean })
                }
                className="border-gray-500"
              />
              <label
                htmlFor="active"
                className="text-sm text-gray-300 cursor-pointer"
              >
                Active Account
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowCreateModal(false);
              }}
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateAdmin}
              className="bg-green-500 text-black hover:bg-green-400"
            >
              Create Admin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Admin Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Edit Admin User
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Username
                </label>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                  disabled={selectedAdmin?.id === currentAdmin?.id}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {(currentAdmin?.role === "super_admin" ||
              (currentAdmin?.permissions.includes("manage_admins") &&
                selectedAdmin?.id !== currentAdmin?.id)) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Role
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value })
                  }
                  disabled={selectedAdmin?.id === currentAdmin?.id}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-white">
                    <SelectItem value="moderator">Moderator</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    {currentAdmin?.role === "super_admin" && (
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(currentAdmin?.role === "super_admin" ||
              currentAdmin?.permissions.includes("manage_admins")) && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">
                  Permissions
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availablePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`edit-${permission.id}`}
                        checked={formData.permissions.includes(permission.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setFormData({
                              ...formData,
                              permissions: [
                                ...formData.permissions,
                                permission.id,
                              ],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              permissions: formData.permissions.filter(
                                (p) => p !== permission.id
                              ),
                            });
                          }
                        }}
                        className="border-gray-500"
                        disabled={
                          selectedAdmin?.id === currentAdmin?.id &&
                          permission.id === "manage_admins"
                        }
                      />
                      <label
                        htmlFor={`edit-${permission.id}`}
                        className="text-sm text-gray-300 cursor-pointer"
                      >
                        {permission.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {currentAdmin?.role === "super_admin" && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, active: checked as boolean })
                  }
                  className="border-gray-500"
                  disabled={selectedAdmin?.id === currentAdmin?.id}
                />
                <label
                  htmlFor="edit-active"
                  className="text-sm text-gray-300 cursor-pointer"
                >
                  Active Account
                </label>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowEditModal(false);
              }}
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditAdmin}
              className="bg-green-500 text-black hover:bg-green-400"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-300">
              Are you sure you want to delete the admin user{" "}
              <span className="font-semibold text-white">
                {selectedAdmin?.name}
              </span>
              ? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
              className="bg-gray-700 text-white border-gray-600 hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button onClick={handleDeleteAdmin} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
