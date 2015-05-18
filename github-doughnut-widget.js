$(function() {
	//	Load settings
	loadJSON("settings", function(response) {
		var settings = JSON.parse(response),
			username = settings[0]["username"],
			request_count = settings[0]["request_count"]

		if (username != "") {
			var url = createRepoUrl(username, request_count)
			try {
				getLanguagesFromRepos(username, url);
			} catch (err) {
				console.log("Github API may be down or username may be wrong.");
			}
	    } else {
			console.log("No username is set.");
		}
	});

	function loadJSON(filename, callback) {   
    	var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', '../' + filename + '.json', true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				callback(xobj.responseText);
			}
		};
		xobj.send(null);  
	}

	function createRepoUrl(username, request_count)
	{
		return "https://api.github.com/users/" + username + "/repos?page=1&per_page=" + request_count + "&direction=desc";
	}

	function getLanguagesFromRepos(username, url)
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
				displayWidget(username, languages, image);
			}
		})
		.fail(function() {
			console.log("Error. Github API may be down, or you got your username wrong.");
		});
	}

	function displayWidget(username, languages, image)
	{
		loadJSON("vendor/colors", function(response) {
			var data = [],
				colors = JSON.parse(response);
			colors["Undefined"] = "gray";
			for (language in languages) {
				if (colors[language]) {
					color = colors[language];
				} else {
					color = colors["Undefined"];
				}
				data.push({"value": languages[language], "label": language, "color": color, "highlight": "blue"});
			}     
			$("#github-doughnut-widget-holder").append("<a href='" + "https://github.com/" + username + "' id='github-user-icon' target='_blank'><img src='" + image + "'></img></a>");
			resizeWidgetElements();
			renderChart(data);
		});
	}


	function resizeWidgetElements()
	{
		var widget_sizing = $("#github-doughnut-widget-holder").width(),
			quarter_sizing	= widget_sizing / 4,
			eighth_sizing = quarter_sizing / 2
		$("#github-user-icon").css({
			"background": "#ccc" ,
			"margin-top": - eighth_sizing + "px" ,
			"margin-left": - eighth_sizing + "px" ,
			"width": quarter_sizing + "px",
			"height": quarter_sizing + "px"
		});
	}


	function renderChart(data)
	{
		var ctx = document.getElementById("github-doughnut-widget").getContext("2d");
		window.myDoughnut = new Chart(ctx).Doughnut(data, {
			responsive: true,
			animationSteps: 50,
			percentageInnerCutout: 70,
			segmentShowStroke : true,
		});
	}
});
