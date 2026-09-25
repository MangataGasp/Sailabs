import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../utils/ThemeToggle'
import Booking from '../features/Booking'
import { FiMenu, FiX } from "react-icons/fi"

const Navbar = () => {
    const [menu, setMenu] = useState(false)

    return (
        <header className='w-full fixed left-0 right-0 z-2000 lg:px-40 px-10 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200/70 dark:border-white/10'>
            <nav className='flex justify-between py-5'>
                <div>
                    <Link to='/' className='font-bold text-sm tracking-widest'>
                        S A I L A B S LTD.
                    </Link>
                </div>

                <div className='lg:flex hidden gap-6 font-light dark:text-gray-400'>
                    <Link to='/'>Home</Link>
                    <Link to='/about'>About</Link>
                    <Link to='/services'>Services</Link>
                    <Link to='/testimonies'>Testimonies</Link>
                    <Link to='/blog'>Blog</Link>
                    {/* <Link to='admin'>Admin</Link> */}
                </div>

                <div className='lg:flex hidden gap-10'>
                    <ThemeToggle />
                    <Booking />
                </div>

                <div className='lg:hidden block'>
                    <div className='flex justify-center items-center gap-2'>
                        <ThemeToggle />
                        <button onClick={() => setMenu(!menu)}>
                            {menu ? <FiX size={24} /> : <FiMenu size={24} />}
                        </button>
                    </div>

                    {menu && (
                        <div className='fixed left-0 top-0 w-full'>
                            <div className='h-screen w-full relative bg-white dark:bg-[#0F172A]'>

                                <button
                                    onClick={() => setMenu(false)}
                                    className='absolute right-10 top-5'
                                >
                                    <FiX size={24} />
                                </button>

                                <div className='flex flex-col gap-6 font-light p-10'>
                                    <Link to='/' onClick={() => setMenu(false)}>Home</Link>
                                    <Link to='/about' onClick={() => setMenu(false)}>About</Link>
                                    <Link to='/services' onClick={() => setMenu(false)}>Services</Link>
                                    <Link to='/testimonies' onClick={() => setMenu(false)}>Testimonies</Link>
                                    <Link to='/blog' onClick={() => setMenu(false)}>Blog</Link>
                                    {/* <Link to='admin'>Admin</Link> */}
                                </div>

                                <div className='flex gap-10 p-10'>
                                    <Booking />
                                    {/* <ThemeToggle /> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

            </nav>
        </header>
    )
}

export default Navbar