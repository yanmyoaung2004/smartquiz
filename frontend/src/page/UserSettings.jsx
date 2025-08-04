import React, { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Bell,
  Palette,
  Shield,
  Smartphone,
  Monitor,
  LogOut,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  handleFailureToast,
  handleSuccessToast,
} from "@/components/ToastService";
import { useRef } from "react";
import { uploadPicture } from "@/service/ImageService";
import ImageUploadProgress from "@/components/ImageUploadProgress";
import { ModeToggle } from "@/components/ModeToggle";
import { useTranslation } from "react-i18next";
import TeacherApplicationForm from "./TeacherApplicationForm";

const UserSettings = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const profileImageInputRef = useRef(null);
  const [profileData, setProfileData] = useState({
    id: null,
    fullName: "",
    email: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [notifications, setNotifications] = useState({
    email: false,
    reminder: false,
  });

  const { i18n } = useTranslation();
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const [security, setSecurity] = useState({
    loginAlerts: true,
    sessionTimeout: "30",
  });
  const { t } = useTranslation();

  const switchLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setLanguage(lang);
  };

  const handleSavePreferences = async () => {
    try {
      const res = await axios.post(
        `/api/user/update-noti-settings`,
        {
          emailNoti: notifications.email,
          reminderId: notifications.reminder,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        handleSuccessToast("You have updated successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);
      const res = await uploadPicture(file, (progress) => {
        setUploadProgress(progress);
      });
      setIsUploading(false);

      if (res.status) {
        setProfileImage(res.imgData);
      } else {
        handleFailureToast(res.msg);
      }
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          `/api/user/get-detail?email=${currentUser?.email}`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        if (res.status === 200) {
          setProfileData({
            id: res.data.id,
            email: res.data.email,
            fullName: res.data.username,
          });
          setNotifications({
            email: res.data.emailNoti,
            reminder: res.data.reminderNoti,
          });
          setProfileImage(res.data.imageUrl);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        handleFailureToast(errorMessage);
      }
    };
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(
          `api/question-type/get-subjects-and-selected`,
          {
            headers: {
              Authorization: `Bearer ${currentUser?.token}`,
            },
          }
        );
        if (res.status === 200) {
          setLoading(false);
          setSubjects(res.data.subjectList);
          setSelectedSubject(res.data.selectedSubject);
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          "Something went wrong";
        handleFailureToast(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
    fetchUserData();
  }, [currentUser?.email, currentUser?.token]);

  const updateUserProfile = async () => {
    if (
      profileData.id === "" ||
      profileData.email === "" ||
      profileData.fullName === ""
    )
      return;
    try {
      const res = await axios.post(
        `/api/user/update`,
        {
          id: profileData.id,
          email: profileData.email,
          username: profileData.fullName,
          profileImage: profileImage,
          qusetionType: selectedSubject.id,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );

      if (res.status === 200) {
        handleSuccessToast("Profile has been updated successfully!");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      handleFailureToast(errorMessage);
    }
  };

  function getFirstWords(text, wordCount = 5) {
    return (
      text?.split(" ").slice(0, wordCount).join(" ") +
      (text?.split(" ").length > wordCount ? "..." : "")
    );
  }

  const updatePassword = async () => {
    if (!passwordData.currentPassword) {
      handleFailureToast("Current password is required!");

      return;
    }

    if (passwordData.newPassword.length < 6) {
      handleFailureToast("New password must be at least 6 characters!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      handleFailureToast("Passwords not not match!");
      return;
    }

    try {
      const res = await axios.post(
        "api/auth/change-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          email: currentUser?.email,
        },
        {
          headers: {
            Authorization: `Bearer ${currentUser?.token}`,
          },
        }
      );
      if (res.status === 200) {
        handleSuccessToast("Password has been changed!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      handleFailureToast(error.message || "Failed to update password");
    }
  };

  return (
    <Layout>
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-screen ">
          {/* Main Content */}
          {isUploading && (
            <ImageUploadProgress uploadProgress={uploadProgress} />
          )}

          {!loading && (
            <div className="max-w-7xl p-6">
              <div className="w-full">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100">
                    {t("settings.pageTitle")}
                  </h1>
                </div>

                {/* Settings Tabs */}
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="space-y-6"
                >
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="profile"
                      className="flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      {t("settings.profile")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="notifications"
                      className="flex items-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      {t("settings.notifications")}
                    </TabsTrigger>
                    <TabsTrigger
                      value="appearance"
                      className="flex items-center gap-2"
                    >
                      <Palette className="w-4 h-4" />
                      {t("settings.appearance")}
                    </TabsTrigger>
                    {/* <TabsTrigger
                      value="security"
                      className="flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      {t("settings.security")}
                    </TabsTrigger> */}
                  </TabsList>

                  {/* Profile Tab */}
                  <TabsContent value="profile" className="space-y-6">
                    <Card className={"dark:bg-slate-800"}>
                      <CardHeader>
                        <CardTitle>{t("settings.profileTitle")}</CardTitle>
                        <CardDescription>
                          {t("settings.profileDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3">
                          <div className="flex items-center gap-4">
                            {profileImage ? (
                              <Avatar
                                className="w-30 h-30 cursor-pointer"
                                onClick={() => {
                                  setProfileImage("");
                                  profileImageInputRef.current?.click();
                                }}
                              >
                                <AvatarImage src={profileImage} />
                                <AvatarFallback className="text-sm">
                                  {getFirstWords(profileData.fullName)}
                                </AvatarFallback>
                              </Avatar>
                            ) : (
                              <Avatar
                                className="w-30 h-30 cursor-pointer"
                                onClick={() => {
                                  setProfileImage("");
                                  profileImageInputRef.current?.click();
                                }}
                              >
                                <AvatarImage src="/placeholder.svg?height=80&width=80" />
                                <AvatarFallback className="text-sm">
                                  {getFirstWords(profileData.fullName)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <input
                              type="file"
                              ref={profileImageInputRef}
                              className="hidden"
                              accept="image/*"
                              onChange={handleProfileImageUpload}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="fullName">
                              {t("settings.fullName")}
                            </Label>
                            <Input
                              id="fullName"
                              value={profileData.fullName}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  fullName: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">{t("settings.email")}</Label>
                            <Input
                              id="email"
                              type="email"
                              value={profileData.email}
                              onChange={(e) =>
                                setProfileData({
                                  ...profileData,
                                  email: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>{t("settings.currentSubject")}</Label>
                            <Select
                              value={selectedSubject?.id?.toString() || ""}
                              onValueChange={(value) => {
                                const matched = subjects.find(
                                  (sub) => sub.id.toString() === value
                                );
                                setSelectedSubject(matched);
                              }}
                            >
                              <SelectTrigger id="type" className="col-span-3">
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectGroup>
                                  <SelectLabel>
                                    {t("settings.types")}
                                  </SelectLabel>
                                  {subjects?.length > 0 &&
                                    subjects.map((sub) => (
                                      <SelectItem
                                        key={sub.id}
                                        value={sub.id.toString()}
                                      >
                                        {sub.name}
                                      </SelectItem>
                                    ))}
                                </SelectGroup>
                              </SelectContent>
                            </Select>

                            <div className="text-sm text-gray-500 mt-1">
                              {t("settings.subjectDescription")}
                            </div>
                          </div>
                        </div>

                        <Button
                          className=" text-white hover:bg-purple-800 cursor-pointer bg-purple-600"
                          onClick={updateUserProfile}
                        >
                          {t("settings.saveChanges")}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className={"dark:bg-slate-800"}>
                      <CardHeader>
                        <CardTitle>{t("settings.changePassword")}</CardTitle>
                        <CardDescription>
                          {t("settings.changePasswordDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword">
                            {t("settings.currentPassword")}
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            placeholder={t("settings.enterCurrentPassword")}
                            value={passwordData.currentPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                currentPassword: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">
                            {t("settings.newPassword")}
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder={t("settings.enterNewPassword")}
                            value={passwordData.newPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                newPassword: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword">
                            {t("settings.confirmPassword")}
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            placeholder={t("settings.enterConfirmPassword")}
                            value={passwordData.confirmPassword}
                            onChange={(e) =>
                              setPasswordData({
                                ...passwordData,
                                confirmPassword: e.target.value,
                              })
                            }
                          />
                        </div>
                        <Button
                          className=" text-white hover:bg-purple-800 cursor-pointer bg-purple-600"
                          onClick={updatePassword}
                        >
                          {t("settings.updatePassword")}
                        </Button>
                      </CardContent>
                    </Card>
                    <TeacherApplicationForm />
                  </TabsContent>

                  {/* Notifications Tab */}
                  <TabsContent value="notifications" className="space-y-6">
                    <Card className={"dark:bg-slate-800"}>
                      <CardHeader>
                        <CardTitle>
                          {t("settings.notificationPreferences")}
                        </CardTitle>
                        <CardDescription>
                          {t("settings.notificationDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {t("settings.emailNotifications")}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {t("settings.emailNotificationsDescription")}
                            </p>
                          </div>
                          <Switch
                            className="data-[state=checked]:bg-purple-600 dark:bg-white dark:data-[state=checked]:bg-purple-600"
                            checked={notifications.email}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                email: checked,
                              })
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {t("settings.reminderNotifications")}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {t("settings.reminderNotificationsDescription")}
                            </p>
                          </div>
                          <Switch
                            className="data-[state=checked]:bg-purple-600 dark:bg-white dark:data-[state=checked]:bg-purple-600"
                            checked={notifications.reminder}
                            onCheckedChange={(checked) =>
                              setNotifications({
                                ...notifications,
                                reminder: checked,
                              })
                            }
                          />
                        </div>

                        <Button
                          className="text-white cursor-pointer bg-purple-600 hover:bg-purple-800"
                          onClick={handleSavePreferences}
                        >
                          Save Preferences
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Appearance Tab */}
                  <TabsContent value="appearance" className="space-y-6">
                    <Card className={"dark:bg-slate-800"}>
                      <CardHeader>
                        <CardTitle>
                          {t("settings.appearanceSettings")}
                        </CardTitle>
                        <CardDescription>
                          {t("settings.appearanceDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <ModeToggle />
                        {/* <div className="space-y-3">
                          <Label>{t("settings.theme")}</Label>
                          <div className="grid grid-cols-3 gap-3">
                            <div
                              className={`p-3 border rounded-lg cursor-pointer ${
                                appearance.theme === "light"
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                              onClick={() =>
                                setAppearance({ ...appearance, theme: "light" })
                              }
                            >
                              <div className="w-full h-8 bg-white border rounded mb-2"></div>
                              <span className="text-sm">
                                {t("settings.themeLight")}
                              </span>
                            </div>
                            <div
                              className={`p-3 border rounded-lg cursor-pointer ${
                                appearance.theme === "dark"
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                              onClick={() =>
                                setAppearance({ ...appearance, theme: "dark" })
                              }
                            >
                              <div className="w-full h-8 bg-gray-900 rounded mb-2"></div>
                              <span className="text-sm">
                                {t("settings.themeDark")}
                              </span>
                            </div>
                            <div
                              className={`p-3 border rounded-lg cursor-pointer ${
                                appearance.theme === "system"
                                  ? "border-blue-500 bg-blue-50"
                                  : "border-gray-200"
                              }`}
                              onClick={() =>
                                setAppearance({
                                  ...appearance,
                                  theme: "system",
                                })
                              }
                            >
                              <div className="w-full h-8 bg-gradient-to-r from-white to-gray-900 rounded mb-2"></div>
                              <span className="text-sm">
                                {t("settings.themeSystem")}
                              </span>
                            </div>
                          </div>
                        </div> */}

                        <div className="space-y-2">
                          <Label htmlFor="language">
                            {t("settings.language")}
                          </Label>
                          <Select
                            value={language}
                            onValueChange={(value) => {
                              switchLanguage(value);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="ja">Japanese</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Button className="text-white cursor-pointer bg-purple-600 hover:bg-purple-800">
                          Save Preferences
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  {/* Security Tab */}
                  <TabsContent value="security" className="space-y-6">
                    <Card className={"dark:bg-slate-800"}>
                      <CardHeader>
                        <CardTitle>{t("settings.securitySettings")}</CardTitle>
                        <CardDescription>
                          {t("settings.securityDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {t("settings.twoFactorAuth")}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {t("settings.twoFactorAuthDescription")}
                            </p>
                          </div>
                          <Button variant="outline">Setup</Button>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {t("settings.loginAlerts")}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {t("settings.loginAlertsDescription")}
                            </p>
                          </div>
                          <Switch
                            checked={security.loginAlerts}
                            onCheckedChange={(checked) =>
                              setSecurity({ ...security, loginAlerts: checked })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>{t("settings.sessionTimeout")}</Label>
                          <p className="text-sm text-gray-500">
                            {t("settings.sessionTimeoutDescription")}
                          </p>
                          <Select
                            value={security.sessionTimeout}
                            onValueChange={(value) =>
                              setSecurity({
                                ...security,
                                sessionTimeout: value,
                              })
                            }
                          >
                            <SelectTrigger className="w-48">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <Separator />

                        <div>
                          <h4 className="font-medium mb-4">
                            {t("settings.activeSessions")}
                          </h4>
                          <p className="text-sm text-gray-500 mb-4">
                            {t("settings.activeSessionsDescription")}
                          </p>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-gray-500" />
                                <div>
                                  <p className="font-medium">Current Browser</p>
                                  <p className="text-sm text-gray-500">
                                    Chrome on Windows • Active now
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm text-green-600 font-medium">
                                Current
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Smartphone className="w-5 h-5 text-gray-500" />
                                <div>
                                  <p className="font-medium">Mobile App</p>
                                  <p className="text-sm text-gray-500">
                                    iPhone 13 • Last active 2 hours ago
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                Log Out
                              </Button>
                            </div>

                            <div className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-gray-500" />
                                <div>
                                  <p className="font-medium">Safari</p>
                                  <p className="text-sm text-gray-500">
                                    Mac OS • Last active 3 days ago
                                  </p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">
                                {t("settings.logout")}
                              </Button>
                            </div>
                          </div>

                          <Button
                            variant="destructive"
                            className="mt-4 flex items-center gap-2 dark:bg-red-700"
                          >
                            <LogOut className="w-4 h-4" />
                            {t("settings.logoutAllDevices")}
                          </Button>
                        </div>

                        <Button className="text-white cursor-pointer bg-purple-600 hover:bg-purple-800">
                          {t("settings.saveSettings")}
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="border-red-200 dark:bg-slate-800">
                      <CardHeader>
                        <CardTitle className="text-red-600">
                          {t("settings.dangerZone")}
                        </CardTitle>
                        <CardDescription>
                          {t("settings.dangerZoneDescription")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">
                              {t("settings.deleteAccount")}
                            </h4>
                            <p className="text-sm text-gray-500">
                              {t("settings.deleteAccountDescription")}
                            </p>
                          </div>
                          <Button
                            variant="destructive"
                            className="mt-4 flex items-center gap-2 dark:bg-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                            {t("settings.deleteAccount")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default UserSettings;
