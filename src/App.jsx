import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Lock, Unlock, Plus, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';

const API_URL = 'https://imf-gadgets-api-ztqw.onrender.com'; // Replace with your Render API URL

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gadgets, setGadgets] = useState([]);
    const [newGadgetName, setNewGadgetName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
            fetchGadgets(storedToken);
        }
    }, []);

    const fetchGadgets = async (currentToken) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/gadgets`, {
                headers: {
                    'Authorization': `Bearer ${currentToken}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setGadgets(data);
            }
        } catch (err) {
            setError('Failed to fetch gadgets');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                fetchGadgets(data.token);
                setError('');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            setError('Login failed');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                setError('');
            } else {
                setError('Registration failed');
            }
        } catch (err) {
            setError('Registration failed');
        }
    };

    const handleLogout = () => {
        setToken('');
        setIsLoggedIn(false);
        localStorage.removeItem('token');
        setGadgets([]);
    };

    const addGadget = async () => {
        try {
            const response = await fetch(`${API_URL}/gadgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: newGadgetName })
            });

            if (response.ok) {
                setNewGadgetName('');
                fetchGadgets(token);
            }
        } catch (err) {
            setError('Failed to add gadget');
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            let endpoint = `${API_URL}/gadgets/${id}`;
            let method = 'PATCH';
            let body = { status: newStatus };

            if (newStatus === 'Destroyed') {
                endpoint = `${API_URL}/gadgets/${id}/self-destruct`;
                method = 'POST';
                body = {};
            }

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            if (response.ok) {
                fetchGadgets(token);
            }
        } catch (err) {
            setError('Failed to update gadget');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Available': 'bg-green-100 text-green-800',
            'Deployed': 'bg-blue-100 text-blue-800',
            'Destroyed': 'bg-red-100 text-red-800',
            'Decommissioned': 'bg-gray-100 text-gray-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">IMF Gadget Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Username"
                                    className="w-full p-2 border rounded"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    placeholder="Password"
                                    className="w-full p-2 border rounded"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleLogin}
                                    className="flex-1 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                                >
                                    <Lock className="inline-block w-4 h-4 mr-2" />
                                    Login
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="flex-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                                >
                                    <Unlock className="inline-block w-4 h-4 mr-2" />
                                    Register
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">IMF Gadget Management</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex space-x-4">
                            <input
                                type="text"
                                placeholder="New Gadget Name"
                                className="flex-1 p-2 border rounded"
                                value={newGadgetName}
                                onChange={(e) => setNewGadgetName(e.target.value)}
                            />
                            <button
                                onClick={addGadget}
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 flex items-center"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Gadget
                            </button>
                        </div>
                    </CardContent>
                </Card>

                {loading ? (
                    <div className="flex justify-center py-8">
                        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {gadgets.map((gadget) => (
                            <Card key={gadget.id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <CardTitle className="text-xl">{gadget.name}</CardTitle>
                                    <p className="text-sm text-gray-500">{gadget.codename}</p>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div className={`inline-block px-2 py-1 rounded ${getStatusColor(gadget.status)}`}>
                                            {gadget.status}
                                        </div>
                                        <p className="text-sm">
                                            Success Probability: {gadget.missionSuccessProbability}%
                                        </p>
                                        <div className="flex space-x-2">
                                            {gadget.status === 'Available' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(gadget.id, 'Deployed')}
                                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                                >
                                                    Deploy
                                                </button>
                                            )}
                                            {gadget.status !== 'Destroyed' && gadget.status !== 'Decommissioned' && (
                                                <>
                                                    <button
                                                        onClick={() => handleStatusUpdate(gadget.id, 'Decommissioned')}
                                                        className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 text-sm flex items-center"
                                                    >
                                                        <Trash2 className="w-4 h-4 mr-1" />
                                                        Decommission
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(gadget.id, 'Destroyed')}
                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm flex items-center"
                                                    >
                                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                                        Self-Destruct
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;