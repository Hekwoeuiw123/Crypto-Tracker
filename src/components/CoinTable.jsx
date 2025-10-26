import React, { useContext, useEffect, useMemo, useState } from "react";
import "./CoinTable.css";
import { getCoinList } from "../CoinApi";
import { Crypto } from "../CryptoContext";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import useDebounceValue from "../hooks/useDebounceValue";

const CoinTable = () => {
  const { currency, symbol } = useContext(Crypto);
  const [coins, setCoins] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pages, setPages] = useState(1)
  const [pageSize, setPageSize] = useState(10);
  const debouncedSearchTerm = useDebounceValue(searchTerm, 1000);
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


  const filteredCoins = useMemo(() => {
    return coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [coins, debouncedSearchTerm]);

  const totalItems = filteredCoins.length
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  useEffect(() => {
    if (totalPages < pages) {
      setPages(totalPages)
    }
  }, [pages, totalPages])

  const pageItems = useMemo(() => {
    const startIndex = (pages - 1) * pageSize 
    const endIndex = startIndex + pageSize
    return filteredCoins.slice(startIndex, endIndex)
  }, [filteredCoins, pageSize, pages])


   const gotoPage = (p) => setPages(Math.max(1, Math.min(totalPages, p)));
   const handlePageSizeChange = (e) => {
    setPageSize(Number(e.target.value));
    setPages(1);
  };
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
        <select value={pageSize} onChange={handlePageSizeChange}>
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>
       

      {isLoading ? (
        <div className="loader">
          <ClipLoader color="#36d7b7" size={50} />
        </div>
      ) : (<>
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
              {pageItems.map((coin) => (
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
         {/* Pagination controls */}
          <div className="pagination">
            <button style={{pointerEvents:pages === 1?"none":"visible"}} onClick={() => gotoPage(1)} disabled={pages === 1}>First</button>
            <button style={{pointerEvents:pages === 1?"none":"visible"}} onClick={() => gotoPage(pages - 1)} disabled={pages === 1}>Prev</button>

            <span>Page {pages} of {totalPages}</span>

            <button style={{pointerEvents:pages === totalPages?"none":"visible"}} onClick={() => gotoPage(pages + 1)} disabled={pages === totalPages}>Next</button>
            <button style={{pointerEvents:pages === totalPages?"none":"visible"}} onClick={() => gotoPage(totalPages)} disabled={pages === totalPages}>Last</button>
          </div></>
      )}
    </div>
  );
};

export default CoinTable;
