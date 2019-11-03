window.addEventListener("load", () => {
    refreshCarsList();
});

function refreshCarsList() {
    let request = new XMLHttpRequest();
    request.open("GET", "/administrator/getcarslist");

    request.addEventListener("load", () => {
        let carsList = JSON.parse(request.response);
        let carsListView = document.getElementById("waitingList");
        carsListView.innerHTML = "";

        for (let car of carsList) {
            carsListView.appendChild(createCarView(car));        
        }
    });
    request.send();
}

function createCarView(car) {
    let row = document.createElement("div");
    row.className = "row car-row";
    row.style.marginTop = "1em";
    let overflow = document.createElement("div");
    overflow.className = "overflow";
    let carView = document.createElement("table");
    carView.className = "u-full-width";
    carView.innerHTML = `
        <thead>
            <tr>
                <th>ID</th>
                <th>Producent</th>
                <th>Model</th>
                <th>Year</th>
                <th>Kilometrage</th>
                <th>Drive type</th>
                <th>Fuel type</th>
                <th>Cylinders number</th>
                <th>Litrage</th>
                <th>Price</th>
                <th>Description</th>
                <th>Status</th>              
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${car.CarID}</td>
                <td>${car.Producent}</td>
                <td>${car.Model}</td>
                <td>${car.YearOfProduction}</td>
                <td>${car.Kilometrage}</td>
                <td>${car.DriveType}</td>
                <td>${car.FuelType}</td>
                <td>${car.Cylinders}</td>
                <td>${car.EngineLitrage}</td>
                <td>${car.Price}</td>
                <td>${car.Descr}</td>
                <td>${car.ApprovalState}</td>
            </tr>
        </tbody>`;

    let adminButtons = document.createElement("div");
    adminButtons.style.textAlign = "center"; 

    let buttonAccept = document.createElement("button");
    buttonAccept.type = "button";
    buttonAccept.className = "button-primary button input accept";
    buttonAccept.style.marginRight = "0.5em";
    buttonAccept.innerHTML = "Accept";
    buttonAccept.addEventListener("click", (e) => {
        updateCarStatus(car.CarID, "Approved");
    });

    let buttonDecline = document.createElement("button");
    buttonDecline.type = "button";
    buttonDecline.className = "button-primary button input decline";
    buttonDecline.style.marginLeft = "0.5em";
    buttonDecline.innerHTML = "Reject";
    buttonDecline.addEventListener("click", (e) => {
        updateCarStatus(car.CarID, "Rejected");
    });

    adminButtons.appendChild(buttonAccept);
    adminButtons.appendChild(buttonDecline);

    overflow.appendChild(carView);
    row.appendChild(overflow);
    row.appendChild(adminButtons);

    return row;
}

function updateCarStatus(carID, status) {
    let carInfo = JSON.stringify({
        CarID: carID,
        ApprovalState: status
    });

    let request = new XMLHttpRequest();
    request.open("POST", "/administrator/updatecarstatus");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", () => {
        refreshCarsList();
    });
    request.send(carInfo);
}
