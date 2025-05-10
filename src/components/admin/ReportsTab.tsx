"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ReportsTab() {
  const [reports, setReports] = useState([
    {
      id: "r101",
      time: "10:23",
      date: "Today",
      user: "UserXYZ",
      type: "Technical",
      message: "Stream lagging during tournament",
      status: "New",
    },
    {
      id: "r102",
      time: "10:45",
      date: "Today",
      user: "Streamer1",
      type: "Game",
      message: "Score not updating correctly",
      status: "In Progress",
    },
    {
      id: "r103",
      time: "11:02",
      date: "Today",
      user: "Viewer123",
      type: "Betting",
      message: "Can't place bet on current match",
      status: "New",
    },
    {
      id: "r104",
      time: "09:15",
      date: "Yesterday",
      user: "Admin2",
      type: "Technical",
      message: "Dashboard loading slowly",
      status: "Resolved",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card className="bg-black bg-opacity-50 border-green-500 text-white">
        <CardHeader>
          <CardTitle className="text-[20px] text-white">
            Reports Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-red-900 bg-opacity-30 border-red-700">
              <CardContent className="p-4">
                <p className="text-gray-300 text-sm">New Reports</p>
                <p className="text-2xl font-bold text-white">2</p>
              </CardContent>
            </Card>
            <Card className="bg-yellow-900 bg-opacity-30 border-yellow-700">
              <CardContent className="p-4">
                <p className="text-gray-300 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-white">1</p>
              </CardContent>
            </Card>
            <Card className="bg-green-900 bg-opacity-30 border-green-700">
              <CardContent className="p-4">
                <p className="text-gray-300 text-sm">Resolved Today</p>
                <p className="text-2xl font-bold text-white">3</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="report-search" className="text-white">
                Search Reports
              </Label>
              <Input
                id="report-search"
                placeholder="Search by message or user..."
                className="bg-gray-800 border-gray-700 text-white mt-1"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="md:w-64">
              <Label htmlFor="status-filter" className="text-white">
                Filter by Status
              </Label>
              <div className="flex gap-2 mt-1">
                <Badge
                  className={`cursor-pointer ${
                    statusFilter === "All"
                      ? "bg-green-500 text-black"
                      : "bg-gray-700 text-white"
                  }`}
                  onClick={() => setStatusFilter("All")}
                >
                  All
                </Badge>
                <Badge
                  className={`cursor-pointer ${
                    statusFilter === "New"
                      ? "bg-red-500"
                      : "bg-gray-700 text-white"
                  }`}
                  onClick={() => setStatusFilter("New")}
                >
                  New
                </Badge>
                <Badge
                  className={`cursor-pointer ${
                    statusFilter === "In Progress"
                      ? "bg-yellow-500 text-black"
                      : "bg-gray-700 text-white"
                  }`}
                  onClick={() => setStatusFilter("In Progress")}
                >
                  In Progress
                </Badge>
                <Badge
                  className={`cursor-pointer ${
                    statusFilter === "Resolved"
                      ? "bg-green-500 text-black"
                      : "bg-gray-700 text-white"
                  }`}
                  onClick={() => setStatusFilter("Resolved")}
                >
                  Resolved
                </Badge>
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-white">Time</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">User</TableHead>
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Report</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-700">
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="text-white">{report.time}</TableCell>
                  <TableCell className="text-white">{report.date}</TableCell>
                  <TableCell className="text-white">{report.user}</TableCell>
                  <TableCell className="text-white">
                    <Badge
                      className={
                        report.type === "Technical"
                          ? "bg-blue-500"
                          : report.type === "Game"
                          ? "bg-purple-500"
                          : "bg-orange-500"
                      }
                    >
                      {report.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white">{report.message}</TableCell>
                  <TableCell className="text-white">
                    <Badge
                      className={
                        report.status === "New"
                          ? "bg-red-500"
                          : report.status === "In Progress"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {report.status !== "Resolved" ? (
                      <Button
                        size="sm"
                        className={
                          report.status === "New"
                            ? "bg-blue-600 text-white hover:bg-blue-500"
                            : "bg-yellow-600 text-white hover:bg-yellow-500"
                        }
                      >
                        {report.status === "New" ? "Take Action" : "Resolve"}
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700 text-white hover:bg-gray-600"
                      >
                        Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
