'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    ferretName: '',
    playSessionLength: 30,
    playSessionRate: 25,
    additionalServices: [],
    notes: '',
  });
  const [loading, setLoading] = useState(false);

  const additionalServiceOptions = [
    { id: 'grooming', label: 'Grooming', price: 15 },
    { id: 'toys', label: 'Premium Toys', price: 10 },
    { id: 'treats', label: 'Special Treats', price: 8 },
    { id: 'photo', label: 'Photo Session', price: 20 },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      const updatedServices = checked
          ? [...formData.additionalServices, name]
          : formData.additionalServices.filter(service => service !== name);

      setFormData({
        ...formData,
        additionalServices: updatedServices
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const calculateTotal = () => {
    // Base price for play session
    const basePrice = (formData.playSessionLength / 30) * formData.playSessionRate;

    // Additional services price
    const additionalServicesPrice = formData.additionalServices.reduce((total, service) => {
      const serviceOption = additionalServiceOptions.find(option => option.id === service);
      return total + (serviceOption ? serviceOption.price : 0);
    }, 0);

    return basePrice + additionalServicesPrice;
  };

  const generateInvoiceId = () => {
    return 'FP-' + Date.now().toString().slice(-6);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const invoiceId = generateInvoiceId();
    const invoiceData = {
      ...formData,
      invoiceId,
      totalAmount: calculateTotal(),
      dateCreated: new Date().toISOString(),
      status: 'pending'
    };

    try {
      const response = await fetch('/api/create-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/invoice/${data.invoiceId}`);
      } else {
        throw new Error('Failed to create invoice');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Failed to create invoice. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-8 bg-purple-700 sm:p-10 sm:pb-6">
            <div className="flex items-center justify-center">
              <h2 className="text-3xl leading-9 font-extrabold text-white">
                Ferret Playtime Invoice Generator
              </h2>
            </div>
            <div className="mt-2 text-center">
              <p className="text-lg leading-6 text-purple-200">
                Create custom invoices for your ferret playtime services
              </p>
            </div>
          </div>

          <div className="px-6 py-8 sm:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                <div>
                  <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">
                    Client Name
                  </label>
                  <div className="mt-1">
                    <input
                        type="text"
                        name="clientName"
                        id="clientName"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={formData.clientName}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">
                    Client Email
                  </label>
                  <div className="mt-1">
                    <input
                        type="email"
                        name="clientEmail"
                        id="clientEmail"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={formData.clientEmail}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="ferretName" className="block text-sm font-medium text-gray-700">
                    Ferret Name
                  </label>
                  <div className="mt-1">
                    <input
                        type="text"
                        name="ferretName"
                        id="ferretName"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={formData.ferretName}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="playSessionLength" className="block text-sm font-medium text-gray-700">
                    Play Session Length (minutes)
                  </label>
                  <div className="mt-1">
                    <select
                        name="playSessionLength"
                        id="playSessionLength"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={formData.playSessionLength}
                        onChange={handleInputChange}
                    >
                      <option value="30">30 minutes</option>
                      <option value="60">60 minutes</option>
                      <option value="90">90 minutes</option>
                      <option value="120">120 minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="playSessionRate" className="block text-sm font-medium text-gray-700">
                    Hourly Rate ($ per 30 min)
                  </label>
                  <div className="mt-1">
                    <input
                        type="number"
                        name="playSessionRate"
                        id="playSessionRate"
                        min="1"
                        required
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                        value={formData.playSessionRate}
                        onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Additional Services
                </label>
                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {additionalServiceOptions.map((service) => (
                      <div key={service.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                              id={service.id}
                              name={service.id}
                              type="checkbox"
                              className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                              checked={formData.additionalServices.includes(service.id)}
                              onChange={handleInputChange}
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={service.id} className="font-medium text-gray-700">
                            {service.label} (${service.price})
                          </label>
                        </div>
                      </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <div className="mt-1">
                <textarea
                    name="notes"
                    id="notes"
                    rows="3"
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
                    value={formData.notes}
                    onChange={handleInputChange}
                />
                </div>
              </div>

              <div>
                <div className="rounded-md bg-gray-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="text-base font-medium text-gray-900">Total Due</div>
                    <div className="text-2xl font-semibold text-purple-700">${calculateTotal().toFixed(2)}</div>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                      type="button"
                      className="ml-3 rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      onClick={() => setFormData({
                        clientName: '',
                        clientEmail: '',
                        ferretName: '',
                        playSessionLength: 30,
                        playSessionRate: 25,
                        additionalServices: [],
                        notes: '',
                      })}
                  >
                    Clear
                  </button>
                  <button
                      type="submit"
                      className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                      disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Invoice'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
  );
}
