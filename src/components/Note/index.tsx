import React, {useState, useEffect, useCallback} from "react";
import { useAppSelector } from "../../app/hooks";
import { selectAuth, LoginStatus } from "../Login/authslice";

export function Note() {
  const auth = useAppSelector(selectAuth);

  if (auth.status !== LoginStatus.LOGGED_IN) return null;
  const {
    apiToken,
    user: { id: userId },
  } = auth;

  return (
    <div>
      <NoteField userId={userId} apiToken={apiToken} />
    </div>
  );
}

type NoteFieldProps = {
  userId: string,
  apiToken: string
}

function NoteField({userId, apiToken}: NoteFieldProps) {
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    async function fetchNote(userId: string, apiToken: string) {
      let response = await fetch(
        `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json", 'Authorization': `Bearer ${apiToken}` },
        },
      ) as any;
      
      const user = await response.json();
      setNote(user.note);
    }
    fetchNote(userId, apiToken);
  }, [userId, apiToken]);

  const setNewNote = () => {
    fetch(
        `https://60b793ec17d1dc0017b8a6bc.mockapi.io/users/${userId}`,
        {
          method: "POST",
          headers: { "Content-type": "application/json", 'Authorization': `Bearer ${apiToken}` },
          body: JSON.stringify({
            note,
          }),
        }
      );
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>,) => {
    setNote(e.target.value);
  }

  return <>
    <textarea value={note} onChange={handleChange}></textarea>
    <div>
      <button onClick={() => setNewNote()}>
        Set New Note
      </button>
    </div>
  </>;
}
