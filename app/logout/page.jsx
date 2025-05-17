'use client'
import React, { useEffect } from 'react'

const Logout = () => {
    useEffect(() => {
        const logout = async () => {
            const response = await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include', // Important: ensures cookies are sent/received
            });
            const data = await response.json();
            if (response.ok) {
                // Redirect or update UI
                window.location.href = '/login';
            } else {
                // Show error message
                alert(data.error || 'Logout failed');
            }
        }
        logout();

    }, [])
    return (
        <>Logging Out</>
    )
}

export default Logout