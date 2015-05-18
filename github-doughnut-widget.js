$(function() {
	var username = "Naoto-Ida",
		request_count = 50,
		colors = {
			"Python": "#4caf50",
			"Undefined": "#9e9e9e"
		}

	if (username != "") {
		var url = createRepoUrl(username, request_count)
		try {
			var data = getRepos(url);
		} catch (err) {
		}
	} else {
		console.log("No username is set.");
	}

	function createRepoUrl(username, request_count)
	{
		return "https://api.github.com/users/" + username + "/repos?page=1&per_page=" + request_count + "&direction=desc";
	}

	function getRepos(url)
	{
		$.getJSON(url, function(json) {
		}).done(function(json) {
			if (json != null) {
				var languages = [];
				var image = "";
            	for (var i = 0; i < json.length; i++) {
					image = json[i]["owner"]["avatar_url"];
					var language = json[i]["language"];	

					if (language == null) {
						language = "Undefined"
					}

					if (languages[language]) {
						languages[language] = languages[language] + 1;
					} else {
						languages[language] = 1;
					}
            	}
				displayWidget(languages, image);
			}
		})
		.fail(function() {
			console.log("Error. Github API may be down, or you got your username wrong.");
		});
	}

	function displayWidget(languages, image)
	{
		console.log(image);
		var data = [];
		for (language in languages) {
			if (colors[language]) {
				color = colors[language];
			} else {
				color = colors["Undefined"];
			}
		

			data.push({"value": languages[language], "label": language, "color": color, "highlight": "blue"});
       	}     
		$("#github-doughnut-widget-holder").append("<img id='github-user-icon' src='" + image + "'></img>");
		resizeWidgetElements();
		var ctx = document.getElementById("github-doughnut-widget").getContext("2d");
		window.myDoughnut = new Chart(ctx).Doughnut(data, {responsive : true});
	}


	function resizeWidgetElements()
	{
		var widget_sizing = $("#github-doughnut-widget-holder").width(),
			half_sizing	= widget_sizing / 2
		$("#github-user-icon").css({"margin": "-" + half_sizing + "px, 0 0 , -" + half_sizing + "px" , "width": half_sizing + "px", "height": half_sizing + "px"});
	}
});
