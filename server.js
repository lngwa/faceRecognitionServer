const express = require("express");
const parser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

let CNT = 0;

const database = {
	users: [
		{
			id: 1,
			name: "Lewis Che",
			email: "lewis@gmail.com",
			password: "melvis",
			entries: 0,
			created_at: new Date()
		},
		{
			id: 2,
			name: "Melvis Che",
			email: "melvis@gmail.com",
			password: "lewis",
			entries: 0,
			created_at: new Date()
		}
	]
};

const getUserByEmail = email => {
	return database.users.filter(user => user.email === email);
};

const getUserByID = id => {
	console.log(id);
	return database.users.filter(user => user.id === id);
};

/*
	/ => GET: "It's working!"
	/signin => POST: success/fail
	/register => POST: user
	/profile/:userID => PUT: user

*/
app.use(parser.json());
app.use(cors());
app.get("/", (req, res) => {
	res.status(200).send(database.users);
});

app.post("/signin", (req, res) => {
	const user = database.users.filter(
		user =>
			user.email === req.body.email && user.password === req.body.password
	);
	if (user.length > 0) {
		res.json(`success`);
	} else {
		res.json(`fail`);
	}
});

app.post("/register", (req, res) => {
	CNT = database.users.length;
	const { name, email, password } = req.body;
	const user = getUserByEmail(email);
	if (user.length > 0) {
		res.json(`User already exist!`);
	} else {
		const newUser = {
			id: ++CNT,
			name: name,
			email: email,
			password: password,
			entries: 0,
			created_at: new Date()
		};
		database.users.push(newUser);
		res.status(200).json(newUser);
	}
});

app.get("/profile/:id", (req, res) => {
	const { id } = req.params;
	let found = false;
	const user = database.users.forEach(user => {
		if (user.id == id) {
			found = true;
			res.json(user);
		}
	});
	if (!found) {
		res.status(404).json(`User not found!`);
	}
});

app.put("/image", (req, res) => {
	
	const { id } = req.body;
	let found = false;
	const user = database.users.forEach(user => {
		if (user.id == id) {
			user.entries++;
			found = true;
			res.json(user.entries);
		}
	});
	if (!found) {
		res.status(404).json(`User not found!`);
	}
});

app.listen(3001, () => {
	console.log("Server is up an running on port 3001");
});
