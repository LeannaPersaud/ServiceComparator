let allServices = [
    {
        id: 1,
        name: "Spotify",
        category: ["Music"],
        desc: "A music streaming service offering songs, podcasts, and audio books. Can be used for free with restrictions \n Individual Premium service costs $12.99, Family Premium Service costs $21.99",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Spotify_App_Logo.svg/960px-Spotify_App_Logo.svg.png",
        section: "all"
    },
    {
        id: 2,
        name: "Youtube Premium",
        category: ["Music", "Streaming"],
        desc: "Service provides ad-free Youtube videos, Youtube Music, and other video benefits. Can be used for free with restrictions. Individual Premium service costs $13.99, Family Premium Service costs $22.99",
        image: "https://images.seeklogo.com/logo-png/36/1/youtube-premium-logo-png_seeklogo-364940.png",
        section: "all"
    },
    {
        id: 3,
        name: "Netflix",
        category: ["Streaming"],
        desc: "A streaming service that offers movies, TV shows, and limited games. The minimum standard plan costs $7.99 and the premium standard plan costs $24.99",
        image: "https://images.ctfassets.net/4cd45et68cgf/Rx83JoRDMkYNlMC9MKzcB/2b14d5a59fc3937afd3f03191e19502d/Netflix-Symbol.png?w=700&h=456",
        section: "all"
    }
]

let filteredServices = [];
let searchServices = [];

displayServices(allServices);

function displayServices(currServices){
    document.getElementById("all").innerHTML = "";
    document.getElementById("pin").innerHTML = "";
    let buttonHtml = null

    for(var i=0; i < currServices.length; i++){
        if(currServices[i].section === "pin"){
            buttonHtml = `
                <button class="btn btn-secondary position-absolute top-0 end-0 pinBtn" data-id=${currServices[i].id} 
                onclick="unpinService(this)">
                    <i class="bi bi-x"></i>
                </button>`
        }
        else{
            buttonHtml = `
            <button class="btn btn-secondary position-absolute top-0 end-0 pinBtn" data-id=${currServices[i].id} 
            onmouseover="changePin(this)" onmouseout="changeUnPin(this)" onclick="pinService(this)">
                <i class="bi bi-pin-angle-fill"></i>
            </button>`
        }

        document.getElementById(currServices[i].section).innerHTML += `
        <div class="col-lg-3 col-md-3 col-sm-6">
            <div class="position-relative card-container h-100">
                    ${buttonHtml}

                <div class="card h-100">
                    <div data-bs-toggle="modal" data-bs-target="#more" data-id=${currServices[i].id}>
                        <img class="card-img-top cardImg" src="${currServices[i].image}">
                        <div class="card-body p-2">
                            <h5 class="card-title">${currServices[i].name}</h5>
                            <ul class="card-text">
                                <li>Category: ${currServices[i].category.join(', ')}</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        `;
    }
}

function restoreDisplay(){
    document.getElementById("noFind").classList.add("d-none");
    document.getElementById("all-container").classList.remove("d-none");
    document.getElementById("pin-container").classList.remove("d-none");
    document.getElementById("searchBar").value = "";
    searchServices = [];

    if(filteredServices.length === 0){
        displayServices(allServices);
    }
    else{
        displayServices(filteredServices);
    }
}

document.getElementById("clearSearch").addEventListener("click", restoreDisplay)

document.getElementById("searchBar").addEventListener("keyup", function(){
    let terms = document.getElementById("searchBar").value.toLowerCase();

    document.getElementById("noFind").classList.add("d-none");
    document.getElementById("all-container").classList.remove("d-none");
    document.getElementById("pin-container").classList.remove("d-none");

    searchServices = getUnPinned().filter(function(service){
        let splitWords = service.name.toLowerCase().split(" ");
        return splitWords.some(word => word.startsWith(terms));
    })

    if(this.value == ""){
        restoreDisplay();
    }
    else{
        if(searchServices.length ===  0){
            document.getElementById("noFind").classList.remove("d-none");
            document.getElementById("all-container").classList.add("d-none");
            document.getElementById("pin-container").classList.add("d-none");
        }
        else{
            combinePinned(searchServices);
        }
    }
})

document.getElementById("reset-btn").addEventListener("click", function(){
    filteredServices = [];
    displayServices(allServices);
})

document.getElementById("submit-btn").addEventListener("click", function(){
    let checkboxes = document.getElementsByName("category");
    let filteredSet = new Set();
    let unpinned = getUnPinned();

    for(var i=0; i < checkboxes.length; i++){
        unpinned.forEach(function(service){
            if(checkboxes[i].checked && service.category.includes(checkboxes[i].value)){
                filteredSet.add(service);
            }
        })
    }

    filteredServices = [...filteredSet];

    if(filteredServices.length === 0){
        displayServices(allServices);
    }
    else{
        combinePinned(filteredServices);
    }
})

document.getElementById("more").addEventListener("show.bs.modal", function(event){
    const card = event.relatedTarget;
    let service = allServices[card.dataset.id-1];

    document.getElementById("modalContent").innerHTML = `
        <div class="modal-header boldbg">
            <h1 class="modal-title fs-5">${service.name}</h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body newbg">
            <img id="modalImage" class="w-100 modalImg" src="${service.image}"/>
            <p class="text-black mt-3">${service.desc}</p>
        </div>
    `
})

function changePin(card){
    let icon = card.querySelector("i");
    icon.classList.remove("bi-pin-angle-fill");
    icon.classList.add("bi-pin-fill");
}

function changeUnPin(card){
    let icon = card.querySelector("i");
    icon.classList.remove("bi-pin-fill");
    icon.classList.add("bi-pin-angle-fill");
}

function pinService(card){
    allServices[card.dataset.id - 1].section = "pin"

    if(filteredServices.length === 0){
        displayServices(allServices);
    }
    else{
        combinePinned(filteredServices);
    }
}

function unpinService(card){
    allServices[card.dataset.id - 1].section = "all"

    if(filteredServices.length === 0){
        displayServices(allServices);
    }
    else{
        combinePinned(filteredServices);
    }
}

function getPinned(){
    return allServices.filter((service) => service.section === "pin");
}

function getUnPinned(){
    return allServices.filter((service) => service.section === "all");
}

function combinePinned(unpinned){
    let combined = [...getPinned(), ...unpinned];
    displayServices(combined);

}
