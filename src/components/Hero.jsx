import React from 'react'
import Galaxy from './Galaxy';
import Navbar from './Navbar';
import BlurText from "./BlurText";
import './Hero.css'
import SplitText from "./SplitText";
import CoinList from './CoinList';
const Hero = () => {
    return (
        <div style={{ width: '100%', height: '90%', position: 'relative', background: 'black' }}>
            <Galaxy>
                <div className="hero-items">
                    <div className="hero-tag-line">
                        <SplitText
                            text="Crypto Tracker"
                            className="hero-text"
                            delay={100}
                            duration={0.6}
                            ease="power3.out"
                            splitType="chars"
                            from={{ opacity: 0, y: 40 }}
                            to={{ opacity: 1, y: 0 }}
                            threshold={0.1}
                            rootMargin="-100px"
                            textAlign="center"
                        />
                        <BlurText
                            text="Track your Crypto Coins !!"
                            delay={150}
                            animateBy="words"
                            direction="top"
                            className="hero-para"
                        />
                    </div>
                    <div className="coin-corausal">
                          <CoinList/>
                    </div>
                </div>
            </Galaxy>
        </div>
    )
}

export default Hero