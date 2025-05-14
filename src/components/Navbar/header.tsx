"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

const Header = () => {
  const [isNavOpen, setIsNavOpen] = useState(false)

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen)
  }

  return (
    <section id="header">
      <Link href="/">
        <Image src="/img/logo.png"  width={70} height={10} className=" bg-transparent" alt="Logo" />
      </Link>

      <div>
        <ul id="navbar" className={isNavOpen ? 'active' : ''}>
          <li><Link href="/" className="active">Home</Link></li>
          <li><Link href="/shop">Shop</Link></li>
          <li><Link href="/blog">Blog</Link></li>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/contact">Contact</Link></li>
          <li id="lg-bag"><Link href="/cart"><i className="far fa-shopping-bag"></i></Link></li>
          <Link href="#" id="close" onClick={toggleNav}><i className="far fa-times"></i></Link>
        </ul>
      </div>
      <div id="mobile">
        <Link href="/cart"><i className="far fa-shopping-bag"></i></Link>
        <i id="bar" className="fas fa-outdent" onClick={toggleNav}></i>
      </div>
    </section>
  )
}

export default Header