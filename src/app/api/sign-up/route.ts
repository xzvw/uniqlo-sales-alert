import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from '@aws-sdk/client-dynamodb'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

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

    if (typeof userQuery.Count !== 'number') {
      return Response.json(
        { message: 'Error registering user.' },
        { status: 500 }
      )
    }

    if (userQuery.Count > 0) {
      return Response.json(
        { message: 'Email already exists.' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error(error)

    return Response.json(
      { message: 'Error registering user.' },
      { status: 500 }
    )
  }

  const userId = uuidv4()
  const passwordHash = await bcrypt.hash(password, 10)

  try {
    await client.send(
      new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
          userId: { S: userId },
          email: { S: email },
          passwordHash: { S: passwordHash },
          createdAt: { S: new Date().toISOString() },
          updatedAt: { S: new Date().toISOString() },
        },
      })
    )

    return Response.json(
      { message: 'User registered successfully.' },
      { status: 201 }
    )
  } catch (error) {
    console.error(error)

    return Response.json(
      { message: 'Error registering user.' },
      { status: 500 }
    )
  }
}
