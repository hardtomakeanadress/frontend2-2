/* global $ MoviesList Movie Cookie Auth*/

$(document).ready(onHtmlLoaded);

function onHtmlLoaded() {
    
    checkLoginStatus();
    displayButtonForUserLogged();
    getMovies();
    displayAutors();
    
    // delete Movie - attach a delegated event handler
    //we are getting the id from the parent div of the clicked delete button
    $("body").on( "click", "#delete", function(event) {
        var elem = $( this );
        var parentId = elem.closest("section", "flex-container")[0].id;
        var userLogin = Cookie.findLoggedUserToken();
        var movie = new Movie;
        movie.deleteMovie(parentId, userLogin)
            .then( function() {
                deleteMovieItem(parentId);    
            });
    });
    
    //add movie button
    $("#add-movie").click(() => {
        window.location.href="addMovie.html";
    });
    
    // login, logout buttons;    
    $('#login').click( () => {
        window.location.href = 'login.html';
    });
    
    $('#logout').click( () => {
        //first we check to see if the user is actualy logged
        const isUserLogged = Cookie.findLoggedUserToken();        
        
        if (isUserLogged) {
            Auth.logOutUser(isUserLogged)
                .then( () => {
                    Cookie.deleteTokenCookie();
                    window.location.href = 'home.html';
                })
                .catch(reason => {console.log(reason)});
        }
        else {
            alert('You are not logged in');
        }
    });
    
    //search bar functionality
    searchMovies();
    
    //function for toggle nav-bar
    var togglebtn=$(".toggle-icon");
    togglebtn.on("click", function(){
        $("#toggle-nav").toggleClass("nav-bar-show");
    });
}

function getMovies() {
    var movies = new MoviesList(); 
    movies.getMovies()
        .then( () => {
            displayMovies(movies.model, "movieDisplay");
        })
        .catch(reason => {
                alert(reason.responseJSON.message);
        });
}


//first parameter contains the data, second one contains the location where we want the data to be written
function displayMovies(data, elementId) {
    
    var userToken = Cookie.findLoggedUserToken();
    var content = document.getElementById(elementId);
    
    if (data.length > 0) {
    
        for (var i = 0; i < data.length; i++) {
            
            var movieItem = document.createElement("section");
            movieItem.setAttribute('class', 'flex-container');
            movieItem.id = data[i].id;
            
            var divPosterTitle = document.createElement('div');
            divPosterTitle.className = 'poster-title';
                
            var divPoster = document.createElement('div');
            divPoster.className = 'poster';
            
            var moviePoster = document.createElement('img');
            moviePoster.setAttribute('src', data[i].poster );
            moviePoster.className = 'img-movie';
            moviePoster.innerHTML = data[i].poster;
            
            var divTitle = document.createElement('div');
            divTitle.className = 'title';
            
            var movieTitle = document.createElement('a');
            movieTitle.innerHTML = data[i].title;
            movieTitle.setAttribute('href', 'movieDetails.html?movieId=' + data[i].id);
            movieTitle.setAttribute('target', '_blank');
            
            var movieYear = document.createElement('p');
            movieYear.innerHTML = "<span>Year:</span> " + data[i].year;
                
            var movieimdbRating = document.createElement('p');
            movieimdbRating.innerHTML ='<span>Raiting:</span> '  + data[i].imdbRating + ' <i class="fa fa-star fa-2x" aria-hidden="true"></i>';
            
            var divButton = document.createElement('div');
            divButton.className = 'button-content';
            
            var editButton = document.createElement("button");
            editButton.setAttribute("edit","edit-movie");
            editButton.setAttribute('id', 'edit');
            editButton.innerHTML = "Edit";
            editButton.addEventListener("click", function(e) {
                window.location.href="editMovie.html?movieId=" + e.path[2].id;
            });
                
            var deleteButton = document.createElement('button');
            deleteButton.setAttribute("delete","delete-movie");
            deleteButton.setAttribute('id', 'delete');
            deleteButton.innerHTML = 'Delete';
            
            if (!userToken) {
                editButton.setAttribute('class', 'hide');
                deleteButton.setAttribute('class', 'hide');
                document.getElementById('user-name').setAttribute('class', 'hide');
            }
            
            divPoster.appendChild(moviePoster);
            divTitle.appendChild(movieTitle);
            divTitle.appendChild(movieYear);
            divTitle.appendChild(movieimdbRating);
            divPosterTitle.appendChild(divPoster);
            divPosterTitle.appendChild(divTitle);
            divButton.appendChild(editButton);
            divButton.appendChild(deleteButton);
            movieItem.appendChild(divPosterTitle);
            movieItem.appendChild(divButton);
            content.appendChild(movieItem);
        }
    }
}

