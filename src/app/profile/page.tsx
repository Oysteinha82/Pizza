"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, updateUser, logout, deleteAccount } = useAuth();
  const { language } = useLanguage();
  const { t } = useTranslation(language);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (showPasswordFields) {
      if (formData.newPassword !== formData.confirmPassword) {
        // Handle password mismatch error
        return;
      }
    }
    await updateUser(formData);
    setIsEditing(false);
    setShowPasswordFields(false);
  };

  const handleDeleteAccount = async () => {
    await deleteAccount();
    router.push("/");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
          <button
            onClick={() => {
              setIsEditing(!isEditing);
              setShowPasswordFields(false);
            }}
            className="text-red-600 hover:text-red-700 font-medium"
          >
            {isEditing ? t("profile.cancel") : t("profile.edit")}
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("profile.firstName")}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={formData.firstName}
                      onChange={(e) =>
                        setFormData({ ...formData, firstName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("profile.lastName")}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("profile.email")}
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("profile.phone")}
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t("profile.address")}
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                </div>

                <div className="pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    className="text-red-600 hover:text-red-700 text-sm font-medium"
                  >
                    {showPasswordFields
                      ? t("profile.cancelPasswordChange")
                      : t("profile.changePassword")}
                  </button>

                  {showPasswordFields && (
                    <div className="space-y-4 mt-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("profile.currentPassword")}
                        </label>
                        <input
                          type="password"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.currentPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              currentPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("profile.newPassword")}
                        </label>
                        <input
                          type="password"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.newPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              newPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          {t("profile.confirmPassword")}
                        </label>
                        <input
                          type="password"
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-red-600 text-white py-3 rounded-xl font-medium hover:bg-red-700 
                            transition-colors flex items-center justify-center gap-2"
                >
                  {t("profile.save")}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("profile.name")}
                  </h3>
                  <p className="mt-1 text-base">
                    {user ? `${user.firstName} ${user.lastName}` : ""}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("profile.email")}
                  </h3>
                  <p className="mt-1 text-base">{user?.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("profile.phone")}
                  </h3>
                  <p className="mt-1 text-base">{user?.phone}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("profile.address")}
                  </h3>
                  <p className="mt-1 text-base">{user?.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4">{t("profile.quickLinks")}</h2>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <Link
              href="/profile/orders"
              className="block p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {t("profile.myOrders")}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {t("profile.viewOrderHistory")}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-xl hover:bg-red-200 transition-colors"
          >
            {t("profile.deleteAccount")}
          </button>
        </div>

        {showDeleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">
                {t("profile.deleteAccountConfirmTitle")}
              </h3>
              <p className="text-gray-500 mb-6">
                {t("profile.deleteAccountConfirmMessage")}
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t("profile.cancel")}
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-colors"
                >
                  {t("profile.confirmDelete")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
