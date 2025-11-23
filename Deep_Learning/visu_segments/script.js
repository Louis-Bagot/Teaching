const segmentNames = ["Bottom","Lower Left","Upper Left","Top","Upper Right","Lower Right","Middle"];
const digits = Array.from({length:10}, (_,i)=>i);

const segDiv = document.getElementById('segments');
const digDiv = document.getElementById('digits');
const svg = document.getElementById('links');

document.getElementById('zeroBtn').addEventListener('click', setWeightsZero);
document.getElementById('randBtn').addEventListener('click', setWeightsRandom);
document.getElementById('evlossBtn').addEventListener('click', updateLossChart);
document.getElementById('trainBtn').addEventListener('click', () => {
  if (trainBtn.style.opacity == 0) {
    trainBtn.style.opacity = 1;
  } else {
    trainOneStep();
  }
});


const dataset = [
    {x: [1.,1.,1.,1.,1.,1.,0.], y: 0}, 
    {x: [0.,0.,0.,0.,1.,1.,0.], y: 1}, 
    {x: [1.,1.,0.,1.,1.,0.,1.], y: 2}, 
    {x: [1.,0.,0.,1.,1.,1.,1.], y: 3}, 
    {x: [0.,0.,1.,0.,1.,1.,1.], y: 4}, 
    {x: [1.,0.,1.,1.,0.,1.,1.], y: 5}, 
    {x: [1.,1.,1.,1.,0.,1.,1.], y: 6}, 
    {x: [1.,1.,1.,0.,0.,1.,1.], y: 6}, // 6 v2
    {x: [0.,0.,0.,1.,1.,1.,0.], y: 7}, 
    {x: [1.,1.,1.,1.,1.,1.,1.], y: 8}, 
    {x: [1.,0.,1.,1.,1.,1.,1.], y: 9}, 
    {x: [0.,0.,1.,1.,1.,1.,1.], y: 9}, // 9 v2
];
const learning_rate = 5;//0.1;

const ctx = document.getElementById('lossChart').getContext('2d');
const lossData = [];
const lossChart = new Chart(ctx, {
    type: 'line',
    data: {
    labels: [],
    datasets: [{
        label: 'Training Loss',
        data: lossData,
        borderColor: 'rgb(0, 150, 255)',
        backgroundColor: 'rgba(0, 149, 255, 0.52)',
        tension: 0.2,
    }]
    },
    options: {
    scales: {
        x: { display: false },
        y: {
        beginAtZero: true,
        title: { display: true, text: 'Loss' }
        }
    },
    plugins: { legend: { display: false } }
    }
});


// Create segment divs with images
const segEls = segmentNames.map((name,i)=>{
    const el = document.createElement('div');
    el.className = 'segment';
    el.dataset.index = i;

    const img = document.createElement('img');
    img.src = `segments/seg${i}.png`; // <-- your 7 images named seg0.png ... seg6.png
    el.appendChild(img);

    el.addEventListener('click', ()=>{
    el.classList.toggle('active');
    updateProbs();
    });
    segDiv.appendChild(el);
    return el;
});

// Create digit divs
const digEls = digits.map((d,i)=>{
    // digit class
    const el = document.createElement('div');
    el.className = 'digit';
    // fill div digit 
    const fill = document.createElement('div');
    fill.className = 'fill';
    el.appendChild(fill);
    // digit number show up
    const num = document.createElement('span');
    num.textContent = d;
    el.appendChild(num);
    // add option to click & change links
    el.addEventListener('click', () => {
    const newVal = parseFloat(prompt(`Set ALL incoming weights for digit ${d}:`, "0"));
    if (!isNaN(newVal)) {
        // update weights for every segment → this digit
        for (let si = 0; si < 7; si++) {
        weights[si][d] = newVal;
        }
        // recolor the corresponding links
        Array.from(svg.querySelectorAll('line.link')).forEach(line => {
        if (parseInt(line.dataset.di) === d) {
            line.setAttribute('stroke', weightToColor(newVal, 0.6));
        }
        });
        updateProbs();
    }
    });
    //info object to store the shown values (sum, prob)
    const info = document.createElement('div');
    info.className = 'info';
    const scoreDiv = document.createElement('div');
    scoreDiv.className = 'score';
    scoreDiv.textContent = "0.00";
    const probDiv = document.createElement('div');
    probDiv.className = 'prob';
    probDiv.textContent = "0.00";
    info.appendChild(scoreDiv);
    info.appendChild(probDiv);

    // wrapper for digit + info
    const row = document.createElement('div');
    row.className = 'digitRow';
    row.appendChild(el);
    row.appendChild(info);

    digDiv.appendChild(row);
    return {el,fill, score:scoreDiv, prob:probDiv};
});

// Initialize weights (segments x digits)
let weights = Array.from({length:7}, ()=>Array(10).fill(0));

