
/* 
 Takes the number of points and the max values and returns an array of length 
 numPoints that are evenly spaced and below the max value.
*/
function makeDomain(numPoints, maxX) {
	var step = maxX / numPoints;
	var domain = Array(numPoints);
	var x = 0;
	for (var i = 0; i < numPoints; i++) {
		domain[i] = x;
		x += step;
	}
	return domain;
}

/* 
 Takes each entry in the domain and applies the function on it and returns and 
 array of theses values.
*/

function makeRange(fn, domain) {
  var range = Array(domain.length);
	for (var i = 0; i < domain.length; i++) {
		range[i] = Math.min(1, Math.max(-1, fn(domain[i])));
	}
	return range;
}
/* 
 Takes each entry in the domain and applies the function on it and returns and 
 array of theses values. These values are capped at -1 and +1 so that values 
 above and below are not graphed.
*/
function makeNormalizedRange(fn, domain){
  var range = Array(domain.length);
	for (var i = 0; i < domain.length; i++) {
		range[i] = fn(domain[i]);
	}
  var max = 0;
  for (let i = 0; i < range.length; i++) {
    max = Math.max(max, Math.abs(range[i]));
  }
  for (let i = 0; i < range.length; i++) {
    range[i] /= max;
  }
  return range;
}
/**
 * Receives domain and range from separate functions.
 * Depending on if the client wishes the graph to be normalized, i.e within 
 * range [-1, 1], the boolean normalize 
 * indicates the proper range.
 * Once the domain and range have been calculated, they are returned as an 
 * array, whish is used when drawing the function
 */
function makeDatapoints(fn, numPoints, maxX, normalize) {
	var domain = makeDomain(numPoints, maxX);
	var range;
	if (normalize) {
		range = makeNormalizedRange(fn, domain);
	} else {
		range = makeRange(fn, domain);
	}
  return [domain, range];	
}

/**
 * Uses the Chart JS library, which receives a dataset that shapes the function
 * and chart points, e.g: range, domain and colouring; 
 * and a configuration that provides the esthetics of the chart, eg: scale, 
 * axis, display etc
 */
function drawDomainRange(ctx, domain, range){
  var data = {
    labels: domain, // x-axeln
    datasets: [{
      borderColor: "rgba(255, 206, 86, 1)",   // Färgspektrum
      data: range,   // y-axeln
      fill: false,
    }]
  };
  // Configuration of chart
  const config = {
    type: 'line',
    data: data,
    options: {
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          display: false
        }],
        yAxes: [{
          ticks: {
            min: -1,
            max: +1,
            beginAtZero:true
          }
        }]    
      },
    }
  };
  return new Chart(ctx, config);
}

/** 
  Does everything needed to draw a graph in the context canvas 
  @param fn is the function to graph
  @param numPoints is the number of datapoints to be plotted
  @param maxX is the largest value that x will take
  @param normalize boolean that determines if the values are capped at ±1
*/
function drawGraph(ctx, fn, numPoints, maxX, normalize){
  var [domain, range] = makeDatapoints(fn, numPoints, maxX, normalize);
  return drawDomainRange(ctx, domain, range);
}

/** 
  Updates data in given graph 
  @param fn is the function to graph
  @param numPoints is the number of datapoints to be plotted
  @param maxX is the largest value that x will take
  @param normalize boolean that determines if the values are capped at ±1
*/

