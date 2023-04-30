import { useState, useEffect } from 'react'

const App = () => {
  const [value, setValue] = useState(null)
  const [message, setMessage] = useState(null)
  const [ previousChats, setPreviousChats ] = useState([])
  const [currentTitle, setcurrentTitle] = useState(null) 
  
  const createNewChat = () => {
    setMessage(null)
    setValue("")
    setcurrentTitle(null) 
  }

  const handleClick = (uniqueTitle) => {
    setcurrentTitle(uniqueTitle)
    setMessage(null)
    setValue("")
  }

  const getMessages = async () => {
    const options = {
      method: "POST",
      body : JSON.stringify({
          message: value
      }),
      headers: {
        "Content-Type": "application/json"
      }
    }

    try{
      const response = await fetch('https://gptclone.herokuapp.com/completions', options)
      const data = await response.json() 
      setMessage(data.choices[0].message)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    console.log(currentTitle, value, message)
    if (!currentTitle && value && message) {
      setcurrentTitle(value)
    } 
    if (currentTitle && value && message) {
      setPreviousChats(prevChats => (
        [...prevChats, 
        {
            title: currentTitle,
            role: "user",
            content: value
        }, 
        {
          title: currentTitle,
          role: message.role,
          content: message.content
        }
        ]
      ))
    }
  }, [message, currentTitle])

  console.log(previousChats)

  const currentChat = previousChats.filter(previousChat => previousChat.title === currentTitle)
  const uniqueTitles = Array.from(new Set(previousChats.map(previousChat => previousChat.title)))
  console.log(uniqueTitles)


  return (
    <div className="app">
      <section className="side-bar">
        <button onClick={createNewChat}>+ New chat</button>
        <ul className="history">
          {uniqueTitles?.map((uniqueTitle, index) => <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>)}
        </ul> 
        <nav>
          <p>Made By Will</p>
        </nav>
      </section>
      <section className="main">
        {!currentTitle && <h1>WillGPT</h1>}
        <ul className="feed">
          {currentChat.map((chatMessage, index) => <li key={index}>
            <p className="role">{chatMessage.role}</p>
            <p>{chatMessage.content}</p>
          </li>)}
        </ul>
        <div className="bottom-section">
          <div className="input-container">
            <input value={value} onChange={(e) => setValue(e.target.value)}/>
            <div id="submit" onClick={getMessages}>➢</div>
          </div>
          <p className="info">
            WillGPT may produce inaccurate information about people, places, or facts. ChatGPT Mar 23 Version
          </p>
        </div>
      </section>
    </div>
  )
}

export default App
