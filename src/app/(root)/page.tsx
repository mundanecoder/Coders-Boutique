"use client";
import { useState } from "react";
import { logout } from "../../../lib/auth";

import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Alice Johnson", email: "alice@example.com" },
  ]);

  const deleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId));
  };

  const changePassword = (userId: string) => {
    alert(`Change password for user ID: ${userId}`);
  };

  async function handleLogout() {
    try {
      console.log("hitt");
      const response = await logout();

      console.log(response);

      router.push("/login");
    } catch (error) {}
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-3xl font-bold mb-4">User Management</h1>

      <button
        className="p-2 border rounded-lg bg-gray-500"
        onClick={() => handleLogout()}
      >
        logout
      </button>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={() => changePassword(user.id)}
                >
                  Change Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
