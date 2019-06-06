// Career Services Coding Challenge - Tip Calculator

// The Challenge

// Your task is to create a simple command-line (Node, Python or other) or front-end JavaScript application that will help calculate a tip at a restaurant for your server. No boilerplate code
// will be provided, so you are free to construct this however you would like. However, your application must:
    // * Take in the value of the bill
    // * Take in the desired tip percentage
    // * Include the option to split the tip amount by number of people at the table
    // * The application should then calculate the amount of tip per table (or per person if the split option is chosen) and return that value to the user.

// BONUS:
    // * Create a simple UI so that this can be used in a browser
    // * Deploy to your favorite hosting service (Heroku, Netlify, etc.)


// The Process 
// Career Services will evaluate the submissions and come to a consensus on a winner. You will be evaluated upon completion of the requirements of the challenge, code cleanliness, and formatting. Career Services will evaluate the entries and pick a winning submission and will announce on July 12, 2019. 
// Restraints and Guidelines...
// Please read these thoroughly. We will validate your submission based on the following criteria:
    // * Your code should be clean and readable. Don't neglect the comments!
    // * You must push your code in a git repository and submit git repository URL to the challenge email.
    // * Commit early, commit often; we will look at the progression of your code throughout application development. Consider your commits valuable. 
    // * You shouldn't need any external libraries to complete this application... BUT if you do, you need to document it in your readme and let us know why it was a better choice.

// Some additional requirements for your application:
    // * The bill value must be a positive float but your application must handle user input that might be a negative or 0 dollar amount (i.e. error handling).
    // * The user input percentage for the tip must be a positive float.
    // * The returned value must be a float rounded to two decimal points (i.e. accurate dollars and cents).

// Function to calculate results based on input fields
function handleCalculate(event) {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Grab values from input fields
    var billAmt = d3.select("#bill-amt").property("value");
    var tipPct = d3.select("#tip-pct").property("value");
    var splitNum = d3.select("#split-num").property("value");

    // Bill Amount - strip leading $ if exists
    if (billAmt[0] == "$") {
        billAmt = billAmt.slice(1, billAmt.length);
    }
    // Tip Percentage - strip trailing % if exists
    if (tipPct[tipPct.length-1] == "%") {
        tipPct = tipPct.slice(0, tipPct.length-1);
    }

    // If Bill Amount and Tip Percentage are blank, exit the function
    // (to avoid throwing errors on initial window resizing)
    if (billAmt == "" || tipPct == "") {
        return;
    }
    
    // Check to see if Bill amount and Tip percentage are numbers
    if (isNaN(billAmt)) {
        // if not, throw an error, reset the field, and exit the function
        alert("Total Bill value must be a number.  Please enter a number and try again.");
        document.getElementById('bill-amt').value = '';
        return;
    }
    if (isNaN(tipPct)) {
        // if not, throw an error, reset the field, and exit the function
        alert("Tip Percentage value must be a number.  Please enter a number and try again.");
        document.getElementById('tip-pct').value = '';
        return;
    }

    // Check to see if Bill Amount and Tip Percentage are > 0
    if (billAmt <=0) {
        // if not, throw an error, reset the field, and exit the function
        alert("Total Bill value must be greater than 0.  Please enter a positive number and try again.");
        document.getElementById('bill-amt').value = '';
        return;
    }
    if (tipPct <=0) {
        // if not, throw an error, reset the field, and exit the function
        alert("Total Bill value must be greater than 0.  Please enter a positive number and try again.");
        document.getElementById('tip-pct').value = '';
        return;
    }

    // Check if the tip was entered as decimal instead of %
    if (tipPct < 1) {
        // multiply by 100
        tipPct *= 100;
    }

    // Cast variables as numbers
    billAmt = +billAmt;
    tipPct = +tipPct;
    splitNum = +splitNum;

    // Calculate tip
    var tipAmt = billAmt * (tipPct / 100)
    // Calculate split amount
    var splitAmt = tipAmt / splitNum;

    // Round Tip Amount and Split Amount to two-decimal places,
    // save as strings to preserve trailing zeroes if they exist
    tipAmtStr = tipAmt.toFixed(2);
    splitAmtStr = splitAmt.toFixed(2);

    // Display results
    displayResults(tipAmtStr,splitNum,splitAmtStr);

    // Clear any previous pie chart
    d3.selectAll("#table-pie>div").remove();
    d3.select("#table-pie").attr("class","");
    // If split is chosen, build pie chart with array of split amounts
    if (splitNum > 1) {
        // Create array of split amounts
        var splitAmts = [];
        var i;
        for(i=0; i<splitNum; i++) {
            splitAmts.push(splitAmt);
        }
        // Build pie chart
        buildPie(splitAmts);
    }
}

