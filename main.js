let xs = [];
let ys = [];
let speed = 0;
let moving = false;
let xpos = 0;
let timeStep = 1;
let currentTime = 0;

const maxPoints = 50;

const data = {
    labels: xs,
    datasets: [{
        label: 'time (s) vs distance (m)',
        data: ys,
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
        fill: false,
        pointRadius: 0,
        tension: 0,
    }]
};

const canvas = document.getElementById('chart');
const ctx = canvas.getContext('2d');

const chart = new Chart(ctx, {
    type: 'line',
    data: data,
    options: {
        animation: {
            duration: 0,
        },
        responsive: true,
        scales: {
            x: { 
                type: 'linear', 
                position: 'bottom',
                grid: {
                    display: false,
                },
            },
            y: { 
                beginAtZero: false,
                grid: {
                    display: false,
                },
            },
        },
    }
});

const speedButton = document.getElementById("speed");
const stopButton = document.getElementById("stop");
const bg = document.getElementById("bg");

speedButton.addEventListener('change', (e => {
    speed = parseInt(e.target.value) || 0;
    moving = true;

    setInterval(() => {
        let lastX = xs[xs.length - 1] || 0;
        let lastY = ys[ys.length - 1] || 0;

        currentTime += timeStep;
        updateChartData(currentTime, lastY + speed);
    }, 1000);
    moveBg();
}));

stopButton.addEventListener('click', (_) => {
    moving = false;
    speed = 0;
});

function moveBg() {
    if (moving || speed === 0) {
        xpos += speed;
        bg.style.backgroundPosition = `-${xpos}px 0`;

        requestAnimationFrame(moveBg);
   }
}

function updateChartData(newX, newY) {
    xs.push(newX);
    ys.push(newY);

    if (xs.length > maxPoints) {
        xs.shift();
        ys.shift();
    }

    chart.data.labels = xs;
    chart.data.datasets[0].data = ys;

    const maxY = Math.max(...ys);
    const minY = Math.min(...ys);

    chart.options.scales.y.min = minY - 10;
    chart.options.scales.y.max = maxY + 10;

    const minX = xs[0];
    const maxX = xs[xs.length - 1];

    chart.options.scales.x.min = minX;
    chart.options.scales.x.max = maxX;

    chart.update('none');
}
