"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const Nav = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const res = await fetch('/api/auth/login/isLoggedIn', {
                method: 'GET',
                credentials: 'include',
            });
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
            setLoading(false);
        })();
    }, []);

    return (
        <nav className='flex-between w-full mb-16 pt-3'>
            <Link href='/' className='flex gap-2 flex-center'>
                <Image
                    src='https://www.svgrepo.com/show/476344/login-lock-refresh.svg'
                    alt='logo'
                    width={30}
                    height={30}
                    className='object-contain'
                />
                <p className='logo_text'>User portal</p>
            </Link>

            {/* Only show links after loading is done */}
            {loading ? null : user ? (
                <div className='sm:flex hidden'>
                    <Link href='/user-list' className="black_btn">
                        User List
                    </Link>
                    <Link href='/logout' className="outline_btn ml-1">
                        Logout
                    </Link>
                </div>
            ) : (
                <div className='sm:flex hidden'>
                    <Link href='/login' className="black_btn">
                        Login
                    </Link>
                    <Link href='/registration' className="outline_btn ml-1">
                        Register
                    </Link>
                </div>
            )}
        </nav>
    );
};

export default Nav;