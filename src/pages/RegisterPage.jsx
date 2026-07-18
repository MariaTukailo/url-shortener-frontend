import { useState } from 'react'
import api from '../api/api'
import Header from '../components/Header'
import '../App.css'

function RegisterPage({ onRegister }) {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleRegister = async () => {
        try {
            const res = await api.post('/auth/register', { username, email, password })
            localStorage.setItem('token', res.data.token)
            onRegister(res.data.token, res.data.role)
        } catch (err) {
            setError('Registration failed. Try again.')
        }
    }

    return (
        <div>
            <Header />
            <div className="container">
                <h2>Sign Up</h2>
                {error && <p className="error">{error}</p>}
                <input
                    placeholder="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                />
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Sign Up</button>
                <p style={{ marginTop: 15, color: '#999', textAlign: 'center' }}>
                    Already have an account?{' '}
                    <span
                        onClick={() => onRegister(null, null)}
                        style={{ color: '#6c5ce7', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Sign In
                    </span>
                </p>
            </div>
        </div>
    )
}

export default RegisterPage