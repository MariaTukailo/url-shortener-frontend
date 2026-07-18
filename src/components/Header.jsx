import logo from '../assets/logo.png'

function Header() {
    return (
        <div style={{
            position: 'fixed',
            top: 50,
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 15,
            padding: '15px 0',
            backgroundColor: '#1a1a1a',
            zIndex: 1000
        }}>
            <h1 style={{
                fontSize: 100,
                fontWeight: 'bold',
                margin: 0,
                color: '#fff',
                textShadow: '0 0 25px rgba(108, 92, 231, 0.6)',
                letterSpacing: 3,


            }}>
                URL Shortener
            </h1>
            <img src={logo} alt="Logo" style={{ width: 150, height: 150 }} />
        </div>
    )
}

export default Header