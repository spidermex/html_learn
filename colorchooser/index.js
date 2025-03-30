
// Important DOM elements to interact
const colorPicker = document.getElementById("color-picker")

// Event Listeners
document.addEventListener('click', function (e) {
    if (e.target.id === "getColorBtn") {
        document.getElementById("colors-sample").style.display = 'none'
        getColor(colorPicker.value, document.getElementById("schemeMode").value)
    }
    else if (e.target.dataset.color) {
        copyColor(e.target)
    }
})

// Function to get the color schema
function getColor(color, mode) {
    const urlTxt = color.substring(1);
    fetch(`https://www.thecolorapi.com/scheme?hex=${urlTxt}&format=json&mode=${mode}&count=6`)
        .then(data => data.json())
        .then(data => {
            let html = ``
            let html2 = ``
            data.colors.forEach(element => {
                html += `<div class="color-cell" style="background-color:${element.hex.value};">
                            <p style="color:${element.contrast.value};">${element.name.value}</p>
                        </div>`
                html2 += `
                <div class="color-name tooltip"  >
                    <p data-color="${element.hex.value}">${element.hex.value}</p>
                    <span class="tooltiptext">Click to copy</span>
                </div>`
            })
            document.getElementById("colores").innerHTML = html
            document.getElementById("nombres").innerHTML = html2
        })
}

// Copy Color to Clipboard
function copyColor(copyText) {
    // Copy the text inside the element
    navigator.clipboard.writeText(copyText.textContent);
    // Change the tooltip text
    const tooltip = copyText.parentElement.querySelector(".tooltiptext")
    tooltip.innerHTML = "Copied: " + copyText.textContent;
    setTimeout(function () {
        tooltip.innerHTML = "Click to copy"
    }, 1500)
}

