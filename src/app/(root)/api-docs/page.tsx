"use client";

import React, { useState } from "react";

type Endpoint = {
  name: string;
  endpoint: string;
  payload?: string;
  response: string;
};

const ApiDocs: React.FC = () => {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(null), 2000); // Reset copy success message after 2 seconds
  };

  const authEndpoints: Endpoint[] = [
    {
      name: "Register",
      endpoint: "POST /api/auth/register",
      payload: `{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}`,
      response: "AxiosResponse",
    },
    {
      name: "Login",
      endpoint: "POST /api/auth/login",
      payload: `{
  "email": "string",
  "password": "string"
}`,
      response: "AxiosResponse",
    },
    {
      name: "Refresh Token",
      endpoint: "POST /api/auth/refresh",
      payload: `{
  "accessToken": "string"
}`,
      response: "AxiosResponse",
    },
    {
      name: "Logout",
      endpoint: "POST /api/auth/logout",
      payload: `{}`,
      response: "AxiosResponse",
    },
    {
      name: "Forgot Password",
      endpoint: "POST /api/auth/forgot-password",
      payload: `{
  "email": "string"
}`,
      response: "AxiosResponse",
    },
    {
      name: "Reset Password",
      endpoint: "POST /api/auth/reset-password",
      payload: `{
  "token": "string",
  "newPassword": "string"
}`,
      response: "AxiosResponse",
    },
  ];

  const userManagementEndpoints: Endpoint[] = [
    {
      name: "Get User By ID",
      endpoint: "GET /api/protected/user/{id}",
      response: "AxiosResponse",
    },
    {
      name: "Delete User By ID",
      endpoint: "DELETE /api/protected/user/delete/{id}",
      response: "AxiosResponse",
    },
    {
      name: "Get All Users",
      endpoint: "GET /api/protected/user",
      payload: `{
  "page": "number (optional)",
  "limit": "number (optional)"
}`,
      response: "AxiosResponse",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-gray-200 p-6">
      <h1 className="text-4xl font-bold mb-8 text-white">API Documentation</h1>

      <section className="max-w-4xl w-full">
        <h2 className="text-3xl font-semibold text-purple-400 mb-6">
          Authentication
        </h2>

        {authEndpoints.map((endpoint, index) => (
          <div key={index} className="mb-8 relative">
            <h3 className="text-2xl font-semibold text-white">
              {endpoint.name}
            </h3>
            <p className="mt-2">
              <strong className="text-gray-300">Endpoint:</strong>{" "}
              <code className="bg-gray-800 text-yellow-300 p-1 rounded">
                {endpoint.endpoint}
              </code>
            </p>
            {endpoint.payload && (
              <p className="mt-2">
                <strong className="text-gray-300">Payload:</strong>
              </p>
            )}
            <div className="relative">
              <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
                {endpoint.payload || "{}"}
              </pre>
              <button
                className="absolute top-2 right-2 bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700"
                onClick={() => handleCopy(endpoint.payload || "{}")}
              >
                Copy
              </button>
            </div>
            {copySuccess && (
              <p className="text-green-400 mt-2">{copySuccess}</p>
            )}
            <p className="mt-2">
              <strong className="text-gray-300">Response:</strong>{" "}
              {endpoint.response}
            </p>
          </div>
        ))}

        <h2 className="text-3xl font-semibold text-purple-400 mb-6">
          User Management
        </h2>

        {userManagementEndpoints.map((endpoint, index) => (
          <div key={index} className="mb-8 relative">
            <h3 className="text-2xl font-semibold text-white">
              {endpoint.name}
            </h3>
            <p className="mt-2">
              <strong className="text-gray-300">Endpoint:</strong>{" "}
              <code className="bg-gray-800 text-yellow-300 p-1 rounded">
                {endpoint.endpoint}
              </code>
            </p>
            {endpoint.payload && (
              <p className="mt-2">
                <strong className="text-gray-300">Query Parameters:</strong>
              </p>
            )}
            <div className="relative">
              <pre className="bg-gray-800 p-4 rounded overflow-x-auto">
                {endpoint.payload || "{}"}
              </pre>
              <button
                className="absolute top-2 right-2 bg-purple-600 text-white py-1 px-2 rounded hover:bg-purple-700"
                onClick={() => handleCopy(endpoint.payload || "{}")}
              >
                Copy
              </button>
            </div>
            {copySuccess && (
              <p className="text-green-400 mt-2">{copySuccess}</p>
            )}
            <p className="mt-2">
              <strong className="text-gray-300">Response:</strong>{" "}
              {endpoint.response}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ApiDocs;
