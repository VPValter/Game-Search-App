$(function() {										// when the DOM is fully loaded
	$('#searchForm').submit(function(e) {			// event handler
		let searchText = $('#searchText').val();	// store input text to variable
		getGames(searchText);
		e.preventDefault();							// cancel any default action
	});
});

function getGames(searchText) {
	$.ajax({										// Perform an asynchronous HTTP (Ajax) request
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: true,
		jsonp: 'json_callback',
		url: 'https://www.giantbomb.com/api/search/?api_key=ec164f3e4ebfe95b8f71fde3a5b2562480e35db4&query=' + searchText + '&resources=game&format=jsonp'
	})
	.done(function(data){							// done will resolve as soon as we have the response
		let games = data.results;
		let output = '';

		if (games.length == 0) {					// if the search doesn't match any results
			output += '<h3>No games found!</h3>';
			$('#result').html(output);
		} else {
			$.map(games, function(game) {			// map or each - difference ?
				output += `
				<div class="col-sm-4 col-md-3">
		            <img class="img-fluid" src="${game.image.small_url}">
		            <h5>${game.name}</h5>
		        	<a onclick="gameSelected('${game.id}')" href="#" class="btn btn-primary">Details</a>
		        </div>
				`;
				$('#result').html(output);
			});
		}			
	})
	.fail(function() {								// if there is an error sending the request
		let errMsg = '<h3>An error occured</h3>';	// new variable because output is undefined
		$('#result').html(errMsg);
	});
};

function gameSelected(id) {
	sessionStorage.setItem('gameID', id);
	window.location.assign('game.html');
	return false;									// WHY?
}

function getGame() {
	let gameId = sessionStorage.getItem('gameID');

	$.ajax({
		type: 'GET',
		dataType: 'jsonp',
		crossDomain: true,
		jsonp: 'json_callback',
		url: 'https://www.giantbomb.com/api/game/' + gameId + '/?api_key=ec164f3e4ebfe95b8f71fde3a5b2562480e35db4&format=jsonp'
	})
	.done(function(data){
		let game = data.results;
		console.log(game);
		let output = `
			<div class="row">
	    		<div class="col-md-4">
	    			<img class="rounded" src="${game.image.medium_url}">
	    		</div>
	    		<div class="col-md-8">
	    			<h2>${game.name}</h2>
	    			<p id="deck" class="font-italic"></p>
	    			<ul class="list-group">
	    				<li id="platforms" class="list-group-item"><strong>Platforms: </strong></li>
	    				<li id="genres" class="list-group-item"><strong>Genres: </strong></li>
	    				<li id="themes" class="list-group-item"><strong>Themes: </strong></li>
	    				<li id="devs" class="list-group-item"><strong>Developers: </strong></li>
	    				<li id="pubs" class="list-group-item"><strong>Publishers: </strong></li>
	    				<li id="release" class="list-group-item"><strong>Expected release year: </strong></li>
	    			</ul>
	    			<a href="${game.site_detail_url}" target="_blank" class="btn btn-primary">View on Giantbomb</a>
		            <a href="index.html" class="btn btn-link">Go Back To Search</a>
	    		</div>
	    	</div>
		`;
		$('#game').html(output);

		if (game.deck == null) {
			$('p#deck').append('No description available');
		} else {
			$('p#deck').append(game.deck);
		}
		if (game.platforms == null) {
			$('li#platforms').append('N/A');
		} else {
			for (i = 0; i < game.platforms.length; i++) {
				$('li#platforms').append(game.platforms[i].name + '; ');
			}
		}
		if (game.genres == null) {
			$('li#genres').append('N/A');
		} else {
			for (i = 0; i < game.genres.length; i++) {
				$('li#genres').append(game.genres[i].name + '; ');
			}
		}
		if (game.themes == null) {
			$('li#themes').append('N/A');
		} else {
			for (i = 0; i < game.themes.length; i++) {
				$('li#themes').append(game.themes[i].name + '; ');
			}
		}
		if (game.developers == null) {
			$('li#devs').append('N/A');
		} else {
			for (i = 0; i < game.developers.length; i++) {
				$('li#devs').append(game.developers[i].name + '; ');
			}
		}
		if (game.publishers == null) {
			$('li#pubs').append('N/A');
		} else {
			for (i = 0; i < game.publishers.length; i++) {
				$('li#pubs').append(game.publishers[i].name + '; ');
			}
		}
		if (game.expected_release_year == null) {
			$('li#release').append('N/A');
		} else {
			$('li#release').append(game.expected_release_year);
		}
	})
	.fail(function() {
		let errMsg = '<h3>An error occured</h3>';
		$('#game').append(errMsg);
	});
}