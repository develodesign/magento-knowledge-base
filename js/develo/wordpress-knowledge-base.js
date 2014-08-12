/**
 */
jQuery( function( $ ){

	var toggleButtons = document.querySelectorAll( '.wordpress-knowledge-base-sub-category a.toggle-link' );

	for( var i = 0; i < toggleButtons.length; i++ ){

		toggleButtons[i].addEventListener( 'click', function( event ){

			event.preventDefault();
			$( this ).parents( '.wordpress-knowledge-base-sub-category' ).toggleClass( 'display' );
		});
	}

	$( '.wordpress-knowledge-base .view-all' ).on( 'click', function(){

		$( this ).parent( 'ul' ).find( '.hidden' ).removeClass( 'hidden' );
		$( this ).addClass( 'hidden' );
	});

	var $loader = $( '.wordpress-knowledge-base .searching' );

	$( '.wordpress-knowledge-base .search-container' ).on( 'click', function(){

		$( this ).find( 'input' ).focus();
	});

	// Searching
	var searching = false;
	var timeout;
	var $resultsContainer = $( '.search-results ul' );
	var $searchResultsHeader = $( '.search-results h2' );
	var $noResultsAlert = $( '#knowledge-base-no-results' );
	var $searchResultsAlert = $( '#knowledge-base-search-results-feedback' );
	var $numberOfSearchResults = $( '#number-of-search-results' );

	/**
	 * Makes an ajax call to the wordpress magento search controller to search for a specific term.
	 */
	var updateSearchResults = function(){

		var searchTerm = $searchInput.val();

		// If we're not already searching
		if( ! searching && searchTerm ){

			searching = true;

			var url =  wordpressSearchUrl + '/?s=' + searchTerm;

			$.ajax( {
				complete: function(){
					searching = false;
					$loader.addClass( 'hidden' );
					$resultsContainer.removeClass( 'hidden' )
				},
				error: function(){
					console.log( arguments );
				},
				success: displayResults,
				url: url
			} );
		}
	};

	/**
	 * Display the results in the results container
	 * If we dont have any results display an alert
	 *
	 * @param result string
	 */
	var displayResults = function( result ){

		result = $.parseJSON( result );

		$resultsContainer.empty();

		if( result.totalRecords == 0 ){

			$noResultsAlert.removeClass( 'hidden' );

			return;
		}

		$numberOfSearchResults.text( result.totalRecords );
		$searchResultsAlert.removeClass( 'hidden' );
		$searchResultsHeader.removeClass( 'hidden' );

		$.each( result.items, function( index, item ) {
			addSearchItem( item );
		} );
	};

	/**
	 * Add a search item to the result container
	 *
	 * @param item
	 */
	var addSearchItem = function( item ){

		var $a = $( '<a/>' )
				.prop( 'href', '/news/' + item.permalink )
				.text( item.post_title )
			;

		var $li = $( '<li/>' )
				.addClass( 'wordpress-knowledge-base-item' )
				.append( $a )
			;

		$resultsContainer.append( $li );
	};

	/**
	 * Starts the search
	 */
	var startSearch = function( ) {

		if( $loader.hasClass( 'hidden' ) )
			$loader.removeClass( 'hidden' );

		if( ! $noResultsAlert.hasClass( 'hidden' ) )
			$noResultsAlert.addClass( 'hidden' );

		if( ! $searchResultsAlert.hasClass( 'hidden' ) )
			$searchResultsAlert.addClass( 'hidden' );

		if( ! $searchResultsHeader.hasClass( 'hidden' ) )
			$searchResultsHeader.addClass( 'hidden' );

		if( ! $resultsContainer.hasClass( 'hidden' ) )
			$resultsContainer.addClass( 'hidden' );

		clearTimeout( timeout );

		// Delay the start of the update search results function.
		timeout = setTimeout(
			updateSearchResults,
			1000 );
	};

	// Hide and show the loader if the user is searching
	var $searchInput = $( '.wordpress-knowledge-base .search-container input' ).on( 'focus', function(){

		//$loader.removeClass( 'hidden' );

	}).on( 'blur', function(){

		$loader.addClass( 'hidden' );

	}).on( 'keyup', function(){

		if( $( this ).val().length > 2 )
			startSearch();
	});

});
