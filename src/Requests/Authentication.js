import { getAuthorization, getAuthToken, getADUser } from "./Authorization";

const URLS = {
  USERSIGNUP: "http://127.0.0.1:8000/api/user/signup/",
  USERLOGIN: "http://127.0.0.1:8000/api/user/login/",
  USERLOGOUT: "http://127.0.0.1:8000/api/user/logout/"
};

export const signupHandler = async (event, signupData) => {
  console.log("[Requests/Authentication.js] signUp Data : ", signupData);
  event.preventDefault();
  try {
    console.log("[Auth.js] : Sign Up Data", signupData);
    const siginupRes = await fetch(URLS.USERSIGNUP, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signupData)
    });
    const data = await siginupRes.json();
    console.log("signup sign up response: ", data);
    // remove if any thing is remaining of the previous user
    localStorage.removeItem("AnshdataUser");
    // Following action will automatically store all the data we need.
    localStorage.setItem("AnshdataUser", JSON.stringify(data));
  } catch (err) {
    console.log("[Auth.js] SIGNUP ERR : ", err);
  }
};

export const signinHandler = async (event, signinData) => {
  console.log("[Auth.js] Log In Handler", signinData);
  event.preventDefault();
  try {
    console.log("[Auth] : Sign In Handler", signinData);
    const loginRes = await fetch(URLS.USERLOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(signinData)
    });
    const data = await loginRes.json();
    console.log("signin response: ", data);
    // remove if any thing is remaining of the previous user
    localStorage.removeItem("AnshdataUser");
    // Following action will automatically store all the data we need.
    localStorage.setItem("AnshdataUser", JSON.stringify(data));
  } catch (err) {
    console.log("[Auth.js] SIGNIN ERR : ", err);
  }
};

export const logoutHandler = async event => {
  console.log("[Auth.js] Log Out Handler");

  try {
    const logoutRes = await fetch(URLS.USERLOGOUT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthorization()
      }
    });
    const data = await logoutRes.json();
    console.log("signout response: ", data);
    // remove if any thing is remaining of the previous user
    localStorage.removeItem("AnshdataUser");
  } catch (err) {
    console.log("[Auth.js] Log out ERR : ", err);
  }
};

export const refreshUserToken = async () => {
  console.log("[Authorization.js] Refresh Handler");
  const URL = "http://127.0.0.1:8000/api/user/refresh/";
  try {
    const adToken = getAuthToken();
    if (adToken === "" || adToken === null) {
      return;
    }
    const refreshData = {
      token: adToken
    };
    // console.log("[Authorization.js] : Refresh Handler", refreshData);
    const refreshRes = await fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(refreshData)
    });

    let AnshdataToken = (await refreshRes.json()).token;
    let AnshdataUser = JSON.parse(getADUser());
    AnshdataUser["token"] = AnshdataToken;
    localStorage.removeItem("AnshdataUser");
    localStorage.setItem("AnshdataUser", JSON.stringify(AnshdataUser));
    console.log("[Authorization.js] Refreshed token");
  } catch (err) {
    console.log("[Authorization.js] Refresh ERR : ", err);
    localStorage.removeItem("AnshdataUser");
  }
};

export const verifyUserToken = async () => {
  console.log("[Authorization.js] Verify Handler");
  const URL = "http://127.0.0.1:8000/api/user/verify/";
  try {
    const adToken = getAuthToken();
    if (adToken === "" || adToken === null) {
      console.loog("User is not logged in not verifying the token");
      return;
    }
    const refreshData = {
      token: adToken
    };
    // console.log("[Authorization.js] : Refresh Handler", refreshData);
    fetch(URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(refreshData)
    })
      .then(response => {
        if (!response.ok) {
          throw Error(response.statusText);
        }
        return response.json();
      })
      .catch(err => {
        console.log("Failed to verify the token will try to refresh", err);
        refreshUserToken();
      })
      .then(data => {
        console.log("Token verified successfully");
      });
  } catch (err) {
    console.log("[Authorization.js] Refresh ERR : ", err);
    localStorage.removeItem("AnshdataUser");
  }
};