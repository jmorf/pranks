'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { LogIn, UserPlus, Loader2 } from 'lucide-react'
import { signIn, signUp } from '@/lib/authClient'

interface AuthModalProps {
  trigger?: React.ReactNode
  defaultMode?: 'signin' | 'signup'
  onSuccess?: () => void
}

export function AuthModal({ trigger, defaultMode = 'signin', onSuccess }: AuthModalProps) {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setConfirmPassword('')
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (mode === 'signup') {
        if (password !== confirmPassword) {
          setError('Passwords do not match')
          setLoading(false)
          return
        }
        
        if (password.length < 8) {
          setError('Password must be at least 8 characters')
          setLoading(false)
          return
        }

        // Create account with Better Auth
        const result = await signUp.email({
          email,
          password,
          name,
        })

        if (result.error) {
          throw new Error(result.error.message || 'Failed to create account')
        }

        // Success - account created and signed in
        setOpen(false)
        resetForm()
        onSuccess?.()
        window.location.reload()
      } else {
        // Sign in with Better Auth
        const result = await signIn.email({
          email,
          password,
        })

        if (result.error) {
          throw new Error(result.error.message || 'Invalid email or password')
        }

        // Success
        setOpen(false)
        resetForm()
        onSuccess?.()
        window.location.reload()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 font-bold">
            <LogIn className="h-4 w-4" />
            <span className="hidden sm:inline">Sign In</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black text-center">
            {mode === 'signin' ? 'Welcome Back!' : 'Join PRANKS.com'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === 'signin' 
              ? 'Sign in to like videos and leave comments' 
              : 'Create an account to join the fun'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          )}
          
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full font-bold" 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === 'signin' ? (
              <>
                <LogIn className="h-4 w-4 mr-2" />
                Sign In
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                Create Account
              </>
            )}
          </Button>
        </form>
        
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === 'signin' ? (
            <>
              Don&apos;t have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-primary hover:underline"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button
                type="button"
                onClick={switchMode}
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