// Draw links
function drawLinks() {
    svg.innerHTML = '';
    const segRects = segEls.map(el=>el.getBoundingClientRect());
    const digRects = digEls.map(obj=>obj.el.getBoundingClientRect());
    const svgRect = svg.getBoundingClientRect();
    svg.setAttribute('width', window.innerWidth);
    svg.setAttribute('height', window.innerHeight);

    segRects.forEach((sr,si)=>{
    digRects.forEach((dr,di)=>{
        const x1 = sr.right - svgRect.left;
        const y1 = sr.top + sr.height/2 - svgRect.top;
        const x2 = dr.left - svgRect.left;
        const y2 = dr.top + dr.height/2 - svgRect.top;
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1',x1);
        line.setAttribute('y1',y1);
        line.setAttribute('x2',x2);
        line.setAttribute('y2',y2);
        line.classList.add('link');
        line.dataset.si = si;
        line.dataset.di = di;
        line.setAttribute('stroke', weightToColor(weights[si][di], 0.6));
        strw = segEls[si].classList.contains('active') ? 4 : 2;
        line.setAttribute('stroke-width', strw);          
        line.addEventListener('click',()=>{
        const newVal = parseFloat(prompt(`Weight from segment ${segmentNames[si]} to digit ${di}:`, weights[si][di]));
        if(!isNaN(newVal)) {
            weights[si][di] = newVal;
            updateProbs();
        }
        });
        line.addEventListener('mouseover',()=>{
        line.setAttribute('stroke', weightToColor(weights[si][di], 1)); 
        strw = segEls[si].classList.contains('active') ? 4 : 2;
        line.setAttribute('stroke-width', strw+1); 
        }); //line.classList.add('active'));
        line.addEventListener('mouseout',()=>{
        line.setAttribute('stroke', weightToColor(weights[si][di], 0.6));
        strw = segEls[si].classList.contains('active') ? 4 : 2;  
        line.setAttribute('stroke-width', strw); 
        }); //line.classList.remove('active'));
        svg.appendChild(line);
    });
    });
}

function softmax(arr){
    const max = Math.max(...arr);
    const exps = arr.map(v=>Math.exp(v-max));
    const sum = exps.reduce((a,b)=>a+b,0);
    return exps.map(v=>v/sum);
}

function updateProbs(){
    const active = segEls.map(el=>el.classList.contains('active')?1:0);
    const scores = digits.map(d=>{
    return active.reduce((sum, act, si)=>sum + act*weights[si][d], 0);
    });
    const probs = softmax(scores);
    probs.forEach((p,i)=>{
    digEls[i].score.textContent = "∑=" + scores[i].toFixed(2);
    digEls[i].prob.textContent = "prob=" + p.toFixed(2);
    digEls[i].fill.style.height = (p*100) + "%";
    });
    Array.from(svg.querySelectorAll('line.link')).forEach(line => {
    const si = parseInt(line.dataset.si);
    const activeSeg = segEls[si].classList.contains('active');
    line.setAttribute('stroke-width', activeSeg ? 4 : 2);
    });
}

function weightToColor(w,alpha=1) {
    // clamp to [-1,1]
    const v = Math.max(-1, Math.min(1, w));
    if (v >= 0) {
    // interpolate white → green
    const g = Math.round(255 * v);
    return `rgb(${255-g},255,${255-g},${alpha})`;
    } else {
    // interpolate white → red
    const r = Math.round(255 * (-v));
    return `rgb(255,${255-r},${255-r},${alpha})`;
    }
}


function setWeightsZero() {
    weights = Array.from({length:7}, ()=>Array(10).fill(0));
    refreshLinks();
    updateProbs();
    updateLossChart();
}

function setWeightsRandom() {
    weights = Array.from({length:7}, () =>
    Array(10).fill(0).map(() => Math.random()*2 - 1)
    );
    updateLossChart();
    refreshLinks();
    updateProbs();
}

// helper to recolor links from current weights
function refreshLinks() {
    Array.from(svg.querySelectorAll('line.link')).forEach(line => {
    const si = parseInt(line.dataset.si);
    const di = parseInt(line.dataset.di);
    line.setAttribute('stroke', weightToColor(weights[si][di], 0.6));
    });
}

function computeLoss(data) {
  let totalLoss = 0;
  for (const sample of data) {
    const x = sample.x;
    const y = sample.y;

    const scores = new Array(10).fill(0);
    for (let d = 0; d < 10; d++) {
      for (let i = 0; i < 7; i++) {
        scores[d] += x[i] * weights[i][d];
      }
    }

    const probs = softmax(scores);
    totalLoss += -Math.log(probs[y] + 1e-12); // cross-entropy
  }
  return totalLoss / data.length; // average loss
}

function updateLossChart() {
    lossData.push(computeLoss(dataset));
    lossChart.data.labels.push(lossData.length);
    lossChart.update();
}


function trainOneStep() {
    let gradSum = Array.from({length:7}, () => Array(10).fill(0));

    for (const sample of dataset) {
        const x = sample.x; // expect array length 7
        const y = sample.y; // expected integer 0..9

        // --- forward: compute scores ---
        const scores = new Array(10).fill(0);
        for (let d = 0; d < 10; d++) {
            let s = 0;
            for (let i = 0; i < 7; i++) {
                s += x[i] * weights[i][d];
            }
            scores[d] = s;
        }
        const probs = softmax(scores)
        const dscores = probs.map((p, d) => p - (d === y ? 1 : 0));
        // accumulate weight gradients
        for (let i=0; i<7; i++) {
            for (let d=0; d<10; d++) {
                gradSum[i][d] += x[i]*dscores[d];
            }
        }
    }


    // --- update weights: W[i][d] -= lr * x[i] * dscores[d] ---
    for (let i = 0; i < 7; i++) {
        for (let d = 0; d < 10; d++) {
            weights[i][d] -= learning_rate * gradSum[i][d] / dataset.length;
        }
    }

    updateLossChart()
    updateProbs();     // updates display and bar fills
    refreshLinks(); // repaint link colors
    return { sample, scores, probs, totalAbsChange };
}

window.addEventListener('resize',drawLinks);
window.addEventListener('load',()=>{
    drawLinks();
    updateProbs();
});
