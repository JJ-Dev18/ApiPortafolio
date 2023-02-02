const mongoose = require("mongoose");
const supertest = require("supertest");
const { server, app } = require("../app.js");
const path = require("path");
const api = supertest(app.app);


describe