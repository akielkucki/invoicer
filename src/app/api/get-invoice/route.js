import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json(
            { message: 'Invoice ID is required' },
            { status: 400 }
        );
    }

    try {
        // In a real application, you would fetch this from a database
        // For this example, we'll return mock data
        const mockInvoice = {
            invoiceId: id,
            clientName: 'Kim Kielkucki',
            clientEmail: 'rcpkim@hotmail.com',
            ferretName: 'Pebbles',
            playSessionLength: 60,
            playSessionRate: 25,
            additionalServices: ['grooming', 'treats'],
            notes: 'Pebbles loves to play with tubes and tunnels. Please include those in the playtime.',
            totalAmount: 2500 * 2 + 15 + 8, // 2 half hours + grooming + treats
            dateCreated: new Date().toISOString(),
            status: 'awaiting payment'
        };

        return NextResponse.json(mockInvoice);
    } catch (error) {
        console.error('Error retrieving invoice:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}