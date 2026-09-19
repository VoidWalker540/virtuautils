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

const advancedToggle =
    document.getElementById("advancedToggle");

const advancedOptions =
    document.getElementById("advancedOptions");

const exactToggle =
    document.getElementById("exactToggle");

const lettersToggle =
    document.getElementById("lettersToggle");

const yToggle =
    document.getElementById("yToggle");

const yInputContainer =
    document.getElementById("yInputContainer");

const result =
    document.getElementById("result");

const resultExact =
    document.getElementById("resultExact");

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

const copyBlock =
    document.getElementById("copyBlock");

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

function formatBlock(value) {

    if (value === null) {
        return "";
    }

    return String(
        Math.floor(value)
    );
}

function buildText(
    x,
    y,
    z,
    labels
) {

    const values = [];

    if (x !== null) {

        values.push(
            labels
                ? `X: ${x}`
                : String(x)
        );

    }

    if (y !== null) {

        values.push(
            labels
                ? `Y: ${y}`
                : String(y)
        );

    }

    if (z !== null) {

        values.push(
            labels
                ? `Z: ${z}`
                : String(z)
        );

    }

    return values.join(
        labels
            ? "  "
            : " "
    );
}

function calculate() {

    const x =
        getNumber(xInput);

    const z =
        getNumber(zInput);

    const y =
        advancedToggle.checked &&
        yToggle.checked
            ? getNumber(yInput)
            : null;

    if (
        x === null &&
        z === null &&
        y === null
    ) {

        result.classList.remove("show");

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

    const labels =
        lettersToggle.checked;

    resultExact.textContent =
        buildText(
            exactX || null,
            exactY || null,
            exactZ || null,
            labels
        );

    resultBlock.textContent =
        buildText(
            blockX,
            blockY,
            blockZ,
            labels
        );

    if (
        blockX !== null &&
        blockZ !== null
    ) {

        const currentChunkX =
            Math.floor(blockX / 16);

        const currentChunkZ =
            Math.floor(blockZ / 16);

        const currentRegionX =
            Math.floor(
                currentChunkX / 32
            );

        const currentRegionZ =
            Math.floor(
                currentChunkZ / 32
            );

        const insideChunkX =
            ((blockX % 16) + 16) % 16;

        const insideChunkZ =
            ((blockZ % 16) + 16) % 16;

        chunkX.textContent =
            currentChunkX;

        chunkZ.textContent =
            currentChunkZ;

        regionX.textContent =
            currentRegionX;

        regionZ.textContent =
            currentRegionZ;

        localX.textContent =
            insideChunkX;

        localZ.textContent =
            insideChunkZ;

        const startX =
            currentChunkX * 16;

        const startZ =
            currentChunkZ * 16;

        minX.textContent =
            startX;

        maxX.textContent =
            startX + 15;

        minZ.textContent =
            startZ;

        maxZ.textContent =
            startZ + 15;

    } else {

        chunkX.textContent = "—";
        chunkZ.textContent = "—";

        regionX.textContent = "—";
        regionZ.textContent = "—";

        localX.textContent = "—";
        localZ.textContent = "—";

        minX.textContent = "—";
        maxX.textContent = "—";

        minZ.textContent = "—";
        maxZ.textContent = "—";
    }

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

function showAdvanced() {

    const enabled =
        advancedToggle.checked;

    advancedOptions.classList.toggle(
        "show",
        enabled
    );

    yInputContainer.classList.toggle(
        "show",
        enabled &&
        yToggle.checked
    );

    if (!enabled) {
        yInput.value = "";
    }

    calculate();
}

function showY() {

    const visible =
        advancedToggle.checked &&
        yToggle.checked;

    yInputContainer.classList.toggle(
        "show",
        visible
    );

    if (!yToggle.checked) {
        yInput.value = "";
    }

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
                        "Copy";

                }, 1500);

        });
}

overworldMode.addEventListener(
    "click",
    () => setMode("overworld")
);

netherMode.addEventListener(
    "click",
    () => setMode("nether")
);

advancedToggle.addEventListener(
    "change",
    showAdvanced
);

yToggle.addEventListener(
    "change",
    showY
);

[
    xInput,
    yInput,
    zInput,
    exactToggle,
    lettersToggle
].forEach(element => {

    element.addEventListener(
        "input",
        calculate
    );

    element.addEventListener(
        "change",
        calculate
    );

});

copyCoordinates.addEventListener(
    "click",
    () => {

        const data =
            calculate();

        if (!data) {
            return;
        }

        copyText(
            resultExact.textContent.trim(),
            copyCoordinates
        );

    }
);

copyBlock.addEventListener(
    "click",
    () => {

        const data =
            calculate();

        if (!data) {
            return;
        }

        copyText(
            resultBlock.textContent.trim(),
            copyBlock
        );

    }
);

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
