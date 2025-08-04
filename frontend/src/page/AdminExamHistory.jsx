import CustomPagination from "@/components/CustomPagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Search } from "lucide-react";
import React, { useState } from "react";

const AdminExamHistory = ({ users }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [pageUser, setPageUser] = useState(0);
  const pageSize = 5;

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.topicList.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedUser = filteredUsers.slice(
    pageUser * pageSize,
    (pageUser + 1) * pageSize
  );
  const totalPagesUsers = Math.ceil(users.length / pageSize);

  return (
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
                <TableHead>Topics</TableHead>
                <TableHead>Scores</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUser.map((user) => (
                <TableRow key={user.practiceId}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user.imageUrl || "/placeholder.svg"}
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
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.topicList}</TableCell>
                  <TableCell>{user.score}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "Excellent" ? "default" : "secondary"
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.date}</TableCell>
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
  );
};

export default AdminExamHistory;
