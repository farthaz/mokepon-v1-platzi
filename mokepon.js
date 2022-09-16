const sectionChooseAttack = document.getElementById('choose-attack')
const buttonMonsterPlayer = document.getElementById('button-monster')
const sectionRestart = document.getElementById('restart')
const buttonRestart = document.getElementById('button-restart')

const spanMonsterFoe = document.getElementById('monster-foe')

const sectionChooseMonster = document.getElementById('choose-monster')
const spanMonsterPlayer = document.getElementById('monsterPlayer')

const spanLivePlayer = document.getElementById('lives-player')
const spanLiveFoe = document.getElementById('lives-foe')

const sectionMessages = document.getElementById('result')
const playerAttacks = document.getElementById('player-attacks')
const foeAttacks = document.getElementById('foe-attacks')
const containerCards = document.getElementById('container-cards')
const attacksContainer = document.getElementById('attacksContainer')

const sectionShowMap = document.getElementById('show-map')
const map = document.getElementById('map')

let playerid = null
let foeid = null
let mokepones = []
let mokeponesFoes = []
let attacksPlayer = []
let attackMonsterFoe = []
let mokeponOptions
let inputHydro 
let inputGeo 
let inputPyro
let playerMonster
let playerMonsterObject
let attacksMokepon
let attacksMonsterFoe
let buttonFire  
let buttonWater 
let buttonEarth 
let buttons = []
let indexAttackPlayer
let indexAttackMonsterFoe
let winPlayer = 0
let winFoe = 0
let livesPlayer = 3
let livesFoe = 3
let panel = map.getContext("2d")
let interval
let mapBackground = new Image()
mapBackground.src = './assets/mokemap.png'
let heightNeeded
let mapWidth = window.innerWidth - 20
const mapMaxWidth = 350

if (mapWidth > mapMaxWidth) {
    mapWidth = mapMaxWidth
}

heightNeeded = mapWidth * 600 / 800

map.width = mapWidth
map.height = heightNeeded

class Mokepon {
    constructor(name, picture, health, pictureMap, id = null) {
        this.id = id
        this.name = name 
        this.picture = picture
        this.health = health
        this.attack = []
        this.width = 40
        this.height = 40
        this.x = random(0, map.width - this.width)
        this.y = random(0, map.height - this.height)
        this.mapPicture = new Image()
        this.mapPicture.src = pictureMap
        this.speedX = 0
        this.speedY = 0
    }
    drawMokepon () {
        panel.drawImage(
            this.mapPicture,
            this.x,
            this.y,
            this.width,
            this.height,
        )
    }
}

let hydro = new Mokepon('Hydro', './assets/mokepons_mokepon_hydro_attack.png', 5, './assets/hipodoge.png')

let geo = new Mokepon ('Geo', './assets/mokepons_mokepon_Geo_attack.png', 5, './assets/capipepo.png')

let pyro = new Mokepon ('Pyro', './assets/mokepons_mokepon_pyro_attack.png', 5, './assets/ratigueya.png')

const HIPODOGE_ATTACKS = [
    { name: 'WATER', id: 'button-water'},
    { name: 'WATER', id: 'button-water'},
    { name: 'WATER', id: 'button-water'},
    { name: 'FIRE', id: 'button-fire'},
    { name: 'EARTH', id: 'button-earth'},
]

const GEO_ATTACKS = [
    { name: 'EARTH', id: 'button-earth'},
    { name: 'EARTH', id: 'button-earth'},
    { name: 'EARTH', id: 'button-earth'},
    { name: 'FIRE', id: 'button-fire'},
    { name: 'WATER', id: 'button-water'},
]

const PYRO_ATTACKS = [
    { name: 'FIRE', id: 'button-fire'},
    { name: 'FIRE', id: 'button-fire'},
    { name: 'FIRE', id: 'button-fire'},
    { name: 'EARTH', id: 'button-earth'},
    { name: 'WATER', id: 'button-water'},
]

hydro.attack.push(...HIPODOGE_ATTACKS)
geo.attack.push(...GEO_ATTACKS)
pyro.attack.push(...PYRO_ATTACKS)

mokepones.push(hydro, geo, pyro)

function startGame() {
    sectionChooseAttack.style.display = 'none'
    sectionShowMap.style.display = 'none'
    
    mokepones.forEach((mokepon) => {
        mokeponOptions = `
        <input type="radio" name = "monsters" id=${mokepon.name} />
        <label class="card-mokepon" for=${mokepon.name}>  
            <p>${mokepon.name}</p>
            <img src=${mokepon.picture} alt="">
        </label>
        `
    containerCards.innerHTML += mokeponOptions 

    inputHydro = document.getElementById('Hydro')
    inputGeo = document.getElementById('Geo')
    inputPyro = document.getElementById('Pyro')

    })
    
    sectionRestart.style.display = 'none'
    
    buttonMonsterPlayer.addEventListener('click', chooseMonsterPlayer)
    

    buttonRestart.addEventListener('click', restartGame)

    joinGame()
}

