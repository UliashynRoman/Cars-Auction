//Get username and start drawing auction
var usernameRequest = new XMLHttpRequest();
usernameRequest.open("GET", "/getUsername");

usernameRequest.addEventListener("load", () => {
    const username = usernameRequest.response;
    const websocket = new WebSocket("ws://localhost:3000");
    let carData;

    websocket.addEventListener("open", (e) => {
        
    });

    websocket.addEventListener("close", (e) => {
        
    });

    websocket.addEventListener("error", (e) => {
        console.error(e);
    });

    websocket.addEventListener("message", (message) => {
        let content = JSON.parse(message.data);
        if (content.type === "currentCountdown") {
            document.getElementById("timeLeft").innerHTML = "TIME LEFT: " + content.body.countdown + " SEC.";
        } else if (content.type === "newHighest") {
            document.getElementById("currentPrice").innerHTML = "CURRENT PRICE: " + content.body.currentHighest;
        } else if (content.type === "carList") {
            carData = content.body;
            drawCarList(carData);
            updateCurrentCar(carData[0]);
            document.getElementById("currentPrice").innerHTML = "CURRENT PRICE: " + carData[0].Price;
        } else if (content.type === "carSold") {
            carData.splice(0, 1);
            drawCarList(carData);
            updateCurrentCar(carData[0]);
        } else if (content.type === "carNotSold") {
            carData.splice(0, 1);
            drawCarList(carData);
            updateCurrentCar(carData[0]);
        }
    });
    
    document.getElementById("submitBit").addEventListener("click", (e) => {
        e.preventDefault();
        var bid = JSON.stringify({
            type: "bid",
            body: {
                amount: document.getElementById("price").value,
                username: username
            }
        });
        websocket.send(bid);
    });
});

usernameRequest.send();

function drawCarList(carList) {
    /*UPDATE RIGHT BAR */
    var carlistHTML = document.querySelector('.wtf');
    carlistHTML.innerHTML = "";
    
    /* wtf > row rowtext > p.first-in-row */
    let bar_row,bar_row_p;
    let first = false;

    for(let i = 0; i < carList.length; i++){
        bar_row = document.createElement('div');
        bar_row.className = "row rowtext";
        bar_row_p = document.createElement('p');
        bar_row_p.innerHTML = carList[i].Producent + " " + carList[i].Model;
        bar_row_p.innerHTML += `- <a class="cost" href="#${carList[i].CarID}">More</a>`;
        if (i == 0) {
            first = true;
            /* Paint First in Que */
            bar_row_p.id = "first-in-row";
        } else {
            first = false;
        }
        bar_row.appendChild(bar_row_p);
        carlistHTML.appendChild(bar_row);
    }

    /*UPDATE ENTIRE PAGE */
    /* row > four-columns*3 > card#1 > img,info-card > h4:text  */
    let contanier = document.getElementById('cars-list');
    contanier.innerHTML = "";
    let row, four_columns, card, info_card, img, name, span;
    let iterator = 0;/* need for correct selection */

    let header = document.createElement("h1");
    header.innerHTML = "Available cars";
    header.className = "heading";
    header.id = "heading";

    contanier.appendChild(header);
    let carIndex = 0;

    for (let index = 0; index < 15; index++) {
        /* ROW */
        row = document.createElement('div');
        row.className = 'row';
        for(let k = 0 ; k < 3; k++){
            if (carList[iterator] === undefined) continue;
            /* Four Columns */
            four_columns = document.createElement('div');
            four_columns.className = "four columns";
            /* Card */
                card = document.createElement('div');
                card.className = 'card';
                iterator += 1;
                card.id = carList[iterator-1].CarID;
                    /* IMG */
                    img = document.createElement('img');
                    img.src = carList[carIndex].images[0];
                    img.className = "u-full-width";
                    /* Info-Card */
                    info_card = document.createElement('div');
                    info_card.className = "info-card";
                        /* h4 and span */
                    name = document.createElement('h4');
                    span = document.createElement('span');
                    span.className = "u-pull-right";
                    span.innerHTML = carList[iterator-1].Producent + " " + carList[iterator-1].Model/* Use Then carList.carPrice */;
                    name.innerHTML = carList[iterator-1].Price;
            /* Appending */
            name.appendChild(span);
            info_card.appendChild(name);
            card.appendChild(img);
            card.appendChild(info_card);
            four_columns.appendChild(card);
            row.appendChild(four_columns);
            carIndex++;
        }
        contanier.appendChild(row);
    }
}


