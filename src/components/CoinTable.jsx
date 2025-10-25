import React, { useContext, useEffect, useMemo, useState } from "react";
import "./CoinTable.css";
import { getCoinList } from "../CoinApi";
import { Crypto } from "../CryptoContext";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useDebounceFunction from "../hooks/useDebounceFunction";
import useDebounceValue from "../hooks/useDebounceValue";

const CoinTable = () => {
  const { currency, symbol } = useContext(Crypto);
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch coin list
  const fetchCoins = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(getCoinList(currency));
      const data = await response.json();
      setCoins(data);
    } catch (error) {
      console.log("Error fetching coins:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, [currency]);

 const handleSearch = (value) => {
  setSearchTerm(value);
};

  const debouncedSearchTerm  = useDebounceValue(searchTerm, 1000);

  const filteredCoins = useMemo(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [coins, debouncedSearchTerm]);

  return (
    <div className="cointable-container">
      <div className="heading">
        <h1>Explore Coins Market</h1>
        <p>View all major cryptocurrencies with price updates in real time.</p>
      </div>

      <div className="search-coin">
        <input
          type="text"
          placeholder="Search by name or symbol..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="loader">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (
        <div className="coin-table">
          <table>
            <thead>
              <tr>
                <th>Coin</th>
                <th>Price</th>
                <th>24h Change</th>
                <th>Market Cap</th>
              </tr>
            </thead>
            <tbody>
              {filteredCoins.map((coin) => (
                <tr
                  key={coin.id}
                  onClick={() => navigate(`/coin-info/${coin.id}`)}
                >
                  <td className="coin-name">
                    <img src={coin.image} alt={coin.name} width="35" />
                    <div>
                      <strong>{coin.name}</strong>
                      <span>({coin.symbol.toUpperCase()})</span>
                    </div>
                  </td>
                  <td>
                    {symbol} {coin.current_price.toLocaleString()}
                  </td>
                  <td
                    style={{
                      color:
                        coin.price_change_percentage_24h > 0
                          ? "limegreen"
                          : "red",
                    }}
                  >
                    {coin.price_change_percentage_24h.toFixed(2)}%
                  </td>
                  <td>
                    {symbol} {coin.market_cap.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoinTable;
