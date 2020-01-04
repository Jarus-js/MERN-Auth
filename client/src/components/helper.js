import cookie from "js-cookie";

//set cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, {
      expires: 1
    });
  }
};

//remove cookie
export const removeCookie = key => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 1
    });
  }
};
//get from cookie such as stored token
//will be useful when we need to make request to server with token
export const getCookie = key => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};

//set in localStorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value)); //whev we save anything in ls we need to save as json
  }
};

//remove from localStorage
export const removeLocalStorage = key => {
  if (window !== "undefined") {
    localStorage.removeItem(key); //whev we save anything in ls we need to save as json
  }
};

//authenticate user by passing data to ls & cookie during login
export const authenticate = (response, next) => {
  console.log("AUTHENTICATE HELPER", response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

export const isAuth = () => {
  if (window !== "undefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      //if theres token in cookie
      if (localStorage.getItem("user")) {
        //if theres user in ls
        return JSON.parse(localStorage.getItem("user")); //as js object
      } else {
        return false;
      }
    }
  }
};

export const logout = next => {
  removeCookie("token");
  removeLocalStorage("user");
  next();
};

export const updateStorage = (response,next)=>{
  if(typeof window === 'undefined'){
    let auth = JSON.parse(localStorage.getItem('user'));
    auth = response.data;
    localStorage.setItem('user',JSON.stringify(auth));
    next();
  }
}
