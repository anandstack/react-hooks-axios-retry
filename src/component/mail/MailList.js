import React, { useReducer, useLayoutEffect, useState } from "react";
import Mail from "./Mail";
import axios, { CancelToken } from "axios";
import axiosRetry from "axios-retry";

export const MailContextStore = React.createContext();

function mailReducer(state, action) {
  switch (action.type) {
    case "UPDATE_SHOW_NAME":
      return { ...state, showName: action.payload };
    case "UPDATE_SHOW_EMAIL":
      return { ...state, showEmail: action.payload };
    case "UPDATE_MAILS":
      return { ...state, mails: action.payload };
    default:
      return {};
  }
}

export default function MailList(props) {
  const [mailsState, dispatch] = useReducer(mailReducer, {
    mails: [],
    showName: true,
  });

  const [text, setText] = useState("Nothing here");
  //axios.defaults.baseURL = "https://api.example.com";
  const getCall = CancelToken.source();

  // Global Axios configuration
  axios.defaults.baseURL = "https://jsonplaceholder.typicode.com";

  let retries = 0;
  axiosRetry(axios, {
    //retries: 5,
    retryCondition: (error) => {
      let config = error.config;
      if (!config) {
        return false;
      }
      retries = retries + 1;
      if (retries >= 3) {
        retries = 0;
        return false;
      }
      return true;
    },
    //retryDelay: axiosRetry.exponentialDelay,
    retrDelay: (retryCount) => {
      console.log("retryCount ", retryCount);
      return retryCount * 2000;
    },
  });

  const jinkaRequestInterceptor = axios.interceptors.request.use((config) => {
    console.log("REQUEST BEGIN");
    console.log(config);
    console.log("REQUEST END");

    return config;
  });
  axios.interceptors.request.eject(jinkaRequestInterceptor);
  //http://slowwly.robertomurray.co.uk/delay/3000/url/https://jsonplaceholder.typicode.com/
  useLayoutEffect(() => {
    axios
      .get(
        "http://slowwly.robertomurray.co.uk/delay/3000/url/https://jsonplaceholder.typicode.com/postts",
        {
          timeout: 4000,
          "axios-retry": {
            retries: 8,
          },
          //validateStatus: (status) => status >= 200 && status < 300, 
        }
      )
      .then((response) =>
        dispatch({
          type: "UPDATE_MAILS",
          payload: response.data,
        })
      )
      .catch((error) => {
        console.log("BEGIN");
        console.log(error.status);
        console.log("END");
      });
  }, []);

  function cancelCall() {
    console.log("cancel() - BEGIN");
    getCall.cancel();
    console.log("cancel() - END");
  }

  return (
    <MailContextStore.Provider value={{ mailsState, dispatch }}>
      <div>
        Hi! Here is your Mail list. {text}
        <br />
        <button onClick={() => cancelCall()}>Cancel Request</button>
        <br />
        <input onChange={(e) => setText(e.target.value)} />
        <br />
        {mailsState.mails &&
          mailsState.mails.map((mail) => {
            return <Mail key={mail.id} mail={{ ...mail }} {...props} />;
          })}
      </div>
    </MailContextStore.Provider>
  );
}
