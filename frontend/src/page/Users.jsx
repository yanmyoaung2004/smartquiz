"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import axios from "axios";
import { useSelector } from "react-redux";
import CustomPagination from "@/components/CustomPagination";
import RoleRequestDetailModal from "@/components/RoleRequestDetailModal";
import {
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@radix-ui/react-dropdown-menu";
import { handleSuccessToast } from "@/components/ToastService";
import AdminPracticeHistory from "./AdminPracticeHistory";
import AdminExamHistory from "./AdminExamHistory";

export default function User() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requestSearchTerm, setRequestSearchTerm] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [roleRequests, setRoleRequests] = useState([]);
  const [pageUser, setPageUser] = useState(0);
  const [pageRoleRequest, setPageRoleRequest] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [practiceHistory, setPracticeHistory] = useState([]);
  const [examHistory, setExamHistory] = useState([]);
  const pageSize = 5;

  const handleOpenModal = (request) => {
    setSelectedRequest(request);
    setModalOpen(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser?.token) return;

      const config = {
        headers: { Authorization: `Bearer ${currentUser.token}` },
      };

      try {
        const [usersRes, practiceRes, examRes, roleReqRes] = await Promise.all([
          axios.get("/api/user/get-users", config),
          axios.get("/api/user/get-practice", config),
          axios.get("/api/user/get-exam", config),
          axios.get("/api/user/role-requests/teacher", config),
        ]);

        if (usersRes.status === 200) setUsers(usersRes.data);
        if (practiceRes.status === 200) setPracticeHistory(practiceRes.data);
        if (examRes.status === 200) setExamHistory(examRes.data);
        if (roleReqRes.status === 200) setRoleRequests(roleReqRes.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUsers();
  }, [currentUser?.token]);

  const filteredUsers = users?.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUser = filteredUsers.slice(
    pageUser * pageSize,
    (pageUser + 1) * pageSize
  );
  const totalPagesUsers = Math.ceil(users.length / pageSize);

  const filteredRequests = roleRequests.filter(
    (request) =>
      request.name.toLowerCase().includes(requestSearchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(requestSearchTerm.toLowerCase())
  );

  const paginatedRoleRequest = filteredRequests.slice(
    pageRoleRequest * pageSize,
    (pageRoleRequest + 1) * pageSize
  );
  const totalPagesRoleRequest = Math.ceil(filteredRequests.length / pageSize);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Active":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Active
          </Badge>
        );
      case "Deactive":
        return (
          <Badge variant="destructive" className="text-slate-100">
            Inactive
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case "Admin":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            Admin
          </Badge>
        );
      case "Teacher":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Teacher
          </Badge>
        );
      case "User":
        return <Badge variant="outline">User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getRequestStatusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "APPROVED":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Approved
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge variant="destructive" className="text-slate-300">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const toggleUserActive = async (userId) => {
    try {
      const res = await axios.put(
        `/api/user/toggleUserActive?userId=${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.id === userId
              ? {
                  ...user,
                  status: user.status === "Active" ? "Deactive" : "Active",
                }
              : user
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleStatusChange = (requestId, newStatus) => {
    setRoleRequests((prevRequests) =>
      prevRequests.map((req) =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const changeUserRole = async (id, action) => {
    try {
      const res = await axios.get(
        `/api/user/role-requests-user?userId=${id}&roleName=${action}`,
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        setUsers((prev) =>
          prev.map((user) =>
            user.id === id ? { ...user, role: action } : user
          )
        );
        handleSuccessToast("User roles updated successfully!");
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center mb-8 justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              User & Exam Management
            </h1>
            <p className="text-muted-foreground">
              Manage users, role upgrade requests, and view practice and public
              exam results
            </p>
          </div>
        </div>

        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="requests">Role Requests</TabsTrigger>
            <TabsTrigger value="practice">Practice</TabsTrigger>
            <TabsTrigger value="public-exam">Public Exam</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-4">
            <Card className={"dark:bg-slate-800"}>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all users in the system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedUser.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={user.avatar || "/placeholder.svg"}
                                  alt={user.name}
                                />
                                <AvatarFallback>
                                  {user.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{getRoleBadge(user.role)}</TableCell>
                          <TableCell>{getStatusBadge(user.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                <DropdownMenuSub>
                                  <DropdownMenuSubTrigger className="flex items-center text-sm p-2">
                                    <Shield className="mr-4 h-4 w-4" />
                                    Change Role
                                  </DropdownMenuSubTrigger>
                                  <DropdownMenuSubContent className="bg-black p-1">
                                    <DropdownMenuItem
                                      onClick={() =>
                                        changeUserRole(user.id, "ROLE_ADMIN")
                                      }
                                    >
                                      Admin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        changeUserRole(user.id, "ROLE_TEACHER")
                                      }
                                    >
                                      Teacher
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() =>
                                        changeUserRole(user.id, "ROLE_STUDENT")
                                      }
                                    >
                                      Student
                                    </DropdownMenuItem>
                                  </DropdownMenuSubContent>
                                </DropdownMenuSub>

                                <DropdownMenuSeparator />

                                {user.status === "Active" ? (
                                  <DropdownMenuItem
                                    className="text-red-600"
                                    onClick={() => toggleUserActive(user.id)}
                                  >
                                    <UserX className="mr-2 h-4 w-4" />
                                    Suspend User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    className="text-green-600"
                                    onClick={() => toggleUserActive(user.id)}
                                  >
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Activate User
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end items-center gap-2">
                    <CustomPagination
                      pageNumber={pageUser}
                      totalPages={totalPagesUsers}
                      onPageChange={setPageUser}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <Card className={"dark:bg-slate-800"}>
              <CardHeader>
                <CardTitle>Role Upgrade Requests</CardTitle>
                <CardDescription>
                  Review and manage user role upgrade requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search requests..."
                      value={requestSearchTerm}
                      onChange={(e) => setRequestSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Requested Role</TableHead>
                        <TableHead>Request Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {paginatedRoleRequest.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={request.avatar || "/placeholder.svg"}
                                  alt={request.name}
                                />
                                <AvatarFallback>
                                  {request.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {request.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {request.email}
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell>
                            {getRoleBadge(request.requestedRole)}
                          </TableCell>
                          <TableCell>{request.requestDate}</TableCell>
                          <TableCell>
                            {getRequestStatusBadge(request.status)}
                          </TableCell>
                          <TableCell className="text-right">
                            {request.status === "Pending" ? (
                              <div className="flex items-center space-x-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="mr-1 h-3 w-3" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive">
                                  <XCircle className="mr-1 h-3 w-3" />
                                  Reject
                                </Button>
                              </div>
                            ) : (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuLabel>Actions</DropdownMenuLabel>

                                  <DropdownMenuItem
                                    onClick={() => handleOpenModal(request)}
                                  >
                                    View Details
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <div className="flex justify-end items-center gap-2">
                    <CustomPagination
                      pageNumber={pageRoleRequest}
                      totalPages={totalPagesRoleRequest}
                      onPageChange={setPageRoleRequest}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="practice" className="space-y-4">
            <AdminPracticeHistory users={practiceHistory} />
          </TabsContent>
          <TabsContent value="public-exam" className="space-y-4">
            <AdminExamHistory users={examHistory} />
          </TabsContent>
        </Tabs>
      </div>
      <RoleRequestDetailModal
        open={modalOpen}
        request={selectedRequest}
        onClose={() => setModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </Layout>
  );
}
