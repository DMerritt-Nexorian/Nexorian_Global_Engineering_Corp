import { EntitlementService } from '@/lib/entitlement';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerId, productId, paymentMode } = body;

    // Enforce Phase 1 Non-Production Rule
    if (paymentMode === 'PRODUCTION') {
      return Response.json(
        {
          error: 'GATE H3 RESTRICTION: Production payment activation is pending human approval.',
          code: 'GATE_H3_PENDING'
        },
        { status: 403 }
      );
    }

    // Process Simulated Non-Production Test Purchase
    const entitlement = EntitlementService.generateLicense(customerId || 'CUST-TEST-001', productId || 'NEX-PORTAL');

    return Response.json({
      success: true,
      environment: 'TEST_SIMULATION_MODE',
      entitlement,
      message: 'Test checkout successful. Production downloads require Gate H3/H5 approval.'
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
