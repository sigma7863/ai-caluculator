import { useState, useCallback, useRef } from 'react';
import { Display } from './Display';
import { Keypad } from './Keypad';
import { useKeyboard } from '../hooks/useKeyboard';
import { useCalculator } from '../hooks/useCalculator';

export function Calculator() {
  const {
    displayValue,
    previousValue,
    operator,
    waitingForOperand,
    error,
    input,
    handleNumber,
    handleOperator,
    handleEquals,
    handleClear,
    handleClearEntry,
    handlePercent,
    handleToggleSign,
    handleDecimal,
    handleBackspace,
  } = useCalculator();

  const keystrokeRef = useRef<HTMLDivElement>(null);

  useKeyboard({
    onNumber: handleNumber,
    onOperator: handleOperator,
    onEquals: handleEquals,
    onClear: handleClear,
    onClearEntry: handleClearEntry,
    onPercent: handlePercent,
    onToggleSign: handleToggleSign,
    onDecimal: handleDecimal,
    onBackspace: handleBackspace,
  });

  const [showToast, setShowToast] = useState<string | null>(null);

  return (
    <div className="calculator" role="application" aria-label="Calculator">
      <div className="calculator-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <Display
        value={displayValue}
        previousValue={previousValue}
        operator={operator}
        waitingForOperand={waitingForOperand}
        error={error}
        input={input}
      />

      <Keypad
        onNumber={handleNumber}
        onOperator={handleOperator}
        onEquals={handleEquals}
        onClear={handleClear}
        onClearEntry={handleClearEntry}
        onPercent={handlePercent}
        onToggleSign={handleToggleSign}
        onDecimal={handleDecimal}
        onBackspace={handleBackspace}
        waitingForOperand={waitingForOperand}
        error={error}
      />

      {showToast && (
        <div className="toast show" role="status" aria-live="polite">
          {showToast}
        </div>
      )}

      <div
        ref={keystrokeRef}
        className="keystroke-indicator"
        aria-hidden="true"
      />
    </div>
  );
}