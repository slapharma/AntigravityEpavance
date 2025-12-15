document.addEventListener('DOMContentLoaded', function() {
    // --- Calculator Logic ---
    const targetInput = document.getElementById('target-level');
    const targetDisplay = document.getElementById('target-display');
    const currentInput = document.getElementById('current-level');
    const formButtons = document.querySelectorAll('.form-options .form-btn');
    const resultNumber = document.getElementById('result-number');

    let currentForm = 'unknown'; // Default

    // Constants derived from OmegaQuant calculator analysis
    const FACTOR_TG = 363; // Triglyceride and Phospholipid
    const FACTOR_EE = 556; // Ethyl Ester and Unknown

    function updateCalculation() {
        if (!targetInput || !currentInput) return;

        const target = parseFloat(targetInput.value);
        const current = parseFloat(currentInput.value);

        // Update target display
        if (targetDisplay) targetDisplay.textContent = target.toFixed(1) + '%';

        if (isNaN(current) || current < 0) {
            if (resultNumber) resultNumber.textContent = '0';
            return;
        }

        let deficit = target - current;
        if (deficit <= 0) {
            if (resultNumber) resultNumber.textContent = '0';
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
        if (resultNumber) resultNumber.textContent = needed.toLocaleString();
    }

    // Event Listeners for Calculator
    if (targetInput) targetInput.addEventListener('input', updateCalculation);
    if (currentInput) currentInput.addEventListener('input', updateCalculation);

    formButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all in this group
            const group = this.parentElement.querySelectorAll('.form-btn');
            group.forEach(b => b.classList.remove('active'));
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

// --- Assessment Wizard Logic ---
let userProfile = {
    age: '',
    gender: '',
    conditions: [],
    supplements: ''
};

function selectOption(btn, category, value) {
    // Handle UI selection
    const parent = btn.parentElement;
    // Deselect siblings
    const siblings = parent.querySelectorAll('.option-btn');
    siblings.forEach(sib => sib.classList.remove('selected'));
    
    // Select clicked
    btn.classList.add('selected');
    
    // Update data
    userProfile[category] = value;
}

function toggleOption(btn, category, value) {
    // Handle multiple selection for conditions
    if (value === 'None') {
        // If None is selected, clear others
        const parent = btn.parentElement;
        const siblings = parent.querySelectorAll('.option-btn');
        siblings.forEach(sib => {
            if (sib !== btn) sib.classList.remove('selected');
        });
        
        btn.classList.toggle('selected');
        
        if (btn.classList.contains('selected')) {
            userProfile[category] = ['None'];
        } else {
            userProfile[category] = [];
        }
    } else {
        // If a condition is selected, deselect 'None'
        const parent = btn.parentElement;
        const noneBtn = parent.querySelector('.option-btn.full-width');
        if (noneBtn) noneBtn.classList.remove('selected');
        
        // Remove 'None' from array if present
        const noneIndex = userProfile[category].indexOf('None');
        if (noneIndex > -1) userProfile[category].splice(noneIndex, 1);

        btn.classList.toggle('selected');
        
        // Update array
        if (btn.classList.contains('selected')) {
            if (!userProfile[category].includes(value)) {
                userProfile[category].push(value);
            }
        } else {
            const index = userProfile[category].indexOf(value);
            if (index > -1) {
                userProfile[category].splice(index, 1);
            }
        }
    }
}

function nextStep(stepNumber) {
    // Validate current step if needed
    if (stepNumber === 2) {
        if (!userProfile.age || !userProfile.gender) {
            alert('Please select your age and gender to continue.');
            return;
        }
    }
    
    showStep(stepNumber);
}

function prevStep(stepNumber) {
    showStep(stepNumber);
}

function showStep(stepNumber) {
    // Hide all steps
    document.querySelectorAll('.assessment-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    document.getElementById('step-' + stepNumber).classList.add('active');
    
    // Update progress
    const progress = (stepNumber - 1) * 33.33; // 4 steps total, so 0, 33, 66, 100
    // Actually for visual progress bar:
    // Step 1: 25%
    // Step 2: 50%
    // Step 3: 75%
    // Step 4: 100%
    const progressPercent = stepNumber * 25;
    document.getElementById('progress-fill').style.width = progressPercent + '%';
    document.getElementById('current-step').textContent = stepNumber;
}

function calculateAssessment() {
    if (!userProfile.supplements) {
        alert('Please select your current supplement routine.');
        return;
    }

    // Logic to estimate score
    // Baseline is usually around 4% for Western diet
    let estimatedScore = 4.0;

    // Adjust based on supplements
    if (userProfile.supplements === 'Standard') {
        estimatedScore += 1.5; // Poor absorption/low dose
    } else if (userProfile.supplements === 'HighEPA') {
        estimatedScore += 3.0; // Better
    } else if (userProfile.supplements === 'Vegan') {
        estimatedScore += 1.0; // ALA conversion is poor
    }

    // Adjust based on age (older people tend to have slightly higher levels due to accumulation/diet)
    if (userProfile.age === '51-70' || userProfile.age === '70+') {
        estimatedScore += 0.5;
    }

    // Cap at reasonable limits
    if (estimatedScore > 8.0) estimatedScore = 7.8; // Unlikely to be optimal without testing

    // Display result
    const resultText = document.getElementById('result-text');
    const scoreDisplay = document.getElementById('estimated-score');
    
    scoreDisplay.textContent = estimatedScore.toFixed(1) + '%';
    
    if (estimatedScore < 5.0) {
        scoreDisplay.style.color = '#d32f2f'; // Red
        resultText.innerHTML = `Based on your profile, your Omega-3 levels are likely <strong>suboptimal</strong>. Most people with a Western diet have an index below 5%.`;
    } else if (estimatedScore < 8.0) {
        scoreDisplay.style.color = '#f57c00'; // Orange
        resultText.innerHTML = `You're doing better than average, but likely still <strong>below the optimal 8% target</strong> for maximum protection.`;
    } else {
        scoreDisplay.style.color = '#2e7d32'; // Green
        resultText.innerHTML = `Your estimated levels look good! However, the only way to be certain is to test.`;
    }

    nextStep(4);
}

function showCalculator() {
    document.getElementById('assessment-section').style.display = 'none';
    document.getElementById('calculator-section').style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function showAssessment() {
    document.getElementById('calculator-section').style.display = 'none';
    document.getElementById('assessment-section').style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
}
