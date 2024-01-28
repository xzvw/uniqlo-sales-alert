import apiUrls from '@/modules/apiUrls'

export function signUp({
  email,
  password,
}: {
  email: string
  password: string
}) {
  return fetch(apiUrls.createUser, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    if (!response.ok) {
      return response.json().then((error) => {
        throw new Error(error.message)
      })
    }

    return response.json()
  })
}
