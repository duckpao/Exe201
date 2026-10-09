import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import SiteHeader from '../components/site/SiteHeader.jsx'
import SiteFooter from '../components/site/SiteFooter.jsx'
import PlaceholderImage from '../components/site/PlaceholderImage.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useSocket } from '../context/SocketContext.jsx'
import { getAiStatus, getMessages, listConversations, sendAiMessage, sendMessageHttp } from '../services/conversationService.js'
import { useToast } from '../context/ToastContext.jsx'
import { Bot, ChevronLeft, MessageCircle } from 'lucide-react'
import '../styles/site.css'

function dedupeAppend(list, message) {
  if (list.some((item) => item.id === message.id)) return list
  return [...list, message]
}

function MessageText({ text }) {
  const parts = String(text || '').split(/(\/phong-tro\/\d+)/g)
  return (
    <span className="message-text">
      {parts.map((part, index) => part.match(/^\/phong-tro\/\d+$/)
        ? <Link key={`${part}-${index}`} to={part} className="message-listing-link">Xem phòng #{part.split('/').pop()}</Link>
        : <span key={`${index}-${part.slice(0, 12)}`}>{part}</span>)}
    </span>
  )
}

export default function MessagesPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const socket = useSocket()
  const toast = useToast()

  const [conversations, setConversations] = useState([])
  const [conversationsLoading, setConversationsLoading] = useState(true)
  const [messages, setMessages] = useState([])
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [body, setBody] = useState('')
  const [chatMode, setChatMode] = useState('owner')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiStatus, setAiStatus] = useState({ available: false, loading: true, model: null })
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
    if (!user) return
    getAiStatus()
      .then((status) => setAiStatus({ ...status, loading: false }))
      .catch(() => setAiStatus({ available: false, loading: false, model: null }))
  }, [user])

  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      return
    }
    setMessagesLoading(true)
    getMessages(conversationId)
      .then((data) => setMessages(data.data || []))
      .catch((err) => toast.error(err.message))
      .finally(() => setMessagesLoading(false))
  }, [conversationId, toast])

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

    function handleMessageError(payload) {
      toast.error(payload?.message || 'Không thể gửi tin nhắn')
    }

    socket.on('message:new', handleNew)
    socket.on('message:error', handleMessageError)
    return () => {
      socket.off('message:new', handleNew)
      socket.off('message:error', handleMessageError)
    }
  }, [socket, conversationId, toast])

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [messages])

  async function handleSend(event) {
    event.preventDefault()
    const text = body.trim()
    if (!text || !conversationId) return
    setBody('')
    try {
      if (chatMode === 'ai') {
        setAiLoading(true)
        const result = await sendAiMessage(conversationId, text)
        setMessages((prev) => dedupeAppend(dedupeAppend(prev, result.question), result.answer))
      } else if (socket?.connected) {
        socket.emit('message:send', { conversationId, body: text })
      } else {
        const message = await sendMessageHttp(conversationId, text)
        setMessages((prev) => dedupeAppend(prev, message))
      }
    } catch (err) {
      setBody(text)
      toast.error(err.message)
    } finally {
      setAiLoading(false)
    }
  }

  const activeConversation = conversations.find((item) => String(item.id) === String(conversationId))

  if (authLoading || !user) return null

  return (
    <div className="site-page">
      <SiteHeader />
      <main className="site-main">
        <div className={`messages-layout ${conversationId ? 'has-active-conversation' : ''}`}>
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
                      <p className="conversation-item-room">{item.listingTitle}</p>
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
                  <div>
                    <Link to="/tin-nhan" className="messages-mobile-back" aria-label="Quay lại danh sách trò chuyện">
                      <ChevronLeft size={18} /> Tin nhắn
                    </Link>
                    <p className="messages-thread-title">{activeConversation?.counterpart.name || 'Trò chuyện'}</p>
                    {activeConversation?.listingUrl && (
                      <Link to={activeConversation.listingUrl} className="messages-thread-room">
                        {activeConversation.listingTitle}
                      </Link>
                    )}
                    {activeConversation && !activeConversation.listingUrl && (
                      <span className="messages-thread-room">{activeConversation.listingTitle}</span>
                    )}
                  </div>
                  <div className="chat-mode-switch" aria-label="Chọn người nhận tin nhắn">
                    <button type="button" className={chatMode === 'owner' ? 'active' : ''} onClick={() => setChatMode('owner')}>
                      <MessageCircle size={16} /> Nhắn chủ bài
                    </button>
                    <button
                      type="button"
                      className={chatMode === 'ai' ? 'active ai' : ''}
                      onClick={() => setChatMode('ai')}
                      disabled={!aiStatus.available}
                      title={!aiStatus.available ? 'Trợ lý AI chưa được cấu hình' : `Đang dùng ${aiStatus.model}`}
                    >
                      <Bot size={16} /> Hỏi AI
                    </button>
                  </div>
                </div>
                {chatMode === 'ai' && (
                  <div className="ai-chat-notice">
                    <Bot size={18} />
                    <span>AI đọc thông tin bài đăng và có thể gợi ý tối đa 5 phòng tương tự từ dữ liệu hệ thống. Hãy xác nhận thông tin quan trọng với chủ bài.</span>
                  </div>
                )}
                {!aiStatus.loading && !aiStatus.available && (
                  <div className="ai-chat-notice ai-chat-unavailable">
                    <Bot size={18} />
                    <span>Trợ lý AI tạm thời chưa sẵn sàng. Bạn vẫn có thể nhắn trực tiếp cho chủ bài.</span>
                  </div>
                )}
                <div className="messages-thread-body" ref={bodyRef}>
                  {messagesLoading && <p className="listing-status">Đang tải tin nhắn...</p>}
                  {!messagesLoading &&
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`message-bubble ${message.sender_type === 'ai' ? 'ai' : message.sender_id === user.id ? 'mine' : 'theirs'} ${message.message_kind === 'ai_question' ? 'ai-question' : ''}`}
                      >
                        {message.sender_type === 'ai' && <span className="message-ai-label"><Bot size={14} /> Trợ lý AI</span>}
                        {message.message_kind === 'ai_question' && <span className="message-ai-label"><Bot size={14} /> Câu hỏi cho AI</span>}
                        <MessageText text={message.body} />
                      </div>
                    ))}
                </div>
                <form className="messages-thread-form" onSubmit={handleSend}>
                  <input
                    type="text"
                    placeholder={chatMode === 'ai' ? 'Hỏi AI về giá, tiện ích hoặc phòng tương tự...' : 'Nhập tin nhắn cho chủ bài...'}
                    value={body}
                    onChange={(event) => setBody(event.target.value)}
                  />
                  <button type="submit" className="btn btn-primary" disabled={aiLoading}>
                    {aiLoading ? 'AI đang trả lời...' : chatMode === 'ai' ? 'Hỏi AI' : 'Gửi'}
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
