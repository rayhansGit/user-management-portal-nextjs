"use client";

import Link from "next/link";
import Image from "next/image";

const Nav = () => {
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

            {/* Desktop Navigation */}
            <div className='sm:flex hidden'>

                <>
                    <Link href='/login' className="black_btn">
                        Login
                    </Link>
                    <Link href='/register' className="outline_btn ml-1">
                        Register
                    </Link>
                </>

            </div>
        </nav>
    );
};

export default Nav;