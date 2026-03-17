import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/db';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check local storage for session
        const session = sessionStorage.getItem('careconnect_session');
        if (session) setUser(JSON.parse(session));
        db.init(); // Ensure DB is ready
    }, []);

    const login = (userData) => {
        sessionStorage.setItem('careconnect_session', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        sessionStorage.removeItem('careconnect_session');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
