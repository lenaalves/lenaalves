import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import Dashboard from './pages/Dashboard'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')

    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password })

    if (error) setError(error.message)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          {isLogin ? 'Entrar' : 'Criar conta'}
        </h1>
        <p className="text-gray-500 mb-6 text-sm">
          {isLogin ? 'Bem-vinda de volta!' : 'Crie sua conta gratuitamente'}
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-violet-500 hover:bg-violet-600 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Cadastrar'}
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-violet-500 font-semibold hover:underline"
          >
            {isLogin ? 'Cadastre-se' : 'Entre aqui'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (!session) return <Auth />

  return <Dashboard userEmail={session.user.email!} />
}