function deleteMovieItem(id){
    $(`#${id}`).remove();
}
 
function checkLoginStatus() {
    const userLogged = Cookie.findLoggedUserName(); 
    if(userLogged) {
        document.getElementById('user-name').innerHTML = "Hi, " + userLogged + "!";
    } 
}
 
function displayButtonForUserLogged() {
    const userLogin = Cookie.findLoggedUserToken();
    if (userLogin) {
        document.getElementById('login').style.display = "none";
        document.getElementById('register').style.display = "none";
    } 
    else {
        document.getElementById('add-movie').style.display = "none";
        document.getElementById('logout').style.display = "none";
    }
}

function searchMovies() {
    $("#submitSearch").click( (event) => {
        event.preventDefault();
        
        const movies      = new MoviesList();
        const selection   = $("#select option:selected").text();
        const queryString = $("#queryString").val();
        
        movies.searchMovies(selection, queryString)
            .then(() => {
                displayMovies(movies.model, "searchDisplay");
            })
            .catch(reason => {
                alert(reason.responseJSON.message);
            });
    });
}

function displayAutors() {
    
    const autors = [{
        name: 'Pantea Andrei',
        facebook: 'https://www.facebook.com/pantea.andrei.102361',
        linkedin: 'https://www.linkedin.com/in/andrei-daniel-pantea/'
    },
    {
        name: 'Leoveanu Roxana',
        facebook: 'https://www.facebook.com/Deeea.Roxi',
        linkedin: 'https://www.linkedin.com/in/roxana-leoveanu-a34031140'
    },
    {
        name: 'Radan Olga',
        facebook: 'https://www.facebook.com/olga.radan',
        linkedin: 'https://www.linkedin.com/in/olga-radan/'
    },
    {
        name: 'Muntean Monica',
        facebook: 'https://www.facebook.com/monica.muntean13',
        linkedin: 'https://www.linkedin.com/in/monica-muntean-12569b42/'
    },
    {
        name: 'Bukos Stefan',
        facebook: 'https://www.facebook.com/adistef82',
        linkedin: 'https://www.linkedin.com/in/adistef/'
    },
    {
        name: 'Gergo Balogh',
        facebook: 'https://www.facebook.com/baloghgj',
        linkedin: 'https://www.linkedin.com/in/gergobalogh/'
    },
    {
        name: 'Asavinei Claudia',
        facebook: 'https://www.facebook.com/asavineiclaudia.maria',
        linkedin: 'https://www.linkedin.com/in/claudia-maria-asavinei/'
    },
    {
        name: 'Crisan Ancuta',
        facebook: 'https://www.facebook.com/crisan.anca93',
        linkedin: 'http://linkedin.com/in/crisan-ancuta-598b87103'
    }];
    
    
    for( var i = 0; i<autors.length; i++) {
        const blueAutors = document.getElementById('team');
        const blueAutor = document.createElement('section');
        
        console.log("Autor " , i, autors[i]);
        blueAutor.className = 'autor';
        blueAutor.innerHTML = '<p>' + autors[i].name + '</p>' + '<span>' +'<a href="'+ autors[i].facebook + '" target="_blank" class="fa fa-facebook"></a>' +' ' 
                + '<a href="' + autors[i].linkedin +'" class="fa fa-linkedin" target="_blank"></a>' + '</span>';
        blueAutors.appendChild(blueAutor);
    }
}