import React, { useContext, useEffect, useState } from 'react'
import "./Navbar.css"
import GlitchText from './GlitchText'
import { FaMoon, FaSun } from "react-icons/fa"; //
import { Crypto } from '../CryptoContext';
import { Link } from 'react-router-dom';
const Navbar = () => {
    const { currency, setCurrency } = useContext(Crypto);
    const [lightMode, setLightMode] = useState(false); // dark is default

    const handleTheme = () => {
        let toogletheme = !lightMode
        setLightMode(!lightMode)
        document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", toogletheme ? "light" : "dark")
    }

    const handleSelect = (e) => {
        setCurrency(e.target.value)
    }
    // Getting Theme from local storage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "light") {
            setLightMode(true);
            document.body.classList.add("light-mode");
        } else {
            setLightMode(false);
            document.body.classList.remove("light-mode");
        }
    }, [])


    return (
        <div className='nav-container'>
            <nav className="navbar">
                <Link to={'/'}  className="logo">
                    <GlitchText
                        speed={1}
                        enableShadows={true}
                        enableOnHover={true}
                        className='logo-text'>
                        CoinTracker
                    </GlitchText>
                </Link>
                <div className="controls">
                    <select name="" id="" onChange={handleSelect} value={currency}>
                        <option value="INR">INR</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>
                    <button
                        className={`toggle-btn ${lightMode ? "light" : "dark"}`}
                        onClick={handleTheme}
                        title={lightMode ? "Switch to Dark Mode" : "Switch to Light Mode"}
                    >
                        {lightMode ? <FaSun /> : <FaMoon />}
                    </button>
                </div>

            </nav>
        </div>
    )
}

export default Navbar