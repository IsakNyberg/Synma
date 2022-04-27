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

function makeRange(fn, domain){
	var range = Array(domain.length);
	for (var i = 0; i < domain.length; i++) {
		range[i] = fn(domain[i]);
	}
	return range;
}

function makeNormalizedRange(fn, domain){
	var range = Array(domain.length);
	for (var i = 0; i < domain.length; i++) {
		range[i] = Math.min(1, Math.max(-1, fn(domain[i])));
	}
	return range;
}

function display(ctx, fn, numPoints, maxX, normalize) {
	console.log(ctx);
	var domain = makeDomain(numPoints, maxX);
	var range;
	if (normalize) {
		range = makeNormalizedRange(fn, domain);
	} else {
		range = makeRange(fn, domain);
	}
	window.onload = function() {drawGraph(domain, range)}
	
	function drawGraph(domain, range){
		var data = {
			labels: domain, // x-axeln
				datasets: [{
					function: function(x) { return eval(fn)},  // Omvandlar sträng till javascript kod
					borderColor: "rgba(255, 206, 86, 1)",   // Färgspektrum
					data: range,   // y-axeln i vanliga fall, men i detta fall skriver man en funktion
					fill: false
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
}
