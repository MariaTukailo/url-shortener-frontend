import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserPage from './pages/UserPage'
import AdminPage from './pages/AdminPage'

function App() {
  const [page, setPage] = useState('login')
  const [token, setToken] = useState(null)
  const [role, setRole] = useState(null)

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setRole(null)
  }


      if (token && role === 'ADMIN') {
          return <AdminPage token={token} onLogout={logout} />
      }


  if (token && role === 'USER') {
    return <UserPage token={token} onLogout={logout} />
  }

  if (page === 'register') {
    return (
        <RegisterPage
            onRegister={(t, r) => {
              if (t) { setToken(t); setRole(r) }
              else setPage('login')
            }}
        />
    )
  }

  return (
      <LoginPage
          onLogin={(t, r) => { setToken(t); setRole(r) }}
          onRegisterClick={() => setPage('register')}
      />
  )
}

export default App