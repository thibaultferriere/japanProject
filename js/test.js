d3.select('h1').style('color','darkblue');
d3.select('h1').style('font-size','40px');

var svg = d3.select('svg');

svg.append('rect')
	.attr('x', 50)
	.attr('y', 50)
	.attr('width', 200)
	.attr('height', 100)
	.attr('fill', 'blue');
