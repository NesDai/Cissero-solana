"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

export function SettingsTab() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="bg-black bg-opacity-50 mb-4">
          <TabsTrigger
            value="account"
            className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Account
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="appearance"
            className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Appearance
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="text-white data-[state=active]:bg-green-500 data-[state=active]:text-black"
          >
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card className="bg-black bg-opacity-50 border-green-500 text-white">
            <CardHeader>
              <CardTitle className="text-[20px] text-white">
                Account Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage your account information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    defaultValue="AdminUser"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="admin@example.com"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-white">
                  Current Password
                </Label>
                <Input
                  id="current-password"
                  type="password"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-white">
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-white">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-500 text-black hover:bg-green-400">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-black bg-opacity-50 border-green-500 text-white">
            <CardHeader>
              <CardTitle className="text-[20px] text-white">
                Notification Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Enable Notifications</p>
                  <p className="text-gray-400 text-sm">
                    Receive notifications for important events
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      notificationsEnabled ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {notificationsEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Sound Alerts</p>
                  <p className="text-gray-400 text-sm">
                    Play sound when new notifications arrive
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      soundEnabled && notificationsEnabled
                        ? "text-green-400"
                        : "text-gray-400"
                    }`}
                  >
                    {soundEnabled && notificationsEnabled
                      ? "Enabled"
                      : "Disabled"}
                  </span>
                  <Switch
                    checked={soundEnabled}
                    onCheckedChange={setSoundEnabled}
                    disabled={!notificationsEnabled}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Auto-assign Events</p>
                  <p className="text-gray-400 text-sm">
                    Automatically assign you to events that need admins
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      autoAssignEnabled ? "text-green-400" : "text-gray-400"
                    }`}
                  >
                    {autoAssignEnabled ? "Enabled" : "Disabled"}
                  </span>
                  <Switch
                    checked={autoAssignEnabled}
                    onCheckedChange={setAutoAssignEnabled}
                    className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notification-email" className="text-white">
                  Notification Email
                </Label>
                <Input
                  id="notification-email"
                  type="email"
                  defaultValue="admin@example.com"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="flex justify-end">
                <Button className="bg-green-500 text-black hover:bg-green-400">
                  Save Preferences
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance">
          <Card className="bg-black bg-opacity-50 border-green-500 text-white">
            <CardHeader>
              <CardTitle className="text-[20px] text-white">
                Appearance Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Customize how the admin dashboard looks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-4">
                Appearance settings would go here
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced">
          <Card className="bg-black bg-opacity-50 border-green-500 text-white">
            <CardHeader>
              <CardTitle className="text-[20px] text-white">
                Advanced Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Configure advanced admin options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-white mb-4">Advanced settings would go here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
