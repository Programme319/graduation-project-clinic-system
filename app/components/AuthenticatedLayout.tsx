'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export default function AuthenticatedLayout({
  children,
  header,
}: AuthenticatedLayoutProps) {
  const [showingNavigationDropdown, setShowingNavigationDropdown] =
    useState(false);
  const [user] = useState({ name: 'Demo User', email: 'demo@clinic.com' });

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex">
              <div className="flex shrink-0 items-center">
                <Link href="/" className="text-xl font-bold text-cyan-600">
                  Clinic System
                </Link>
              </div>

              <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Dashboard
                </Link>
                <Link
                  href="/patients"
                  className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Patients
                </Link>
              </div>
            </div>

            <div className="hidden sm:ms-6 sm:flex sm:items-center">
              <div className="relative ms-3">
                <button
                  className="inline-flex items-center rounded-md border border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                  onClick={() =>
                    setShowingNavigationDropdown(
                      (previousState) => !previousState
                    )
                  }
                >
                  {user.name}

                  <svg
                    className="-me-0.5 ms-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {showingNavigationDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </Link>
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => alert('Logout')}
                    >
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="-me-2 flex items-center sm:hidden">
              <button
                onClick={() =>
                  setShowingNavigationDropdown(
                    (previousState) => !previousState
                  )
                }
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
              >
                <svg
                  className="h-6 w-6"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    className={
                      !showingNavigationDropdown ? 'inline-flex' : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                  <path
                    className={
                      showingNavigationDropdown ? 'inline-flex' : 'hidden'
                    }
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {showingNavigationDropdown && (
          <div className="space-y-1 pb-3 pt-2 sm:hidden">
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Dashboard
            </Link>
            <Link
              href="/patients"
              className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
            >
              Patients
            </Link>

            <div className="border-t border-gray-200 pb-1 pt-4">
              <div className="px-4">
                <div className="text-base font-medium text-gray-800">
                  {user.name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {user.email}
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <Link
                  href="/profile"
                  className="block px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <button
                  className="block w-full text-left px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                  onClick={() => alert('Logout')}
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {header && (
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {header}
          </div>
        </header>
      )}

      <main>{children}</main>
    </div>
  );
}
