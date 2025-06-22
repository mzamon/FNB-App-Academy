class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = undefined;
        this.resetScreen = false;
        this.maxDisplayLength = 9;
        
        this.display = document.getElementById('display');
        this.initialize();
    }
    
    initialize() {
        document.querySelectorAll('.btn.number').forEach(button => {
            button.addEventListener('click', () => this.appendNumber(button.textContent));
        });
        
        document.querySelectorAll('.btn.operator').forEach(button => {
            if (!['clear', 'equals', 'sign', 'percent'].includes(button.id)) {
                button.addEventListener('click', () => this.setOperation(button.textContent));
            }
        });
        
        document.getElementById('clear').addEventListener('click', () => this.clear());
        document.getElementById('equals').addEventListener('click', () => this.calculate());
        document.getElementById('decimal').addEventListener('click', () => this.appendDecimal());
        document.getElementById('sign').addEventListener('click', () => this.toggleSign());
        document.getElementById('percent').addEventListener('click', () => this.percentage());
    }
    
    appendNumber(number) {
        if (this.currentInput === '0' || this.resetScreen) {
            this.currentInput = number;
            this.resetScreen = false;
        } else {
            if (this.currentInput.length < this.maxDisplayLength) {
                this.currentInput += number;
            }
        }
        this.updateDisplay();
    }
    
    appendDecimal() {
        if (this.resetScreen) {
            this.currentInput = '0.';
            this.resetScreen = false;
            return;
        }
        if (!this.currentInput.includes('.')) {
            this.currentInput += '.';
        }
        this.updateDisplay();
    }
    
    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = undefined;
        this.updateDisplay();
    }
    
    setOperation(operator) {
        if (this.operation !== undefined) this.calculate();
        this.previousInput = this.currentInput;
        this.operation = operator;
        this.resetScreen = true;
    }
    
    calculate() {
        let computation;
        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        
        if (isNaN(prev)) return;
        
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return;
        }
        
        this.currentInput = this.formatResult(computation);
        this.operation = undefined;
        this.previousInput = '';
        this.resetScreen = true;
        this.updateDisplay();
    }
    
    toggleSign() {
        this.currentInput = (parseFloat(this.currentInput) * -1).toString();
        this.updateDisplay();
    }
    
    percentage() {
        this.currentInput = (parseFloat(this.currentInput) / 100).toString();
        this.updateDisplay();
    }
    
    formatResult(result) {
        const strResult = result.toString();
        if (strResult.length > this.maxDisplayLength) {
            return parseFloat(result.toPrecision(this.maxDisplayLength - 2)).toString();
        }
        return strResult;
    }
    
    updateDisplay() {
        this.display.textContent = this.currentInput;
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});