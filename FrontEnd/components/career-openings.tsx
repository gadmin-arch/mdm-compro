"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowUpRight, Briefcase, CalendarDays, CheckCircle2, Clock, MapPin, XCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Career } from "@/lib/cms"
import { employmentTypeLabel, fallbackCareers, formatDate, isCareerClosed } from "@/lib/cms"
import { container } from "@/lib/layout"
import { cn } from "@/lib/utils"

export function CareerOpenings({ jobs = fallbackCareers.data }: { jobs?: Career[] }) {
  const [statusFilter, setStatusFilter] = useState<"all" | "open" | "closed">("all")

  const openJobs = jobs.filter((j) => !isCareerClosed(j))
  const closedJobs = jobs.filter((j) => isCareerClosed(j))

  const displayedJobs =
    statusFilter === "open" ? openJobs : statusFilter === "closed" ? closedJobs : jobs

  return (
    <section className="border-b border-border/60 bg-secondary/40">
      <div className={container("py-20")}>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Career Opportunities
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground text-balance sm:text-4xl">
              Find your next role.
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            We&apos;re hiring across engineering, operations, and project management. Explore our
            currently open vacancies and past project openings.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-border/70 pb-4">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
              statusFilter === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
            )}
          >
            All Roles
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                statusFilter === "all"
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {jobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("open")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
              statusFilter === "open"
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
            )}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Open Positions
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                statusFilter === "open"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              )}
            >
              {openJobs.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setStatusFilter("closed")}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer",
              statusFilter === "closed"
                ? "bg-muted-foreground text-background shadow-xs"
                : "bg-card text-muted-foreground hover:bg-secondary hover:text-foreground border border-border"
            )}
          >
            <XCircle className="h-3.5 w-3.5" />
            Closed Positions
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                statusFilter === "closed"
                  ? "bg-background/20 text-background"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {closedJobs.length}
            </span>
          </button>
        </div>

        {/* Jobs list */}
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
          {displayedJobs.length === 0 ? (
            <li className="p-12 text-center text-sm text-muted-foreground">
              {statusFilter === "closed"
                ? "No closed job positions found."
                : statusFilter === "open"
                  ? "There are currently no active openings in this category. Check back soon or send us your CV!"
                  : "No roles matched your search or filters. Check back soon or send us your CV."}
            </li>
          ) : (
            displayedJobs.map((job) => {
              const closed = isCareerClosed(job)
              return (
                <li key={job.slug} className="group">
                  <Link
                    href={`/career/${job.slug}`}
                    className="grid gap-4 p-5 transition-colors hover:bg-secondary/50 sm:p-6 lg:grid-cols-12 lg:items-center lg:gap-6"
                  >
                    <div className="lg:col-span-5">
                      <div className="flex flex-wrap items-center gap-2">
                        {closed ? (
                          <Badge
                            variant="outline"
                            className="border-rose-500/40 bg-rose-500/10 text-rose-700 dark:text-rose-400 font-semibold"
                          >
                            <XCircle className="mr-1 h-3 w-3 text-rose-600 dark:text-rose-400" />
                            Closed
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                          >
                            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Open
                          </Badge>
                        )}
                        <Badge variant="outline">{job.department}</Badge>
                        <Badge
                          variant="secondary"
                          className="bg-accent/25 text-foreground hover:bg-accent/25"
                        >
                          {employmentTypeLabel(job.employmentType)}
                        </Badge>
                      </div>
                      <h3
                        className={cn(
                          "mt-2 font-display text-lg font-semibold leading-snug text-foreground",
                          closed && "text-foreground/80"
                        )}
                      >
                        {job.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                        {job.summary}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground sm:grid-cols-3 lg:col-span-6 lg:grid-cols-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                            Location
                          </p>
                          <p className="font-medium text-foreground">{job.location}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Briefcase className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                            Type
                          </p>
                          <p className="font-medium text-foreground">
                            {employmentTypeLabel(job.employmentType)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/70" />
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
                            Deadline
                          </p>
                          <p
                            className={cn(
                              "font-medium text-foreground",
                              closed && "text-rose-600 dark:text-rose-400 font-semibold"
                            )}
                          >
                            {formatDate(job.deadline ?? job.publishedAt)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-start lg:col-span-1 lg:justify-end">
                      {closed ? (
                        <span className="inline-flex items-center rounded-md bg-secondary px-3 py-1.5 text-xs font-semibold text-muted-foreground border border-border">
                          Closed
                        </span>
                      ) : (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="pointer-events-none w-fit"
                          tabIndex={-1}
                        >
                          <span>
                            Apply
                            <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        </Button>
                      )}
                    </div>
                  </Link>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </section>
  )
}
