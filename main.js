let start = Date.now()
let canvas_container = document.getElementById('canvas-container')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let side = 0;
let cells;
let tilecount = 100;
let cellwidth = side / tilecount
let playing = true
init()
let i = 0
setInterval(() => {
    if (playing) step()
    i++;
    if (i == 1000) console.log(Date.now() - start)
}, 1000 / 60)
function step() {
    side = canvas_container.offsetHeight
    canvas_container.style.width = side
    if (canvas.width != side || canvas.height != side) {
        canvas.width = side
        canvas.height = side
    }
    cellwidth = side / tilecount
    let nextphase = deepcopy(cells)
    for (var y = 0; y < tilecount; y++) {
        for (let x = 0; x < tilecount; x++) {
            nextphase[y][x] = nextvalue(x, y, cells[y][x])
            draw(x, y, nextphase[y][x])
        }
    }
    cells = deepcopy(nextphase)
}
function getneighborcount(x, y, debug) {
    let neighborcount = 0
    py = (y + 1) == tilecount ? 0 : y + 1
    my = (y - 1) < 0 ? tilecount - 1 : y - 1
    px = (x - 1) < 0 ? tilecount - 1 : x - 1
    mx = (x + 1) == tilecount ? 0 : x + 1
    neighborcount += cells[py][mx] > 0 ? 1 : 0
    neighborcount += cells[py][x] > 0 ? 1 : 0
    neighborcount += cells[py][px] > 0 ? 1 : 0
    neighborcount += cells[y][mx] > 0 ? 1 : 0
    neighborcount += cells[y][px] > 0 ? 1 : 0
    neighborcount += cells[my][mx] > 0 ? 1 : 0
    neighborcount += cells[my][x] > 0 ? 1 : 0
    neighborcount += cells[my][px] > 0 ? 1 : 0
    if (debug) console.log(cells[down][x], down, x)
    return neighborcount
}
function nextvalue(x, y, val) {
    let neighborcount = getneighborcount(x, y);
    if (val > 0) {
        if (neighborcount < 2 || neighborcount > 3) {
            return 0
        } else {
            return val + 1
        }
    } else {
        if (neighborcount == 3) {
            return 1
        } else {
            return val
        }
    }
}

function init() {
    side = canvas_container.offsetHeight
    canvas_container.style.width = side
    canvas.width = side
    canvas.height = side
    cells = []
    for (let x = 0; x < tilecount; x++) {
        cells.push([])
        for (let y = 0; y < tilecount; y++) {
            cells[x].push(Math.round(Math.random()))
            // cells[x].push(0)
        }
    }
}

function draw(x, y, age) {
    if (age == 0) ctx.fillStyle = 'hsl(0,0%,30%)'
    //else if (age > 10) ctx.fillStyle = `hsl(220,50%,50%)`
    else ctx.fillStyle = `hsl(${(age - 1) * 20},50%,50%)`
    ctx.fillRect(x * cellwidth, y * cellwidth, cellwidth, cellwidth)
}

canvas.addEventListener('click', (e) => {
    let y = Math.floor(e.offsetY / cellwidth)
    let x = Math.floor(e.offsetX / cellwidth)
    if (!e.metaKey) {
        console.log(x, y, e.offsetX, e.offsetY)
        cells[y][x] = 1
        draw(x, y, cells[y][x])
    } else {
        console.log(getneighborcount(x, y), nextvalue(x, y, cells[y][x]))
    }
}, false)

function deepcopy(arr) {
    let newarr = []
    for (let i = 0; i < arr.length; i++) {
        newarr.push(arr[i].slice(0))
    }
    return newarr;
}