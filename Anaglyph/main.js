const container = document.querySelector('.container')
const sizeEl = document.querySelector('.size')
const color = document.querySelector('.color')
const resetBtn = document.querySelector('.btn')
const createAnaglyph = document.querySelector('.anaglyph')
const diff = document.querySelector('.difficulty')
const pad = document.querySelector('.padding')

let size = sizeEl.value
let difficulty = diff.value
let padding = pad.value
let draw = false

let grid = []
resetGrid()

function resetGrid() {
    grid = []
    for (let i = 0; i < size * size; i++) {
        grid.push(0)
    }
}

function resetPadding() {
    for (let i = 0; i < size * size; i++) {
        if (grid[i] == 1) {
            pass
        } else {
            grid[i] == 0
        }
    }
    markPadding()
}

function getNeighbors(x, y) {
    let neighbors = []
    for (let i = 0; i < padding; i++) {
        for (let j = 0; j < padding; j++) {
            if (x - i >= 0 && j + y <= size - 1) {
                neighbors.push([x - i, y + j])
            }
            if (x - i >= 0 && y - j >= 0) {
                neighbors.push([x - i, y - j])
            }
            if (x + i <= size - 1 && y + j <= size - 1) {
                neighbors.push([x + i, y + j])
            }
            if (x + i <= size - 1 && y - j >= 0) {
                neighbors.push([x + i, y - j])
            }
            
        }
    }
    //console.log("Neighbors = ", neighbors)
    return neighbors
}

function markPadding() {
    for (let index = 0; index < size * size; index++) {
        let i = Math.floor(index / size)
        let j = index % size
        if (grid[index] == 1) {
            let neighbors = getNeighbors(i, j)
            for (let n = 0; n < neighbors.length; n++) {
                //console.log("Neighbor of ", i,", ", j, ": ", neighbors[n])
                let grid_ind = Math.round(neighbors[n][0] * size + neighbors[n][1])
                if (grid[grid_ind] != 1) {
                    grid[grid_ind] = 2
                }
            }
        }
        
    }
}

function populate(size) {
  container.style.setProperty('--size', size)
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement('div')
    div.classList.add('pixel')

    div.addEventListener('mouseover', function(){
        if(!draw) return
        div.style.backgroundColor = color.value
        grid[i] = 1
    })
    div.addEventListener('mousdown', function(){
        div.style.backgroundColor = color.value
        grid[i] = 1
    })

    container.appendChild(div)
  }
}

window.addEventListener("mousedown", function(){
    draw = true
})
window.addEventListener("mouseup", function(){
    draw = false
})

function reset(){
    container.innerHTML = ''
    populate(size)
    resetGrid()
}

resetBtn.addEventListener('click', reset)

const hsbToRgb = (h, s, b) => {
    h = h * 360/255
    s = s * 100/255
    b = b * 100/255
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    const rgb = [255 * f(5), 255 * f(3), 255 * f(1)]
    return rgb;
  };

function rgbToHex(arr) {
    const r = Math.round(arr[0])
    const g = Math.round(arr[1])
    const b = Math.round(arr[2])
    return ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
}
    

var redTop = 55;
var blueLow = 75;
var blueTop = 190;
var purpleLow = 200;

var odstin=Math.random()*255;
var satur=255;

function selectCyan(){
    odstin=Math.random()*255;
    satur=255;
    while(odstin<blueLow || odstin>blueTop){
        odstin=Math.random()*255;
    }
};

function selectRed(){
    odstin=Math.random()*255;
    while(odstin>redTop && odstin<purpleLow){
        odstin=Math.random()*255;
    }
    satur=Math.random()*8;
    if(satur>1) {satur=255;}
};

function glyph(arr) {
    let out_arr = []
    for (i = 0; i < size; i++) {
        for (j = 0; j < size; j++) {
            let index = i*size + j
            odstin=Math.random()*255;
            satur=255;
            pom=Math.random()*100;
            
            if (arr[index] == 1) {
                selectCyan()
            } else if (arr[index] == 2) {
                if (Math.random() > difficulty / 100) {
                    selectRed()
                } else {
                    selectCyan()
                }
            } else {
                if (Math.random() > .5) {
                    selectRed()
                } else {
                    selectCyan()
                }
            }
            
            out_arr.push('#' + rgbToHex(hsbToRgb(odstin, satur, 255)))
        }
    }
    return out_arr
}

function createGlyph(){
    markPadding()
    //console.log(grid)
    container.innerHTML = ''
    let colors = glyph(grid)
    container.style.setProperty('--size', size)
    for (let i = 0; i < size * size; i++) {
        const div = document.createElement('div')
        div.classList.add('pixel')

        div.style.backgroundColor = colors[i]

        container.appendChild(div)
    }
}

createAnaglyph.addEventListener('click', createGlyph)

sizeEl.addEventListener('keyup', function(){
    size = sizeEl.value
    reset()
    resetGrid()
})

diff.addEventListener('keyup', function(){
    difficulty = diff.value
})

pad.addEventListener('keyup', function(){
    padding = pad.value
    resetPadding()
})

populate(size)