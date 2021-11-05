import validator from "email-validator";

export function validateUsername(username) {
  if (username.length < 3) {
    throw "username has to be 3 or more characters";
  } else if (username.length >= 20) {
    throw "username must be less than 20 characters";
  }
}

export function validateEmail(email) {
  if (!validator.validate(email)) {
    throw "enter a valid email";
  }
}

export function validatePassword(password) {
  if (password.length < 8) {
    throw "password must be 8 or more characters";
  } else if (password.length > 30) {
    throw "password must be 30 or less characters";
  } else if (!password.match(/[0-9]/)) {
    throw "password must include a number";
  } else if (!password.match(/[a-z]/)) {
    throw "password must include a lower case character";
  } else if (!password.match(/[A-Z]/)) {
    throw "password must include an upper case character";
  }
}

export function validateName(name) {
  if (!name) {
    throw "please enter your name";
  } else if (name.trim().length === 0) {
    throw "please input something for your name";
  } else if (name.match(/ +/)) {
    throw "name cannot include spaces";
  } else if (name.length > 30) {
    throw "name cannot be over 30 characters";
  } else if (name.length === 0) {
    throw "name cannot be blank";
  }
}
