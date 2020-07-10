import React, { useMemo, useLayoutEffect, useState, useCallback } from 'react'
import MailList from './mail/MailList'
import axios from 'axios'

export default function Dashboard (props) {
    const [userId, setUserId] = useState("1")
    const [user, setUser] = useState({})
    const [numb, setNumb] = useState(5)
    const [counter, setCounter] = useState(0)

    const loadUser = useCallback(() => {
      axios.get("https://reqres.in/api/users/" + userId)
        .then((response) => {
          setUser({ ...response.data.data });
        })
        .catch((error) => {
          console.log(error);
          setUserId(userId);
        });
    }, [userId]);

    useLayoutEffect(() => {
      loadUser();
    }, [loadUser]);

    const compute = (numb) => {
      console.log("comput(numb) is executed");
      return numb * numb;
    };

    //const computedValue = compute(numb);
    const computedValue = useMemo(() => compute(numb), [numb]);

    return (
      <div>
        Welcome to Jinka <br/> <input value={numb} onChange={(e) => setNumb(e.target.value)} /> <br /> Computed Value: {computedValue} <br />
        {counter}<br/>
        <button onClick={() => setCounter(counter + 1)}> Increment </button>
        <br />
          User ID : <input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <br />
          <button type="submit">Change User</button>
        <br />
        <MailList {...user} />
      </div>
    );
}

