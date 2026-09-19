const xInput =
    document.getElementById("xInput");

const zInput =
    document.getElementById("zInput");

const yInput =
    document.getElementById("yInput");

const yInputContainer =
    document.getElementById("yInputContainer");

const overworldToNether =
    document.getElementById("overworldToNether");

const netherToOverworld =
    document.getElementById("netherToOverworld");

const coordinateResult =
    document.getElementById("coordinateResult");

const chunkX =
    document.getElementById("chunkX");

const chunkZ =
    document.getElementById("chunkZ");

const regionX =
    document.getElementById("regionX");

const regionZ =
    document.getElementById("regionZ");

const localX =
    document.getElementById("localX");

const localZ =
    document.getElementById("localZ");

const xBoundary =
    document.getElementById("xBoundary");

const zBoundary =
    document.getElementById("zBoundary");

const copyCoordinates =
    document.getElementById("copyCoordinates");

const copyChunk =
    document.getElementById("copyChunk");

const copyTp =
    document.getElementById("copyTp");


let mode = "overworld";


function formatNumber(value) {

    if (Number.isInteger(value)) {
        return value.toString();
    }

    return value
        .toFixed(6)
        .replace(/\.?0+$/, "");

}


function calculate() {

    const rawX =
        parseFloat(xInput.value);

    const rawZ =
        parseFloat(zInput.value);

    const rawY =
        parseFloat(yInput.value);

    if (
        Number.isNaN(rawX) ||
        Number.isNaN(rawZ)
    ) {
        return null;
    }

    let x;
    let z;

    if (mode === "overworld") {

        x = rawX / 8;
        z = rawZ / 8;

    } else {

        x = rawX * 8;
        z = rawZ * 8;

    }

    const blockX =
        Math.floor(x);

    const blockZ =
        Math.floor(z);

    const blockY =
        Number.isNaN(rawY)
            ? null
            : Math.floor(rawY);

    const calculatedChunkX =
        Math.floor(blockX / 16);

    const calculatedChunkZ =
        Math.floor(blockZ / 16);

    const calculatedRegionX =
        Math.floor(calculatedChunkX / 32);

    const calculatedRegionZ =
        Math.floor(calculatedChunkZ / 32);

    const calculatedLocalX =
        ((blockX % 16) + 16) % 16;

    const calculatedLocalZ =
        ((blockZ % 16) + 16) % 16;

    const minX =
        calculatedChunkX * 16;

    const maxX =
        minX + 15;

    const minZ =
        calculatedChunkZ * 16;

    const maxZ =
        minZ + 15;

    return {

        x,
        z,

        blockX,
        blockZ,
        blockY,

        chunkX: calculatedChunkX,
        chunkZ: calculatedChunkZ,

        regionX: calculatedRegionX,
        regionZ: calculatedRegionZ,

        localX: calculatedLocalX,
        localZ: calculatedLocalZ,

        minX,
        maxX,

        minZ,
        maxZ

    };

}


function updateResults() {

    const data =
        calculate();

    if (!data) {

        coordinateResult.innerHTML =
            "X: —<br>Z: —";

        yInputContainer.style.display =
            "none";

        chunkX.textContent = "—";
        chunkZ.textContent = "—";

        regionX.textContent = "—";
        regionZ.textContent = "—";

        localX.textContent = "—";
        localZ.textContent = "—";

        xBoundary.textContent = "—";
        zBoundary.textContent = "—";

        return;

    }

    yInputContainer.style.display =
        "block";

    const formattedX =
        formatNumber(data.x);

    const formattedZ =
        formatNumber(data.z);

    let result =
        `X: ${formattedX}<br>` +
        `Z: ${formattedZ}`;

    if (data.blockY !== null) {

        result =
            `X: ${formattedX}<br>` +
            `Y: ${formatNumber(data.blockY)}<br>` +
            `Z: ${formattedZ}`;

    }

    coordinateResult.innerHTML =
        result;

    chunkX.textContent =
        data.chunkX;

    chunkZ.textContent =
        data.chunkZ;

    regionX.textContent =
        data.regionX;

    regionZ.textContent =
        data.regionZ;

    localX.textContent =
        data.localX;

    localZ.textContent =
        data.localZ;

    xBoundary.textContent =
        `${data.minX} → ${data.maxX}`;

    zBoundary.textContent =
        `${data.minZ} → ${data.maxZ}`;

}


function getCopyCoordinates() {

    const data =
        calculate();

    if (!data) {
        return "";
    }

    if (data.blockY !== null) {

        return [
            formatNumber(data.x),
            formatNumber(data.blockY),
            formatNumber(data.z)
        ].join(" ");

    }

    return [
        formatNumber(data.x),
        formatNumber(data.z)
    ].join(" ");

}


function getCopyChunk() {

    const data =
        calculate();

    if (!data) {
        return "";
    }

    return `${data.chunkX} ${data.chunkZ}`;

}


function getCopyTp() {

    const data =
        calculate();

    if (!data) {
        return "";
    }

    const targetDimension =
        mode === "overworld"
            ? "minecraft:the_nether"
            : "minecraft:overworld";

    const y =
        data.blockY === null
            ? "~"
            : data.blockY;

    return (
        `/execute in ${targetDimension} run tp @s ` +
        `${data.blockX} ${y} ${data.blockZ}`
    );

}


async function copyText(
    text,
    button
) {

    if (!text) {
        return;
    }

    try {

        await navigator.clipboard.writeText(text);

        const originalText =
            button.textContent;

        button.textContent =
            "Copied!";

        setTimeout(() => {

            button.textContent =
                originalText;

        }, 1200);

    } catch (error) {

        console.error(
            "Failed to copy:",
            error
        );

    }

}


overworldToNether.addEventListener(
    "click",
    () => {

        mode = "overworld";

        overworldToNether.classList.add(
            "active"
        );

        netherToOverworld.classList.remove(
            "active"
        );

        updateResults();

    }
);


netherToOverworld.addEventListener(
    "click",
    () => {

        mode = "nether";

        netherToOverworld.classList.add(
            "active"
        );

        overworldToNether.classList.remove(
            "active"
        );

        updateResults();

    }
);


[
    xInput,
    zInput,
    yInput
].forEach(input => {

    input.addEventListener(
        "input",
        updateResults
    );

});


copyCoordinates.addEventListener(
    "click",
    () => {

        copyText(
            getCopyCoordinates(),
            copyCoordinates
        );

    }
);


copyChunk.addEventListener(
    "click",
    () => {

        copyText(
            getCopyChunk(),
            copyChunk
        );

    }
);


copyTp.addEventListener(
    "click",
    () => {

        copyText(
            getCopyTp(),
            copyTp
        );

    }
);


yInputContainer.style.display =
    "none";

updateResults();
