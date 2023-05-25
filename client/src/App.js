import { useEffect, useState } from "react";
import logo from './assests/icons8-chatgpt-64.png'

function App() {
  const [value, setValue] = useState("");
  const [message, setMessage] = useState(null);
  const [previousChats, setPreviousChats] = useState([]);
  const [currentTitle, setCurrentTitle] = useState(null);
  const API_KEY = process.env.API_KEY;
  const createNewChat = () => {
    setMessage(null);
    setValue("");
    setCurrentTitle(null);
  };

  const handleClick = (uniqueTitle) => {
    setCurrentTitle(uniqueTitle)
    setMessage(null);
    setValue("");
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body: JSON.stringify({
        message: value,
      }),
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
    };
    try {
      const response = await fetch(
        "http://localhost:8000/completions",
        options
      );
      if (response.ok) {
        const data = await response.json();
        setMessage(data.choices[0].message);
      } else {
        throw new Error("Error occurred while fetching data");
      }
    } catch (error) {
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      getMessages();
    }
  };


  useEffect(() => {
    if (!currentTitle && value && message) {
      setCurrentTitle(value);
    }
    if (currentTitle && message) {
      setPreviousChats((previousChats) => [
        ...previousChats,
        {
          title: currentTitle,
          role: "user",
          content: value,
        },
        {
          title: currentTitle,
          role: message.role,
          content: message.content,
        },
      ]);
    }
  }, [message, currentTitle]);

  const currentChat = previousChats.filter(
    (previousChats) => previousChats.title === currentTitle
  );
  const uniqueTitles = Array.from(
    new Set(previousChats.map((previousChats) => previousChats.title))
  );

  return (
    <div className='app'>
      <section className='sidebar'>
        <img src={logo} alt="openai logo" className="logo"/>
        <button className='sidebar-btn' onClick={createNewChat}>
          ﹢ New Chat
        </button>
        <ul className='history'>
          {uniqueTitles.map((uniqueTitle, index) => (
            <li key={index}onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>
          ))}
        </ul>
        <nav className='navbar'>
          <p>Made by Matthew</p>
        </nav>
      </section>
      <section className='main'>
        {!currentTitle && <h1>MatthewGPT<img src={logo} alt="openai logo" className="logo"/></h1>}
        <ul className='feed'>
          {currentChat?.map((chatMessage, index) => (
            <li key={index} className="feed-list">
              <p className='role'>{chatMessage.role}</p>
              <p className="feed-list-p">{chatMessage.content}</p>
            </li>
          ))}
        </ul>
        <div className='bottom-section'>
          <div className='input-container'>
            <input value={value} onChange={(e) => setValue(e.target.value)}onKeyDown={handleKeyDown} />
            <div id='submit' onClick={getMessages}>
              ➢
            </div>
          </div>
          <p className='info'>
            Free Research Preview. ChatGPT may produce inaccurate information
            about people, places, or facts.{" "}
            <a
              href='https://help.openai.com/en/articles/6825453-chatgpt-release-notes'
              target='blank'
            >
              ChatGPT May 12 Version
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

export default App;
