import * as ActionTypes from "./ActionTypes";
import { baseUrl } from "../shared/baseUrl";
import { NavigationActions } from "react-navigation";
import { EventRegister } from "react-native-event-listeners";

// get patients data:  actions
export const fetchUser = (userId) => (dispatch) => {
  if (userId != null) {
    // dispatch(userLoading());
    return fetch(baseUrl + "api/user/" + userId)
      .then(
        (response) => {
          if (response.ok) {
            return response;
          } else {
            var error = new Error(
              "Error " + response.status + ": " + response.statusText
            );
            error.response = response;
            throw error;
          }
        },
        (error) => {
          var errMess = new Error(error.message);
          throw errMess;
        }
      )
      .then((response) => response.json())
      .then((user) =>
        dispatch(
          addUser(
            Object.assign(
              {
                symptomDataLen:
                  user.symptom && user.symptom.length ? user.symptom.length : 0,
              },
              user
            )
          )
        )
      )
      .catch((error) => dispatch(userFailed(error.message)));
  } else {
    dispatch(userFailed("InValid Login"));
  }
};

//update patient data
export const updatePatientDetails = (userId, image, userObj) => (dispatch) => {
  var form = new FormData();
  form.append("data", JSON.stringify(userObj));
  if (image) {
    var fileObj = {
      name: "image.jpg",
      type: "image/jpeg",
      uri: image,
    };
    form.append("profile", fileObj);
  }

  return fetch(baseUrl + "api/user/" + userId, {
    method: "POST",
    body: form,
    creadentials: "same-origin",
  })
    .then(
      (response) => {
        if (response.ok) {
          EventRegister.emit("UPDATE_USER", "true");
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then((response) => response.json())

    .then((user) => {
      if (user.ok) {
        dispatch(updatePatienceSuccess(user));
      } else {
        dispatch(userFailed(user));
      }
    })
    .catch((error) => dispatch(userFailed(error.message)));
};

// register user
export const registerUser = (userObj) => (dispatch) => {
  //  dispatch(userLoading());
  return fetch(baseUrl + "api/user/signup", {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json",
    },
    creadentials: "same-origin",
  })
    .then(
      (response) => {
        if (response.ok) {
          return response.json();
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then((response) => response)
    .then((user) =>
      user
        ? dispatch(registerFirstUser(user))
        : dispatch(userFailed(error.message))
    )
    .catch((error) => dispatch(userFailed(error.message)));
};

// login user
export const loginUser = (userObj) => (dispatch) => {
  dispatch(userLoading());
  return fetch(baseUrl + "api/user/signin", {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json",
    },
    creadentials: "same-origin",
  })
    .then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then((response) => response.json())
    .then((user) =>
      user.success
        ? dispatch(addUser(user))
        : dispatch(userFailed(error.message))
    )
    .catch((error) => dispatch(userFailed(error.message)));
};

//Otp generate
export const generateOTP = (userId, userObj) => (dispatch) => {
  return fetch(baseUrl + "api/user/generateOtp/" + userId, {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json",
    },
    creadentials: "same-origin",
  })
    .then(
      (response) => {
        if (response.ok) {
          var res = response.json();
          return res;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);
        throw errMess;
      }
    )
    .then((res) => res)
    .then((user) =>
      user
        ? dispatch(getOtpRequestId(user))
        : dispatch(userFailed(error.message))
    )
    .catch((error) => dispatch(userFailed(error.message)));
};

//validate OTP
export const validateOtp = (userObj) => (dispatch) => {
  return fetch(baseUrl + "api/user/verifyOtp", {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(
      (response) => {
        if (response.ok) {
          return response
            .json()
            .then((data) => {
              EventRegister.emit("VALIDATE_OTP", data);
              return data;
            })
            .catch((err) => {});
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);

        throw errMess;
      }
    )
    .then((response) => response)
    .catch((error) => dispatch(userFailed(error.message)));
};

export const getUserDetails = (mobileNum) => (dispatch) => {
  if (mobileNum != null) {
    return fetch(baseUrl + "api/user/getdetails/" + mobileNum)
    .then(
      (response) => {
        if (response.ok) {
          return response
            .json()
            .then((data) => {
              return data;
            })
            .catch((err) => {});
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);

        throw errMess;
      }
    )
    .then((response) => response)
    .catch((error) => dispatch(userFailed(error.message)));
}
};
export const updateLockDetails = (userObj) => (dispatch) => {
  console.log("actioncreators", userObj)
  return fetch(baseUrl + "api/user/updateFlag", {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json",
    },
    creadentials: "same-origin",
  }).then(
    (response) => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error(
          "Error " + response.status + ": " + response.statusText
        );
        error.response = response;
        throw error;
      }
    },
    (error) => {
      var errMess = new Error(error.message);
      throw errMess;
    }
  );
};
logout;
export const logout = () => (dispatch) => {
  dispatch(userLoading());
  dispatch(userLogout());
};

export const userLogout = () => ({
  type: ActionTypes.USER_LOGOUT,
});

export const userLoading = () => ({
  type: ActionTypes.USER_LOADING,
});

export const userFailed = (errMess) => ({
  type: ActionTypes.USER_FAILED,
  payload: errMess,
});

export const addUser = (user) => ({
  type: ActionTypes.USER_ADD,
  payload: user,
});

export const registerFirstUser = (user) => ({
  type: ActionTypes.USER_REGISTER,
  payload: user,
});

export const userRegisterSuccess = (user) => ({
  type: ActionTypes.USER_REGISTER_SUCCESS,
  payload: user,
});

export const updatePatienceSuccess = (user) => ({
  type: ActionTypes.USER_DETAILS_UPDATE_SUCCESS,
  payload: user,
});
export const updateOtpDetails = (user) => ({
  type: ActionTypes.USER_OTP_VALIDATION,
  payload: user,
});
export const getUserDetailsByMobile = (user) => ({
  type: ActionTypes.GET_USER_DETAILS,
  payload: user,
});
export const getOtpRequestId = (user) => ({
  type: ActionTypes.GET_OTP_REQUEST_ID,
  payload: user,
});
export const getOtpValidate = (user) => ({
  type: ActionTypes.GET_OTP_VALIDATE,
  payload: user,
});

//SOS APIs
export const raiseSOSAPI = (userObj) => (dispatch) => {
  return fetch(baseUrl + "api/patient/raiseSOS", {
    method: "POST",
    body: JSON.stringify(userObj),
    headers: {
      "Content-Type": "application/json",
    },
    creadentials: "same-origin",
  }).then(
    (response) => {
      if (response.ok) {
        return response;
      } else {
        var error = new Error(
          "Error " + response.status + ": " + response.statusText
        );
        error.response = response;
        throw error;
      }
    },
    (error) => {
      var errMess = new Error(error.message);
      throw errMess;
    }
  );
};

export const fetchSosStatus = (userId) => (dispatch) => {
  if (userId != null) {
    return fetch(baseUrl + "api/patient/sosStatus/" + userId).then(
      (response) => {
        if (response.ok) {
          return response.json();
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);
        throw errMess;
      }
    );
  }
};

// update symptom only body temperatur and heart rate
export const updateSymptom = (userObj) => (dispatch) => {
  if (userObj != null) {
    //dispatch(userLoading());
    return fetch(baseUrl + "api/patient/updatesymptom", {
      method: "POST",
      body: JSON.stringify(userObj),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(
      (response) => {
        if (response.ok) {
          return response;
        } else {
          var error = new Error(
            "Error " + response.status + ": " + response.statusText
          );
          error.response = response;
          throw error;
        }
      },
      (error) => {
        var errMess = new Error(error.message);
        throw errMess;
      }
    );
  }
};
