"use client";

import {
  Users,
  GraduationCap,
  TrendingUp,
  Globe,
  Smartphone,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

// Sample data
const educationData = [
  { level: "High School", users: 2840, fill: "hsl(var(--chart-1))" },
  { level: "Bachelor's", users: 4250, fill: "hsl(var(--chart-2))" },
  { level: "Master's", users: 1890, fill: "hsl(var(--chart-3))" },
  { level: "PhD", users: 420, fill: "hsl(var(--chart-4))" },
  { level: "Other", users: 680, fill: "hsl(var(--chart-5))" },
];

const ageData = [
  { range: "18-24", users: 3200 },
  { range: "25-34", users: 4800 },
  { range: "35-44", users: 2100 },
  { range: "45-54", users: 890 },
  { range: "55+", users: 410 },
];

const registrationTrends = [
  { month: "Jan", users: 1200 },
  { month: "Feb", users: 1450 },
  { month: "Mar", users: 1680 },
  { month: "Apr", users: 1320 },
  { month: "May", users: 1890 },
  { month: "Jun", users: 2100 },
  { month: "Jul", users: 2340 },
  { month: "Aug", users: 2180 },
  { month: "Sep", users: 2450 },
  { month: "Oct", users: 2680 },
  { month: "Nov", users: 2890 },
  { month: "Dec", users: 3100 },
];

const activityData = [
  { day: "Mon", active: 8400, total: 12000 },
  { day: "Tue", active: 9200, total: 12000 },
  { day: "Wed", active: 8800, total: 12000 },
  { day: "Thu", active: 9600, total: 12000 },
  { day: "Fri", active: 10200, total: 12000 },
  { day: "Sat", active: 7800, total: 12000 },
  { day: "Sun", active: 7200, total: 12000 },
];

const locationData = [
  { country: "United States", users: 4200 },
  { country: "United Kingdom", users: 1800 },
  { country: "Canada", users: 1200 },
  { country: "Germany", users: 980 },
  { country: "Australia", users: 720 },
  { country: "Others", users: 1180 },
];

const userData = [
  {
    id: "USR001",
    name: "Alice Johnson",
    email: "alice.johnson@email.com",
    education: "Bachelor's",
    age: 28,
    location: "New York, US",
    joinDate: "2024-01-15",
    status: "Active",
    lastActive: "2 hours ago",
  },
  {
    id: "USR002",
    name: "Bob Smith",
    email: "bob.smith@email.com",
    education: "Master's",
    age: 34,
    location: "London, UK",
    joinDate: "2024-02-20",
    status: "Active",
    lastActive: "1 day ago",
  },
  {
    id: "USR003",
    name: "Carol Davis",
    email: "carol.davis@email.com",
    education: "High School",
    age: 22,
    location: "Toronto, CA",
    joinDate: "2024-03-10",
    status: "Inactive",
    lastActive: "1 week ago",
  },
  {
    id: "USR004",
    name: "David Wilson",
    email: "david.wilson@email.com",
    education: "PhD",
    age: 41,
    location: "Berlin, DE",
    joinDate: "2024-01-05",
    status: "Active",
    lastActive: "30 minutes ago",
  },
  {
    id: "USR005",
    name: "Eva Brown",
    email: "eva.brown@email.com",
    education: "Bachelor's",
    age: 26,
    location: "Sydney, AU",
    joinDate: "2024-04-12",
    status: "Active",
    lastActive: "5 hours ago",
  },
  {
    id: "USR006",
    name: "Frank Miller",
    email: "frank.miller@email.com",
    education: "Master's",
    age: 38,
    location: "Chicago, US",
    joinDate: "2024-02-28",
    status: "Active",
    lastActive: "1 hour ago",
  },
  {
    id: "USR007",
    name: "Grace Lee",
    email: "grace.lee@email.com",
    education: "High School",
    age: 19,
    location: "Vancouver, CA",
    joinDate: "2024-05-18",
    status: "Active",
    lastActive: "3 hours ago",
  },
  {
    id: "USR008",
    name: "Henry Taylor",
    email: "henry.taylor@email.com",
    education: "Bachelor's",
    age: 31,
    location: "Manchester, UK",
    joinDate: "2024-03-22",
    status: "Inactive",
    lastActive: "2 weeks ago",
  },
];

export default function Component() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">User Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Comprehensive insights into your user base and engagement metrics
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10,080</div>
              <p className="text-xs text-muted-foreground">
                +12.5% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8,420</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Countries</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">+3 new this month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mobile Users
              </CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                +2.1% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Education Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Educational Background
              </CardTitle>
              <CardDescription>
                Distribution of users by education level
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                  },
                }}
                className="h-[300px]"
              >
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={educationData}
                    dataKey="users"
                    nameKey="level"
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
              <CardDescription>Users grouped by age ranges</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: "Users",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <BarChart data={ageData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="users" fill="var(--color-users)" radius={4} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Registration Trends */}
          <Card>
            <CardHeader>
              <CardTitle>Registration Trends</CardTitle>
              <CardDescription>
                New user registrations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  users: {
                    label: "New Users",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <LineChart data={registrationTrends}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line
                    dataKey="users"
                    type="monotone"
                    stroke="var(--color-users)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* User Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
              <CardDescription>Active vs total users by day</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  active: {
                    label: "Active Users",
                    color: "hsl(var(--chart-3))",
                  },
                  total: {
                    label: "Total Users",
                    color: "hsl(var(--chart-4))",
                  },
                }}
                className="h-[300px]"
              >
                <AreaChart data={activityData}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    dataKey="total"
                    type="monotone"
                    fill="var(--color-total)"
                    fillOpacity={0.4}
                    stroke="var(--color-total)"
                  />
                  <Area
                    dataKey="active"
                    type="monotone"
                    fill="var(--color-active)"
                    fillOpacity={0.8}
                    stroke="var(--color-active)"
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        {/* Geographic Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Geographic Distribution</CardTitle>
            <CardDescription>Top countries by user count</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                users: {
                  label: "Users",
                  color: "hsl(var(--chart-5))",
                },
              }}
              className="h-[200px]"
            >
              <BarChart data={locationData} layout="horizontal">
                <CartesianGrid horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="country" type="category" width={100} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="users" fill="var(--color-users)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* User Table */}
        <Card>
          <CardHeader>
            <CardTitle>User Directory</CardTitle>
            <CardDescription>Complete list of registered users</CardDescription>
            <div className="flex gap-4 mt-4">
              <Input placeholder="Search users..." className="max-w-sm" />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Users</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by education" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="bachelors">Bachelor's</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="phd">PhD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Education</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={`/placeholder.svg?height=32&width=32`}
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
                    <TableCell>{user.education}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell>{user.location}</TableCell>
                    <TableCell>{user.joinDate}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Active" ? "default" : "secondary"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {user.lastActive}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
