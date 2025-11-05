'use client'
import useProject from '@/hooks/use-project'
import React from 'react'
import MeetingCard from '../dashboard/meeting-card'
import { api } from '@/trpc/react'
import Link from 'next/link'
// import DeleteMeetingButton from './delete-meeting-button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import DeleteMeetingButton from './delete-meeting-button'


const MeetingsPage = () => {
    const { project } = useProject()
    const { data: meetings, isLoading } = api.project.getMeetings.useQuery({ projectId: project?.id ?? '' }, {
        refetchInterval: 10000
    })
    return (
        <>
            <MeetingCard />
            <div className="h-6"></div>
            <h1 className="text-xl font-semibold text-gray-800">All Meetings</h1>
            {meetings && meetings.length === 0 && (
                <div className="text-sm text-gray-500">No meetings yet</div>
            )}
            {isLoading && (
                <div className="mt-4">
                    <Loader2 className="animate-spin" />
                </div>
            )}
            <ul role="list" className="divide-y divide-gray-200">
                {meetings?.map((meeting) => (
                    <li
                        key={meeting.id}
                        className="flex items-center justify-between py-5 gap-x-6"
                    >
                        <div className="flex items-center gap-2">
                            
                            <div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-x-3">
                                        <Link
                                            aria-disabled={meeting.status === "PROCESSING"}
                                            href={`/meeting/${meeting.id}`}
                                            className={cn("text-sm font-semibold leading-6 text-white hover:underline", meeting.status === "PROCESSING" && "opacity-50 pointer-events-none cursor-not-allowed")}
                                        >
                                            {meeting.name}
                                        </Link>
                                        {meeting.status === "PROCESSING" && (
                                            <Badge className='bg-yellow-500 text-white'>
                                                Processing <Loader2 className='animate-spin size-3 ml-1' />
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center text-xs leading-5 text-gray-500 gap-x-2">
                                    <p className="whitespace-nowrap">
                                        <time dateTime={meeting.createdAt.toLocaleDateString()}>
                                            {meeting.createdAt.toLocaleDateString()}
                                        </time>
                                    </p>
                                    <p className='truncate'>
                                      {meeting.issues.length} issues
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center flex-none gap-x-4">
                            <Link
                                aria-disabled={meeting.status === "PROCESSING"}
                                href={`/meeting/${meeting.id}`}
                                className={cn("hidden rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:block", meeting.status === "PROCESSING" && "opacity-50 pointer-events-none cursor-not-allowed")}
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