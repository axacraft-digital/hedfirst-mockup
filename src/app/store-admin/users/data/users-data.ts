export interface StoreUser {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "admin" | "manager" | "support"
  status: "ACTIVE" | "INACTIVE" | "INVITED"
  createdAt: string
}

export const storeUsers: StoreUser[] = [
  {
    id: "usr_admin001",
    firstName: "Kelly",
    lastName: "Smith",
    email: "kelly@hedfirst.com",
    role: "admin",
    status: "ACTIVE",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "usr_admin002",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus@hedfirst.com",
    role: "admin",
    status: "ACTIVE",
    createdAt: "2024-02-20T14:30:00Z",
  },
  {
    id: "usr_mgr001",
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah@hedfirst.com",
    role: "manager",
    status: "ACTIVE",
    createdAt: "2024-03-10T09:15:00Z",
  },
  {
    id: "usr_mgr002",
    firstName: "David",
    lastName: "Chen",
    email: "david@hedfirst.com",
    role: "manager",
    status: "INACTIVE",
    createdAt: "2024-04-05T11:45:00Z",
  },
  {
    id: "usr_sup001",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily@hedfirst.com",
    role: "support",
    status: "ACTIVE",
    createdAt: "2024-05-12T16:20:00Z",
  },
  {
    id: "usr_sup002",
    firstName: "James",
    lastName: "Thompson",
    email: "james@hedfirst.com",
    role: "support",
    status: "INVITED",
    createdAt: "2024-11-28T08:00:00Z",
  },
]
