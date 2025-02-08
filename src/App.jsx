import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Lock, Unlock, Plus, RefreshCw, Trash2, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './components/ui/dialog';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

const API_URL = import.meta.env.VITE_API_URL;

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [gadgets, setGadgets] = useState([]);
    const [newGadgetName, setNewGadgetName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selfDestructDialog, setSelfDestructDialog] = useState({ open: false, gadgetId: null });
    const [confirmationCode, setConfirmationCode] = useState('');
    const [enteredCode, setEnteredCode] = useState('');
    const [selfDestructError, setSelfDestructError] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            setIsLoggedIn(true);
            fetchGadgets(storedToken);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                setToken(data.token);
                localStorage.setItem('token', data.token);
                setIsLoggedIn(true);
                setError('');
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Login failed - Network error');
        }
    };

    const fetchGadgets = async (currentToken) => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/gadgets`, {
                headers: {
                    'Authorization': `Bearer ${currentToken}`,
                    'Accept': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                setGadgets(data);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Failed to fetch gadgets');
            }
        } catch (err) {
            setError('Failed to fetch gadgets');
        } finally {
            setLoading(false);
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
            if (newStatus === 'Destroyed') {
                // Request confirmation code first
                const response = await fetch(`${API_URL}/gadgets/${id}/request-destruction`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setConfirmationCode(data.confirmationCode);
                    setSelfDestructDialog({ open: true, gadgetId: id });
                    setSelfDestructError('');
                    return;
                }
            }

            const response = await fetch(`${API_URL}/gadgets/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (response.ok) {
                fetchGadgets(token);
            }
        } catch (err) {
            setError('Failed to update gadget');
        }
    };

    const handleSelfDestruct = async () => {
        try {
            const response = await fetch(`${API_URL}/gadgets/${selfDestructDialog.gadgetId}/self-destruct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ confirmationCode: enteredCode })
            });

            if (response.ok) {
                setSelfDestructDialog({ open: false, gadgetId: null });
                setEnteredCode('');
                setConfirmationCode('');
                fetchGadgets(token);
            } else {
                const data = await response.json();
                setSelfDestructError(data.error || 'Self-destruct failed');
            }
        } catch (err) {
            setSelfDestructError('Self-destruct failed - Network error');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'Available': 'bg-green-100 text-green-800',
            'Deployed': 'bg-blue-100 text-blue-800',
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
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {error && <p className="text-red-500 text-sm">{error}</p>}
                            <div className="flex space-x-4">
                                <Button onClick={handleLogin} className="flex-1">
                                    <Lock className="w-4 h-4 mr-2" />
                                    Login
                                </Button>
                                <Button onClick={handleRegister} variant="secondary" className="flex-1">
                                    <Unlock className="w-4 h-4 mr-2" />
                                    Register
                                </Button>
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
                    <Button variant="destructive" onClick={handleLogout}>Logout</Button>
                </div>

                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <div className="flex space-x-4">
                            <Input
                                type="text"
                                placeholder="New Gadget Name"
                                value={newGadgetName}
                                onChange={(e) => setNewGadgetName(e.target.value)}
                            />
                            <Button onClick={addGadget} className="bg-green-500 hover:bg-green-600">
                                <Plus className="w-4 h-4 mr-2" />
                                Add Gadget
                            </Button>
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
                                                <Button
                                                    onClick={() => handleStatusUpdate(gadget.id, 'Deployed')}
                                                    variant="secondary"
                                                    size="sm"
                                                >
                                                    Deploy
                                                </Button>
                                            )}
                                            {gadget.status !== 'Destroyed' && (
                                                <>
                                                    {gadget.status !== 'Decommissioned' && (
                                                        <Button
                                                            onClick={() => handleStatusUpdate(gadget.id, 'Decommissioned')}
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Decommission
                                                        </Button>
                                                    )}
                                                    <Button
                                                        onClick={() => handleStatusUpdate(gadget.id, 'Destroyed')}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <AlertTriangle className="w-4 h-4 mr-1" />
                                                        Self-Destruct
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <Dialog open={selfDestructDialog.open} onOpenChange={(open) => {
                    if (!open) {
                        setSelfDestructDialog({ open: false, gadgetId: null });
                        setEnteredCode('');
                        setSelfDestructError('');
                    }
                }}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirm Self-Destruct</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-gray-500 mb-4">
                                A confirmation code has been generated. Please enter it below to confirm self-destruct:
                            </p>
                            <p className="text-lg font-mono text-center mb-4 text-red-500">
                                {confirmationCode}
                            </p>
                            <Input
                                type="text"
                                placeholder="Enter confirmation code"
                                value={enteredCode}
                                onChange={(e) => setEnteredCode(e.target.value)}
                            />
                            {selfDestructError && (
                                <p className="text-red-500 text-sm mt-2">{selfDestructError}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setSelfDestructDialog({ open: false, gadgetId: null })}>
                                Cancel
                            </Button>
                            <Button variant="destructive" onClick={handleSelfDestruct}>
                                Confirm Self-Destruct
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};

export default App;