function joinGame() {
    fetch("http://192.168.100.83:8080/join")
        .then(function (res) {
            if(res.ok) {
                res.text()
                .then(function (response) {
                    console.log(response)
                    playerid = response
                })
            }
        })
}

function chooseMonsterPlayer() {    
    if (inputHydro.checked) {
        spanMonsterPlayer.innerHTML = inputHydro.id
        playerMonster = inputHydro.id
    } else if (inputGeo.checked) {
        spanMonsterPlayer.innerHTML = inputGeo.id  
        playerMonster = inputGeo.id
    } else if (inputPyro.checked) {
        spanMonsterPlayer.innerHTML = inputPyro.id 
        playerMonster = inputPyro.id  
    } 
    else {
        alert('Please select a monster')
        return
    }
    sectionChooseMonster.style.display = 'none'
    
    chooseMokepon(playerMonster)

    extractAttack(playerMonster)
    sectionShowMap.style.display = 'flex'
    startMap()
    
}

function chooseMokepon(playerMonster) {
    fetch(`http://192.168.100.83:8080/mokepon/${playerid}`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            mokepon: playerMonster
        })
    })
}

function extractAttack (playerMonster){
    let attacks 
    for (let i = 0; i < mokepones.length; i++) {
        if (playerMonster === mokepones[i].name) {
            attacks = mokepones[i].attack
        }
    }
    showAttacks(attacks)
}

function showAttacks(attacks) {
    attacks.forEach((attack) => {
        attacksMokepon = `
        <button id=${attack.id} class ="button-attack BAttack">${attack.name} </button>
        `

        attacksContainer.innerHTML += attacksMokepon

    })
        buttonFire = document.getElementById('button-fire')
        buttonWater = document.getElementById('button-water')
        buttonEarth = document.getElementById('button-earth')
        buttons = document.querySelectorAll('.BAttack')   
        

}

function attackSeq() {
    buttons.forEach((button) => {
        button.addEventListener('click', (e) => {
            if (e.target.textContent === 'FIRE ') {
                attacksPlayer.push('FIRE')
                console.log(attacksPlayer)
                button.style.background = '#112f58'
                button.disabled = true
            } else if (e.target.textContent === 'WATER ') {
                attacksPlayer.push('WATER')
                console.log(attacksPlayer)
                button.style.background = '#112f58'
                button.disabled = true
            } else {
                attacksPlayer.push('EARTH')
                console.log(attacksPlayer)
                button.style.background = '#112f58'
                button.disabled = true
            }
            if(attacksPlayer.length === 5){
            sendAttacks()
            }
        })
    })

}

function sendAttacks() {
    fetch(`http://local:8080/mokepon/${playerid}/attacks`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            attacks: attacksPlayer
        })
    })

    interval = setInterval(obtainAttacks, 50)
}

function obtainAttacks() {  
    fetch(`http://local:8080/mokepon/${foeid}/attacks`)
        .then(function(res){
            if(res.ok) {
                res.json()
                    .then(function({ attacks}) {
                        if (attacks.lenght === 5) {
                            attackMonsterFoe = attacks 
                            battle()
                        }
                    })
                }
        })                
}

function chooseMonsterFoe(foe) {
    spanMonsterFoe.innerHTML = foe.name
    attacksMonsterFoe = foe.attack
    attackSeq()

}

function randomAttackFoe() {
    console.log('attacks foe', attackMonsterFoe)
    let attackFoe = random(0, attacksMonsterFoe.length -1)

    if (attackFoe == 0 || attackFoe == 1) {
        attackMonsterFoe.push('FIRE') 
    } else if (attackFoe == 3 || attackFoe == 4) {
        attackMonsterFoe.push('WATER') 
    } else {
        attackMonsterFoe.push('EARTH')
    }
    console.log(attackMonsterFoe)
    startBattle()

}

function startBattle() {
    if (attacksPlayer.length === 5) {
        battle()
    }
}

function indexPlayers(player, foe) {
    indexAttackPlayer = attacksPlayer[player]
    indexAttackMonsterFoe = attackMonsterFoe[foe]
}

function battle() {
    clearInterval(interval)

    for (let index = 0; index < attacksPlayer.length; index++) {
        if (attacksPlayer[index] === attackMonsterFoe[index]) {
            indexPlayers(index, index)
            newMessage("DRAW")
        } else if (attacksPlayer[index] === 'FIRE' && attackMonsterFoe[index] === 'EARTH') {
            indexPlayers(index, index)
            newMessage("YOU WON")
            winPlayer++
            spanLivePlayer.innerHTML = winPlayer
        } else if (attacksPlayer[index] === 'WATER' && attackMonsterFoe[index] === 'FIRE') {
            indexPlayers(index, index)
            newMessage("YOU WON")
            winPlayer++
            spanLivePlayer.innerHTML = winPlayer
        } else if (attacksPlayer[index] === 'EARTH' && attackMonsterFoe[index] === 'WATER') {
            indexPlayers(index, index)
            newMessage("YOU WON")
            winPlayer++
            spanLivePlayer.innerHTML = winPlayer
        } else {
            indexPlayers(index, index)
            newMessage("YOU LOST")
            winFoe++
            spanLiveFoe.innerHTML = winFoe
        }
        
    }
    checkVictories()
    }

