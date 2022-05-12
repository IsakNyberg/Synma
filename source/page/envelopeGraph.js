/**
 * Takes the number of points and the max values and returns an array of length 
 * numPoints that are evenly spaced and below the max value.
 * @param numPoints The number of points the horizontal axis.
 * @param maxX The maximum value of the horizontal axis.
 * @returns The set of values on the horizontal axis. 
 */
 function makeEnvelopeDomain(numPoints, maxX) {
	var step = maxX / numPoints;
	var domain = Array(numPoints);
	var x = 0;
	for (var i = 0; i < numPoints; i++) {
		domain[i] = x;
		x += step;
	}
	return domain;
}

function makeEnvelopeRange(fn, max, domain, continous, interval) {
	var fn1 = fn[0];
	var fn2 = fn[1];
	var fn3 = fn[2]; 
	var maxX1 = max[0]; 
	var maxX2 = max[1]; 
	var maxX3 = max[2];
	var range = Array(domain.length);
	if (interval.length == 0) {
		interval = [-20_000, 20_000];
	}

	let offset1 = 0;
	let offset2 = 0;
	
	if(continous) {
		offset1 = Math.abs(fn1(maxX1) - fn2(domain[0]));
		if(fn1(maxX1) < fn2(domain[0])) {
			offset1 = -1 * offset1;
		}
		offset2 = Math.abs(fn2(maxX2 - maxX1) + offset1 - fn3(domain[0]));
		if((fn2(maxX2) + offset1) < fn3(maxX2)) {
			offset2 = -1 * offset2;
		}
	}
	for(let i = 0; i < domain.length; i++) {
		if(domain[i] < maxX1) {
			range[i] = Math.min(interval[1], Math.max(interval[0], fn1(domain[i])));
		}
		if(domain[i] >= maxX1 && domain[i] < maxX2) {
			range[i] = Math.min(interval[1], Math.max(interval[0], fn2(domain[i] - maxX1) + offset1));
		} 	
		if(domain[i] >= maxX2 && domain[i] < maxX3) {
			range[i] = Math.min(interval[1], Math.max(interval[0], fn3(domain[i] - maxX2) + offset2));
		}
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
function makeEnvelopeNormalizedRange(fn1, fn2, fn3, maxX1, maxX2, maxX3, domain, continous) {
	var range = Array(domain.length);
	let offset1 = 0;
	let offset2 = 0;

	if(continous) {
		offset1 = Math.abs(fn1(maxX1) - fn2(domain[0]));
		if(fn1(maxX1) < fn2(domain[0])) {
			offset1 = -1 * offset1;
		}
		offset2 = Math.abs(fn2(maxX2 - maxX1) + offset1 - fn3(domain[0]));
		if((fn2(maxX2) + offset1) < fn3(maxX2)) {
			offset2 = -1 * offset2;
		}
	}

	for(let i = 0; i < domain.length; i++) {

		if(domain[i] < maxX1) {
			range[i] = fn1(domain[i]);
		}
		if(domain[i] > maxX1 && domain[i] <= maxX2) {
			range[i] = fn2(domain[i]-maxX1) + offset1;
		}
		if(domain[i] > maxX2 && domain[i] <= maxX3) {
			range[i] = fn3(domain[i]-maxX2) + offset2;
		}
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
 * @param fn The function to graph.
 * @param numPoints The number of points the horizontal axis.
 * @param maxX The maximum value of the horizontal axis.
 * @param normalize The boolean flag indicating whether to normalize or not.
 * @returns The domain and range of the function.
 */
function makeEnvelopeDatapoints(functions, numPoints, maxValues, normalize, continous, interval) {
	var domain = makeEnvelopeDomain(numPoints, maxValues[2]);
	var range;
	if (normalize) {
		range = makeEnvelopeNormalizedRange(
			functions[0], 
			functions[1], 
			functions[2], 
			maxValues[0], 
			maxValues[1], 
			maxValues[2], 
			domain, 
			continous
		);
	}
	else range = makeEnvelopeRange(functions, maxValues, domain, continous, interval);
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
 * @returns The graph..
 */
function drawEnvelopeDomainRange(ctx, domain, range, colorValues, maxValues, interval) {
	var index1 = (domain.length * maxValues[0]) / (maxValues[2]);
	var index2 = (domain.length * maxValues[1]) / (maxValues[2]);
	var index3 = (domain.length);
	
	// account for the pitch graph
	if (interval.length == 0) {
		let maxY = Math.max(...range);
		let minY = Math.min(...range);
		interval = [minY, maxY];
	}
	// account for when the entire graph is only 1 value [0,0...,0]
	if (interval[0] == interval[1]) {
		interval = [interval[0]-1, interval[1]+1]
	}

	const lineColour = (ctx) => {
		if (ctx.p0.parsed.x < index1)
			return colorValues[0];
		if (ctx.p0.parsed.x < index2)
			return colorValues[1];
		if (ctx.p0.parsed.x < index3)
			return colorValues[2];
		return 'rgba(0, 0, 0, 1)';
	}

	const data = {
		labels: domain, 
		datasets: [{	
			type: 'line',
			borderColor: [
				'rgba(0, 0, 0, 1)',
			],
			tension: 0.4,
			segment: {
				borderColor: ctx =>  lineColour(ctx),
			},
			spanGaps: true,
			data: range, 
			fill: false,
			pointRadius: 0,
		}]
	};
	// Configuration of chart
	const config = {
		data: data,
		options: {
			plugins: {
				legend: {
					display: false
				}
			},
			scales: { 
				x: {
					display: false 
				},
				y: {
					min: interval[0],
					max: interval[1],
					beginAtZero:false
				}, 
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
function drawEnvelope(ctx, functions, numPoints, maxValues, options, colorValues, interval) {
	var [domain, range] = makeEnvelopeDatapoints(functions, numPoints, maxValues, options[0], options[1], interval);
	return drawEnvelopeDomainRange(ctx, domain, range, colorValues, maxValues, interval);
}
