"use client"
import { useEffect } from "react";
import Script from "next/script";

import { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
 
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {

  const router = useRouter()
 
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
 
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
 
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
 
    if (response.ok) {
      router.push('/profile')
    } else {
      // Handle errors
    }
  }

/*
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('token', data.token);
      router.push('/protected')
    } else {
      // Handle errors
    }
  }
*/

  return (
   
    <main className="flex-1 flex items-center justify-center p-6">
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Se connecter</h2>
        <p className="mt-2 text-sm text-gray-600">
          Connectez-vous à la plateforme via le formulaire ci-dessous ou via votre compte Office 365.
        </p>
      </div>
      <form className="mt-8 space-y-6">
        <div className="space-y-4">
          <Input type="email" placeholder="Email" className="bg-gray-800 text-white placeholder-gray-400 border-gray-700" />
          <Input type="password" placeholder="Mot de passe" className="bg-gray-800 text-white placeholder-gray-400 border-gray-700" />
        </div>
        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
          Connectez-vous
        </Button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">— ou connectez-vous avec —</p>
        <Button variant="outline" className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600 text-black">
          Connectez-vous via Office365
        </Button>
      </div>
    </div>
  </main>
  )
}