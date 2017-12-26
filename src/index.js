/**
 * Throttle helper function
 * @param {Function} fn the function to throttle
 * @param {Number} threshhold sets how often should the function be able to run
 * @param {Object} scope sets the value of "this"
 */
function throttle(fn, threshhold = 200, scope) {
  var last, deferTimer;
  return function () {
    var context = scope || this;

    var now = + new Date,
        args = arguments;
    if (last && now < last + threshhold) {
      // hold on to it
      clearTimeout(deferTimer);
      deferTimer = setTimeout(function () {
        last = now;
        fn.apply(context, args);
      }, threshhold);
    } else {
      last = now;
      fn.apply(context, args);
    }
  };
}

// Global canvas context - represents heatmap
let ctx;

function toggleHeatmapVisibility() {
  const heatmap = document.getElementById('heatmap');
  heatmap.classList.toggle('hidden');
}

function plotDOMElement(e) {
  ctx.fillStyle = 'rgba(255, 0, 0, 0.05)';
  ctx.fillRect(e.target.offsetLeft, e.target.offsetTop, e.target.clientWidth, e.target.clientHeight);
}


window.addEventListener('load', function() {

  const divs = Array.from(document.getElementsByClassName('section'));
  divs.forEach(div => div.addEventListener('click', plotDOMElement));

  const heatmap = document.getElementById('heatmap');
  heatmap.height = window.innerHeight;
  heatmap.width = window.innerWidth;
  ctx = heatmap.getContext('2d');

  const toggleHeatmap = document.getElementById('toggle-heatmap');
  toggleHeatmap.addEventListener('click', toggleHeatmapVisibility)
});

// Mouse position tracking logic --------------------------------------------//
function plotCircle(cenX, cenY, radius) {
  ctx.beginPath();
  ctx.arc(cenX, cenY, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = 'rgba(255, 0, 0, 0.05)';
  ctx.fill();
}

function getMouseLocation(e) {
  plotCircle(e.clientX, e.clientY, 20);
}

const throttledLocation = throttle(getMouseLocation);

document.addEventListener('mousemove', throttledLocation);
//--------------------------------------------------------------------------//