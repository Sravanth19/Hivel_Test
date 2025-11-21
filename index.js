const fs = require('fs');

function decodeValue(base, value) {
    return BigInt(parseInt(value, parseInt(base)));
}

function findSecret(points) {
    let secret = BigInt(0);
    const k = points.length;

    for (let i = 0; i < k; i++) {
        const [xi, yi] = points[i];
        let li = BigInt(1);

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                const [xj, _] = points[j];
                li = li * BigInt(-xj) / (BigInt(xi) - BigInt(xj));
            }
        }

        secret += yi * li;
    }

    return secret;
}

function solveShamirSecret(jsonData) {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    const n = data.keys.n;
    const k = data.keys.k;

    console.log(`n (total roots): ${n}`);
    console.log(`k (minimum required): ${k}`);

    const points = [];
    for (let i = 1; i <= n; i++) {
        if (data[i.toString()]) {
            const x = i;
            const base = data[i.toString()].base;
            const value = data[i.toString()].value;
            const y = decodeValue(base, value);

            points.push([x, y]);
            console.log(`Point ${i}: x=${x}, y=${y} (decoded from base ${base})`);
        }
    }

    const selectedPoints = points.slice(0, k);
    console.log(`\nUsing first ${k} points for interpolation...`);

    const secret = findSecret(selectedPoints);

    console.log(`\nSecret (constant term): ${secret}`);
    return secret;
}

if (process.argv[2]) {
    const filename = process.argv[2];
    console.log(`=== READING FROM ${filename} ===`);
    try {
        const fileData = JSON.parse(fs.readFileSync(filename, 'utf8'));
        solveShamirSecret(fileData);
    } catch (error) {
        console.error(`Error reading ${filename}:`, error.message);
    }
} else {
    console.log("=== READING FROM testcase1.json ===");
    try {
        const fileData1 = JSON.parse(fs.readFileSync('testcase1.json', 'utf8'));
        solveShamirSecret(fileData1);
    } catch (error) {
        console.error('Error reading testcase1.json:', error.message);
    }

    console.log("\n\n=== READING FROM testcase2.json ===");
    try {
        const fileData2 = JSON.parse(fs.readFileSync('testcase2.json', 'utf8'));
        solveShamirSecret(fileData2);
    } catch (error) {
        console.error('Error reading testcase2.json:', error.message);
    }
}