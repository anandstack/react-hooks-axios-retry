import React, { useContext } from "react";
import { MailContextStore } from "./MailList";

export default function Mail(props) {
  const { mailsState, dispatch } = useContext(MailContextStore);

  return (
    <div>
      Hi {mailsState.showName} {mailsState.showName && props.first_name}
      <br />
      Mail ID: {props.mail.id} of Email: {props.mail.title} <br />
      <button
        onClick={() =>
          dispatch({
            type: "UPDATE_SHOW_NAME",
            payload: !mailsState.showName,
          })
        }
      >
        {mailsState.showName ? "Hide" : "Show"} First Name
      </button>
    </div>
  );
}
