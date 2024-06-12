document.addEventListener("DOMContentLoaded", function() {
    const svg = d3.select("#moirePattern");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const a1 = 1.0;
    const a2 = 1.0;
    let N = 50; // Reduced number of grid points per axis

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

    function applyStrain(points, biaxialStrain, uniaxialStrain, strainAngle) {
        let strainAngleRad = Math.radians(strainAngle);
        let strainMatrix = [
            [1 + biaxialStrain + uniaxialStrain * Math.cos(strainAngleRad) ** 2, uniaxialStrain * Math.sin(strainAngleRad) * Math.cos(strainAngleRad)],
            [uniaxialStrain * Math.sin(strainAngleRad) * Math.cos(strainAngleRad), 1 + biaxialStrain + uniaxialStrain * Math.sin(strainAngleRad) ** 2]
        ];
        return points.map(p => {
            return {
                x: p.x * strainMatrix[0][0] + p.y * strainMatrix[0][1],
                y: p.x * strainMatrix[1][0] + p.y * strainMatrix[1][1]
            };
        });
    }

    function applyRotation(points, theta) {
        let thetaRad = Math.radians(theta);
        let rotationMatrix = [
            [Math.cos(thetaRad), -Math.sin(thetaRad)],
            [Math.sin(thetaRad), Math.cos(thetaRad)]
        ];
        return points.map(p => {
            return {
                x: p.x * rotationMatrix[0][0] + p.y * rotationMatrix[0][1],
                y: p.x * rotationMatrix[1][0] + p.y * rotationMatrix[1][1]
            };
        });
    }

    function drawPattern() {
        let biaxialStrain = parseFloat(document.getElementById("biaxialStrain").value);
        let uniaxialStrain = parseFloat(document.getElementById("uniaxialStrain").value);
        let strainAngle = parseFloat(document.getElementById("strainAngle").value);
        let twistAngle = parseFloat(document.getElementById("twistAngle").value);

        let lattice1 = generateHexagonalLattice(N, a1);
        let lattice2 = generateHexagonalLattice(N, a2);
        lattice2 = applyStrain(lattice2, biaxialStrain, uniaxialStrain, strainAngle);
        lattice2 = applyRotation(lattice2, twistAngle);

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

    Math.radians = function(degrees) {
        return degrees * Math.PI / 180;
    };

    document.getElementById("biaxialStrain").addEventListener("input", drawPattern);
    document.getElementById("uniaxialStrain").addEventListener("input", drawPattern);
    document.getElementById("strainAngle").addEventListener("input", drawPattern);
    document.getElementById("twistAngle").addEventListener("input", drawPattern);

    drawPattern();
});
