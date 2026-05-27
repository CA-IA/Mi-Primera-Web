console.log("Web cargada correctamente");

const ctx = document.getElementById('isoChart');

new Chart(ctx, {
    type: 'line',

    data: {

        labels: [
            '1995',
            '2000',
            '2005',
            '2010',
            '2015',
            '2020',
            '2025'
        ],

        datasets: [{

            label: 'Certificaciones ISO 9001 en España',

            data: [
                5000,
                18000,
                42000,
                62000,
                58000,
                52000,
                50000
            ],

            borderWidth: 4,
            tension: 0.4

        }]
    },

    options: {

        responsive: true,

        plugins: {

            legend: {
                labels: {
                    font: {
                        size: 14
                    }
                }
            }
        }
    }
});