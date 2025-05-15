"use client"

import { useState, useEffect } from "react"
import { Search, Trophy } from "lucide-react"
import { getAllMatchSummary, getUsers } from "@/lib/firebase/api"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Pagination } from "@/components/ui/pagination"
import { BaseLayout } from "@/components/layout/base-layout"

interface MatchDataRaw {
  matchId: string
  matchName: string
  startDateTime: { toDate: () => Date } | any
  endDateTime: { toDate: () => Date } | any
  streamer1: string
  streamer2: string
  marketStatus?: string
}
interface MatchNormalized {
  matchId: string
  matchName: string
  startDateTime: Date
  endDateTime: Date
  streamer1: string
  streamer2: string
  marketStatus: string
}
interface UserData {
  userId: string
  points?: number
}

export default function MatchesPage() {
  const [activeTab, setActiveTab] = useState<'ongoing' | 'upcoming'>('ongoing')
  const [matches, setMatches] = useState<MatchNormalized[]>([])
  const [leaderboard, setLeaderboard] = useState<UserData[]>([])
  const [search, setSearch] = useState<string>('')
  const [loadingMatches, setLoadingMatches] = useState(true)
  const [loadingLeaderboard, setLoadingLeaderboard] = useState(true)
  const itemsPerPage = 20
  const [ongoingPage, setOngoingPage] = useState(1)
  const [upcomingPage, setUpcomingPage] = useState(1)

  // Load matches
  useEffect(() => {
    const fetchMatches = async () => {
      setLoadingMatches(true)
      try {
        const raw: MatchDataRaw[] = await getAllMatchSummary()
        const normalized = raw.map(m => ({
          matchId: m.matchId,
          matchName: m.matchName,
          startDateTime: m.startDateTime?.toDate ? m.startDateTime.toDate() : new Date(m.startDateTime),
          endDateTime: m.endDateTime?.toDate ? m.endDateTime.toDate() : new Date(m.endDateTime),
          streamer1: m.streamer1,
          streamer2: m.streamer2,
          marketStatus: m.marketStatus ?? 'Unknown',
        }))
        setMatches(normalized)
      } catch {
        setMatches([])
      } finally {
        setLoadingMatches(false)
      }
    }
    fetchMatches()
  }, [])

  // Load leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoadingLeaderboard(true)
      try {
        const rawUsers = await getUsers()
        const users = rawUsers.map((u: any) => ({
          userId: u.userId || u.id || 'Unknown',
          points: u.points || 0,
        })) as UserData[]
        users.sort((a, b) => (b.points || 0) - (a.points || 0))
        setLeaderboard(users.slice(0, 10))
      } catch {
        setLeaderboard([])
      } finally {
        setLoadingLeaderboard(false)
      }
    }
    fetchLeaderboard()
  }, [])

  // Filter and paginate
  const now = new Date()
  const ongoingAll = matches.filter(m => m.startDateTime <= now && m.endDateTime >= now)
  const upcomingAll = matches.filter(m => m.startDateTime > now)
  const ongoingFiltered = ongoingAll.filter(m => m.matchName.toLowerCase().includes(search.toLowerCase()))
  const upcomingFiltered = upcomingAll.filter(m => m.matchName.toLowerCase().includes(search.toLowerCase()))
  const ongoingPaged = ongoingFiltered.slice((ongoingPage - 1) * itemsPerPage, ongoingPage * itemsPerPage)
  const upcomingPaged = upcomingFiltered.slice((upcomingPage - 1) * itemsPerPage, upcomingPage * itemsPerPage)

  return (
    <BaseLayout>
      <main className="max-w-[1200px] mx-auto px-4 py-8 md:flex md:space-x-8">
        {/* Matches Section */}
        <div className="md:w-2/3">
          <Tabs value={activeTab} onValueChange={value => {
            setActiveTab(value as any)
            if (value === 'ongoing') setOngoingPage(1)
            else setUpcomingPage(1)
          }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <TabsList className="bg-[#09090b]/80 rounded-full p-1 border border-[#27272a]">
                <TabsTrigger value="ongoing" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-[#a1a1aa]">
                  Ongoing
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#27272a] data-[state=active]:text-white text-[#a1a1aa]">
                  Upcoming
                </TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a1a1aa] w-4 h-4" />
                <Input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search matches..."
                  className="pl-10 bg-[#09090b]/80 text-white border-[#27272a]"
                />
              </div>
            </div>

            {/* Ongoing Tab */}
            <TabsContent value="ongoing">
              {loadingMatches ? (
                <div className="grid grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm animate-pulse">
                      <CardHeader>
                        <Skeleton className="h-5 w-1/2 bg-[#27272a]" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full bg-[#27272a] mb-2" />
                        <Skeleton className="h-4 w-3/4 bg-[#27272a] mb-2" />
                        <Skeleton className="h-8 w-full bg-[#27272a]" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : ongoingFiltered.length ? (
                <>
                  <ScrollArea className="h-[600px]">
                    <div className="grid grid-cols-2 gap-6 p-2">
                      {ongoingPaged.map(m => {
                        const timeLeft = Math.max(0, Math.ceil((m.endDateTime.getTime() - now.getTime()) / 60000))
                        return (
                          <Card key={m.matchId} className="bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm">
                            <CardHeader className="flex justify-between items-center">
                              <div>
                                <CardTitle className="text-2xl font-semibold text-white text-left">ID: {m.matchId}</CardTitle>
                                <div className="text-sm text-white font-semibold">{m.matchName}</div>
                              </div>
                              <Badge variant="outline" className="border-red-500 text-red-500">
                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse inline-block mr-1" />Live
                              </Badge>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="text-[#a1a1aa] text-left text-sm">{m.streamer1} vs {m.streamer2}</div>
                              <div className="text-[#a1a1aa] text-left text-xs">Market: {m.marketStatus} · Closes in {timeLeft} m</div>
                              <Button className="w-full bg-white text-black hover:bg-white/90 px-6 py-2 rounded-md">Predict</Button>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>
                  </ScrollArea>
                  {ongoingFiltered.length > itemsPerPage && (
                    <Pagination
                      total={ongoingFiltered.length}
                      pageSize={itemsPerPage}
                      currentPage={ongoingPage}
                      onPageChange={setOngoingPage}
                      className="mt-2"
                    />
                  )}
                </>
              ) : (
                <div className="text-white">No ongoing matches.</div>
              )}
            </TabsContent>

            {/* Upcoming Tab */}
            <TabsContent value="upcoming">
              {loadingMatches ? (
                <div className="grid grid-cols-2 gap-6">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Card key={i} className="bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm animate-pulse">
                      <CardHeader>
                        <Skeleton className="h-5 w-1/2 bg-[#27272a]" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full bg-[#27272a] mb-2" />
                        <Skeleton className="h-4 w-3/4 bg-[#27272a] mb-2" />
                        <Skeleton className="h-8 w-full bg-[#27272a]" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : upcomingFiltered.length ? (
                <>
                  <ScrollArea className="h-[600px]">
                    <div className="grid grid-cols-2 gap-6 p-2">
                      {upcomingPaged.map(m => (
                        <Card key={m.matchId} className="bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm">
                          <CardHeader className="flex justify-between items-center">
                            <div>
                              <CardTitle>ID: {m.matchId}</CardTitle>
                              <div className="text-sm text-white font-semibold">{m.matchName}</div>
                            </div>
                            <Badge variant="outline" className="bg-yellow-900/50 text-yellow-500">
                              Upcoming
                            </Badge>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <div className="text-sm text-gray-400">{m.streamer1} vs {m.streamer2}</div>
                            <div className="text-xs text-gray-400">Market: {m.marketStatus}</div>
                            <Button className="w-full border border-gray-600 text-white hover:bg-gray-700">Details</Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                  {upcomingFiltered.length > itemsPerPage && (
                    <Pagination
                      total={upcomingFiltered.length}
                      pageSize={itemsPerPage}
                      currentPage={upcomingPage}
                      onPageChange={setUpcomingPage}
                      className="mt-2"
                    />
                  )}
                </>
              ) : (
                <div className="text-white">No upcoming matches.</div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Leaderboard Section */}
        <div className="md:w-1/3 space-y-4">
          <h2 className="flex items-center text-2xl font-semibold text-white gap-2">
            <Trophy className="text-yellow-500" /> Top Streamers
          </h2>
          {loadingLeaderboard ? (
            <Card className="bg-[#09090b]/80 animate-pulse">
              <CardContent className="space-y-2">
                <Skeleton className="h-4 w-3/4 bg-[#27272a]" />
                <Skeleton className="h-4 w-2/3 bg-[#27272a]" />
                <Skeleton className="h-4 w-1/2 bg-[#27272a]" />
              </CardContent>
            </Card>
          ) : leaderboard.length ? (
            <Card className="bg-[#09090b]/80 border-[#27272a] backdrop-blur-sm">
              <CardContent>
                <ol className="list-decimal list-inside space-y-2">
                  {leaderboard.map((u, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span className="text-white">{u.userId}</span>
                      <span className="text-green-500">+{u.points}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ) : (
            <div className="text-white">No top streamers to show.</div>
          )}
        </div>
      </main>
    </BaseLayout>
  )
}
