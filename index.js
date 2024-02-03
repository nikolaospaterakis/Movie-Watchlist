
const bodyEl = document.querySelector("body")
const searchEl = document.getElementById("input-search")
const resultsEl = document.getElementById("sec-res")
const mainEl = document.getElementById("main")
const watchListEl = document.getElementById("watchlist")

bodyEl.addEventListener("click", function(e){
    if(e.target.id === "btn-search"){
        searchTitle(searchEl.value)
    } else if(e.target.dataset.tolist){
        checkWatchList(e.target.dataset.tolist)
    } else if(e.target.dataset.deletelist){
        deleteMovie(e.target.dataset.deletelist)
    } else if(e.target.id === "btn-delete"){
        localStorage.clear()
    } else if(e.target.id === "btn-mode"){
        if(!JSON.parse(localStorage.getItem("mode"))) {
            localStorage.setItem("mode", true)
            document.getElementById("mode-drk").style.display = "none"
            document.getElementById("mode-light").style.display = "block"
            bodyEl.style.backgroundColor = "white"
            for(let element of document.getElementsByClassName("movie-title-rate")){
                element.style.color = "black"
            }
            for(let element of document.getElementsByClassName("movie-min-genre")){
                element.style.color = "black"
            }
        } else {
            localStorage.setItem("mode", false)
            document.getElementById("mode-drk").style.display = "block"
            document.getElementById("mode-light").style.display = "none"
            bodyEl.style.backgroundColor = "black"
            for(let element of document.getElementsByClassName("movie-title-rate")){
                element.style.color = "white"
            }
            for(let element of document.getElementsByClassName("movie-min-genre")){
                element.style.color = "white"
            }
        }
    }
})

function searchTitle(searchItem){
    mainEl.innerHTML = " "
    const itemToSearch = searchItem.replace(" ", "+")
    fetch(`https://www.omdbapi.com/?apikey=4315cfe3&s=${itemToSearch}`)
        .then(res => res.json())
        .then(data => {
            if(data.totalResults > 0){
                resultsEl.classList.add("hidden")
                data.Search.forEach(movie => {
                    moreInfo(movie.imdbID)
                });
            } else {
                resultsEl.classList.add("hidden")
                mainEl.innerHTML = `
                    <section>
                        <h3>Unable to find what you’re looking for.<br> Please try another search.</h3>
                    </section>
                `
            }
        })
}

function moreInfo(ID){
    let runTime = ""
    fetch(`https://www.omdbapi.com/?apikey=4315cfe3&i=${ID}`)
        .then(res => res.json())
        .then(data => {
            if(data.Runtime === "N/A"){
                runtime = "?"
            } else {
                runtime = data.Runtime
            }
            mainEl.innerHTML += 
            `
                <div class="movie-bg">
                    <div class="movie" id="movies">
                        <img src="${data.Poster}" alt="Movie Poster" onerror="this.src='images/noimage.jpg';">
                        <div class="movie-details">
                            <div class="movie-title-rate" id="movie-title-rate-${data.imdbID}">
                                <h3>${data.Title}</h3>
                                <h3 class="movie-rate">
                                    <i class="fa-solid fa-star"></i>
                                    ${data.imdbRating}
                                </h3>
                            </div>
                            <div class="movie-min-genre" id="movie-min-genre-${data.imdbID}">
                                <h4>${runtime}</h4>
                                <h4>${data.Genre}</h4>
                                <h4>
                                    <i class="fa-solid fa-circle-plus" data-tolist="${data.imdbID}"></i>
                                    <span id="wlist" class="hidden">
                                        Watchlist
                                    </span>
                                </h4>
                            </div>
                            <p>${data.Plot}</p>
                        </div>
                    </div>
                </div>
            `
            checkMode()
        })
}