function checkVictories() {
    if (winPlayer === winFoe) {
    finalMessage("Draw! Keep trying")
    } else if (winPlayer > winFoe) {
        finalMessage("Ha! You won, lucky shot!")
    } else {
        finalMessage("You lost, loser!")
    }
}

function newMessage(result) {
    let newPlayerAttack = document.createElement('p')
    let newFoeAttack = document.createElement('p')

    sectionMessages.innerHTML = result
    newPlayerAttack.innerHTML = indexAttackPlayer
    newFoeAttack.innerHTML = indexAttackMonsterFoe
   
    playerAttacks.appendChild(newPlayerAttack)
    foeAttacks.appendChild(newFoeAttack)
}

function finalMessage(finalResult) {
    sectionMessages.innerHTML = finalResult
    sectionRestart.style.display = 'block'

}

function restartGame() {
    location.reload()
}

function random(min, max) {
    return Math.floor(Math.random()*(max - min + 1) + min)
}

function drawCanvas() {
    playerMonsterObject.x = playerMonsterObject.x + playerMonsterObject.speedX
    playerMonsterObject.y = playerMonsterObject.y + playerMonsterObject.speedY
    panel.clearRect(0, 0, map.width, map.height)
    panel.drawImage(
        mapBackground,
        0,
        0,
        map.width,
        map.height,

    )
    playerMonsterObject.drawMokepon()
    sendPosition(playerMonsterObject.x, playerMonsterObject.y)

    mokeponesFoes.forEach(function (mokepon) {
        mokepon.drawMokepon()
        checkCrash(mokepon)
    })
}

function sendPosition(x, y){
    fetch(`http://192.168.100.83:8080/mokepon/${playerid}/position`, {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            x,
            y
        })
    })
    .then(function(res) {
        if(res.ok) {
            res.json()
            .then(function ({ foes }) {
                mokeponesFoes = foes.map(function (foe) {
                    let mokeponFoe = null
                    const mokeponName = foe.mokepon.name || ""
                    if (mokeponName === "Hydro") {
                        mokeponFoe = new Mokepon('Hydro', './assets/mokepons_mokepon_hydro_attack.png', 5, './assets/hipodoge.png', foe.id)
                    } else if (mokeponName === "Geo") {
                        mokeponFoe = new Mokepon ('Geo', './assets/mokepons_mokepon_Geo_attack.png', 5, './assets/capipepo.png', foe.id)
                    } else if (mokeponName === "Pyro") {
                        mokeponFoe = new Mokepon ('Pyro', './assets/mokepons_mokepon_pyro_attack.png', 5, './assets/ratigueya.png', foe.id)
                    }
                    mokeponFoe.x = foe.x
                    mokeponFoe.y = foe.y

                    return mokeponFoe
                })
            })
        }
    })
}

function moveRight() {
    playerMonsterObject.speedX = 5
}

function moveLeft() {
    playerMonsterObject.speedX = - 5

}

function moveDown() {
    playerMonsterObject.speedY = 5
}

function moveUp() {
    playerMonsterObject.speedY = - 5

}

function stopMove() {
    playerMonsterObject.speedX = 0
    playerMonsterObject.speedY = 0
}

function keyPressed(event) {
    switch (event.key) {
        case 'ArrowUp':
            moveUp()
            break
        case 'ArrowDown':
            moveDown()
            break
        case 'ArrowLeft':
            moveLeft()
            break
        case 'ArrowRight':
            moveRight()
            break
        default:
            break
    }
    
}

function startMap() {
    playerMonsterObject = obtainMonsters(playerMonster)
    interval = setInterval(drawCanvas, 50)
    window.addEventListener('keydown', keyPressed)
    window.addEventListener('keyup', stopMove)
}

function obtainMonsters () {
    for (let i = 0; i < mokepones.length; i++) {
        if (playerMonster === mokepones[i].name) {
            return mokepones[i]
        }
    }
}

function checkCrash(foe) {
    const upFoe = foe.y
    const downFoe = foe.y + foe.height
    const rightFoe = foe.x + foe.width
    const leftFoe = foe.x

    const upMonster = playerMonsterObject.y
    const downMonster = playerMonsterObject.y + playerMonsterObject.height
    const rightMonster = playerMonsterObject.x + playerMonsterObject.width
    const leftMonster = playerMonsterObject.x

    if(downMonster < upFoe || upMonster > downFoe || rightMonster < leftFoe || leftMonster > rightFoe) {
        return
    }
    stopMove()
    clearInterval(interval)
    console.log('crash detected')

    foeid = foe.id
    sectionChooseAttack.style.display = 'flex'  
    sectionShowMap.style.display = 'none'
    chooseMonsterFoe(foe)

    // alert("You crashed with " + foe.name + "!")

    }

window.addEventListener('load', startGame)