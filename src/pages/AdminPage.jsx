import { useState, useEffect } from 'react'
import api from '../api/api'
import Header from '../components/Header'
import '../App.css'

function AdminPage({ token, onLogout }) {
    const [users, setUsers] = useState([])
    const [links, setLinks] = useState([])
    const [activeTab, setActiveTab] = useState('users')
    const [error, setError] = useState('')
    const [editUser, setEditUser] = useState(null)
    const [editUsername, setEditUsername] = useState('')
    const [editEmail, setEditEmail] = useState('')

    useEffect(() => {
        api.get('/api/admin/users').then(res => setUsers(res.data)).catch(() => {})
        api.get('/api/admin/links').then(res => setLinks(res.data)).catch(() => {})
    }, [])

    const deleteUser = async (id) => {
        await api.delete(`/api/admin/users/${id}`)
        setUsers(users.filter(u => u.id !== id))
    }

    const deleteLink = async (id) => {
        await api.delete(`/api/admin/links/${id}`)
        setLinks(links.filter(l => l.id !== id))
    }

    const startEdit = (user) => {
        setEditUser(user.id)
        setEditUsername(user.username)
        setEditEmail(user.email)
    }

    const saveEdit = async (id) => {
        const res = await api.patch(`/api/admin/users/${id}?username=${editUsername}&email=${editEmail}`)
        setUsers(users.map(u => u.id === id ? res.data : u))
        setEditUser(null)
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            <div style={{ width: 650 }}>
                <Header />
                <div className="container" style={{ padding: '30px', marginTop: 80 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
                        <h2 style={{ margin: 0, fontSize: 22 }}>Admin Panel</h2>
                        <button onClick={onLogout} style={{ backgroundColor: 'transparent', border: '1px solid #555', color: '#999', padding: '6px 16px', fontSize: 13, borderRadius: 6, cursor: 'pointer' }}>Logout</button>
                    </div>

                    {error && <p className="error">{error}</p>}

                    <div style={{ display: 'flex', gap: 10, marginBottom: 25 }}>
                        <button onClick={() => setActiveTab('users')} style={{ flex: 1, backgroundColor: activeTab === 'users' ? '#6c5ce7' : '#555', color: '#fff', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>Users ({users.length})</button>
                        <button onClick={() => setActiveTab('links')} style={{ flex: 1, backgroundColor: activeTab === 'links' ? '#6c5ce7' : '#555', color: '#fff', border: 'none', padding: 12, borderRadius: 8, cursor: 'pointer', fontSize: 15 }}>Links ({links.length})</button>
                    </div>

                    <div style={{ maxHeight: 400, overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#555 #2d2d2d' }}>
                        {activeTab === 'users' && users.map(user => (
                            <div key={user.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #3a3a3a' }}>
                                <div style={{ flex: 1, paddingRight: 12 }}>
                                    {editUser === user.id ? (
                                        <div>
                                            <input value={editUsername} onChange={e => setEditUsername(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
                                            <input value={editEmail} onChange={e => setEditEmail(e.target.value)} style={{ width: '100%' }} />
                                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                                <button onClick={() => saveEdit(user.id)} style={{ backgroundColor: '#27ae60', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Save</button>
                                                <button onClick={() => setEditUser(null)} style={{ backgroundColor: '#555', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: 4, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <span style={{ color: '#fff', fontSize: 15 }}>{user.username}</span>
                                            <span style={{ marginLeft: 10, padding: '3px 10px', borderRadius: 4, fontSize: 12, backgroundColor: user.role === 'ADMIN' ? '#e74c3c' : '#6c5ce7' }}>{user.role}</span>
                                            <p style={{ color: '#999', fontSize: 13, margin: '4px 0 0 0' }}>{user.email}</p>
                                        </>
                                    )}
                                </div>
                                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                                    <button onClick={() => startEdit(user)} style={{ backgroundColor: '#555', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>Edit</button>
                                    <button onClick={() => deleteUser(user.id)} style={{ backgroundColor: '#e74c3c', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, whiteSpace: 'nowrap' }}>Delete</button>
                                </div>
                            </div>
                        ))}

                        {activeTab === 'links' && links.map(link => (
                            <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px 0', borderBottom: '1px solid #3a3a3a' }}>
                                <div style={{ flex: 1, paddingRight: 12, minWidth: 0, overflowWrap: 'break-word', wordBreak: 'break-all' }}>
                                    <a href={link.shortUrl} target="_blank" style={{ color: '#6c5ce7', fontSize: 14 }}>{link.shortUrl}</a>
                                    <p style={{ color: '#999', fontSize: 12, margin: '3px 0 0 0' }}>{link.originalUrl}</p>
                                    <p style={{ color: '#777', fontSize: 11, margin: '2px 0 0 0' }}>Owner: {link.userName}</p>
                                </div>
                                <button onClick={() => deleteLink(link.id)} style={{ backgroundColor: '#e74c3c', border: 'none', color: '#fff', padding: '8px 16px', borderRadius: 6, cursor: 'pointer', fontSize: 13, flexShrink: 0, whiteSpace: 'nowrap' }}>Delete</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPage