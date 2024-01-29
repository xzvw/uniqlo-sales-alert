'use client'
import Link from 'next/link'
import { MouseEventHandler, useCallback, useState } from 'react'
import { signUp } from '@/modules/apis'
import routes from '@/modules/routes'
import type { ChangeEventHandler } from 'react'

function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<Error | null>(null)

  const onEmailChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setEmail(event.target.value)
    },
    []
  )

  const onPasswordChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setPassword(event.target.value)
    },
    []
  )

  const onSignUpClick = useCallback<MouseEventHandler>(() => {
    setError(null)

    signUp({ email, password })
      .then((data) => {
        console.log('data', data)
      })
      .catch((error: Error) => {
        setError(error)
      })
  }, [email, password])

  return (
    <div>
      <h1>Sign Up</h1>
      <div
        style={{
          display: 'grid',
          gap: 5,
          gridTemplateColumns: 'auto 1fr',
          width: 320,
        }}
      >
        <div>Email</div>
        <input value={email} onChange={onEmailChange} />
        <div>Password</div>
        <input type="password" value={password} onChange={onPasswordChange} />
        <div style={{ gridColumn: 'span 2' }}>
          <button onClick={onSignUpClick}>Sign Up</button>
        </div>
        {error && (
          <div
            style={{
              border: '1px solid red',
              gridColumn: 'span 2',
              padding: 5,
            }}
          >
            {error.message}
          </div>
        )}
      </div>
      <hr />
      <div>
        <Link href={routes.login}>Login</Link>
      </div>
    </div>
  )
}

export default SignUpPage
