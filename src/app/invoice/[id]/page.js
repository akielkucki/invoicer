'use client';

import { useEffect, useState } from 'react';
import { use } from 'react';
import Link from 'next/link';

export default function InvoicePage({ params }) {
    const unwrappedParams = use(params);
    const id = unwrappedParams.id;
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;

        async function fetchInvoice() {
            try {
                const response = await fetch(`/api/get-invoice?id=${id}`);
                if (!response.ok) {
                    throw new Error('Invoice not found');
                }
                const data = await response.json();
                setInvoice(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchInvoice();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl text-gray-600">Loading invoice...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-xl text-red-600 mb-4">{error}</div>
                <Link href="/" className="text-purple-600 hover:text-purple-800">
                    Return to invoice creator
                </Link>
            </div>
        );
    }

    if (!invoice) {
        return null;
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    return (
        <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="px-6 py-8 bg-purple-700 sm:p-10 sm:pb-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl leading-9 font-extrabold text-white">
                            Ferret Playtime Invoice
                        </h2>
                        <div className="text-white bg-purple-800 px-3 py-1 rounded-full text-sm font-semibold">
                            #{invoice.invoiceId}
                        </div>
                    </div>
                    <div className="mt-2">
                        <p className="text-lg leading-6 text-purple-200">
                            {formatDate(invoice.dateCreated)}
                        </p>
                    </div>
                </div>

                <div className="px-6 py-8 sm:p-10 border-b border-gray-200">
                    <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Client Information</h3>
                            <div className="mt-3">
                                <p className="text-gray-700">{invoice.clientName}</p>
                                <p className="text-gray-700">{invoice.clientEmail}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Ferret Information</h3>
                            <div className="mt-3">
                                <p className="text-gray-700">Name: {invoice.ferretName}</p>
                                <p className="text-gray-700">Play Session: {invoice.playSessionLength} minutes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-8 sm:p-10">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Services</h3>

                    <div className="border-t border-gray-200">
                        <div className="flex py-4 justify-between">
                            <div>
                                <p className="text-gray-900 font-medium">Ferret Playtime Session</p>
                                <p className="text-gray-500">{invoice.playSessionLength} minutes @ ${invoice.playSessionRate}/30min</p>
                            </div>
                            <p className="text-gray-900 font-medium">
                                ${((invoice.playSessionLength / 30) * invoice.playSessionRate).toFixed(2)}
                            </p>
                        </div>

                        {invoice.additionalServices.length > 0 && (
                            <>
                                <div className="border-t border-gray-200 pt-4">
                                    <h4 className="text-sm font-medium text-gray-900 mb-2">Additional Services</h4>
                                    {invoice.additionalServices.map((serviceId) => {
                                        const service = {
                                            grooming: { label: 'Grooming', price: 15 },
                                            toys: { label: 'Premium Toys', price: 10 },
                                            treats: { label: 'Special Treats', price: 8 },
                                            photo: { label: 'Photo Session', price: 20 },
                                        }[serviceId];

                                        return (
                                            <div key={serviceId} className="flex py-2 justify-between">
                                                <p className="text-gray-700">{service.label}</p>
                                                <p className="text-gray-900">${service.price.toFixed(2)}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}

                        {invoice.notes && (
                            <div className="border-t border-gray-200 py-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                                <p className="text-gray-700 whitespace-pre-line">{invoice.notes}</p>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between">
                                <p className="text-lg font-medium text-gray-900">Total Due</p>
                                <p className="text-2xl font-bold text-purple-700">${invoice.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="mt-8">
                            <div className="rounded-md bg-gray-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1v-3a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-800">Payment Information</h3>
                                        <div className="mt-2 text-sm text-gray-700">
                                            <p>Please make payment within 14 days of receiving this invoice.</p>
                                            <p className="mt-1">Payment methods accepted: Cash, Credit Card, or Bank Transfer.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-between">
                            <Link href="/" className="text-purple-600 hover:text-purple-800 font-medium">
                                ← Back to invoice creator
                            </Link>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                            >
                                Print Invoice
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}