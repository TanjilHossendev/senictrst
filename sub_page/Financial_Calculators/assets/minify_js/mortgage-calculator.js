window.addEventListener('load', () => {
    // Utility Functions
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);

    // Dark Mode Toggle
    const darkModeToggle = $('#darkModeToggle');
    const html = document.documentElement;

    const applyDarkMode = (isDark) => {
        html.classList.toggle('dark', isDark);
        darkModeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    };

    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;

    applyDarkMode(isDarkMode);

    darkModeToggle.addEventListener('click', () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        applyDarkMode(isDarkMode);
    });

    // Mobile Menu
    const mobileMenuBtn = $('#mobileMenuBtn');
    const mobileMenu = $('#mobileMenu');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenuBtn.setAttribute('aria-expanded', !mobileMenu.classList.contains('hidden'));
    });

    // FAQ Accordion
    $$('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            const icon = button.querySelector('i');
            const isOpen = !answer.classList.contains('hidden');

            answer.classList.toggle('hidden');
            icon.classList.toggle('fa-chevron-down', isOpen);
            icon.classList.toggle('fa-chevron-up', !isOpen);
            button.setAttribute('aria-expanded', !isOpen);
        });
    });

    // Tooltip
    const tooltipTriggers = $$('.tooltip-trigger');
    let tooltipElement = null;

    const createTooltip = (text, target) => {
        tooltipElement = document.createElement('div');
        tooltipElement.className = 'absolute z-50 px-3 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm dark:bg-gray-700';
        tooltipElement.textContent = text;
        document.body.appendChild(tooltipElement);

        const targetRect = target.getBoundingClientRect();
        tooltipElement.style.left = `${targetRect.left + window.scrollX}px`;
        tooltipElement.style.top = `${targetRect.bottom + window.scrollY + 5}px`;
    };

    tooltipTriggers.forEach(trigger => {
        trigger.addEventListener('mouseenter', (e) => {
            const tooltipText = trigger.dataset.tooltip;
            createTooltip(tooltipText, trigger);
        });
        trigger.addEventListener('mouseleave', () => {
            if (tooltipElement) {
                tooltipElement.remove();
                tooltipElement = null;
            }
        });
    });

    // Mortgage Calculator Logic
    const mortgageForm = $('#mortgageForm');
    if (!mortgageForm) return;

    const homePriceInput = $('#homePrice');
    const downPaymentInput = $('#downPayment');
    const downPaymentPercentInput = $('#downPaymentPercent');
    const interestRateInput = $('#interestRate');
    const loanTermInput = $('#loanTerm');
    const extraPaymentInput = $('#extraPayment');
    const propertyTaxInput = $('#propertyTax');
    const homeInsuranceInput = $('#homeInsurance');
    const pmiInput = $('#pmi');

    // Sync down payment fields
    homePriceInput.addEventListener('input', () => updateDownPayment(true));
    downPaymentInput.addEventListener('input', () => updateDownPayment(true));
    downPaymentPercentInput.addEventListener('input', () => updateDownPayment(false));

    function updateDownPayment(isDollar) {
        const homePrice = parseFloat(homePriceInput.value) || 0;
        if (homePrice === 0) return;

        if (isDollar) {
            const downPayment = parseFloat(downPaymentInput.value) || 0;
            const percent = (downPayment / homePrice) * 100;
            downPaymentPercentInput.value = percent.toFixed(1);
        } else {
            const percent = parseFloat(downPaymentPercentInput.value) || 0;
            const downPayment = (homePrice * percent) / 100;
            downPaymentInput.value = downPayment.toFixed(0);
        }
    }

    // Tab navigation
    const basicTab = $('#basicTab');
    const advancedTab = $('#advancedTab');
    const basicContent = $('#basicContent');
    const advancedContent = $('#advancedContent');

    basicTab.addEventListener('click', () => {
        basicTab.classList.add('active');
        advancedTab.classList.remove('active');
        basicContent.classList.remove('hidden');
        advancedContent.classList.add('hidden');
    });

    advancedTab.addEventListener('click', () => {
        advancedTab.classList.add('active');
        basicTab.classList.remove('active');
        advancedContent.classList.remove('hidden');
        basicContent.classList.add('hidden');
    });

    // Form submission
    mortgageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateForm()) {
            calculateAndDisplay();
        }
    });

    mortgageForm.addEventListener('reset', () => {
        // Reset results and chart
        // ...
    });

    function validateForm() {
        let isValid = true;
        [homePriceInput, interestRateInput].forEach(input => {
            if (!input.value) {
                input.classList.add('border-red-500');
                isValid = false;
            } else {
                input.classList.remove('border-red-500');
            }
        });
        return isValid;
    }

    let paymentChart = null;

    function calculateAndDisplay() {
        const homePrice = parseFloat(homePriceInput.value) || 0;
        const downPayment = parseFloat(downPaymentInput.value) || 0;
        const interestRate = parseFloat(interestRateInput.value) || 0;
        const loanTerm = parseInt(loanTermInput.value) || 15;
        const extraPayment = parseFloat(extraPaymentInput.value) || 0;
        const propertyTax = parseFloat(propertyTaxInput.value) || 0;
        const homeInsurance = parseFloat(homeInsuranceInput.value) || 0;
        const pmi = parseFloat(pmiInput.value) || 0;

        const loanAmount = homePrice - downPayment;
        if (loanAmount <= 0) {
            alert("Home price must be greater than down payment.");
            return;
        }

        // Calculate for the selected term
        const mainResult = calculateMortgage(loanAmount, interestRate, loanTerm, extraPayment);
        displayMainResults(mainResult, propertyTax, homeInsurance, pmi);

        // Calculate for 15 vs 30 year comparison
        const result15 = calculateMortgage(loanAmount, interestRate, 15, 0);
        const result30 = calculateMortgage(loanAmount, interestRate, 30, 0);
        displayComparison(result15, result30);

        // Calculate extra payment impact
        const resultWithExtra = calculateMortgage(loanAmount, interestRate, loanTerm, extraPayment);
        displayExtraPaymentImpact(mainResult, resultWithExtra, extraPayment);

        // Generate Amortization Schedule
        generateAmortizationSchedule(mainResult);

        // Update Chart
        updateResultsChart(mainResult, propertyTax, homeInsurance, pmi);
    }

    function calculateMortgage(principal, annualRate, years, extraPayment = 0) {
        const monthlyRate = annualRate / 100 / 12;
        const numberOfPayments = years * 12;

        const monthlyPayment = monthlyRate > 0 ?
            principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / (Math.pow(1 + monthlyRate, numberOfPayments) - 1) :
            principal / numberOfPayments;

        let balance = principal;
        let totalInterest = 0;
        let amortization = [];
        let paymentsMade = 0;

        for (let i = 1; i <= numberOfPayments && balance > 0; i++) {
            const interestPayment = balance * monthlyRate;
            let principalPayment = monthlyPayment - interestPayment;
            const totalMonthlyPayment = monthlyPayment + extraPayment;

            if (balance < totalMonthlyPayment) {
                principalPayment = balance;
                balance = 0;
            } else {
                balance -= (principalPayment + extraPayment);
            }
            
            totalInterest += interestPayment;
            paymentsMade = i;

            amortization.push({
                month: i,
                payment: totalMonthlyPayment,
                principal: principalPayment + extraPayment,
                interest: interestPayment,
                balance: balance
            });
        }

        const totalPayment = principal + totalInterest;
        const payoffDate = new Date();
        payoffDate.setMonth(payoffDate.getMonth() + paymentsMade);

        return {
            principal,
            monthlyPayment,
            totalPayment,
            totalInterest,
            payoffDate,
            amortization,
            years: paymentsMade / 12,
            numberOfPayments: paymentsMade
        };
    }

    function displayMainResults(result, propertyTax, homeInsurance, pmi) {
        const monthlyPI = result.monthlyPayment;
        const totalMonthly = monthlyPI + (propertyTax / 12) + (homeInsurance / 12) + pmi;

        $('#monthlyPayment').textContent = formatCurrency(totalMonthly);
        $('#totalPayment').textContent = formatCurrency(result.totalPayment);
        $('#totalInterest').textContent = formatCurrency(result.totalInterest);
        $('#payoffDate').textContent = result.payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    function displayComparison(result15, result30) {
        $('#payment15').textContent = formatCurrency(result15.monthlyPayment);
        $('#interest15').textContent = formatCurrency(result15.totalInterest);
        $('#total15').textContent = formatCurrency(result15.totalPayment);

        $('#payment30').textContent = formatCurrency(result30.monthlyPayment);
        $('#interest30').textContent = formatCurrency(result30.totalInterest);
        $('#total30').textContent = formatCurrency(result30.totalPayment);

        const interestSavings = result30.totalInterest - result15.totalInterest;
        $('#interestSavings').textContent = formatCurrency(interestSavings);
        $('#timeSavings').textContent = `${result30.years - result15.years} Years`;
        $('#debtFreeDate').textContent = result15.payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }

    function displayExtraPaymentImpact(originalResult, extraResult, extraPayment) {
        if (extraPayment > 0) {
            const timeSavedYears = Math.floor(originalResult.years - extraResult.years);
            const timeSavedMonths = Math.round(((originalResult.years - extraResult.years) % 1) * 12);
            $('#extraTimeSaved').textContent = `${timeSavedYears} Yrs, ${timeSavedMonths} Mos`;

            const interestSaved = originalResult.totalInterest - extraResult.totalInterest;
            $('#extraInterestSaved').textContent = formatCurrency(interestSaved);

            $('#extraPayoffDate').textContent = extraResult.payoffDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });

            const totalExtraPaid = extraPayment * extraResult.numberOfPayments;
            const roi = (interestSaved / totalExtraPaid) * 100;
            $('#extraPaymentROI').textContent = `${roi.toFixed(2)}%`;
            $('#extraPaymentImpact').classList.remove('hidden');
        } else {
            $('#extraPaymentImpact').classList.add('hidden');
        }
    }

    function generateAmortizationSchedule(result) {
        const scheduleBody = $('#scheduleBody');
        const scheduleView = $('#scheduleView').value;
        scheduleBody.innerHTML = ''; // Clear previous schedule

        let scheduleData;
        if (scheduleView === 'yearly') {
            scheduleData = result.amortization.reduce((acc, curr) => {
                const year = Math.ceil(curr.month / 12);
                if (!acc[year]) {
                    acc[year] = { year, payment: 0, principal: 0, interest: 0, balance: 0 };
                }
                acc[year].payment += curr.payment;
                acc[year].principal += curr.principal;
                acc[year].interest += curr.interest;
                acc[year].balance = curr.balance;
                return acc;
            }, {});
        } else {
            scheduleData = result.amortization.map(p => ({...p, period: p.month}));
        }

        Object.values(scheduleData).forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${row.year || row.period}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${formatCurrency(row.payment)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${formatCurrency(row.principal)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-red-600">${formatCurrency(row.interest)}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">${formatCurrency(row.balance)}</td>
            `;
            scheduleBody.appendChild(tr);
        });
    }

    function updateResultsChart(result, propertyTax, homeInsurance, pmi) {
        if (typeof Chart === 'undefined') {
            console.error('Chart.js is not loaded.');
            return;
        }
        const ctx = $('#paymentChart').getContext('2d');
        const data = {
            labels: ['Principal & Interest', 'Property Tax', 'Home Insurance', 'PMI'],
            datasets: [{
                data: [
                    result.monthlyPayment,
                    propertyTax / 12,
                    homeInsurance / 12,
                    pmi
                ],
                backgroundColor: ['#10b981', '#3b82f6', '#93c5fd', '#ef4444'],
                hoverOffset: 4
            }]
        };

        if (paymentChart) {
            paymentChart.data = data;
            paymentChart.update();
        } else {
            paymentChart = new Chart(ctx, {
                type: 'doughnut',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                color: isDarkMode ? '#fff' : '#333'
                            }
                        }
                    }
                }
            });
        }
    }

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    }

    // Export and Share
    $('#exportPDF').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const calculatorSection = $('#mortgage-calculator');
        html2canvas(calculatorSection).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save("mortgage-results.pdf");
        });
    });

    $('#shareResults').addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: 'My Mortgage Calculation',
                text: `Check out my mortgage calculation results: Monthly Payment: ${$('#monthlyPayment').textContent}`,
                url: window.location.href
            }).catch(console.error);
        } else {
            alert('Share functionality is not supported in your browser.');
        }
    });
    
    $('#exportSchedule').addEventListener('click', () => {
        const table = $('#amortizationTable');
        let csvContent = "data:text/csv;charset=utf-8,";
        
        const rows = table.querySelectorAll("tr");
        rows.forEach(row => {
            const rowData = [];
            row.querySelectorAll("th, td").forEach(cell => {
                rowData.push(cell.textContent);
            });
            csvContent += rowData.join(",") + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "amortization_schedule.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });

    // Initial calculation on load with placeholder values
    if (homePriceInput.value && interestRateInput.value) {
        calculateAndDisplay();
    }

    const accordion = document.getElementById('faq-accordion');

    if (accordion) {
        const buttons = accordion.querySelectorAll('button');

        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const content = button.nextElementSibling;
                const icon = button.querySelector('i');

                // Close all other accordions
                buttons.forEach(otherButton => {
                    if (otherButton !== button) {
                        otherButton.nextElementSibling.classList.add('hidden');
                        otherButton.querySelector('i').classList.remove('fa-chevron-up');
                        otherButton.querySelector('i').classList.add('fa-chevron-down');
                    }
                });

                // Toggle the current accordion
                content.classList.toggle('hidden');
                icon.classList.toggle('fa-chevron-down');
                icon.classList.toggle('fa-chevron-up');
            });
        });
    }
});