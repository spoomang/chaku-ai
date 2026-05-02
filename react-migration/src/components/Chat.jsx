import { useState, useEffect, useRef } from 'react'
import { getMessages, sendMessage } from '../services/api'

export default function Chat({ eventId, groupId, userId, userName, token }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const offsetRef = useRef(0)
  const scrollRef = useRef(null)
  const isSendingRef = useRef(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isSendingRef.current) return
      const res = await getMessages(eventId, offsetRef.current, token)
      if (Array.isArray(res) && res.length > 0) {
        offsetRef.current += res.length
        setMessages(prev => [...prev, ...res])
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [eventId, token])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  async function handleSend() {
    if (!input.trim()) return
    isSendingRef.current = true
    const content = input
    setInput('')
    await sendMessage({ eventId, groupId, memberId: userId, name: userName, content }, token)
    const newMsg = { content, name: userName, createTime: Date.now() }
    setMessages(prev => [...prev, newMsg])
    offsetRef.current += 1
    isSendingRef.current = false
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div id="chat">
      <div className="scroll" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`container${i % 2 === 0 ? '' : ' darker'}`}>
            <p>{m.name} :: {m.content}</p>
            <span className={i % 2 === 0 ? 'time-left' : 'time-right'}>{m.createTime}</span>
          </div>
        ))}
      </div>
      <div className="chat-input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
        />
        <button className="btn btn-primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  )
}
