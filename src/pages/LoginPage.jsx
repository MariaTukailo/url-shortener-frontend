import { useState } from 'react'
import api from '../api/api'
import Header from '../components/Header'
import '../App.css'

function LoginPage({ onLogin, onRegisterClick }) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleLogin = async () => {
        try {
            const res = await api.post('/auth/login', { username, password })
            localStorage.setItem('token', res.data.token)
            onLogin(res.data.token, res.data.role)
        } catch (err) {
            setError('Invalid username or password')
        }
    }

    return (
        <div>
            <Header />
            <div className="container">
                <h2>Sign In</h2>
                {error && <p className="error">{error}</p>}
                <input
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleLogin}>Sign In</button>
                <p style={{ marginTop: 15, color: '#999', textAlign: 'center' }}>
                    Don't have an account?{' '}
                    <span
                        onClick={onRegisterClick}
                        style={{ color: '#6c5ce7', cursor: 'pointer', textDecoration: 'underline' }}
                    >
            Sign Up
          </span>
                </p>
            </div>
        </div>
    )
}

export default LoginPage