import React, { useState, useEffect, useRef, KeyboardEvent } from 'react';
import { Display } from './Display';
import { CalculatorUtils } from '../utils';
import { Display as DisplayType, Operation, CalculatorTheme } from '../types';

export const Calculator: React.FC = () => {
  const [theme, setTheme] = useState<CalculatorTheme>({
    isDark: false,
    background: '#ffffff',
    display: '#ffffff',
    button: {
      background: '#f8f9fa',
      hover: '#e9ecef',
      text: '#2d3436',
      action: '#74b9ff',
      special: '#fdcb6e',
    },
  });

  const [display, setDisplay] = useState<DisplayType>({
    value: '0',
    decimal: 0,
    isScientific: false,
    history: [],
    memory: 0,
  });

  const [isDark, setIsDark] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [angle, setAngle] = useState('deg');
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const displayRef = useRef<HTMLDivElement>(null);
  const currentOperation = useRef<Operation | null>(null);
  const pendingValue = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.style.setProperty('--bg-color', '#1a1a1a');
      root.style.setProperty('--text-color', '#ffffff');
      root.style.setProperty('--button-bg', '#2d2d2d');
      root.style.setProperty('--button-hover', '#404040');
      root.style.setProperty('--button-text', '#ffffff');
      root.style.setProperty('--action-color', '#0984e3');
      root.style.setProperty('--special-color', '#fdcb6e');
    } else {
      root.style.setProperty('--bg-color', '#ffffff');
      root.style.setProperty('--text-color', '#2d3436');
      root.style.setProperty('--button-bg', '#f8f9fa');
      root.style.setProperty('--button-hover', '#e9ecef');
      root.style.setProperty('--button-text', '#2d3436');
      root.style.setProperty('--action-color', '#74b9ff');
      root.style.setProperty('--special-color', '#fdcb6e');
    }

    updateTheme();
  }, [isDark]);

  const updateTheme = () => {
    setTheme({
      isDark,
      background: isDark ? '#1a1a1a' : '#ffffff',
      display: isDark ? '#2d2d2d' : '#ffffff',
      button: {
        background: isDark ? '#2d2d2d' : '#f8f9fa',
        hover: isDark ? '#404040' : '#e9ecef',
        text: isDark ? '#ffffff' : '#2d3436',
        action: isDark ? '#0984e3' : '#74b9ff',
        special: isDark ? '#fdcb6e' : '#fdcb6e',
      },
    });
  };

  const handleButtonClick = (value: string) => {
    if (isAnimating) return;
    setActiveButton(value);
    setIsAnimating(true);

    setTimeout(() => {
      setActiveButton(null);
      setIsAnimating(false);
    }, 150);

    if (value === 'AC') {
      setDisplay({ ...display, value: '0', decimal: 0, error: undefined });
      currentOperation.current = null;
      pendingValue.current = null;
      return;
    }

    if (value === 'C') {
      setDisplay({ ...display, value: '0', decimal: 0, error: undefined });
      return;
    }

    if (value === '<') {
      const newValue = display.value === '0' ? '0' : display.value.slice(0, -1);
      setDisplay({ ...display, value: newValue });
      return;
    }

    if (value === '±') {
      const newDecimal = display.decimal * -1;
      const newValue = CalculatorUtils.toggleSign(display.value);
      setDisplay({ ...display, value: newValue, decimal: newDecimal });
      return;
    }

    if (value === '%') {
      const result = CalculatorUtils.calculate(display, '%', display.decimal);
      setDisplay(result);
      return;
    }

    if (value === '÷') {
      currentOperation.current = '÷';
      pendingValue.current = display.decimal;
      const result = CalculatorUtils.calculate(display, '÷', 1);
      setDisplay(result);
      setHistory([...history, `${display.value} ÷ 1 = ${result.value}`]);
      return;
    }

    if (value === '×') {
      currentOperation.current = '×';
      pendingValue.current = display.decimal;
      const result = CalculatorUtils.calculate(display, '×', 1);
      setDisplay(result);
      setHistory([...history, `${display.value} × 1 = ${result.value}`]);
      return;
    }

    if (value === '-') {
      currentOperation.current = '-';
      pendingValue.current = display.decimal;
      const result = CalculatorUtils.calculate(display, '-', 0);
      setDisplay(result);
      setHistory([...history, `${display.value} - 0 = ${result.value}`]);
      return;
    }

    if (value === '+') {
      currentOperation.current = '+';
      pendingValue.current = display.decimal;
      const result = CalculatorUtils.calculate(display, '+', 0);
      setDisplay(result);
      setHistory([...history, `${display.value} + 0 = ${result.value}`]);
      return;
    }

    if (value === '=') {
      if (currentOperation.current && pendingValue.current !== null) {
        const result = CalculatorUtils.calculate(display, currentOperation.current, pendingValue.current);
        setDisplay(result);
        setHistory([...history, `${pendingValue.current} ${currentOperation.current} ${display.value} = ${result.value}`]);
        currentOperation.current = null;
        pendingValue.current = null;
      }
      return;
    }

    if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'].includes(value)) {
      let newValue = display.value === '0' && value !== '.' ? value : CalculatorUtils.insertString(display.value, value, 0);
      if (value === '.') {
        const hasDecimal = newValue.includes('.');
        if (!hasDecimal) {
          newValue = newValue + '.0';
        }
      }
      setDisplay({ ...display, value: newValue });
    }

    if (value === '√') {
      const result = Math.sqrt(display.decimal);
      setDisplay({ ...display, value: result.toString(), decimal: result });
      return;
    }

    if (value === '^') {
      currentOperation.current = '^' as Operation;
      pendingValue.current = display.decimal;
      return;
    }

    if (value === 'π') {
      const result = Math.PI;
      setDisplay({ ...display, value: result.toString(), decimal: result });
      return;
    }

    if (value === 'e') {
      const result = Math.E;
      setDisplay({ ...display, value: result.toString(), decimal: result });
      return;
    }

    if (value === 'M+') {
      setMemory(display.decimal);
      return;
    }

    if (value === 'MR') {
      setDisplay({ ...display, value: memory.toString(), decimal: memory });
      return;
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    let key = e.key;
    if (key === 'Enter') key = '=';
    if (key === 'Backspace') key = '<';
    if (key === 'Escape') key = 'AC';
    if (key === '+') key = '×';
    if (key === '-') key = '-';
    if (key === '/') key = '÷';
    if (key === 'x' || key === 'X') key = '×';
    if (['+', '-', '*', '/', '^', '%', '('].includes(key)) {
      e.preventDefault();
    }
    handleButtonClick(key);
  };

  const handleDecimalChange = (value: number) => {
    setMemory(value);
  };

  return (
    <div className="calculator-container">
      <div className="header">
        <button
          className="theme-toggle"
          onClick={() => setIsDark(!isDark)}
          aria-label="Toggle dark mode"
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <h1>Calculator</h1>
      </div>

      <div className="display-wrapper">
        <Display
          ref={displayRef}
          display={display}
          theme={theme}
          onDecimalChange={handleDecimalChange}
          onScientificToggle={() => setDisplay({ ...display, isScientific: !display.isScientific})}
        />
      </div>

      <div className="angle-switch">
        <button
          className={`${angle === 'deg' ? 'active' : ''}`}
          onClick={() => setAngle('deg')}
        >
          Deg
        </button>
        <button
          className={`${angle === 'rad' ? 'active' : ''}`}
          onClick={() => setAngle('rad')}
        >
          Rad
        </button>
      </div>

      <div className="button-grid">
        {
          [
            ['AC', 'C', '<', '÷',
             '7', '8', '9', '×',
             '4', '5', '6', '-',
             '1', '2', '3', '+',
             '0', '.', '=', '+/',
             '%', 'M+', 'MR', 'MC']
          ].map((row, rowIndex) => (
            <div key={rowIndex} className="button-row">
              {row.map((button) => {
                const isAction = ['÷', '×', '-', '+', '=', '+/'].includes(button);
                const isSpecial = ['AC', 'C', '<', '%', 'M+', 'MR', 'MC'].includes(button);
                const isNumber = !isNaN(parseInt(button)) || button === '.';

                return (
                  <button
                    key={button}
                    className={`calculator-button ${isAction ? 'action' : ''} ${isSpecial ? 'special' : ''} ${isNumber ? 'number' : ''}`}
                    onClick={() => handleButtonClick(button)}
                    disabled={isAnimating}
                    style={{
                      backgroundColor: button === activeButton ? theme.button.action : theme.button.background,
                      color: theme.button.text,
                      transform: button === activeButton ? 'scale(0.95)' : 'scale(1)',
                    }}
                  >
                    {CalculatorUtils.getButtonText(button, display)}
                  </button>
                );
              })}
            </div>
          ))
        }
      </div>

      <div className="memory-panel">
        <div>Memory: {memory}</div>
        <div>History: {history.length} entries</div>
        <div>Angle: {angle}</div>
      </div>

      {history.length > 0 && (
        <div className="history-panel">
          <h3>History</h3>
          <ul>
            {history.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .calculator-container {
          max-width: 400px;
          margin: 50px auto;
          background-color: var(--bg-color);
          color: var(--text-color);
          border-radius: 20px;
          padding: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .calculator-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 30px 50px rgba(0, 0, 0, 0.15);
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .header h1 {
          font-size: 24px;
          font-weight: 700;
          margin: 0;
        }
        .theme-toggle {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 10px;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        .theme-toggle:hover {
          background-color: var(--button-hover);
        }
        .display-wrapper {
          margin-bottom: 20px;
        }
        .angle-switch {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
        }
        .angle-switch button {
          flex: 1;
          padding: 10px;
          border: 1px solid var(--button-bg);
          background-color: var(--button-bg);
          color: var(--button-text);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .angle-switch button.active {
          background-color: var(--action-color);
          color: white;
        }
        .button-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }
        .button-row {
          display: contents;
        }
        .calculator-button {
          padding: 16px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow: hidden;
        }
        .calculator-button:active {
          transform: scale(0.95);
        }
        .calculator-button:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }
        .number {
          background-color: var(--button-bg);
          color: var(--button-text);
        }
        .action {
          background-color: var(--action-color);
          color: white;
        }
        .special {
          background-color: var(--special-color);
          color: var(--button-text);
        }
        .memory-panel {
          display: flex;
          justify-content: space-between;
          padding: 15px;
          background-color: var(--button-bg);
          border-radius: 12px;
          margin-bottom: 20px;
          font-size: 14px;
        }
        .history-panel {
          background-color: var(--button-bg);
          border-radius: 12px;
          padding: 15px;
        }
        .history-panel h3 {
          margin: 0 0 10px 0;
          font-size: 16px;
        }
        .history-panel ul {
          list-style: none;
          padding: 0;
          margin: 0;
          max-height: 200px;
          overflow-y: auto;
        }
        .history-panel li {
          padding: 8px 0;
          border-bottom: 1px solid var(--button-hover);
          font-size: 14px;
        }
        .history-panel li:last-child {
          border-bottom: none;
        }
        @media (prefers-color-scheme: dark) {
          .calculator-container {
            background-color: var(--dark-bg, #1a1a1a);
          }
        }
      `}</style>
    </div>
  );
};