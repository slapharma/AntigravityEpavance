document.addEventListener('DOMContentLoaded', function () {
    const targetInput = document.getElementById('target-level');
    const targetDisplay = document.getElementById('target-display');
    const currentInput = document.getElementById('current-level');
    const formButtons = document.querySelectorAll('.form-btn');
    const resultNumber = document.getElementById('result-number');

    let currentForm = 'unknown'; // Default

    // Constants derived from OmegaQuant calculator analysis
    const FACTOR_TG = 363; // Triglyceride and Phospholipid
    const FACTOR_EE = 556; // Ethyl Ester and Unknown

    function updateCalculation() {
        const target = parseFloat(targetInput.value);
        const current = parseFloat(currentInput.value);

        // Update target display
        targetDisplay.textContent = target.toFixed(1) + '%';

        if (isNaN(current) || current < 0) {
            resultNumber.textContent = '0';
            return;
        }

        let deficit = target - current;
        if (deficit <= 0) {
            resultNumber.textContent = '0';
            return;
        }

        let factor = FACTOR_EE; // Default
        if (currentForm === 'triglyceride' || currentForm === 'phospholipid') {
            factor = FACTOR_TG;
        } else {
            factor = FACTOR_EE;
        }

        let needed = deficit * factor;

        // Round to nearest 10
        needed = Math.round(needed / 10) * 10;

        // Animate the number change (simple version)
        resultNumber.textContent = needed.toLocaleString();
    }

    // Event Listeners
    targetInput.addEventListener('input', updateCalculation);
    currentInput.addEventListener('input', updateCalculation);

    formButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all
            formButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked
            this.classList.add('active');
            // Update current form
            currentForm = this.getAttribute('data-form');
            updateCalculation();
        });
    });

    // Initial calculation
    updateCalculation();
});
