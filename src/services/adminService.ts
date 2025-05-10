// Admin authentication and management service

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  name: string;
  role: "admin" | "super_admin" | "moderator";
  permissions: string[];
  lastLogin: Date;
  createdAt: Date;
  active: boolean;
  profileImage?: string;
}

// Available permissions in the system
export const availablePermissions = [
  { id: "create_events", label: "Create Events" },
  { id: "edit_events", label: "Edit Events" },
  { id: "delete_events", label: "Delete Events" },
  { id: "approve_events", label: "Approve Events" },
  { id: "assign_events", label: "Assign Events" },
  { id: "manage_all_events", label: "Manage All Events" },
  { id: "view_history", label: "View Event History" },
  { id: "undo_actions", label: "Undo Actions" },
  { id: "manage_admins", label: "Manage Admins" },
  { id: "view_analytics", label: "View Analytics" },
];

// Mock admin users for development
let mockAdmins: AdminUser[] = [
  {
    id: "admin1",
    username: "admin",
    email: "admin@example.com",
    name: "Super Admin",
    role: "super_admin",
    permissions: availablePermissions.map((p) => p.id),
    lastLogin: new Date(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    active: true,
  },
  {
    id: "admin2",
    username: "moderator",
    email: "mod@example.com",
    name: "Event Moderator",
    role: "moderator",
    permissions: ["create_events", "edit_events", "view_history"],
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    active: true,
  },
  {
    id: "admin3",
    username: "approver",
    email: "approver@example.com",
    name: "Event Approver",
    role: "admin",
    permissions: ["approve_events", "assign_events", "view_history"],
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    active: true,
  },
];

// Store the current logged-in admin
let currentAdmin: AdminUser | null = null;

/**
 * Login an admin
 */
export function loginAdmin(
  username: string,
  password: string
): AdminUser | null {
  // In a real app, you'd verify credentials against a database
  // For this mock, we'll just check if the email exists (username parameter is actually the email)
  const admin = mockAdmins.find((a) => a.email === username && a.active);

  if (!admin) {
    // Return null instead of throwing an error for easier handling
    return null;
  }

  // Update last login time
  admin.lastLogin = new Date();

  // Store the current admin
  currentAdmin = admin;

  // Store in localStorage for session persistence (if in browser environment)
  if (typeof window !== "undefined") {
    try {
      // Convert Date objects to ISO strings for storage
      const adminForStorage = {
        ...admin,
        lastLogin: admin.lastLogin.toISOString(),
        createdAt: admin.createdAt.toISOString(),
      };
      localStorage.setItem("currentAdmin", JSON.stringify(adminForStorage));
    } catch (error) {
      console.error("Error storing admin in localStorage:", error);
    }
  }

  return admin;
}

/**
 * Logout the current admin
 */
export function logoutAdmin(): void {
  currentAdmin = null;
  localStorage.removeItem("adminToken");
}

/**
 * Get the current logged-in admin
 */
export function getCurrentAdmin(): AdminUser | null {
  // If we already have the admin in memory, return it
  if (currentAdmin) {
    return currentAdmin;
  }

  // Try to get from localStorage if in browser environment
  if (typeof window !== "undefined") {
    try {
      const storedAdmin = localStorage.getItem("currentAdmin");
      if (storedAdmin) {
        const parsedAdmin = JSON.parse(storedAdmin);

        // Convert ISO strings back to Date objects
        if (parsedAdmin.lastLogin) {
          parsedAdmin.lastLogin = new Date(parsedAdmin.lastLogin);
        }
        if (parsedAdmin.createdAt) {
          parsedAdmin.createdAt = new Date(parsedAdmin.createdAt);
        }

        currentAdmin = parsedAdmin;
        return currentAdmin;
      }
    } catch (error) {
      console.error("Error retrieving admin from localStorage:", error);
    }
  }

  // For demo purposes, you might want to auto-login the first admin
  // Uncomment the next line if you want this behavior
  // return mockAdmins[0];

  return null;
}

/**
 * Get all admins (for super_admin use)
 */
export async function getAllAdmins(): Promise<AdminUser[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const admin = getCurrentAdmin();

  if (!admin) {
    throw new Error("You must be logged in to view admins");
  }

  if (
    admin.role !== "super_admin" &&
    !admin.permissions.includes("manage_admins")
  ) {
    throw new Error("You don't have permission to view all admins");
  }

  // Return a deep copy to prevent direct mutation
  return JSON.parse(JSON.stringify(mockAdmins));
}

/**
 * Get admin by ID
 */
export async function getAdminById(id: string): Promise<AdminUser | null> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));

  const admin = mockAdmins.find((a) => a.id === id);
  return admin ? JSON.parse(JSON.stringify(admin)) : null;
}

