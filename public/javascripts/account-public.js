var addCarModal = document.getElementById("addCarModal");
var editProfileModal = document.getElementById("editProfileModal");

window.addEventListener("load", (e) => {
    refreshCarsList();
    refreshProfileInfo();
});

window.addEventListener("click", (e) => {
    if (e.target == document.getElementById("modalinner")) {
        addCarModal.className = "modal";
    } else if (e.target == document.getElementById("modal2inner")) {
        editProfileModal.className = "modal2";        
    }
});

document.getElementById("addCarButton").addEventListener("click", (e) => {
    e.preventDefault();
    addCarModal.className = "modal modal-open";
});

document.getElementById("submitAddCar").addEventListener("click", (e) => {
    e.preventDefault();
    let carForm = document.forms["addCarForm"];
    let producent = carForm.elements["producent"].value;
    let model = carForm.elements["model"].value;
    let yearOfProduction = carForm.elements["yearOfProduction"].value;
    let kilometrage = carForm.elements["kilometrage"].value;
    let driveType = carForm.elements["driveType"].value;
    let fuelType = carForm.elements["fuelType"].value;
    let transmission = carForm.elements["transmission"].value;
    let torqueNm = carForm.elements["torqueNm"].value;
    let numberOfCylinders = carForm.elements["numberOfCylinders"].value;
    let engineLitrage = carForm.elements["engineLitrage"].value;
    let price = carForm.elements["price"].value;
    let description = carForm.elements["description"].value;
    let images = carForm.elements["images"].files;

    let formData = new FormData(carForm);
    for(let entry of formData.entries()) {
        console.log(entry[0]);
        console.log(entry[1]);
    }

    let carInfo = JSON.stringify({
        producent: producent,
        model: model,
        yearOfProduction: yearOfProduction,
        kilometrage: kilometrage,
        driveType: driveType,
        fuelType: fuelType,
        transmission: transmission,
        torqueNm: torqueNm,
        cylinders: numberOfCylinders,
        engineLitrage: engineLitrage,
        price: price,
        description: description,
        images: images
    });

    let request = new XMLHttpRequest();
    request.open("POST", "/account/addcar");
    //request.setRequestHeader("Content-Type", "multipart/form-data");
    request.addEventListener("load", () => {
        refreshCarsList();
    });
    request.send(formData);

    addCarModal.className = "modal";
});

document.getElementById("cancelAddCar").addEventListener("click", (e) => {
    e.preventDefault();
    addCarModal.className = "modal";
});

document.getElementById("editProfileButton").addEventListener("click", (e) => {
    e.preventDefault();
    editProfileModal.className = "modal2 modal2-open";
});

document.getElementById("submitEditProfile").addEventListener("click", (e) => {
    e.preventDefault();
    let profileForm = document.forms["editProfileForm"];
    let firstName = profileForm.elements["firstName"].value;
    let lastName = profileForm.elements["lastName"].value;
    let phoneNumber = profileForm.elements["phoneNumber"].value;

    let profileInfo = JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        phoneNumber: phoneNumber
    });

    let request = new XMLHttpRequest();
    request.open("POST", "/account/editprofile");
    request.setRequestHeader("Content-Type", "application/json");
    request.addEventListener("load", () => {
        refreshProfileInfo();
    });
    request.send(profileInfo);

    editProfileModal.className = "modal2";
});

document.getElementById("cancelEditProfile").addEventListener("click", (e) => {
    e.preventDefault();
    editProfileModal.className = "modal2";
});

function refreshProfileInfo() {
    let request = new XMLHttpRequest();
    request.open("GET", "/account/getprofileinfo");

    request.addEventListener("load", () => {
        let profileInfo = JSON.parse(request.response);

        document.getElementById("profileCard").innerHTML = `
            <p>${profileInfo.Email}<\p>
            <p>${profileInfo.FirstName + " " + profileInfo.LastName}<\p>
            <p>${profileInfo.PhoneNumber}<\p>
        `;

        let profileForm = document.forms["editProfileForm"];
        profileForm.elements["firstName"].value = profileInfo.FirstName;
        profileForm.elements["lastName"].value = profileInfo.LastName;
        profileForm.elements["phoneNumber"].value = profileInfo.PhoneNumber;
    });
    request.send();
}

function refreshCarsList() {
    let request = new XMLHttpRequest();
    request.open("GET", "/account/getcarslist");

    request.addEventListener("load", () => {
        let carsList = JSON.parse(request.response);
        let carsListView = document.getElementById("carsList");
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
    
    let button = document.createElement("button");
    button.type = "button";
    button.className = "button-primary button input remove-from-cart";
    button.innerHTML = "Remove";
    button.addEventListener("click", (e) => {
        removeCar(car.CarID);
    });

    overflow.appendChild(carView);
    row.appendChild(overflow);
    row.appendChild(button);

    return row;
}

function removeCar(carID) {
    let request = new XMLHttpRequest();
    request.open("POST", "/account/removecar");
    request.setRequestHeader("Content-Type", "application/json");

    let carInfo = JSON.stringify({
        carID: carID
    });

    request.addEventListener("load", () => {
        refreshCarsList();
    });
    request.send(carInfo);
}