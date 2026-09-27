import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { getMessages, listConversations, sendMessageHttp } from '../services/conversationService.js'
import '../styles/site.css'

function dedupeAppend(list, message) {
  if (list.some((item) => item.id === message.id)) return list
  return [...list, message]
}

export default function MessagesPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const socket = useSocket()

  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const bodyRef = useRef(null)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [authLoading, user, navigate])

  useEffect(() => {
    if (!user) return
    setConversationsLoading(true)
    listConversations()
      .then((data) => setConversations(data.data || []))
      .catch(() => {})
      .finally(() => setConversationsLoading(false))
  }, [user])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setMessagesLoading(true)
    setError('')
    getMessages(conversationId)
      .then((data) => setMessages(data.data || []))
      .catch((err) => setError(err.message))
      .finally(() => setMessagesLoading(false))
  }, [conversationId])

  useEffect(() => {
    if (!socket || !conversationId) return
    socket.emit('conversation:join', conversationId)
  }, [socket, conversationId])

  useEffect(() => {
    if (!socket) return

    function refreshConversations() {
      listConversations()
        .then((data) => setConversations(data.data || []))
        .catch(() => {})
    }

    function handleNew(message) {
      if (conversationId && String(message.conversation_id) === String(conversationId)) {
        setMessages((prev) => dedupeAppend(prev, message))
      }
      refreshConversations()
    }

    socket.on('message:new', handleNew)
    return () => socket.off('message:new', handleNew)
  }, [socket, conversationId])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [messages])

  async function handleSend(event) {
    event.preventDefault()
    const text = body.trim()
    if (!text || !conversationId) return
    setBody('')
    setError('')
    try {
      if (socket?.connected) {
        socket.emit('message:send', { conversationId, body: text })
      } else {
        const message = await sendMessageHttp(conversationId, text)
        setMessages((prev) => dedupeAppend(prev, message))
      }
    } catch (err) {
      setError(err.message)
    }
  }

  const activeConversation = conversations.find((item) => String(item.id) === String(conversationId))

  if (authLoading || !user) return null

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <div className="messages-layout">
          <aside className="messages-sidebar">
            <h2 className="messages-sidebar-title">Tin nhắn</h2>
            {conversationsLoading && <p className="listing-status">Đang tải...</p>}
            {!conversationsLoading && conversations.length === 0 && (
              <p className="listing-status">Bạn chưa có cuộc trò chuyện nào.</p>
            )}
            <ul className="conversation-list">
              {conversations.map((item) => (
                <li key={item.id}>
                  <Link
                    to={`/tin-nhan/${item.id}`}
                    className={`conversation-item ${String(item.id) === String(conversationId) ? 'active' : ''}`}
                  >
                    <PlaceholderImage
                      src={item.counterpart.avatar}
                      alt={item.counterpart.name}
                      className="conversation-avatar"
                    />
                    <div className="conversation-item-body">
                      <p className="conversation-item-name">{item.counterpart.name}</p>
                      <p className="conversation-item-room">{item.roomTitle}</p>
                      <p className="conversation-item-last">{item.lastMessage || 'Chưa có tin nhắn'}</p>
                    </div>
                    {item.unreadCount > 0 && <span className="conversation-badge">{item.unreadCount}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          <section className="messages-thread">
            {!conversationId && <p className="listing-status">Chọn một cuộc trò chuyện để bắt đầu.</p>}
            {conversationId && (
              <>
                <div className="messages-thread-header">
                  <p className="messages-thread-title">{activeConversation?.counterpart.name || 'Trò chuyện'}</p>
                  {activeConversation?.roomTitle && (
                    <Link to={`/phong-tro/${activeConversation.roomListingId}`} className="messages-thread-room">
                      {activeConversation.roomTitle}
                    </Link>
                  )}
                </div>
                <div className="messages-thread-body" ref={bodyRef}>
                  {messagesLoading && <p className="listing-status">Đang tải tin nhắn...</p>}
                  {!messagesLoading &&
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-bubble ${message.sender_id === user.id ? 'mine' : 'theirs'}`}
                      >
                        {message.body}
                      </div>
                    ))}
                </div>
                {error && <p className="banner banner-error visible">{error}</p>}
                <form className="messages-thread-form" onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                  />
                  <button type="submit" className="btn btn-primary">
                    Gửi
                  </button>
                </form>
              </>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
