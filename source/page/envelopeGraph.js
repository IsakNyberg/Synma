/**
 * Takes the number of points and the max values and returns an array of length 
 * numPoints that are evenly spaced and below the max value.
 * @param numPoints The number of points the horizontal axis.
 * @param maxX The maximum value of the horizontal axis.
 * @returns The set of values on the horizontal axis. 
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
/**
 * Takes each entry in the domain and applies the function on it and returns and 
 * array of theses values.
 * @param fn The function to graph.
 * @param domain The set of values on the horizontal axis.
 * @returns The set of values which are the result of applying the function fn to the domain.
 */
function makeRangeContinous(fn1, fn2, fn3, maxX1, maxX2, maxX3, domain) {
	var range = Array(domain.length);
   
	for(let i = 0; i < domain.length; i++) {

        if(domain[i] < maxX1) 							range[i] = Math.min(1, Math.max(-1, fn1(domain[i])));
        if(domain[i] >= maxX1 && domain[i] < maxX2) 	range[i] = Math.min(1, Math.max(-1, fn2(domain[i])));
        if(domain[i] >= maxX2 && domain[i] < maxX3) 	range[i] = Math.min(1, Math.max(-1, fn3(domain[i])));
    }
	return range;
}

function makeRange(fn1, fn2, fn3, maxX1, maxX2, maxX3, domain, continous) {
	var range = Array(domain.length);

	let offset1 = 0;
	let offset2 = 0;
   
	if(continous) {
   
		offset1 = Math.abs(fn1(maxX1) - fn2(domain[0]));
		if(fn1(maxX1) < fn2(domain[0])) offset1 = -1 * offset1;

		offset2 = Math.abs(fn2(maxX2 - maxX1) + offset1 - fn3(domain[0]));
		if((fn2(maxX2) + offset1) < fn3(maxX2)) offset2 = -1 * offset2;
	}

	for(let i = 0; i < domain.length; i++) {

        if(domain[i] < maxX1) 							range[i] = Math.min(1, Math.max(-1, fn1(domain[i])));
        if(domain[i] >= maxX1 && domain[i] < maxX2) 	range[i] = Math.min(1, Math.max(-1, fn2(domain[i] - maxX1) + offset1));
        if(domain[i] >= maxX2 && domain[i] < maxX3) 	range[i] = Math.min(1, Math.max(-1, fn3(domain[i] - maxX2) + offset2));
    }

	return range;
}
/**
 * Takes each entry in the domain and applies the function on it and returns and 
 * array of theses values. These values are capped at -1 and +1 so that values 
 * above and below are not graphed.
 * @param fn The function to graph.
 * @param domain The set of values on the horizontal axis.
 * @returns The normalized set of values which are the result of applying the function fn to the domain.
 */

function makeNormalizedRange(fn1, fn2, fn3, maxX1, maxX2, maxX3, domain, continous) {

	var range = Array(domain.length);
	let offset1 = 0;
	let offset2 = 0;

	if(continous) {
   
		offset1 = Math.abs(fn1(maxX1) - fn2(domain[0]));
		if(fn1(maxX1) < fn2(domain[0])) offset1 = -1 * offset1;

		offset2 = Math.abs(fn2(maxX2 - maxX1) + offset1 - fn3(domain[0]));
		if((fn2(maxX2) + offset1) < fn3(maxX2)) offset2 = -1 * offset2;
	}


	for(let i = 0; i < domain.length; i++) {

        if(domain[i] < maxX1) 							range[i] = fn1(domain[i]);
        if(domain[i] > maxX1 && domain[i] <= maxX2) 	range[i] = fn2(domain[i]-maxX1) + offset1;
        if(domain[i] > maxX2 && domain[i] <= maxX3) 	range[i] = fn3(domain[i]-maxX2) + offset2;
    }

	var max = 0;
	for (let i = 0; i < range.length; i++) {
		max = Math.max(max, Math.abs(range[i]));
	}
	for (let i = 0; i < range.length; i++) range[i] /= max;
	return range;
}

/**
 * Receives domain and range from separate functions.
 * Depending on if the client wishes the graph to be normalized, i.e within 
 * range [-1, 1], the boolean normalize 
 * indicates the proper range.
 * Once the domain and range have been calculated, they are returned as an 
 * array, whish is used when drawing the function
 * @param fn The function to graph.
 * @param numPoints The number of points the horizontal axis.
 * @param maxX The maximum value of the horizontal axis.
 * @param normalize The boolean flag indicating whether to normalize or not.
 * @returns The domain and range of the function.
 */
function makeDatapoints(functions, numPoints, maxValues, normalize, continous) {
	var domain = makeDomain(numPoints, maxValues[2]);
	var range;
	if (normalize) range = makeNormalizedRange(functions[0], functions[1], functions[2], maxValues[0], maxValues[1], maxValues[2], domain, continous);
	else range = makeRange(functions[0], functions[1], functions[2], maxValues[0], maxValues[1], maxValues[2], domain, continous);
	return [domain, range];
}
/**
 * Uses the Chart JS library, which receives a dataset that shapes the function
 * and chart points, e.g: range, domain and colouring; 
 * and a configuration that provides the esthetics of the chart, eg: scale, 
 * axis, display etc
 * @param ctx The graph context.
 * @param domain The set of values on the horizontal axis.
 * @param range The set of values which are the result of applying the function fn to the domain.
 * @param color The color of the border.
 * @returns The graph.
 */
function drawDomainRange(ctx, domain, range, color) {
	var data = {
		labels: domain, // x-axeln
		datasets: [{
			borderColor: color, // Färgspektrum
			data: range, // y-axeln
			fill: false,
		}]
	};
	// Configuration of chart
	const config = {
		type: 'line',
		data: data,
		options: {
			legend: { display: false },
			scales: { 
				xAxes: [{ 
					display: false 
				}],
				yAxes: [{
					ticks: {
					  min: -1,
					  max: +1,
					  beginAtZero:false
					}
				}]    
			}
		}
	};
	return new Chart(ctx, config);
}
/** 
 * Does everything needed to draw a graph in the context canvas.
 * @param fn is the function to graph
 * @param numPoints is the number of datapoints to be plotted
 * @param maxX is the largest value that x will take
 * @param normalize boolean that determines if the values are capped at ±1
 * @param color The color of the curve of the graph.
 * @returns The graph.  
 */
function drawGraph(ctx, functions, numPoints, maxValues, normalize, continous, color) {
	var [domain, range] = makeDatapoints(functions, numPoints, maxValues, normalize, continous);
	return drawDomainRange(ctx, domain, range, color);
}
