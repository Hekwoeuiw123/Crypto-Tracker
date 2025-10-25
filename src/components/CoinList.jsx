import React, { useContext, useEffect, useState } from 'react'
import './CoinList.css'
import { Crypto } from '../CryptoContext'
import { getTrendingCoins } from '../CoinApi'
import { ClipLoader } from "react-spinners"

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import { Link } from 'react-router-dom'

const CoinList = () => {
  const { currency, symbol } = useContext(Crypto)
  const [isLoading, setIsLoading] = useState(false)
  const [trendingData, setTrendingData] = useState([])

  const settings = {
    dots: false,
    
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 2000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 967, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } }
    ]
  }

  const fetchTrendingCoin = async () => {
    try {
      setIsLoading(true)
      const trend = await fetch(getTrendingCoins(currency))
      const data = await trend.json()
      setTrendingData(data)
    } catch (error) {
      console.log("Error Occurred !!! ", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTrendingCoin()
  }, [currency])


  return (
    <div className='card-carousel'>
      {isLoading && (
        <div className="loader">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      )}

      {!isLoading && trendingData.length > 0 && (
        <Slider {...settings}>
          {trendingData.map((coin) => (
            <Link to={`/coin-info/${coin.id}`} key={coin.id}>
            <div className='card-container' >
              <h2>#{coin.market_cap_rank}</h2>
              <div className="coin-img">
                <img src={coin.image} alt={coin.name} width={60} />
              </div>
              <div className="coin-info">
                <div className="coin-name">
                  <h2>{coin.symbol.toUpperCase()}</h2>
                  <h3
                    style={{
                      color:
                        coin.price_change_percentage_24h > 0
                          ? "limegreen"
                          : "red",
                    }}
                  >
                    {(coin.price_change_percentage_24h).toFixed(2)}%
                  </h3>
                </div>
                <h1>{symbol} {coin.current_price}</h1>
              </div>
            </div></Link>
          ))}
          
        </Slider>
      )}
    </div>
  )
}

export default CoinList
