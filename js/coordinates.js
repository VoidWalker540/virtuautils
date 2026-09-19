const overworldMode =
    document.getElementById("overworldMode");

const netherMode =
    document.getElementById("netherMode");

const xInput =
    document.getElementById("x");

const yInput =
    document.getElementById("y");

const zInput =
    document.getElementById("z");

const yInputContainer =
    document.getElementById("yInputContainer");

const result =
    document.getElementById("result");

const resultCoordinates =
    document.getElementById("resultCoordinates");

const resultBlock =
    document.getElementById("resultBlock");

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

const minX =
    document.getElementById("minX");

const maxX =
    document.getElementById("maxX");

const minZ =
    document.getElementById("minZ");

const maxZ =
    document.getElementById("maxZ");

const copyCoordinates =
    document.getElementById("copyCoordinates");

const copyChunk =
    document.getElementById("copyChunk");

const copyTp =
    document.getElementById("copyTp");

let mode = "overworld";

let copyTimer = null;


function getNumber(input) {

    if (input.value.trim() === "") {
        return null;
    }

    const value =
        Number(input.value);

    return Number.isFinite(value)
        ? value
        : null;
}


function formatNumber(value) {

    if (value === null) {
        return "";
    }

    if (Number.isInteger(value)) {
        return String(value);
    }

    return value
        .toFixed(6)
        .replace(/\.?0+$/, "");
}


function calculate() {

    const x =
        getNumber(xInput);

    const z =
        getNumber(zInput);

    const y =
        getNumber(yInput);

    /*
     * Results appear as soon as
     * X or Z has an input.
     */

    if (
        x === null &&
        z === null
    ) {

        result.classList.remove("show");

        yInputContainer.classList.remove("show");

        return null;
    }


    const convertedX =
        x === null
            ? null
            : mode === "overworld"
                ? x / 8
                : x * 8;

    const convertedZ =
        z === null
            ? null
            : mode === "overworld"
                ? z / 8
                : z * 8;


    const exactX =
        formatNumber(convertedX);

    const exactZ =
        formatNumber(convertedZ);

    const exactY =
        formatNumber(y);


    const blockX =
        convertedX === null
            ? null
            : Math.floor(convertedX);

    const blockZ =
        convertedZ === null
            ? null
            : Math.floor(convertedZ);

    const blockY =
        y === null
            ? null
            : Math.floor(y);


    /*
     * Coordinates
     */

    let coordinatesHTML = "";

    if (convertedX !== null) {

        coordinatesHTML +=
            `X: ${exactX}`;

    }

    if (y !== null) {

        coordinatesHTML +=
            `<br>Y: ${exactY}`;

    }

    if (convertedZ !== null) {

        coordinatesHTML +=
            `<br>Z: ${exactZ}`;

    }

    resultCoordinates.innerHTML =
        coordinatesHTML;


    /*
     * Block
     */

    let blockHTML = "";

    if (blockX !== null) {

        blockHTML +=
            `X: ${blockX}`;

    }

    if (blockY !== null) {

        blockHTML +=
            `<br>Y: ${blockY}`;

    }

    if (blockZ !== null) {

        blockHTML +=
            `<br>Z: ${blockZ}`;

    }

    resultBlock.innerHTML =
        blockHTML;


    /*
     * X chunk and region information.
     */

    if (blockX !== null) {

        const currentChunkX =
            Math.floor(blockX / 16);

        const currentRegionX =
            Math.floor(
                currentChunkX / 32
            );

        const insideChunkX =
            ((blockX % 16) + 16) % 16;


        chunkX.textContent =
            currentChunkX;

        regionX.textContent =
            currentRegionX;

        localX.textContent =
            insideChunkX;


        const startX =
            currentChunkX * 16;


        minX.textContent =
            startX;

        maxX.textContent =
            startX + 15;

    } else {

        chunkX.textContent = "—";
        regionX.textContent = "—";
        localX.textContent = "—";

        minX.textContent = "—";
        maxX.textContent = "—";

    }


    /*
     * Z chunk and region information.
     */

    if (blockZ !== null) {

        const currentChunkZ =
            Math.floor(blockZ / 16);

        const currentRegionZ =
            Math.floor(
                currentChunkZ / 32
            );

        const insideChunkZ =
            ((blockZ % 16) + 16) % 16;


        chunkZ.textContent =
            currentChunkZ;

        regionZ.textContent =
            currentRegionZ;

        localZ.textContent =
            insideChunkZ;


        const startZ =
            currentChunkZ * 16;


        minZ.textContent =
            startZ;

        maxZ.textContent =
            startZ + 15;

    } else {

        chunkZ.textContent = "—";
        regionZ.textContent = "—";
        localZ.textContent = "—";

        minZ.textContent = "—";
        maxZ.textContent = "—";

    }


    /*
     * Show Y input once results exist.
     */

    yInputContainer.classList.add("show");


    /*
     * Re-run result animation.
     */

    result.classList.remove("show");

    void result.offsetWidth;

    result.classList.add("show");


    return {

        exactX,
        exactY,
        exactZ,

        blockX,
        blockY,
        blockZ

    };

}


