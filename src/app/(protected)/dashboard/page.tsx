"use client"
import useProject from '@/hooks/use-project'
import { useUser } from '@clerk/nextjs'
import React from 'react'

const Dashboard = () => {
    const {project} = useProject()
  return (
    <h1>
      {project?.name}
    </h1>
  )
}

export default Dashboard
