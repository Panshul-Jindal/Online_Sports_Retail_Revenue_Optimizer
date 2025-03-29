var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
const expressSession = require("express-session");

var logger = require("morgan");
var cors = require("cors");
const bcrypt = require("bcrypt"); // or 'bcryptjs'
const { Pool } = require("pg"); // Add PostgreSQL library


// const API = axios.create({
//   baseURL: "http://localhost:5173", // Base URL of your backend
// });

// // Example: Fetch products
// export const fetchProducts = async () => {
//   try {
//     console.log("Sending request to /products");
//     const response = await API.get("/products"); // Check if API is properly set up
//     console.log("Received raw response:", response);
//     const data = await response.data; // Adjust for Axios (no need for `.json()`)
//     console.log("Parsed data:", data);
//     return data;
//   } catch (error) {
//     console.error("Error fetching products:", error);
//     throw error;
//   }
// };


const corsOptions = {
  origin: "http://localhost:5173", // Replace with your frontend's URL
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true, // Allow cookies
};

// PostgreSQL Connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'DBMS_Project',
  password: 'harekrishna',
  port: 5432,
});

pool.connect()
  .then(() => console.log("PostgreSQL connected"))
  .catch((err) => console.log(err));

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/api/auth");
var productRoutes = require("./routes/api/products");
var cartRoutes = require("./routes/api/Cart");
var orderRoutes = require("./routes/api/order");
var chatRoutes = require("./routes/api/Chatbot");



var app = express();
app.use(cors(corsOptions));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);




app.use("/api/products", productRoutes(pool));
app.use("/api/auth", authRouter(pool)); 
app.use("/api/cart", cartRoutes(pool));
app.use("/api/order", orderRoutes(pool));
app.use("/chatbot", chatRoutes);









// app.use(express.static(path.join(__dirname, "public")));
// below line is needed to connect static files in frontend with the backend so that those files can be included in the server without
// app.use(express.static(path.join(__dirname, "../frontend/build")));







// Handle React routing



// // Routes
// app.use("/auth", authRouter); // Use auth.js routes under the '/auth' endpoint

// app.use("/products", productRoutes);




// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
// });

// app.use("/", indexRouter);
// app.use("/users", usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});





// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
app.listen(5000, () => console.log("Backend running on http://localhost:5000"));
