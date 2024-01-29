export async function POST(request: Request) {
  const requestBody = await request.json()

  const { email, password } = requestBody

  if (!email) {
    return Response.json({ message: 'Missing email field.' }, { status: 400 })
  }

  if (!password) {
    return Response.json(
      { message: 'Missing password field.' },
      { status: 400 }
    )
  }

  // @todo
  return Response.json(requestBody)
}
