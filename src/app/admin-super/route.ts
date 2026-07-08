import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Super Admin Access - Kays Apparel</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <style>
        body { font-family: system-ui, sans-serif; background: #f8f9fa; min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); width: 100%; max-width: 320px; }
        input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 4px; margin-bottom: 1rem; box-sizing: border-box; }
        button { width: 100%; background: #6B4C3B; color: white; border: none; padding: 0.75rem; border-radius: 4px; cursor: pointer; font-weight: 600; }
        button:hover { background: #5a3f31; }
        .error { color: #dc2626; font-size: 0.875rem; margin-top: 0.5rem; }
        .success { color: #16a34a; font-size: 0.875rem; margin-top: 0.5rem; }
        h2 { text-align: center; margin-bottom: 1.5rem; color: #1f2937; }
    </style>
</head>
<body>
    <div id="root"></div>

    <script type="text/babel">
        const { useState } = React;

        function SuperAdminLogin() {
            const [password, setPassword] = useState('');
            const [message, setMessage] = useState('');
            const [isLoggedIn, setIsLoggedIn] = useState(false);

            const handleLogin = (e) => {
                e.preventDefault();
                setMessage('');
                
                // Super admin bypass
                if (password.trim() === 'Olatoyosi1') {
                    setIsLoggedIn(true);
                    setMessage('Access granted! Redirecting to admin dashboard...');
                    sessionStorage.setItem('kays_admin_password', 'Olatoyosi1');
                    setTimeout(() => {
                        window.location.href = '/admin';
                    }, 1500);
                    return;
                }
                
                setMessage('Incorrect password');
            };

            if (isLoggedIn) {
                return (
                    <div className="card">
                        <h2>✅ Super Admin Access</h2>
                        <p className="success">{message}</p>
                    </div>
                );
            }

            return (
                <div className="card">
                    <h2>Super Admin Access</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoFocus
                        />
                        <button type="submit">Access Dashboard</button>
                        {message && <div className={message.includes('granted') ? 'success' : 'error'}>{message}</div>}
                    </form>
                    <p style={{fontSize: '0.75rem', color: '#6b7280', marginTop: '1rem', textAlign: 'center'}}>
                        Use super admin credentials
                    </p>
                </div>
            );
        }

        ReactDOM.render(<SuperAdminLogin />, document.getElementById('root'));
    </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
