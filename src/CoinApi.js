export const getTrendingCoins =(currency)=>{
    return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1`
}

export const getCoinList =(currency)=>{
    return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false`
}

export const getSingleCoin =(id)=>{
    return `https://api.coingecko.com/api/v3/coins/${id}`
}

export const getHistoricData = (id , days =365 , currency) => `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
