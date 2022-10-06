const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Task = require('./task');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate (value) {
      if (!validator.isEmail(value)) {
        throw new Error('Please provide correct email!');
      }
    }
  },
  age: {
    type: Number,
    default: 1,
    validate (value) {
      if (value <= 0) {
        throw new Error('Age must be a positive value!');
      }
    }
  },
  password: {
    type: String,
    trim: true,
    required: true,
    minlength: 7,
    validate (value) {
      if (value.toLowerCase().includes('password')) {
        throw new Error('Password must not contain the word "password"');
      }
    }
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
});

userSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'owner'
});

// this is tricky usage: - here we overwrite toJSON function to delete the unneeded props - because toJSON is called every time behind the scene
userSchema.methods.toJSON = function () {
  const userData = this.toObject();

  delete userData.password;
  delete userData.tokens;
  delete userData.avatar; // no need to send the avatar property, since it is too large, the avatar data will be handled differently!
  return userData;
};

userSchema.methods.generateAuthToken = async function () {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);

  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('Unable to login');
  }

  const isMatched = await bcryptjs.compare(password, user.password);

  if (!isMatched) {
    throw new Error('Unable to login - check user and pass!');
  }

  return user;
};

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcryptjs.hash(this.password, 8);
  }

  next();
});

// Delete all user's tasks, when user is deleted!
userSchema.pre('remove', async function (next) {
  const user = this;

  await Task.deleteMany({ owner: user._id });

  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
