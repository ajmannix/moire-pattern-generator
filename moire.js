document.addEventListener("DOMContentLoaded", function() {
    const svg = d3.select("#moirePattern");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const a1 = 1.0;
    const a2 = 1.0;

    function generateHexagonalLattice(N, a) {
        let points = [];
        for (let i = -N; i < N; i++) {
            for (let j = -N; j < N; j++) {
                let x = a * (i + j * 0.5);
                let y = a * (Math.sqrt(3) / 2 * j);
                points.push({ x: x, y: y });
            }
        }
        return points;
    }

    function drawPattern() {
        let biaxialStrain = parseFloat(document.getElementById("biaxialStrain").value);
        let uniaxialStrain = parseFloat(document.getElementById("uniaxialStrain").value);
        let strainAngle = parseFloat(document.getElementById("strainAngle").value);
        let twistAngle = parseFloat(document.getElementById("twistAngle").value);
        let rangeOfView = parseFloat(document.getElementById("rangeOfView").value);

        document.getElementById("biaxialStrainValue").value = biaxialStrain.toFixed(2);
        document.getElementById("uniaxialStrainValue").value = uniaxialStrain.toFixed(2);
        document.getElementById("strainAngleValue").value = strainAngle.toFixed(0);
        document.getElementById("twistAngleValue").value = twistAngle.toFixed(1);
        document.getElementById("rangeOfViewValue").value = rangeOfView.toFixed(0);

        let lattice1 = generateHexagonalLattice(rangeOfView, a1);
        let lattice2 = generateHexagonalLattice(rangeOfView, a2);

        svg.selectAll("circle").remove(); // Clear previous circles

        // Add circles for both lattices
        svg.selectAll("circle.lattice1")
            .data(lattice1)
            .enter().append("circle")
            .attr("class", "lattice1")
            .attr("cx", d => width / 2 + d.x * 10)
            .attr("cy", d => height / 2 + d.y * 10)
            .attr("r", 1)
            .style("fill", "blue")
            .style("opacity", 0.5);

        svg.selectAll("circle.lattice2")
            .data(lattice2)
            .enter().append("circle")
            .attr("class", "lattice2")
            .attr("cx", d => width / 2 + d.x * 10)
            .attr("cy", d => height / 2 + d.y * 10)
            .attr("r", 1)
            .style("fill", "red")
            .style("opacity", 0.5);
    }

    document.getElementById("biaxialStrain").addEventListener("input", drawPattern);
    document.getElementById("uniaxialStrain").addEventListener("input", drawPattern);
    document.getElementById("strainAngle").addEventListener("input", drawPattern);
    document.getElementById("twistAngle").addEventListener("input", drawPattern);
    document.getElementById("rangeOfView").addEventListener("input", drawPattern);

    drawPattern();
});
