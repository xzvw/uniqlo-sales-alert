'use client'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import routes from '@/modules/routes'
import type { ChangeEventHandler } from 'react'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

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

  return (
    <div>
      <h1>Login</h1>
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
          <button>Login</button>
        </div>
      </div>
      <hr />
      <div>
        <Link href={routes.signUp}>Create an account</Link>
      </div>
    </div>
  )
}

export default LoginPage
