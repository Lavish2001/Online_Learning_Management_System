// index.js
require("./bin/kernel");
let serverless = require("serverless-http");
let express = require("express");
let path = require("path");
const { sequelize } = require('./app/Models/index');
let logger = require("morgan");
let cookieParser = require("cookie-parser");
let courseRoutes = require("./routes/CourseApi");
let userRoutes = require("./routes/UserApi");
let lessonRoutes = require("./routes/LessonsApi");
let enrollmentRoutes = require("./routes/EnrollementApi");
let testRoutes = require("./routes/TestApi");
let questionRoutes = require("./routes/QuestionApi");
let marksRoutes = require("./routes/MarksApi");
let gradeRoutes = require("./routes/GradesApi");
let optionsRoutes = require('./routes/OptionsApi');
const { Courses } = model("");
const { Users } = model("");
const { Enrollments } = model("");
const { Grades } = model("");



// let paymentRoutes = require('./routes/PaymentApi');
// Import the library:
let cors = require("cors");
let app = express();
const dir = (__dirname + '/Public/Courses/Lessons');
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLNonNull } = require('graphql');
const { graphqlHTTP } = require('express-graphql');


const UserType = new GraphQLObjectType({
  name: 'Users',
  description: 'all Courses',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    username: { type: new GraphQLNonNull(GraphQLString) },
    email: { type: new GraphQLNonNull(GraphQLString) }
    // add other fields as needed
  }),
});

const GradeType = new GraphQLObjectType({
  name: 'Grades',
  description: 'Student Grades',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    grade: { type: GraphQLString },
    // add other fields as needed
  }),
});

const EnrollmentType = new GraphQLObjectType({
  name: 'Enrollments',
  description: 'Students Enrollments',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    student_id: { type: new GraphQLNonNull(GraphQLInt) },
    course_id: { type: new GraphQLNonNull(GraphQLInt) },
    enrolled_at: { type: new GraphQLNonNull(GraphQLString) },
    completed_at: { type: GraphQLString },
    student_details: {
      type: UserType,
      resolve: async (parent, args) => {
        return Users.findOne({ where: { id: parent.student_id } })
      }
    },
    student_grade: {
      type: GradeType,
      resolve: async (parent, args) => {
        return Grades.findOne({ where: { student_id: parent.student_id, course_id: parent.course_id } })
      }
    },
    // add other fields as needed
  }),
});

const CourseType = new GraphQLObjectType({
  name: 'Courses',
  description: 'all Courses',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    course_name: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: new GraphQLNonNull(GraphQLString) },
    course_price: { type: new GraphQLNonNull(GraphQLInt) },
    teacher: {
      type: UserType,
      resolve: async (parent, args) => {
        return Users.findOne({ where: { id: parent.teacher_id } })
      }
    },
    enrollments: {
      type: new GraphQLList(EnrollmentType),
      resolve: async (parent, args) => {
        return Enrollments.findAll({ where: { course_id: parent.id } })
      }
    }
    // add other fields as needed
  }),
});


const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    courses: {
      type: new GraphQLList(CourseType),
      description: 'All Available Courses',
      args: {
        id: { type: GraphQLInt }
      },
      resolve: async (parent, args) => {
        if (args.id) {
          const courses = await Courses.findAll({ where: { id: args.id } });
          return courses
        } else {
          const courses = await Courses.findAll();
          return courses;
        }
      }
    }
  })
});

const schema = new GraphQLSchema({
  query: RootQueryType
})


app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true,
}))


// sequelize.sync();

// view engine setup
app.set("views", path.join(__dirname, "resources/views"));
app.set("view engine", "twig"); // either pug,twig etc

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
// Then use it before your routes are set up:

// FILES ROUTES //

app.use('/Images', express.static(path.join(dir)));

app.use(cors());
// app.use("/www", webRoutes);
app.use("/", userRoutes);
app.use("/api/v1", courseRoutes);
app.use("/api/v2", lessonRoutes);
app.use("/api/v3", enrollmentRoutes);
app.use("/api/v4", testRoutes);
app.use("/api/v5", questionRoutes);
app.use("/api/v6", marksRoutes);
app.use("/api/v7", gradeRoutes);
app.use("/api/v8", optionsRoutes);
// app.use("/api/v9", paymentRoutes);


// catch 404 and forward to error handler
app.use((req, res, next) => {
  console.log(next)
  next({
    status: 404,
    message: "Not Found",
  });
});

// error handler
app.use((err, req, res, next) => {
  if (err.status === 404) {
    return res.status(404).render("errors/404");
  }

  if (err.status === 500) {
    return res.status(500).render("errors/500");
  }
  return next();
});


module.exports = app;
module.exports.handler = serverless(app);