function checkWatchList(key){
    let exists = false
    let listToSave = []
    let loopingArray
    fetch(`https://www.omdbapi.com/?apikey=4315cfe3&i=${key}`)
    .then(res => res.json())
    .then(data => {
        if(!localStorage.getItem('watchlist')){
            listToSave.push(data)
            localStorage.setItem('watchlist', JSON.stringify(listToSave))
        } else {
            if(Object.keys(JSON.parse(localStorage.getItem('watchlist'))).length === 1){
                for(let item of JSON.parse(localStorage.getItem('watchlist'))){
                    if(item.imdbID === data.imdbID){
                        exists = true
                    }
                    listToSave.push(item)
                }
                if(exists === false){
                    listToSave.push(data)
                }
                localStorage.setItem('watchlist', JSON.stringify(listToSave))
            } else {
                for(let item of JSON.parse(localStorage.getItem('watchlist'))){
                    if(item.imdbID === data.imdbID){
                        exists = true
                    }
                    listToSave.push(item)
                }
                if(exists === false){
                    listToSave.push(data)
                }
                localStorage.setItem('watchlist', JSON.stringify(listToSave))
            }
        }    
    })
}

function clear(){
    watchListEl.textContent = ``
    render()
}

function deleteMovie(key){
    let listToSave = []
    fetch(`https://www.omdbapi.com/?apikey=4315cfe3&i=${key}`)
        .then(res => res.json())
        .then(data => {
                for(let item of JSON.parse(localStorage.getItem('watchlist'))){
                    if(item.imdbID !== data.imdbID){
                        listToSave.push(item)
                    }
                }
                localStorage.setItem('watchlist', JSON.stringify(listToSave))
                document.getElementById("main-wl").innerHTML =  ``
                render()
            })
}

function render(){
        if(!localStorage.getItem('watchlist') || localStorage.getItem('watchlist').length === 2){
            document.getElementById("main-wl").innerHTML = 
            `
            <section id="watchlist">
                <div id="missing">
                    <h3>Your watchlist is looking a little empty...</h3>
                    <a href="index.html">
                        <h3 id="h3-add">
                            <i class="fa-solid fa-circle-plus"></i> Let's add some movies
                        </h3>
                    </a>
                </div>   
            </section>
            `
        }else {
            const myWatchList = JSON.parse(localStorage.getItem('watchlist'))
            for(let item of myWatchList){
                if(item.Runtime === "N/A"){
                    runtime = "?"
                } else {
                    runtime = item.Runtime
                }
                document.getElementById("main-wl").innerHTML += 
                `
                            <div class="movie-bg">
                                <div class="movie">
                                    <img src="${item.Poster}" alt="Movie Poster" onerror="this.src='images/noimage.jpg';">
                                    <div class="movie-details">
                                        <div class="movie-title-rate">
                                            <h3>${item.Title}</h3>
                                            <h3 class="movie-rate">
                                                <i class="fa-solid fa-star"></i>
                                                ${item.imdbRating}
                                            </h3>
                                        </div>
                                        <div class="movie-min-genre">
                                            <h4>${runtime}</h4>
                                            <h4>${item.Genre}</h4>
                                            <h4>
                                                <i class="fa-solid fa-circle-minus" data-deletelist="${item.imdbID}"></i>
                                                <span id="wlist" class="hidden">
                                                    Watchlist
                                                </span>
                                            </h4>
                                        </div>
                                        <p>${item.Plot}</p>
                                    </div>
                                </div>
                            </div>
                        ` 
                    }
            checkMode()
        }   
}

function checkMode(){
    if(JSON.parse(localStorage.getItem("mode"))) {
        document.getElementById("mode-drk").style.display = "none"
        document.getElementById("mode-light").style.display = "block"
        bodyEl.style.backgroundColor = "white"
        for(let element of document.getElementsByClassName("movie-title-rate")){
            element.style.color = "black"
        }
        for(let element of document.getElementsByClassName("movie-min-genre")){
            element.style.color = "black"
        }
        
    } else {
        document.getElementById("mode-drk").style.display = "block"
        document.getElementById("mode-light").style.display = "none"
        bodyEl.style.backgroundColor = "black"
        for(let element of document.getElementsByClassName("movie-title-rate")){
            element.style.color = "white"
        }
        for(let element of document.getElementsByClassName("movie-min-genre")){
            element.style.color = "white"
        }
    }
}

checkMode()
render()
