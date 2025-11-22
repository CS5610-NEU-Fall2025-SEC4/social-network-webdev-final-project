'use client'
import React, { Suspense } from 'react'

export default function CommentLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading comment section...</div>}>{children}</Suspense>
}
