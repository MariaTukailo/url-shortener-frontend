import { useState, useEffect } from 'react'
import api from '../api/api'
import Header from '../components/Header'
import '../App.css'

function UserPage({ token, onLogout }) {
    const [links, setLinks] = useState([])
    const [originalUrl, setOriginalUrl] = useState('')
    const [showLinks, setShowLinks] = useState(false)
    const [shortenedUrl, setShortenedUrl] = useState('')
    const [error, setError] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    useEffect(() => {
        api.get('/api/links/my').then(res => setLinks(res.data)).catch(() => {})
        api.get('/api/me').then(res => {
            setUsername(res.data.username)
            setEmail(res.data.email)
        }).catch(() => {})
    }, [])

    const createLink = async () => {
        try {
            const res = await api.post('/api/links', { originalUrl })
            setLinks([...links, res.data])
            setShortenedUrl(res.data.shortUrl)
            setOriginalUrl('')
        } catch (err) {
            setError('Failed to create link')
        }
    }

    const deleteLink = async (id) => {
        await api.delete(`/api/links/${id}`)
        setLinks(links.filter(l => l.id !== id))
    }

    const saveProfile = async () => {
        try {
            const res = await api.patch(`/api/me?username=${username}&email=${email}`)
            setUsername(res.data.username)
            setEmail(res.data.email)
            setEditMode(false)
        } catch (err) {
            setError('Failed to update profile')
        }
    }

    return (
        <div>
            <Header />

            <div className="container" style={{ maxWidth: 550, margin: '40px auto', padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                    <h2 style={{ margin: 0, fontSize: 22 }}>Shorten a URL</h2>
                    <button
                        onClick={onLogout}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #555',
                            color: '#999',
                            padding: '6px 16px',
                            fontSize: 13,
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        Logout
                    </button>
                </div>

                {error && <p className="error">{error}</p>}

                <input
                    placeholder="Paste long URL here..."
                    value={originalUrl}
                    onChange={e => setOriginalUrl(e.target.value)}
                    style={{ width: '100%', marginBottom: 10 }}
                />
                <button onClick={createLink} style={{ width: '100%', marginBottom: 20 }}>Shorten</button>

                {shortenedUrl && (
                    <div style={{
                        backgroundColor: '#3d3d3d',
                        padding: '14px 16px',
                        borderRadius: 8,
                        marginBottom: 20,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}>
                        <a
                            href={shortenedUrl}
                            target="_blank"
                            style={{
                                color: '#fff',
                                fontSize: 16,
                                wordBreak: 'break-all',
                                textDecoration: 'underline'
                            }}
                        >
                            {shortenedUrl}
                        </a>
                        <button
                            onClick={() => navigator.clipboard.writeText(shortenedUrl)}
                            style={{
                                backgroundColor: '#555',
                                color: '#fff',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: 4,
                                cursor: 'pointer',
                                fontSize: 13,
                                marginLeft: 12,
                                whiteSpace: 'nowrap'
                            }}
                        >
                            Copy
                        </button>
                    </div>
                )}

                <button
                    onClick={() => setShowLinks(!showLinks)}
                    style={{
                        backgroundColor: '#6c5ce7',
                        width: '100%',
                        marginBottom: 20
                    }}
                >
                    {showLinks ? 'Hide My Links' : 'My Links'}
                </button>

                {showLinks && (
                    <div>
                        {links.length === 0 ? (
                            <p style={{ color: '#999', textAlign: 'center', padding: '20px 0' }}>No links yet.</p>
                        ) : (
                            links.map(link => (
                                <div key={link.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '12px 0',
                                    borderBottom: '1px solid #3a3a3a'
                                }}>
                                    <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
                                        <a href={link.shortUrl} target="_blank" style={{ color: '#6c5ce7', fontSize: 14, wordBreak: 'break-all' }}>
                                            {link.shortUrl}
                                        </a>
                                        <p style={{ color: '#999', fontSize: 12, margin: '3px 0 0 0', wordBreak: 'break-all' }}>
                                            {link.originalUrl}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => deleteLink(link.id)}
                                        style={{
                                            backgroundColor: 'transparent',
                                            border: 'none',
                                            color: '#999',
                                            cursor: 'pointer',
                                            fontSize: 18,
                                            flexShrink: 0,
                                            padding: 0
                                        }}
                                        title="Delete"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div style={{ borderTop: '1px solid #444', marginTop: 25, paddingTop: 20 }}>
                    {editMode ? (
                        <div>
                            <input value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
                            <input value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={saveProfile} style={{ backgroundColor: '#27ae60', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Save</button>
                                <button onClick={() => setEditMode(false)} style={{ backgroundColor: '#555', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <span style={{ color: '#fff', fontSize: 14 }}>{username}</span>
                                <p style={{ color: '#999', fontSize: 12, margin: '2px 0 0 0' }}>{email}</p>
                            </div>
                            <button onClick={() => setEditMode(true)} style={{ backgroundColor: '#555', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Edit</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserPage