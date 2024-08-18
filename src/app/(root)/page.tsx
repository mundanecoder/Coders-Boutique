"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllUsers, deleteUserById, logout } from "../../../lib/auth";

interface User {
  id: string;
  name: string;
  email: string;
  roles: { id: string; role: string; userId: string }[];
}

interface Meta {
  page: number;
  limit: number;
  totalPages: number;
  totalUsers: number;
}

export default function Home() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (currentpage: number) => {
    setLoading(true);
    try {
      const response = await getAllUsers({
        page: currentpage,
        limit: 5,
      });

      if (response.status === 200) {
        const { users, currentUser, meta } = response.data;
        setUsers(users);
        setCurrentUser(currentUser);
        setMeta(meta);
      } else {
        console.error("Error fetching users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (currentUser?.roles.some((role) => role.role === "Admin")) {
      try {
        await deleteUserById(userId);
        setUsers(users.filter((user) => user.id !== userId));
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    } else {
      alert("You do not have permission to delete users.");
    }
  };

  const handleLogout = async () => {
    try {
      const response = await logout();

      if (response.status === 200) {
        localStorage.clear();
        router.push("/login");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (meta?.totalPages || 1)) {
      setCurrentPage(newPage);
    }
  };

  const isAdmin = currentUser?.roles.some((role) => role.role === "Admin");

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#6139D5]/80"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-100 mb-8 text-center">
          User Management
        </h1>

        {currentUser && (
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6 mb-8">
            <p className="text-lg font-medium text-gray-100">
              Logged in as:{" "}
              <span className="font-bold">{currentUser.name}</span> (
              {currentUser.email})
            </p>
            <p className="text-md text-gray-300">
              Role: {currentUser.roles[0]?.role}
            </p>
            <button
              className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#6139D5]/80 hover:bg-[#6139D5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6139D5] focus:ring-offset-gray-800"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        )}

        <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {user.roles[0]?.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      className={`text-red-400 hover:text-red-300 ${
                        !isAdmin && "opacity-50 cursor-not-allowed"
                      }`}
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={!isAdmin}
                      title={
                        !isAdmin
                          ? "You do not have permission to delete users"
                          : "Delete user"
                      }
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="bg-gray-800 shadow overflow-hidden sm:rounded-lg mt-8 p-6">
            <p className="text-sm text-gray-300">
              Showing page <span className="font-medium">{meta.page}</span> of{" "}
              <span className="font-medium">{meta.totalPages}</span>
            </p>
            <p className="text-sm text-gray-300 mt-1">
              Total Users:{" "}
              <span className="font-medium">{meta.totalUsers}</span>
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="px-4 py-2 border border-[#6139D5]/80 text-sm font-medium rounded-md text-white bg-[#6139D5]/80 hover:bg-[#6139D5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6139D5] focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(meta.page - 1)}
                disabled={meta.page === 1}
              >
                Previous
              </button>
              <button
                className="ml-3 px-4 py-2 border border-[#6139D5]/80 text-sm font-medium rounded-md text-white bg-[#6139D5]/80 hover:bg-[#6139D5] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6139D5] focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={() => handlePageChange(meta.page + 1)}
                disabled={meta.page === meta.totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
