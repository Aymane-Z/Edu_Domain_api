export default {
	app: {
		name: "EduDomain",
		url: "https://edudomainapi-production.up.railway.app/",
		frontendUrl: "http://localhost:8050",
		secret: "fa0e57bce90f3400841d1f8e9b42ac81",
		language: "english",
		publicDir: "assets",
	},
	auth: {
		userTokenSecret: "7cfbd02A-1ax%W@93ba0YY6Q!!0-c3aa494fe51f6d00b249",
		apiTokenSecret: "c54dc628$Xax%W!6a3629B#Q-!07a4df9a5811d1206535e2",
		jwtDuration: 60, //in minutes
		otpDuration: 5, //in minutes
	},
	database: {
		name:"patrimoine",
		type: "mysql",
		host: "localhost",
		username: "root",
		password: "123",
		port: "3306",
		charset: "utf8",
		recordlimit: 10,
		ordertype: "DESC"
	},
	mail: {
		username:"7301fd004@smtp-brevo.com",
		password: "CVP8X4SxDzcnmL95",
		senderemail:"no-reply@eduDomain.ma",
		sendername:"EDU DOMAIN",
		host: "smtp-relay.brevo.com",
		secure: true,
		port: "587"
	},
	upload: {
		tempDir: "uploads/temp/",
		importdata: {
			filenameType: "timestamp",
			extensions: "csv",
			limit: "10",
			maxFileSize: "3",
			returnFullpath: "false",
			filenamePrefix: "",
			uploadDir: "uploads/files/"
		},
		
		recu: {
			filenameType: "random",
			extensions: "jpg,png,gif,jpeg",
			limit: "1",
			maxFileSize: "3",
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

		photo: {
			filenameType: "random",
			extensions: "jpg,png,gif,jpeg",
			limit: "1",
			maxFileSize: "3",
			returnFullpath: false,
			filenamePrefix: "",
			uploadDir: "uploads/files",
			imageResize:  [ 
				{name: "small", width: 100, height: 100, mode: "cover"}, 
				{name: "medium", width: 480, height: 480, mode: "inside"}, 
				{name: "large", width: 1024, height: 760, mode: "inside"}
			],

		},

	},
	s3: {
		secretAccessKey: "",
		accessKeyId: "",
		region: "us-west-2",
		bucket: "",
	},
	
	locales: {
		'english': 'English',
	}

}