/**
 * Create a new admin (super_admin only)
 */
export async function createAdmin(
  adminData: Omit<AdminUser, "id" | "lastLogin" | "createdAt">
): Promise<AdminUser> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const admin = getCurrentAdmin();

  if (!admin) {
    throw new Error("You must be logged in to create an admin");
  }

  if (
    admin.role !== "super_admin" &&
    !admin.permissions.includes("manage_admins")
  ) {
    throw new Error("You don't have permission to create admins");
  }

  // Check if username or email already exists
  const usernameExists = mockAdmins.some(
    (a) => a.username === adminData.username
  );
  const emailExists = mockAdmins.some((a) => a.email === adminData.email);

  if (usernameExists) {
    throw new Error("Username already exists");
  }

  if (emailExists) {
    throw new Error("Email already exists");
  }

  // Create new admin
  const newAdmin: AdminUser = {
    ...adminData,
    id: Math.random().toString(36).substring(2, 9),
    lastLogin: new Date(),
    createdAt: new Date(),
  };

  mockAdmins.push(newAdmin);

  return newAdmin;
}

/**
 * Update an existing admin
 */
export async function updateAdmin(
  id: string,
  updates: Partial<AdminUser>
): Promise<AdminUser> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const admin = getCurrentAdmin();

  if (!admin) {
    throw new Error("You must be logged in to update an admin");
  }

  // Only super_admins can update other admins
  // Regular admins can only update their own profile
  if (
    admin.role !== "super_admin" &&
    !admin.permissions.includes("manage_admins") &&
    admin.id !== id
  ) {
    throw new Error("You don't have permission to update this admin");
  }

  const adminIndex = mockAdmins.findIndex((a) => a.id === id);
  if (adminIndex === -1) {
    throw new Error("Admin not found");
  }

  // Prevent changing username or email to one that already exists
  if (updates.username) {
    const usernameExists = mockAdmins.some(
      (a) => a.id !== id && a.username === updates.username
    );
    if (usernameExists) {
      throw new Error("Username already exists");
    }
  }

  if (updates.email) {
    const emailExists = mockAdmins.some(
      (a) => a.id !== id && a.email === updates.email
    );
    if (emailExists) {
      throw new Error("Email already exists");
    }
  }

  // Prevent non-super_admins from changing roles or permissions
  if (
    (updates.role || updates.permissions) &&
    admin.role !== "super_admin" &&
    !admin.permissions.includes("manage_admins")
  ) {
    throw new Error("You don't have permission to change roles or permissions");
  }

  // Update the admin
  mockAdmins[adminIndex] = {
    ...mockAdmins[adminIndex],
    ...updates,
  };

  // If we're updating the current admin, update that too
  if (currentAdmin && currentAdmin.id === id) {
    currentAdmin = mockAdmins[adminIndex];
  }

  return mockAdmins[adminIndex];
}

/**
 * Delete an admin (super_admin only)
 */
export async function deleteAdmin(id: string): Promise<void> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  const admin = getCurrentAdmin();

  if (!admin) {
    throw new Error("You must be logged in to delete an admin");
  }

  if (
    admin.role !== "super_admin" &&
    !admin.permissions.includes("manage_admins")
  ) {
    throw new Error("You don't have permission to delete admins");
  }

  // Prevent deleting yourself
  if (admin.id === id) {
    throw new Error("You cannot delete your own account");
  }

  const adminIndex = mockAdmins.findIndex((a) => a.id === id);
  if (adminIndex === -1) {
    throw new Error("Admin not found");
  }

  mockAdmins.splice(adminIndex, 1);
}

/**
 * Get admin activity statistics
 */
export async function getAdminStats(adminId?: string): Promise<any> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const admin = getCurrentAdmin();

  if (!admin) {
    throw new Error("You must be logged in to view admin stats");
  }

  // If adminId is provided, check permissions
  if (adminId && adminId !== admin.id) {
    if (
      admin.role !== "super_admin" &&
      !admin.permissions.includes("view_analytics")
    ) {
      throw new Error("You don't have permission to view other admin stats");
    }
  }

  // In a real app, you'd query a database for actual stats
  // Here we'll return mock data
  return {
    eventsCreated: Math.floor(Math.random() * 50),
    eventsApproved: Math.floor(Math.random() * 30),
    eventsRejected: Math.floor(Math.random() * 10),
    totalActions: Math.floor(Math.random() * 100),
    lastActive: new Date(),
  };
}
