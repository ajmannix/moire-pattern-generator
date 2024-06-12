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

    function syncSliderAndInput(sliderId, inputId) {
        const slider = document.getElementById(sliderId);
        const input = document.getElementById(inputId);

        slider.addEventListener("input", () => {
            input.value = slider.value;
            drawPattern();
        });

        input.addEventListener("input", () => {
            const value = parseFloat(input.value);
            if (!isNaN(value)) {
                slider.value = value;
                drawPattern();
            }
        });
    }

    function saveSvg() {
        const serializer = new XMLSerializer();
        const source = serializer.serializeToString(svg.node());

        const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "moire_pattern.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    Math.radians = function(degrees) {
        return degrees * Math.PI / 180;
    };

    syncSliderAndInput("biaxialStrain", "biaxialStrainValue");
    syncSliderAndInput("uniaxialStrain", "uniaxialStrainValue");
    syncSliderAndInput("strainAngle", "strainAngleValue");
    syncSliderAndInput("twistAngle", "twistAngleValue");
    syncSliderAndInput("rangeOfView", "rangeOfViewValue");

    document.getElementById("saveButton").addEventListener("click", saveSvg);

    drawPattern();
});
