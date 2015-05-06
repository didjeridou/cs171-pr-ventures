# Ventures

> When is the best time to fundraise and what are some important patterns to be aware of?

> Where is my startup most likely to get funded?

> What are my chances of actually succeeding?

As a young entrepreneur, I have always been interested in these questions and in general how people create companies from scratch. I have myself founded a few companies, and as I am getting better at it, I try to understand how how funding and financing plays a role in a company's success.

This is why I decided to create a visualization that would capture various dimensions of fundraising in the startup world. To me this project is not just school work: it is a tool I intend to use to comprehend how the startup scene is evolving, and so I can use that data to my advantage.

[Here is the 2min video tour](https://youtu.be/dX-Ueq1erO0)
[Ventures web page](http://didjeridou.github.io/cs171-pr-ventures/)

# Project Structure
Here is more information about the project structure:

```sh
/Ventures
	index.html			Main page
	README.md
	/_docs			Contains documents, process books
		...
	/css				Custom CSS and grid css
		complement.css 	
		normalize.css
		nv.d3.min.css	
		style.css
	/data				Contains the CSV and JSON data
		50cities.json	These JSON contain the data for their
		dealsize.json	respective visualizations.
		months.json	'rounds_month.csv' is an example of an
		most_funded.json	intermediary step between Crunchbase
		rounds_month.csv	and the JSON data for D3
		sankey.json	
		states.json	
	/images			Contains images for the project
		...
	/js	
		datascript.js	Place for temp. scripts, data cleaning
		geomap_vis.js	Script for chapter two map vis
		sankey_vis.js	Script for the Sankey vis in chapter 3
		script.js		Main JS, contains fcts for next steps
		table_vis.js	Script for the table vis in Ch. 4
	/libs				Contains libraries
		...
```