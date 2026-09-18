const themeSelect = document.getElementById("themeSelect");

function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
}

function applyTheme(theme) {
    const resolvedTheme =
        theme === "system"
            ? getSystemTheme()
            : theme;

    document.documentElement.dataset.theme =
        resolvedTheme;

    document.documentElement.style.colorScheme =
        resolvedTheme;

    if (themeSelect) {
        themeSelect.value = theme;
    }

    localStorage.setItem(
        "virtuaUtilsTheme",
        theme
    );
}

function loadTheme() {
    const savedTheme =
        localStorage.getItem("virtuaUtilsTheme") ||
        "system";

    const validThemes = [
        "system",
        "light",
        "dark"
    ];

    applyTheme(
        validThemes.includes(savedTheme)
            ? savedTheme
            : "system"
    );
}

if (themeSelect) {
    themeSelect.addEventListener(
        "change",
        () => {
            applyTheme(
                themeSelect.value
            );
        }
    );
}

loadTheme();

window
    .matchMedia(
        "(prefers-color-scheme: light)"
    )
    .addEventListener(
        "change",
        () => {

            if (
                (
                    localStorage.getItem(
                        "virtuaUtilsTheme"
                    ) || "system"
                ) === "system"
            ) {
                applyTheme("system");
            }

        }
    );
