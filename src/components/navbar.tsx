import Link from "next/link"


const NavBar = () => {
  return (
    <nav>
        <ul>
            <li>
                <Link href="/">Home</Link>
                <Link href="/login">Login</Link>
            </li>
        </ul>
    </nav>
  )
}

export default NavBar