function updateCurrentCar(car,queue = 0) {
    /* UPDATE MAIN IMAGE */
    let insideblock = document.querySelector('.insideblock');
    console.log(car.images[0]);
    insideblock.style.backgroundImage = `url(${car.images[0]})`;

    document.getElementById("currentPrice").innerHTML = "CURRENT PRICE: " + car.Price;

    /* UPDATE ABOUT CAR TABLE */
    let overflow = document.querySelector('.overflow');
    console.log(overflow.parentNode);
    overflow.innerHTML = "";
    let table,thead,tbody;
    
    table = document.createElement('table');
    table.id = "buy-content";
    table.className = "u-full-width";
        thead = document.createElement('thead');
            thead.innerHTML = `
            <tr>
                <th>
                    <p>Producent:</p>
                </th>
                <td>
                    <p class="prod">${car.Producent}</p>
                </td>
                <th>
                    <p>Model:</p>
                </th>
                <td>
                    <p class="model">${car.Model}</p>
                </td>
                <th>
                    <p>Kilometrage:</p>
                </th>
                <td>
                    <p class="kil">${car.Kilometrage}</p>
                </td>
                <th>
                    <p>Fuel:</p>
                </th>
                <td>
                    <p class="fueltype">${car.FuelType}</p>
                </td>
            </tr>`;   
            tbody = document.createElement('tbody');
            tbody.innerHTML = `
            <tr>
                <th>
                    <p>Engine Litrage:</p>
                </th>

                <td>
                    <p class="engine">${car.EngineLitrage}</p>
                </td>
                <th>
                    <p>Year of Production:</p>
                </th>
                <td>
                    <p class="rok">${car.YearOfProduction}</p>
                </td>
                <th>
                    <p>Drive Type:</p>
                </th>
                <td>
                     <p class="drivetype">${car.DriveType}</p>
                </td>
                <th>
                    <p>Cylinders:</p>
                </th>
                <td>
                    <p class="cyl">${car.Cylinders}</p>
                </td>
            </tr>
                           
            `;
    table.appendChild(thead);
    table.appendChild(tbody);
    overflow.appendChild(table);
    carlistHTML = document.querySelector('.wtf');
    carlistHTML.children[0].children[0].id = "first-in-row";
}

//Contact MODAL
var contactModal = document.getElementById("contactModal");
window.addEventListener("click", (e) => {
    if (e.target == document.getElementById("modalinner")) {
        contactModal.className = "modal";
    }
});
document.getElementById("opCont").addEventListener("click", (e) => {
    e.preventDefault();
    contactModal.className = "modal modal-open";
});
document.getElementById("submitMessage").addEventListener("click", (e) => {
    contactModal.className = "modal";
});
/* PlaceBit MODAL */
var placeBitModal = document.getElementById("placeBitModal");
window.addEventListener("click", (e) => {
    if (e.target == document.getElementById("modalinner")) {
        placeBitModal.className = "modal";
    }
});

document.getElementById("submitBit").addEventListener("click", (e) => {
    placeBitModal.className = "modal";
});

window.addEventListener('click', (e) => {
    console.log(e.target);
    if(e.target.id == "placeBit"){
        e.preventDefault();    
        placeBitModal.className = "modal modal-open";
    }
    if(e.target.id == "close"){
        placeBitModal.className = "modal";
    }
});
