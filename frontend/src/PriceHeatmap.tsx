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
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const token = "KIS-DOMINIK-BOSCH-BEUGRO"; 

useEffect(() => 
  {

    const fetchPrices = fetch("http://127.0.0.1:8000/api/prices", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    const fetchSavedBlocks = fetch("http://127.0.0.1:8000/api/time-blocks", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    }).then((res) => res.json());

    Promise.all([fetchPrices, fetchSavedBlocks])
      .then(([pricesData, savedBlocksData]) => {
        if (pricesData.error) throw new Error(pricesData.error);
        if (!Array.isArray(pricesData)) throw new Error("Ez nem egy tömb!");

        setPrices(pricesData);

        if (Array.isArray(savedBlocksData)) {
          setSelectedBlocks(savedBlocksData);
        }

        setLoading(false);
      })
      .catch((err) => 
      {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const toggleBlock = (datetime: string) => {
    setMessage(null);
    if (selectedBlocks.includes(datetime)) {
      setSelectedBlocks(selectedBlocks.filter((b) => b !== datetime));
    } else {
      setSelectedBlocks([...selectedBlocks, datetime]);
    }
  };

  var onlyPrices = prices.map(x => x.priceHufKWh);
  var minPrice = Math.min(...onlyPrices);
  var maxPrice = Math.max(...onlyPrices);
  var avgPrice = onlyPrices.reduce((a, b) => a + b, 0) / onlyPrices.length;

  function  getBackgroundColor(price: number) : string
  {
    var ratio = (price - minPrice) / (maxPrice - minPrice);
    
    const hue = (1 - ratio) * 120; 
    return `hsl(${hue}, 70%, 45%)`;
  }

  const handleSave = () => {
    setMessage(null);

    if (selectedBlocks.length < 2) {
      alert("A fűtési időszaknak legalább 30 percesnek kell lennie!");
      return;
    }

    const hasForbiddenBlock = selectedBlocks.some((datetime) => {
      const timePart = datetime.split(' ')[1];
      if (!timePart) return false;
      const hour = parseInt(timePart.split(':')[0], 10);
      return hour === 23;
    });

    if (hasForbiddenBlock) {
      alert('Hiba: A 23:00 és 00:00 közötti időszakban tilos a fűtés beállítása!');
      return;
    }
    const selectedPriceObjects = prices.filter((p) => selectedBlocks.includes(p.time.toString()));
    const hasExpensiveBlock = selectedPriceObjects.some((p) => p.priceHufKWh > avgPrice);

    if (hasExpensiveBlock) {
      alert(`A kijelölt időszakok között van olyan, ami meghaladja a napi átlagárat (${avgPrice.toFixed(2)} HUF/kWh).`);
    }

    fetch("http://127.0.0.1:8000/api/time-blocks", {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        time_blocks: selectedBlocks,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message || "Sikeres mentés!");
      })
      .catch((err) => {
        alert("Hiba a mentés során: " + err.message);
      });
  };

  if (loading) return <div>Betöltés...</div>;
  if (error) return <div>Hiba: {error}</div>;

  return (
  <div>
      <span>Napi átlagár: <strong>{avgPrice.toFixed(2)} HUF/kWh</strong></span>

      <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '15px' }}>
        Kattints a 15 perces blokkokra a fűtési időszakok kijelöléséhez/törléséhez!
      </p>

      <div
        style={{
          display: 'flex',
          overflowX: 'auto',
          border: '1px solid #444',
          borderRadius: '8px',
          padding: '8px',
          backgroundColor: '#1e1e1e',
          marginBottom: '20px',
        }}
      >
        {prices.map((item, index) => {
          const isSelected = selectedBlocks.includes(item.time.toString());
          return (
            <div
              key={index}
              onClick={() => toggleBlock(item.time.toString())}
              style={{
                flex: '0 0 70px',
                backgroundColor: getBackgroundColor(item.priceHufKWh),
                color: 'white',
                padding: '10px 2px',
                textAlign: 'center',
                fontSize: '11px',
                marginRight: '4px',
                borderRadius: '6px',
                cursor: 'pointer',
                border: isSelected ? '3px solid #ffffff' : '1px solid transparent',
                position: 'relative',
              }}
              title={`${item.time.toString()} - ${item.priceHufKWh} HUF/kWh`}
            >
              {isSelected}
              <div>{item.time ? item.time.toString().split(' ')[1] : '--:--'}</div>
              <strong style={{ display: 'block', marginTop: '6px', fontSize: '12px' }}>
                {typeof item.priceHufKWh === 'number' ? item.priceHufKWh : '-'}
              </strong>
              <span style={{ fontSize: '9px', opacity: 0.8 }}>HUF</span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Preferált időszakok mentése ({selectedBlocks.length} blokk / {selectedBlocks.length * 15} perc)
        </button>

        {message && (
          <span style={{ color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>
            {message}
          </span>
        )}
      </div>
    </div>
  );
};
