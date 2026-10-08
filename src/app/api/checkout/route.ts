
export async function POST() {
  return Response.json(
    {
      success: false,
      code: "NOT_OFFERED",
      message: "No product in this portal is offered for sale or lease. Payment is not connected."
    },
    { status: 403 }
  );
}
