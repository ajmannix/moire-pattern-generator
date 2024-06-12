document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM fully loaded and parsed");
    const svg = d3.select("#moirePattern");
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const a1 = 1.0;
    const a2 = 1.0;
    let N = 100;

    function generateHexagonalLattice(N, a) {
        console.log("Generating hexagonal lattice");
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
        console.log("Applying strain");
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
        console.log("Applying rotation");
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
        console.log("Drawing pattern");
        let biaxialStrain = parseFloat(document.getElementById("biaxialStrain").value);
        let uniaxialStrain = parseFloat(document.getElementById("uniaxialStrain").value);
        let strainAngle = parseFloat(document.getElementById("strainAngle").value