// Function to clear fields and remove Results and pie chart divs
function handleClear(event) {

    // Prevent the page from refreshing
    d3.event.preventDefault();

    // Clear input fields
    document.getElementById('bill-amt').value = '';
    document.getElementById('tip-pct').value = '';
    document.getElementById('split-num').value = '';

    // Delete current chart
    d3.select("#table-pie>div").remove();

    // Delete results
    d3.selectAll("#results>div").remove();

    // Remove card class from Results div
    d3.select("#results").attr("class","");
}

// Function to display calculation results
function displayResults(tipAmtStr,splitNum,splitAmtStr) {

    // Select Results div
    var results = d3.select("#results");

    // Assign card class to Results div
    results.attr("class","card border-primary mb-3")

    // Clear any previous results
    d3.selectAll("#results>div").remove();

    // Display results
    results.append("div").text(`Results`).attr("class","card-header");
    var resultCardBody = results.append("div").attr("class","card-body");
    resultCardBody.append("p").text(`Tip Amount: $${tipAmtStr}`).attr("class","card-text");
    // If the split option was chosen, display split information
    if (splitNum > 1) {
        resultCardBody.append("p").text(`Split between ${splitNum} people...`).attr("class","card-text");
        resultCardBody.append("p").text(`Tip per Person: $${splitAmtStr}`).attr("class","card-text");    
    }
}

// Function to build pie chart with the split amounts
function buildPie(splitAmts) {

    // Create arrays for labels, colors, and text using length of passed value array
    var i;
    var labels = [];
    var colors = [];
    var splitAmtsFormatted = [];
    for(i=0; i<splitAmts.length; i++) {
        labels.push(i+1);
        colors.push("#af8555");
        splitAmtsFormatted.push(`$${splitAmts[i].toFixed(2)}`);
    }

    // Create trace element using passed array
    trace = {
        type: 'pie',
        labels: labels,
        values: splitAmts,
        text: splitAmtsFormatted,
        textinfo: 'text',
        hole: .35,
        marker: {
            colors: colors,
            line: {
                color: "#000000",
                width: 1
            },
        },
        showlegend: false
    };

    // define width of SVG as width of parent element
    var pieWidth = document.getElementById('table-pie').offsetWidth - 20;

    // Create layout element
    var layout = {
        margin: {
            l: 10,
            r: 10,
            t: 0,
            b: 0
        },
        hovermode: false,
        width: pieWidth,
        height: pieWidth,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
    };
    
    // Assign data variable for plotting
    var data = [trace];

    // Select Results div
    var pieDiv = d3.select("#table-pie");

    // Assign card class to Pie div
    pieDiv.attr("class","card border-primary mb-3")

    // Display results
    pieDiv.append("div").text(`Useful* Visualization`).attr("class","card-header");
    var pieCardBody = pieDiv.append("div").attr("class","card-body").attr("id","pie-chart").attr("style","padding:10px");

    // Draw pie chart
    Plotly.newPlot("pie-chart",data,layout,{displayModeBar: false},{responsive: true});
    pieCardBody.append("p").text("*Actual usefulness may vary").attr("class","card-text").attr("style","font-size:small"); 
}

// Function to create array and populate Split select dropdown
function populateSplit() {
    // Create array for Split select dropdown
    var splitNums = [];
    var i;
    // Create array from 1 to 10 (increase '10' below to extend select dropdown)
    for(i=1; i<=10; i++) {
        splitNums.push(i);
    }

    // Select html element
    var splitNum = d3.select("#split-num");

    // Populate Split select dropdown
    splitNums.forEach(function(number) {
        var option = splitNum.append("option");
        option.text(number);
    });
}

// Declare variable for Filter Table button
var calculateButton = d3.select("#calculate-btn");

// Declare variable for Clear Filter button
var clearButton = d3.select("#clear-btn");

// Define Filter Table button action
calculateButton.on("click",handleCalculate);

// Define Clear Filter button action
clearButton.on("click",handleClear);

// Populate Split select dropdown on page load
populateSplit();

// When the browser window is resized, handleCalculate() is called
// to generate a rescaled pie chart
d3.select(window).on("resize", handleCalculate);