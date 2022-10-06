const express = require('express');
require('./db/mongoose');

const PORT = process.env.PORT;
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

app.use(express.json()); // set this to be able to parse Json in the req.body
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}!`);
});

// const User = require('./models/user');
// const Task = require('./models/task');

// const main = async () => {
//   // const task = await Task.findById('someID');
//   // await task.populate('owner');
//   // console.log(task.owner);

//   const user = await User.findById('62e138a08b54c546afc0acfa');
//   await user.populate('tasks')

//   console.log(user.tasks);
// };

// main()
