import React, { useEffect, useState } from 'react';

interface PriceData {
  time: number;
  priceHufKWh: number;
}

export const PriceHeatmap = () => 
{
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => 
  {
    const token = "KIS-DOMINIK-BOSCH-BEUGRO"; 

    fetch("/api/prices", 
    {
      /*headers: 
      {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },*/
    })
      .then((res) => 
      {
        if (!res.ok) 
        {
          throw new Error("Hiba történt az adatlekérés során!");
        }
        return res.json();
      })
      .then((data: PriceData[]) => 
      {
        setPrices(data);
        setLoading(false);
      })
      .catch((err) => 
      {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) 
    return <div>Árak betöltése...</div>;

  if (error) 
    return <div>Hiba: {error}</div>;

  var onlyPrices = prices.map(x => x.priceHufKWh);
  var minPrice = Math.min(...onlyPrices);
  var maxPrice = Math.max(...onlyPrices);

  function  getBackgroundColor(price: number) : string
  {
    var ratio = (price - minPrice) / (maxPrice - minPrice);
    
    const hue = (1 - ratio) * 120; 
    return `hsl(${hue}, 70%, 45%)`;
  }

  return (
    <div>
        {prices.map(item => (
          <div
            style={{
              display: 'inline-block',
              width: "60px",
              height: "30px",
              backgroundColor: getBackgroundColor(item.priceHufKWh),
              color: 'white',
              textAlign: 'center',
              fontSize: '11px',
            }}
          >
            {item.priceHufKWh}
          </div>
        ))}
      </div>
  );
}

