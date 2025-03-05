import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const invoiceData = await request.json();

        // In a real application, you would save this to a database
        // For this example, we'll pretend it was saved successfully

        // You could also send an email notification here

        return NextResponse.json({
            message: 'Invoice created successfully',
            invoiceId: invoiceData.invoiceId
        });
    } catch (error) {
        console.error('Error creating invoice:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

