import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Send, Settings, Trash2, Bot, User } from 'lucide-react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [agentPrompt, setAgentPrompt] = useState('Você é um assistente de IA útil e prestativo.')
  const [showSettings, setShowSettings] = useState(false)
  const [backendUrl, setBackendUrl] = useState('http://localhost:5000')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage = { role: 'user', content: inputMessage }
    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch(`${backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: 'default_user',
          agent_prompt: agentPrompt,
          api_key: apiKey,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const agentMessage = { role: 'assistant', content: data.response }
        setMessages(prev => [...prev, agentMessage])
      } else {
        const errorMessage = { role: 'error', content: `Erro: ${data.error}` }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      const errorMessage = { role: 'error', content: `Erro de conexão: ${error.message}` }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetContext = async () => {
    try {
      await fetch(`${backendUrl}/reset_context`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: 'default_user',
        }),
      })
      setMessages([])
    } catch (error) {
      console.error('Erro ao resetar contexto:', error)
    }
  }

  const handleSaveConfig = async () => {
    try {
      await fetch(`${backendUrl}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: apiKey,
          agent_prompt: agentPrompt,
          user_id: 'default_user',
        }),
      })
      setShowSettings(false)
    } catch (error) {
      console.error('Erro ao salvar configuração:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pt-4">
          <div className="flex items-center gap-3">
            <div className="bg-primary text-primary-foreground p-3 rounded-xl">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Agente de IA Adaptável</h1>
              <p className="text-sm text-muted-foreground">Seu assistente inteligente personalizado</p>
            </div>
          </div>
          <Button
            variant={showSettings ? 'default' : 'outline'}
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="transition-all hover:scale-105"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="mb-4 border-2 animate-in slide-in-from-top duration-300">
            <CardHeader>
              <CardTitle>Configurações</CardTitle>
              <CardDescription>Configure sua chave de API e o prompt do agente</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="backend-url">URL do Backend</Label>
                <Input
                  id="backend-url"
                  type="text"
                  value={backendUrl}
                  onChange={(e) => setBackendUrl(e.target.value)}
                  placeholder="http://localhost:5000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="api-key">Chave da API (OpenAI)</Label>
                <Input
                  id="api-key"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agent-prompt">Prompt do Agente</Label>
                <Textarea
                  id="agent-prompt"
                  value={agentPrompt}
                  onChange={(e) => setAgentPrompt(e.target.value)}
                  placeholder="Você é um assistente de IA..."
                  rows={4}
                />
              </div>
              <Button onClick={handleSaveConfig} className="w-full">
                Salvar Configurações
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col overflow-hidden border-2">
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center">
                <div className="space-y-3">
                  <Bot className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium text-muted-foreground">
                    Comece uma conversa com seu agente de IA
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Configure a chave da API nas configurações para começar
                  </p>
                </div>
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  } animate-in slide-in-from-bottom duration-300`}
                >
                  {msg.role === 'assistant' && (
                    <div className="bg-primary text-primary-foreground p-2 rounded-lg h-fit">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : msg.role === 'error'
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && (
                    <div className="bg-secondary text-secondary-foreground p-2 rounded-lg h-fit">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-in slide-in-from-bottom duration-300">
                <div className="bg-primary text-primary-foreground p-2 rounded-lg h-fit">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="bg-muted p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t bg-card">
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  disabled={isLoading}
                  className="resize-none"
                />
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
                className="transition-all hover:scale-105"
              >
                <Send className="w-5 h-5" />
              </Button>
              <Button
                onClick={handleResetContext}
                variant="outline"
                size="icon"
                className="transition-all hover:scale-105"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default App

