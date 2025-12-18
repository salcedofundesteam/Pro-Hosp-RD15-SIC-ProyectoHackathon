import React from 'react'
import Image from 'next/image'
import logo from '../../public/logo.png'
import Link from 'next/link'

export default function Header() {
    return (
        <header className="w-full px-8 h-20 flex items-center justify-between font-inter">

            {/* Logo */}
            <div className="flex items-center">
                <Image
                    src={logo}
                    alt="Logo Pro-Hosp"
                    width={180}
                    priority
                />
            </div>

            {/* Navigation */}
            <nav className="flex items-center gap-10 text-sm font-medium text-black">
                <Link
                    href="#home"
                    className="transition-colors hover:text-blue-600"
                >
                    Home
                </Link>
                <Link
                    href="#aboutus"
                    className="transition-colors hover:text-blue-600"
                >
                    Sobre nosotros
                </Link>
                <Link
                    href="#contactus"
                    className="transition-colors hover:text-blue-600"
                >
                    Contactanos
                </Link>
            </nav>

            {/* CTA Button */}
            <Link href={"auth/login"}
                className="
    flex items-center gap-2 px-10 py-3 rounded-full
    bg-linear-to-r from-[#5EC7FF] to-[#168AFE]
    hover:from-[#168AFE] hover:to-[#5EC7FF]
    text-white text-sm font-semibold shadow-md
    transition-all duration-300 cursor-pointer
  "
            >
                Sign Up
                <i className="bx bx-right-arrow-alt text-lg transition-transform group-hover:translate-x-1"></i>
            </Link>
        </header>
    )
}