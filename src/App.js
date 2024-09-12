import { useState } from 'react';
import './App.css';

export default function App() {
  const [harfler, setHarfler] = useState([]);
  const [undoStack, setUndoStack] = useState([]);

  const alfabe = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  const colors = ['red', 'green', 'blue', 'purple', 'orange']; // Rastgele renkler için bir dizi

  let hoverTimer; // Mouse harfin üzerinde fazla durduğunda tetiklenecek zamanlayıcı

  const handleMouseClick = (event) => {
    const randomLet = alfabe[Math.floor(Math.random() * alfabe.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Rastgele bir renk seçimi

    //her tıklamada üretilecek yeni harf elemanı için
    const newHarf = {
      harf: randomLet,
      x: event.clientX - 22, // Harfin genişliğinin yarısı kadar sola kaydırma
      y: event.clientY - 22, // Harfin yüksekliğinin yarısı kadar yukarı kaydırma
      color: randomColor, // Renk bilgisi eklendi
    };

    setHarfler((prevHarfler) => [...prevHarfler, newHarf]);
    setUndoStack([]);
  };

  const handleMouseOver = (index) => {
    // Sallanma animasyonunu başlat
    const updatedHarfler = [...harfler];
    updatedHarfler[index].shake = true;
    setHarfler(updatedHarfler);

    // Mouse harfin üzerinde belirli bir süre durursa büyütme ve patlatma işlemini başlat
    hoverTimer = setTimeout(() => {
      handlePop(index);
    }, 2000); // 2 saniye boyunca mouse harfin üzerinde durursa patlasın
  };

  const handleMouseOut = (index) => {
    // Sallanma animasyonunu durdur ve zamanlayıcıyı sıfırla
    const updatedHarfler = [...harfler];
    updatedHarfler[index].shake = false;
    setHarfler(updatedHarfler);
    clearTimeout(hoverTimer); // Mouse harften çıktığında patlama işlemi iptal edilsin
  };

  const handlePop = (index) => {
    // Harfi büyütüp patlat ve stack'ten çıkar
    const updatedHarfler = [...harfler];
    updatedHarfler.splice(index, 1); // Harfi diziden çıkar
    setHarfler(updatedHarfler);
  };

  const handleUndo = () => {
    if (harfler.length > 0) {
      const lastHarf = harfler[harfler.length - 1];
      const newHarfler = harfler.slice(0, harfler.length - 1);
      setHarfler(newHarfler);
      setUndoStack([...undoStack, lastHarf]);
    }
  };

  const handleRedo = () => {
    if (undoStack.length > 0) {
      const lastUndone = undoStack[undoStack.length - 1];
      setHarfler([...harfler, lastUndone]);
      setUndoStack(undoStack.slice(0, undoStack.length - 1));
    }
  };

  const handleDelete = () => {
    setHarfler([]);
    setUndoStack([]);
  };

  return (
    <div className="main">
      <div className="harfAlan" onClick={handleMouseClick}>
        {harfler.map((item, index) => (
          <div
            key={index}
            className={`harf ${item.shake ? 'shake' : ''}`} // Sallanma ve büyüme animasyonu ekleniyor
            draggable
            onMouseOver={() => handleMouseOver(index)} // Mouse üzerine geldiğinde animasyonu başlat
            // onMouseOut={() => handleMouseOut(index)} // Mouse ayrıldığında animasyonu durdur
            style={{
              position: 'absolute',
              top: item.y,
              left: item.x,
              fontSize: '44px',
              color: item.color,
              animation: item.shake ? 'shake 2s infinite' : '', // Sallanma ve büyüme animasyonu
            }}
          >
            {item.harf}
          </div>
        ))}
      </div>
      <div className="buttons">
        <button onClick={handleUndo}>Undo</button>
        <button onClick={handleRedo} disabled={undoStack.length === 0}>
          Redo
        </button>
        <button onClick={handleDelete}>Delete All</button>
      </div>
    </div>
  );
  
}
