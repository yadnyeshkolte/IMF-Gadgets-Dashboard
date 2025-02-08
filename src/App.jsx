import { useState, useEffect } from 'react';
import { AlertCircle, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Alert, AlertDescription } from './components/ui/alert';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Select } from './components/ui/select';

const API_URL = 'https://imf-gadgets-api-ztqw.onrender.com';

const Login = ({ onLogin }) => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Attempting login with:', credentials.username);
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();
            console.log('Login response status:', response.status);

            if (response.ok) {
                console.log('Login successful');
                onLogin(data.token);
            } else {
                console.error('Login failed:', data.error);
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to connect to server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto mt-8">
            <CardHeader>
                <CardTitle>IMF Gadget System Login</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Username"
                        value={credentials.username}
                        onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                        disabled={isLoading}
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                        disabled={isLoading}
                    />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                </form>
            </CardContent>
        </Card>
    );
};

const GadgetDashboard = ({ token }) => {
    const [gadgets, setGadgets] = useState([]);
    const [newGadget, setNewGadget] = useState({ name: '' });
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fetchGadgets = async () => {
        setIsLoading(true);
        setError('');

        try {
            const url = filter ? `${API_URL}/gadgets?status=${filter}` : `${API_URL}/gadgets`;
            console.log('Fetching gadgets from:', url);

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Fetch response status:', response.status);
            const data = await response.json();

            if (response.ok) {
                console.log('Fetched gadgets:', data);
                setGadgets(data);
            } else {
                console.error('Failed to fetch gadgets:', data);
                setError(data.error || 'Failed to fetch gadgets');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to connect to server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchGadgets();
        }
    }, [filter, token]);

    const handleAddGadget = async (e) => {
        e.preventDefault();
        if (!newGadget.name.trim()) return;

        try {
            console.log('Adding new gadget:', newGadget);
            const response = await fetch(`${API_URL}/gadgets`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newGadget)
            });

            if (response.ok) {
                console.log('Gadget added successfully');
                setNewGadget({ name: '' });
                fetchGadgets();
            } else {
                const data = await response.json();
                console.error('Failed to add gadget:', data);
                setError(data.error || 'Failed to add gadget');
            }
        } catch (err) {
            console.error('Add gadget error:', err);
            setError('Failed to connect to server. Please try again.');
        }
    };

    const handleSelfDestruct = async (id) => {
        try {
            console.log('Self-destructing gadget:', id);
            const response = await fetch(`${API_URL}/gadgets/${id}/self-destruct`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                console.log('Gadget self-destructed successfully');
                fetchGadgets();
            } else {
                const data = await response.json();
                console.error('Failed to self-destruct gadget:', data);
                setError(data.error || 'Failed to self-destruct gadget');
            }
        } catch (err) {
            console.error('Self-destruct error:', err);
            setError('Failed to connect to server. Please try again.');
        }
    };

    if (!token) {
        return <Alert variant="destructive"><AlertDescription>No authentication token found. Please log in again.</AlertDescription></Alert>;
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>IMF Gadget Dashboard</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 mb-6">
                        <form onSubmit={handleAddGadget} className="flex-1 flex gap-2">
                            <Input
                                placeholder="New Gadget Name"
                                value={newGadget.name}
                                onChange={(e) => setNewGadget({ name: e.target.value })}
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading || !newGadget.name.trim()}>
                                <Plus className="h-4 w-4 mr-2" />Add Gadget
                            </Button>
                        </form>
                        <Select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-48"
                            disabled={isLoading}
                        >
                            <option value="">All Status</option>
                            <option value="Available">Available</option>
                            <option value="Deployed">Deployed</option>
                            <option value="Destroyed">Destroyed</option>
                            <option value="Decommissioned">Decommissioned</option>
                        </Select>
                        <Button onClick={fetchGadgets} disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>

                    {error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {isLoading ? (
                        <div className="text-center py-8">Loading gadgets...</div>
                    ) : gadgets.length === 0 ? (
                        <div className="text-center py-8">No gadgets found</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {gadgets.map(gadget => (
                                <Card key={gadget.id}>
                                    <CardHeader>
                                        <CardTitle className="text-lg">{gadget.name}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600">Codename: {gadget.codename}</p>
                                        <p className="text-sm text-gray-600">Status: {gadget.status}</p>
                                        <p className="text-sm text-gray-600">Success Probability: {gadget.missionSuccessProbability}%</p>
                                        {gadget.status === 'Available' && (
                                            <Button
                                                variant="destructive"
                                                className="mt-4"
                                                onClick={() => handleSelfDestruct(gadget.id)}
                                                disabled={isLoading}
                                            >
                                                <Trash2 className="h-4 w-4 mr-2" />Self Destruct
                                            </Button>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

const App = () => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    return token ? (
        <GadgetDashboard
            token={token}
            onLogout={() => setToken(null)}
        />
    ) : (
        <Login onLogin={setToken} />
    );
};

export default App;