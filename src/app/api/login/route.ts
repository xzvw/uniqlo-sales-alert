import { DynamoDBClient, QueryCommand } from '@aws-sdk/client-dynamodb'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const TABLE_NAME = 'dev-users'

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

  const client = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })

  try {
    const userQuery = await client.send(
      new QueryCommand({
        TableName: TABLE_NAME,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': { S: email },
        },
      })
    )

    if (typeof userQuery.Count !== 'number' || !userQuery.Items) {
      return Response.json(
        { message: 'Error logging in user.' },
        { status: 500 }
      )
    }

    if (userQuery.Count === 0) {
      return Response.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const user = userQuery.Items[0]

    if (!user?.userId?.S || !user?.passwordHash?.S) {
      return Response.json(
        { message: 'Error logging in user.' },
        { status: 500 }
      )
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash.S)

    if (!isPasswordValid) {
      return Response.json(
        { message: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    const token = jwt.sign({ userId: user.userId.S }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    })

    return Response.json({ token }, { status: 200 })
  } catch (error) {
    console.error(error)

    return Response.json({ message: 'Error logging in user.' }, { status: 500 })
  }
}