function setMode(nextMode) {

    mode = nextMode;

    overworldMode.classList.toggle(
        "active",
        mode === "overworld"
    );

    netherMode.classList.toggle(
        "active",
        mode === "nether"
    );

    calculate();
}


function copyText(
    text,
    button
) {

    if (!text) {
        return;
    }

    navigator.clipboard
        .writeText(text)
        .then(() => {

            clearTimeout(
                copyTimer
            );

            const original =
                button.textContent;

            button.textContent =
                "✓ Copied!";

            button.classList.add(
                "copied"
            );

            copyTimer =
                setTimeout(() => {

                    button.textContent =
                        original;

                    button.classList.remove(
                        "copied"
                    );

                }, 1500);

        })
        .catch(() => {

            button.textContent =
                "Copy failed";

            clearTimeout(
                copyTimer
            );

            copyTimer =
                setTimeout(() => {

                    button.textContent =
                        button.id === "copyCoordinates"
                            ? "Copy Coordinates"
                            : button.id === "copyChunk"
                                ? "Copy Chunk"
                                : "Copy /tp";

                }, 1500);

        });

}


overworldMode.addEventListener(
    "click",
    () => {

        setMode("overworld");

    }
);


netherMode.addEventListener(
    "click",
    () => {

        setMode("nether");

    }
);


[
    xInput,
    yInput,
    zInput
].forEach(input => {

    input.addEventListener(
        "input",
        calculate
    );

});


/*
 * Copy Coordinates
 *
 * Copies only the values.
 * No X:, Y: or Z: labels.
 */

copyCoordinates.addEventListener(
    "click",
    () => {

        const data =
            calculate();

        if (!data) {
            return;
        }

        const values = [];

        if (data.exactX !== "") {

            values.push(
                data.exactX
            );

        }

        if (data.exactY !== "") {

            values.push(
                data.exactY
            );

        }

        if (data.exactZ !== "") {

            values.push(
                data.exactZ
            );

        }

        copyText(
            values.join(" "),
            copyCoordinates
        );

    }
);


/*
 * Copy Chunk
 *
 * Copies:
 * Chunk X Chunk Z
 */

copyChunk.addEventListener(
    "click",
    () => {

        const data =
            calculate();

        if (
            !data ||
            data.blockX === null ||
            data.blockZ === null
        ) {
            return;
        }

        const currentChunkX =
            Math.floor(
                data.blockX / 16
            );

        const currentChunkZ =
            Math.floor(
                data.blockZ / 16
            );

        copyText(
            `${currentChunkX} ${currentChunkZ}`,
            copyChunk
        );

    }
);


/*
 * Copy /tp
 */

copyTp.addEventListener(
    "click",
    () => {

        const data =
            calculate();

        if (
            !data ||
            data.blockX === null ||
            data.blockZ === null
        ) {
            return;
        }

        const targetDimension =
            mode === "overworld"
                ? "minecraft:the_nether"
                : "minecraft:overworld";

        const y =
            data.blockY === null
                ? "~"
                : data.blockY;

        const command =
            `/execute in ${targetDimension} run tp @s ${data.blockX} ${y} ${data.blockZ}`;

        copyText(
            command,
            copyTp
        );

    }
);


calculate();
