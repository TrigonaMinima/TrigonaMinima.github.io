// https://ianto-cannon.github.io/clock.html
// Exact copy of `common.js`.
const svgNS = "http://www.w3.org/2000/svg";
let year, month, date, hour, minute, second, millisecond, hue; //numbers
let timeFracs = [], time = [], sides = [];
let timeZoneName = "", binary = "", monthStr = "", emoji = "", title = "", weekday = ""; //strings
let randomColor = null;
let darkMode = true;
const anyColor = () => {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 40 + 30);
    const l = Math.floor(Math.random() * 60 + 20);
    return `hsl(${h}, ${s}%, ${l}%)`;
};
const halloweenColor = () => {
    const colors = ["#8A4985", "#ff7518"];
    return colors[Math.floor(Math.random() * colors.length)];
};
const christmasColor = () => {
    const colors = ["#ff0000", "#008000"];
    return colors[Math.floor(Math.random() * colors.length)];
};
const newYearColor = () => {
    const colors = ["#ffdd00", "#add8e6", "#800080"];
    return colors[Math.floor(Math.random() * colors.length)];
};
const valentinesColor = () => {
    const colors = ["#ff1493", "#db7093"];
    return colors[Math.floor(Math.random() * colors.length)];
};
const prideColor = () => {
    const colors = ['#e40303', '#ff8c00', '#ffed00', '#008026', '#24408e', '#732982'];
    return colors[Math.floor(Math.random() * colors.length)];
};
const earthColor = () => {
    const colors = ['#008026', '#24408e'];
    return colors[Math.floor(Math.random() * colors.length)];
};
const rgbToHue = (rgb) => {
    let r, g, b;
    if (rgb.startsWith("#")) {
        rgb = rgb.replace(/^#/, '');
        r = parseInt(rgb.slice(0, 2), 16) / 255;
        g = parseInt(rgb.slice(2, 4), 16) / 255;
        b = parseInt(rgb.slice(4, 6), 16) / 255;
    } else {
        [r, g, b] = rgb.match(/\d+/g).map(Number).map(v => v / 255);
    }
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;
    let hue = 0;
    if (delta === 0) {
        hue = 0;
    } else if (max === r) {
        hue = ((g - b) / delta) % 6;
    } else if (max === g) {
        hue = (b - r) / delta + 2;
    } else {
        hue = (r - g) / delta + 4;
    }
    hue = Math.round(hue * 60);
    if (hue < 0) hue += 360;
    return hue;
};
const getTime = () => {
    const now = new Date();
    timeZoneName = Intl.DateTimeFormat("en-US", { timeZoneName: 'short' }).format(now).split(' ').pop();
    year = now.getFullYear();
    month = now.getMonth(); //Jan=0, Feb=1...
    monthStr = now.toLocaleString('en-US', { month: 'short' }); // Jul
    date = now.getDate();
    //get the week number this month
    const firstOfMonth = new Date(year, month, 1);
    const lastOfMonth = new Date(year, month + 1, 0);
    const firstDay = (firstOfMonth.getDay() + 6) % 7; // Monday = 0
    const week = Math.floor((firstDay + date - 1) / 7);
    const totalDays = lastOfMonth.getDate();
    const weeksInMonth = Math.ceil((firstDay + totalDays) / 7);
    sides = [9, 9, 11, weeksInMonth - 1, 6, 23, 5, 9, 5, 9];
    weekday = now.toLocaleString('en-US', { weekday: 'short' }); // Thu
    const wkday = (now.getDay() + 6) % 7; //Sun=6, Mon=0...
    hour = now.getHours();
    minute = now.getMinutes();
    second = now.getSeconds();
    millisecond = now.getMilliseconds();
    time = [Math.floor(year / 10) % 10, year % 10, month, week, wkday, hour, Math.floor(minute / 10), minute % 10, Math.floor(second / 10), second % 10];
    const secFrac = millisecond / 1000;
    const minFrac = (second + secFrac) / 60;
    const hrFrac = (minute + minFrac) / 60;
    const dayFrac = (hour + hrFrac) / 24;
    //get the day number this year
    const start = new Date(year, 0, 0); // Jan 1
    const oneDay = 1000 * 60 * 60 * 24;
    const days = Math.floor((now - start) / oneDay);
    const yrFrac = (days + dayFrac) / 365.25;
    const milFrac = (year + yrFrac) / 1000;
    timeFracs = [milFrac, yrFrac, dayFrac, hrFrac, minFrac, secFrac];
    const unixTime = Math.floor(now.getTime() / 1000);
    binary = unixTime.toString(2).padStart(31, '0');
};
const createTriangle = (value, width, height, lightness, peaksSVG) => {
    for (let i = -1; i <= 1; i++) {
        const left = width * (.5 - value + i);
        const mid = width * (1 - value + i);
        const right = width * (1.5 - value + i);
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("fill", `hsl(${hue}, 30%, ${lightness}%)`);
        path.setAttribute("d", `M${left.toFixed(0)},10 L${mid.toFixed(0)},${10 - height} L${right.toFixed(0)},10 Z`);
        peaksSVG.appendChild(path);
    }
};
const updatePeaks = (peaksSVG) => {
    while (peaksSVG.firstChild) {
        peaksSVG.removeChild(peaksSVG.firstChild);
    }
    const width = 1000;
    getTime();
    for (let i = 0; i <= 4; i++) {
        const lightness = darkMode ? (20 + i * 10) : (100 - 20 - i * 10);
        createTriangle(timeFracs[i] % 1, width, 10 - i * 1.5, lightness, peaksSVG);
    }
    requestAnimationFrame(() => updatePeaks(peaksSVG));
};


getTime();
emoji = "";
if (month === 9 && date === 31) {
    emoji = " 🎃";
    title = "Happy halloween!";
    randomColor = halloweenColor;
    const style = document.createElement("style");
    style.textContent = `@font-face {font-family: 'Creepster'; src: url('creepster.woff2') format('woff2'); font-display: swap;}`;
    document.head.appendChild(style);
    document.querySelectorAll('h1, h2, h3').forEach((el) => {
        el.classList.add('halloween');
    });
} else if (month === 11 && date >= 24 && date <= 26) {
    emoji = " 🎄";
    title = "Merry Christmas!";
    randomColor = christmasColor;
} else if (month === 0 && date <= 3) {
    emoji = " 🎆";
    title = "Happy new year!";
    randomColor = newYearColor;
} else if (month === 1 && date === 14) {
    emoji = " 💘";
    title = "Happy Valentine's day!";
    randomColor = valentinesColor;
    document.querySelectorAll('h1, h2, h3').forEach((el) => {
        el.classList.add('valentines');
    });
} else if (month === 5 && date === 28) {
    emoji = " 🌈";
    title = "Happy pride!";
    randomColor = prideColor;
} else if (month === 3 && date === 22) {
    emoji = " 🌎";
    title = "Happy Earth day!";
    randomColor = earthColor;
} else {
    randomColor = anyColor;
}
document.querySelectorAll("h2").forEach((h) => {
    h.textContent += emoji;
    h.title = title;
});
let col = randomColor();
if (col.startsWith("hsl(")) {
    hue = parseInt(col.match(/hsl\((\d+),/)[1], 10);
} else {
    hue = rgbToHue(col);
}
const lightness = document.body.classList.contains('dark') ? 70 : 30;
col = `hsl(${hue}, 30%, ${lightness}%)`;
document.querySelectorAll("svg.peaks").forEach(svg => {
    updatePeaks(svg);
    svg.setAttribute("viewBox", "0 0 1000 10");
    svg.setAttribute("preserveAspectRatio", "none");
});
