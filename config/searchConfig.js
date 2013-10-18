module.exports = {

	headers: {
		"user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_6_8) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.101 Safari/537.11"
	},

	sites: [
		{
			host: "thepiratebay.se",
			port: 80,
			path: ["/search/", "/0/7/0"],
			method: "GET"
		},
		{
			host: "tpb.derp.pw",
			port: 80,
			path: ["/search/", "/0/7/0"],
			method: "GET"
		},
		{
			host: "tpb.partipirate.org",
			port: 80,
			path: ["/search/", "/0/7/0"],
			method: "GET"
		},
		{
			host: "kat.ph",
			port: 80,
			path: ["/usearch/", "/?field=seeders&sorder=desc"],
			method: "GET"
		},
		{
			host: "tpb.pirates.ie",
			port: 80,
			path: ["/search/", "/0/7/0"],
			method: "GET"
		}
	]


};