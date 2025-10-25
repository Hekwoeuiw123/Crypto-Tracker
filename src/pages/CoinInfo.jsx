import React, { useContext, useState, useEffect } from 'react'
import './CoinInfo.css'
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import { ClipLoader } from "react-spinners"
import { useParams } from 'react-router-dom'
import { Crypto } from '../CryptoContext'
import { getHistoricData, getSingleCoin } from '../CoinApi'

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Title, Tooltip, Legend);

const CoinInfo = () => {
    const DAYS_OPTIONS = [
        { label: "1D", days: 1 },
        { label: "7D", days: 7 },
        { label: "30D", days: 30 },
        { label: "90D", days: 90 },
        { label: "1Y", days: 365 }
    ];

    const [data, setData] = useState({})
    const [chartData, setChartData] = useState(null)
    const [days, setDays] = useState(365)
    const { id } = useParams()
    const { currency, symbol } = useContext(Crypto)
    const fetchCoinDetails = async () => {
        try {
            const trend = await fetch(getSingleCoin(id))
            const res = await trend.json()
            setData(res)
        } catch (error) {
            console.log("Error Occurred !!! ", error)
        }
    }
    const fetchCoinChart = async (daysParam = days) => {
        try {
            const res = await fetch(getHistoricData(id, daysParam, currency));
            const json = await res.json();

            const labels = json.prices.map((p) => {
                const date = new Date(p[0]);
                return daysParam === 1
                    ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                    : date.toLocaleDateString();
            });

            const prices = json.prices.map((p) => p[1]);

            setChartData({
                labels,
                datasets: [
                    {
                        label: `${id.toUpperCase()} Price (Last ${daysParam} Days)`,
                        data: prices,
                        borderColor: "limegreen",
                        borderWidth: 2,
                        tension: 0.3,
                        pointRadius: 0,
                    },
                ],
            });
        } catch (err) {
            if (err.name !== "AbortError") {
                console.error("Fetch error:", err);
            }
        }
    };
    useEffect(() => {
        fetchCoinDetails()
        fetchCoinChart(days);
    }, [currency, days])
    return (
        <>
            {id ?
                <div className='container'>
                    <div className="coin-data">
                        {data ? <><img src={data?.image?.large} alt={data?.name} className="coin-logo" />
                            <h1>{data?.name}</h1>
                            <p className='coin-full-info' dangerouslySetInnerHTML={{ __html: data?.description?.en }}></p>

                            <h3>Current Price: <span>{symbol} {data?.market_data?.current_price?.[currency.toLowerCase()]}</span></h3>
                            <h3>Market Cap: <span>{symbol} {data?.market_data?.market_cap?.[currency.toLowerCase()]}</span></h3>
                            <h3>Rank: <span>#{data?.market_cap_rank}</span></h3></> : (
                            <div className="centered-loader"><ClipLoader color="#36d7b7" size={40} /></div>
                        )}

                    </div>
                    <div className="coin-chart">
                        {chartData ? (
                            <>
                                <Line
                                    data={chartData}
                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                labels: { color: "white" }
                                            },
                                            title: {
                                                display: true,
                                                text: `${data?.name} Price Chart`,
                                                color: "cyan"
                                            }
                                        },
                                        scales: {
                                            x: {
                                                ticks: { color: "white" },
                                                grid: { color: "black" }
                                            },
                                            y: {
                                                ticks: { color: "white" },
                                                grid: { color: "black" }
                                            }
                                        }
                                    }}
                                />
                                <div className="days-selector" role="tablist" aria-label="Select days range">
                                    {DAYS_OPTIONS.map((opt) => {
                                        const active = String(opt.days) === String(days);
                                        return (
                                            <button
                                                key={opt.label}
                                                className={`day-btn ${active ? "active" : ""}`}
                                                onClick={() => setDays(opt.days)}
                                                aria-pressed={active}
                                            >
                                                {opt.label}
                                            </button>
                                        );
                                    })}
                                </div></>

                        ) : (
                            <div className="centered-loader"><ClipLoader color="#36d7b7" size={40} /></div>
                        )}
                    </div>
                </div>
                : <h1>404 !!! Not Found</h1>}
        </>
    )
}

export default CoinInfo