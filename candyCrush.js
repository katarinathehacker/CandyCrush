var godteri = ["bluegodteri", "oransjgodteri", "greengodteri", "gultgodteri", "redgodteri", "lillagodteri"]
var tavle = [];
var rad = 9;
var kolonne = 9;
let score = 0;
const tid = 60; 


var currRute;
var otherRute;


 window.onload = function() { //starter når nettsiden laster
    const klokke = document.getElementById("timer");
    klokke.innerHTML = tid + " sek";
    startSpill();
    
    window.setInterval(function() {
        slideGodteri();
        lagGodteri();
    }, 100)
    sjekkMatch(true);
} 

function slideGodteri() {
    for (let k = 0; k < kolonne; k++) {
        let ind = rad - 1;
        for (let r = kolonne-1; r >= 0; r--) {
            if (!tavle[r][k].src.includes("blank")) {
                tavle[ind][k].src = tavle[r][k].src;
                ind -= 1;
            }
        }

        for (let r = ind; r >= 0; r--) {
            tavle[r][k].src = "./bilder/blank.png";
        }
    }
}

function lagGodteri() {
    for (let c = 0; c < kolonne;  c++) {
        if (tavle[0][c].src.includes("blank")) {
            tavle[0][c].src = "./bilder/" + randomGodteri() + ".png";
        }
    }

}

function onStart() {
    const scoreEl = document.getElementById("score");
    scoreEl.innerHTML = 0;
    const klokke = document.getElementById("timer");
    klokke.innerHTML = tid + " sek";
    document.getElementById("overlay").style.display = "none";
    TikkeKlokke(); 
}

function onRestart() {
    document.getElementById("tavle").innerHTML = "";
    tavle = [];
    onStart();
    startSpill();
    sjekkMatch(true);
}

function randomGodteri() {
    return godteri[Math.floor(Math.random() * godteri.length)];
}



function startSpill() {
    for (let i = 0; i < rad; i++){
        let radArray = [];
        for (let k = 0; k < kolonne; k++){
            let rute = document.createElement("img")
            rute.classList.add("rute");
            rute.id = i.toString() + "_" + k.toString();
            rute.src = "./bilder/" + randomGodteri() + ".png";

            //Dra-funksjoner
            rute.addEventListener("dragstart", draStart); //trykk på godteri og det vil føre til en dra prosess
            rute.addEventListener("dragover", draOver); // klikk på godteri og det vil flytte musen til å dra godteri
            rute.addEventListener("dragenter", draEnter); // dra godteri til et annet godteri
            rute.addEventListener("dragleave", draLeave); // legg ett godteri over et annet
            rute.addEventListener("drop", draDropp); //la godteri bli der om det blir byttet
            rute.addEventListener("dragend", draSlutt); // etter å ha dratt skal godteri bli byttet


            document.getElementById("tavle").append(rute);
            radArray.push(rute);
        }
        tavle.push(radArray);
    }
console.log(tavle);
}

function draStart() {
    currRute = this
}

function draOver(e) {
    e.preventDefault();
}

function draEnter(e) {
    e.preventDefault();
}

function draLeave() {
    console.log('draLeave');
}

function draDropp() {
    otherRute = this;
}

function draSlutt() {
    console.log('draSlutt');

    let currCoords = currRute.id.split("_");
    let i = parseInt(currCoords[0]);
    let k = parseInt(currCoords[1]);


    let otherCoords = otherRute.id.split("_");
    let i2 = parseInt(otherCoords[0]);
    let k2 = parseInt(otherCoords[1]);

    let currImg = currRute.src;
    let otherImg = otherRute.src;
    currRute.src = otherImg;
    otherRute.src = currImg;

    setTimeout(sjekkMatch, 200)
}

function sjekkMatch(startetPaaNytt = false) {
    let fjernBrikker = [];

    //  Sjekker matcher loddrett
    for (let i = 0; i < rad; i++) {
        for (let k = 0; k < kolonne - 2; k++) {
            let first = tavle[i][k];
            let second = tavle[i][k + 1];
            let third = tavle[i][k + 2];

            if (first.src === second.src && first.src === third.src && !first.src.includes("blank.png"))
                fjernBrikker.push(first, second, third); 
        }
    }

    // Sjekker matcher vannrett    
    for (let k = 0; k < kolonne; k++) {
        for(let i = 0; i < rad - 2; i++) {
            let first = tavle[i][k];
            let second = tavle[i + 1][k];
            let third = tavle[i + 2][k];

            if (first.src === second.src && first.src === third.src && !first.src.includes("blank.png")){
                fjernBrikker.push(first, second, third);
            }

        }
    }

    // Fjern brikker og øk score
    if (fjernBrikker.length > 0) {
        fjernBrikker.forEach(rute => {
            rute.src = "./bilder/blank.png"; // tom rute
        });

        if (!startetPaaNytt) {
            score += 55;
        }
        document.getElementById("score").innerText = score;
    }
}

// Spill ferdig
function avsluttSpill() {
    // Disable tavle
    const alleRuter = document.getElementsByClassName("rute");
    
    for (let i = 0; i < alleRuter.length; i++) {
        alleRuter[i].removeEventListener("dragstart", draStart); //trykk på godteri og det vil føre til en dra prosess
        alleRuter[i].removeEventListener("dragover", draOver); // klikk på godteri og det vil flytte musen til å dra godteri
        alleRuter[i].removeEventListener("dragenter", draEnter); // dra godteri til et annet godteri
        alleRuter[i].removeEventListener("dragleave", draLeave); // legg ett godteri over et annet
        alleRuter[i].removeEventListener("drop", draDropp); //la godteri bli der om det blir byttet
        alleRuter[i].removeEventListener("dragend", draSlutt); // etter å ha dratt skal godteri bli byttet
    }

    document.getElementById("overlay").style.display = "block";

    // Varsle avslutt
    alert("Tiden er ute! Du fikk " + score + "poeng!");
}

// klokke som tikker ned


var timerInterval;
function TikkeKlokke(){
    let timer = tid;
    const tidTimer = document.getElementById("timer");
    const startKnapp = document.getElementById("startKnapp");
    startKnapp.style.display = "none";
    const restartKnapp = document.getElementById("restartKnapp");
    restartKnapp.style.display = "inline";

    timerInterval = setInterval(() => {
        timer--;
        tidTimer.innerHTML = timer + " sek"
        if( timer <= 0) {
            clearInterval(timerInterval);
            avsluttSpill();
        }
    }, 1000);

}



// spillregler

function Regler(){
    const tekst = document.getElementById("regelTekst")
    
    if (tekst.style.display === "none") {
        tekst.style.display = "block";
    } else {
        tekst.style.display = "none";
    }
}