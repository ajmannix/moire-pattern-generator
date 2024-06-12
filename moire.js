
document.addEventListener("DOMContentLoaded", function() {
    const svg = d3.select("#moirePattern");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const a1 = 1.0;
    const a2 = 1.0;
    let N = 100;

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
        let strainMatrix = [
            [1 + biaxialStrain + uniaxialStrain * Math.cos(Math.radians(strainAngle)) ** 2, uniaxialStrain * Math.sin(Math.radians(strainAngle)) * Math.cos(Math.radians(strainAngle))],
            [uniaxialStrain * Math.sin(Math.radians(strainAngle)) * Math.cos(Math.radians(strainAngle)), 1 + biaxialStrain + uniaxialStrain * Math.sin(Math.radians(strainAngle)) ** 2]
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

        svg.selectAll("*").remove();
        svg.selectAll("circle")
            .data(lattice1.concat(lattice2))
            .enter().append("circle")
            .attr("cx", d => width / 2 + d.x * 10)
            .attr("cy", d => height / 2 + d.y * 10)
            .attr("r", 1)
            .style("fill", "blue")
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
