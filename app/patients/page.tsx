'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AuthenticatedLayout from '@/app/components/AuthenticatedLayout';

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function Index() {
  const [search, setSearch] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch('/api/patients')
        .then((res) => res.json())
        .then((data) => {
          setPatients(data);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <AuthenticatedLayout>
      <div className="py-12 bg-gray-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-cyan-600">
            <h2 className="text-2xl font-bold text-gray-800 m-auto pb-16 justify-self-center text-center">
              قائمة المرضى (Patient List)
            </h2>
            <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-2">
              {/* Search Input */}
              <div className="relative w-full md:w-1/3">
                <input
                  type="text"
                  placeholder="بحث بالاسم أو الرقم القومي..."
                  className="w-full border border-gray-300 rounded-lg focus:ring-cyan-500 shadow-sm px-4 py-2"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Link
                href="/patients/create"
                className="w-full md:w-auto px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-bold shadow-md hover:bg-cyan-700 transition flex items-center justify-center gap-2"
              >
                <span>+</span>
                إضافة مريض جديد
              </Link>
            </div>

            {loading ? (
              <div className="text-center">جاري تحميل البيانات...</div>
            ) : (
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-cyan-50 text-gray-700">
                    <th className="p-4 border-b">رقم التذكرة</th>
                    <th className="p-4 border-b text-right">الاسم بالكامل</th>
                    <th className="p-4 border-b">البريد</th>
                    <th className="p-4 border-b">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 border-b text-center font-mono">
                        #{p.id}
                      </td>
                      <td className="p-4 border-b font-bold">
                        {p.firstName} {p.lastName}
                      </td>
                      <td className="p-4 border-b">{p.email}</td>
                      <td className="p-4 border-b text-center">
                        <Link
                          href={`/patients/${p.id}`}
                          className="text-cyan-600 hover:text-cyan-800 font-bold underline"
                        >
                          عرض التفاصيل
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
