import React from 'react';
import { NextPage } from 'next';
import Link from 'next/link';

interface HeaderProps {
  title: string;
}

const Header: NextPage<HeaderProps> = ({ title }) => {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a>About</a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a>Contact</a>
            </Link>
          </li>
        </ul>
      </nav>
      <h1>{title}</h1>
    </header>
  );
};

export default Header;
