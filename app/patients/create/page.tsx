'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthenticatedLayout from '@/app/components/AuthenticatedLayout';

interface TestRow {
  testCode: string;
  testName: string;
  testResult: string;
}

interface MedicationRow {
  medCode: string;
  medName: string;
  dosage: string;
}

export default function CreatePatient() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    emergencyContact: '',
    emergencyPhone: '',
  });

  const [tests, setTests] = useState<TestRow[]>([
    { testCode: '', testName: '', testResult: '' },
  ]);

  const [medications, setMedications] = useState<MedicationRow[]>([
    { medCode: '', medName: '', dosage: '' },
  ]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTestChange = (
    index: number,
    field: keyof TestRow,
    value: string
  ) => {
    const newTests = [...tests];
    newTests[index][field] = value;
    setTests(newTests);
  };

  const handleMedicationChange = (
    index: number,
    field: keyof MedicationRow,
    value: string
  ) => {
    const newMeds = [...medications];
    newMeds[index][field] = value;
    setMedications(newMeds);
  };

  const addTest = () => {
    setTests([...tests, { testCode: '', testName: '', testResult: '' }]);
  };

  const addMedication = () => {
    setMedications([...medications, { medCode: '', medName: '', dosage: '' }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': 'demo-user',
        },
        body: JSON.stringify({
          ...formData,
          tests,
          medications,
        }),
      });

      if (response.ok) {
        alert('تم إضافة المريض بنجاح');
        window.location.href = '/patients';
      }
    } catch (error) {
      alert('حدث خطأ أثناء إضافة المريض');
    }
  };

  return (
    <AuthenticatedLayout>
      <div className="py-12 bg-gray-100 min-h-screen">
        <form
          onSubmit={handleSubmit}
          className="max-w-6xl mx-auto space-y-8 p-8 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {/* Page Header */}
          <div className="relative text-center border-b-2 border-cyan-600 pb-6 mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              البيانات الأساسية
            </h2>
          </div>

          {/* Section 1: Basic Info */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="col-span-1 md:col-span-2">
                <label className="block text-lg font-medium text-gray-700">
                  اسم المريض (Patient Name)
                </label>
                <input
                  type="text"
                  name="firstName"
                  className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md focus:ring-cyan-500 focus:border-cyan-500"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  الرقم القومي (National ID)
                </label>
                <input
                  type="text"
                  name="email"
                  className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label className="block text-lg font-medium text-gray-700">
                  العمر (Age)
                </label>
                <input
                  type="text"
                  name="phone"
                  className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="mt-6">
              <label className="block text-lg font-medium text-gray-700">
                شكوى المريض (Patient Complaint)
              </label>
              <textarea
                name="emergencyContact"
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md h-24"
                value={formData.emergencyContact}
                onChange={handleInputChange}
              ></textarea>
            </div>
          </div>

          {/* Section 2: Medical Diagnosis */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <label className="block text-xl font-bold text-cyan-600 mb-3 text-center">
              التشخيص الطبي (Medical Diagnosis)
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-400 rounded-md h-32 text-lg"
              placeholder="اكتب التشخيص هنا..."
            ></textarea>
          </div>

          {/* Section 3: Investigations */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              الفحوصات والتحاليل (Investigations)
            </h3>
            <div className="border border-gray-400 rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-cyan-100">
                    <th className="p-3 border-b border-gray-400 font-semibold text-gray-800">
                      كود الفحص (Test Code)
                    </th>
                    <th className="p-3 border-b border-gray-400 font-semibold text-gray-800">
                      اسم الفحص (Test Name)
                    </th>
                    <th className="p-3 border-b border-gray-400 font-semibold text-gray-800">
                      النتيجة (Result)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tests.map((test, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="border-r border-gray-300">
                        <input
                          type="text"
                          className="w-full px-3 py-1 bg-transparent border-none focus:ring-0"
                          value={test.testCode}
                          onChange={(e) =>
                            handleTestChange(index, 'testCode', e.target.value)
                          }
                        />
                      </td>
                      <td className="border-r border-gray-300">
                        <input
                          type="text"
                          className="w-full px-3 py-1 bg-transparent border-none"
                          value={test.testName}
                          onChange={(e) =>
                            handleTestChange(index, 'testName', e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="w-full px-3 py-1 bg-transparent border-none"
                          value={test.testResult}
                          onChange={(e) =>
                            handleTestChange(index, 'testResult', e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addTest}
              className="mt-3 px-4 py-1.5 bg-cyan-600 text-white rounded text-sm hover:bg-cyan-700 transition"
            >
              + إضافة فحص (Add Test)
            </button>
          </div>

          {/* Section 4: Medications */}
          <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              الأدوية المصروفة (Prescribed Medications)
            </h3>
            <div className="border border-gray-400 rounded overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-green-100">
                    <th className="p-3 border-b border-gray-400 font-semibold text-gray-800">
                      كود الدواء (Med Code)
                    </th>
                    <th className="p-3 border-b border-gray-400 font-semibold text-gray-800">
                      اسم الدواء (Medication Name)
                    </th>
                    <th className="p-3 border-b border-gray-400 font-semibold text-gray-800">
                      الجرعة (Dosage)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {medications.map((med, index) => (
                    <tr key={index} className="border-b border-gray-300">
                      <td className="border-r border-gray-300">
                        <input
                          type="text"
                          className="w-full px-3 py-1 bg-transparent border-none focus:ring-0"
                          value={med.medCode}
                          onChange={(e) =>
                            handleMedicationChange(index, 'medCode', e.target.value)
                          }
                        />
                      </td>
                      <td className="border-r border-gray-300">
                        <input
                          type="text"
                          className="w-full px-3 py-1 bg-transparent border-none focus:ring-0"
                          value={med.medName}
                          onChange={(e) =>
                            handleMedicationChange(index, 'medName', e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="w-full px-3 py-1 bg-transparent border-none focus:ring-0"
                          value={med.dosage}
                          onChange={(e) =>
                            handleMedicationChange(index, 'dosage', e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addMedication}
              className="mt-3 px-4 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition"
            >
              + إضافة دواء (Add Medication)
            </button>
          </div>

          {/* Section 5: Footer */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-t-2 border-cyan-600 mt-10">
            <div>
              <label className="block text-lg font-medium text-gray-700">
                اسم الطبيب المعالج (Treating Physician)
              </label>
              <input
                type="text"
                name="lastName"
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <label className="block text-lg font-medium text-gray-700">
                اسم الصيدلي (Pharmacist's Name)
              </label>
              <input
                type="text"
                name="emergencyPhone"
                className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-md"
                value={formData.emergencyPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between gap-4 mt-8">
            <Link
              href="/patients"
              className="px-6 py-2.5 bg-gray-400 text-white rounded-lg font-bold shadow-md hover:bg-gray-500 transition"
            >
              إلغاء
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg font-bold shadow-md hover:bg-cyan-700 transition"
            >
              حفظ المريض
            </button>
          </div>
        </form>
      </div>
    </AuthenticatedLayout>
  );
}
