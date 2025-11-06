'use client'

import useProject from '@/hooks/use-project'
import React from 'react'
import MeetingCard from '../dashboard/meeting-card'
import { api } from '@/trpc/react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import DeleteMeetingButton from './delete-meeting-button'

const MeetingsPage = () => {
  const { project } = useProject()
  const { data: meetings, isLoading } = api.project.getMeetings.useQuery(
    { projectId: project?.id ?? '' },
    { refetchInterval: 10000 }
  )

  return (
    <>
      <MeetingCard />
      <div className="h-6"></div>

      <h1 className="text-xl font-semibold text-gray-100">All Meetings</h1>

      {meetings && meetings.length === 0 && (
        <div className="text-sm text-gray-400 mt-2">No meetings yet</div>
      )}

      {isLoading && (
        <div className="mt-4 flex justify-center">
          <Loader2 className="animate-spin text-gray-400" />
        </div>
      )}

      <ul role="list" className="mt-4 space-y-4">
        {meetings?.map((meeting) => (
          <li
            key={meeting.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-3 gap-x-6 rounded-xl border border-gray-800 bg-gray-800/60 p-5 hover:bg-gray-800/80 transition-colors shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div>
                <div className="flex items-center gap-x-3">
                  <Link
                    aria-disabled={meeting.status === 'PROCESSING'}
                    href={`/meeting/${meeting.id}`}
                    className={cn(
                      'text-base font-medium text-gray-100 hover:text-white hover:underline transition-colors',
                      meeting.status === 'PROCESSING' &&
                        'opacity-50 pointer-events-none cursor-not-allowed'
                    )}
                  >
                    {meeting.name}
                  </Link>
                  {meeting.status === 'PROCESSING' && (
                    <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-600 flex items-center gap-1">
                      Processing
                      <Loader2 className="animate-spin size-3" />
                    </Badge>
                  )}
                </div>

                <div className="flex items-center text-xs text-gray-400 gap-x-2 mt-1">
                  <p className="whitespace-nowrap">
                    <time dateTime={meeting.createdAt.toLocaleDateString()}>
                      {meeting.createdAt.toLocaleDateString()}
                    </time>
                  </p>
                  <p className="truncate">{meeting.issues.length} issues</p>
                </div>
              </div>
            </div>

            <div className="flex items-center flex-none gap-x-4">
              <Link
                aria-disabled={meeting.status === 'PROCESSING'}
                href={`/meetings/${meeting.id}`}
                className={cn(
                  'hidden rounded-md bg-gray-700 px-3 py-1.5 text-sm font-semibold text-gray-100 shadow-sm hover:bg-gray-600 sm:block transition-colors',
                  meeting.status === 'PROCESSING' &&
                    'opacity-50 pointer-events-none cursor-not-allowed'
                )}
              >
                View meeting
              </Link>
              <DeleteMeetingButton meetingId={meeting.id} />
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

export default MeetingsPage
