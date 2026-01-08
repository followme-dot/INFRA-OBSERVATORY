'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  User,
  Users,
  Phone,
  Mail,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Settings,
  Bell,
  AlertCircle,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PLATFORMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

// Mock on-call schedules
const generateSchedules = () => {
  const teams = [
    { name: 'Platform SRE', color: '#00d4ff', platforms: ['infrabank', 'infrapay'] },
    { name: 'Infrastructure', color: '#7c3aed', platforms: ['infravault', 'infradigital'] },
    { name: 'Security', color: '#ef4444', platforms: ['infracoinn', 'infrainsurance'] },
    { name: 'DevOps', color: '#10b981', platforms: ['infradevtech', 'infraforge', 'infraschool'] },
  ];

  const members = [
    { name: 'Maria Garcia', email: 'maria.garcia@infra.com', phone: '+1 555-0101', avatar: 'MG' },
    { name: 'Carlos Lopez', email: 'carlos.lopez@infra.com', phone: '+1 555-0102', avatar: 'CL' },
    { name: 'Ana Martinez', email: 'ana.martinez@infra.com', phone: '+1 555-0103', avatar: 'AM' },
    { name: 'Pedro Sanchez', email: 'pedro.sanchez@infra.com', phone: '+1 555-0104', avatar: 'PS' },
    { name: 'Laura Rodriguez', email: 'laura.rodriguez@infra.com', phone: '+1 555-0105', avatar: 'LR' },
    { name: 'Miguel Torres', email: 'miguel.torres@infra.com', phone: '+1 555-0106', avatar: 'MT' },
  ];

  return teams.map((team, teamIndex) => ({
    id: `schedule-${teamIndex}`,
    team: team.name,
    color: team.color,
    platforms: team.platforms,
    currentOnCall: members[teamIndex % members.length],
    nextOnCall: members[(teamIndex + 1) % members.length],
    shiftStart: new Date(Date.now() - Math.random() * 12 * 3600000).toISOString(),
    shiftEnd: new Date(Date.now() + (24 - Math.random() * 12) * 3600000).toISOString(),
    rotation: '1 week',
    escalationPolicy: [
      { level: 1, delay: 5, target: members[teamIndex % members.length] },
      { level: 2, delay: 15, target: members[(teamIndex + 1) % members.length] },
      { level: 3, delay: 30, target: { name: 'Team Lead', email: 'lead@infra.com' } },
    ],
  }));
};

// Generate calendar data for the week
const generateWeekSchedule = () => {
  const days = [];
  const members = ['MG', 'CL', 'AM', 'PS', 'LR', 'MT'];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    days.push({
      date: date.toISOString(),
      dayName: date.toLocaleDateString('es-ES', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: i === 0,
      onCall: members[i % members.length],
    });
  }
  return days;
};

export default function OnCallPage() {
  const [schedules] = useState(() => generateSchedules());
  const [weekSchedule] = useState(() => generateWeekSchedule());
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  const filteredSchedules =
    selectedTeam === 'all'
      ? schedules
      : schedules.filter((s) => s.team === selectedTeam);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/alerts">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary">On-Call Schedule</h1>
            <p className="text-text-secondary mt-1">
              Manage on-call rotations and escalation policies
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Manage Policies
          </Button>
          <Button variant="primary" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule
          </Button>
        </div>
      </div>

      {/* Current On-Call Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {schedules.map((schedule) => (
          <Card key={schedule.id} padding="md" className="border-t-4" style={{ borderTopColor: schedule.color }}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-xs text-text-muted">Currently On-Call</p>
                <p className="font-semibold text-text-primary">{schedule.team}</p>
              </div>
              <Badge variant="success" size="sm">Active</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                style={{ backgroundColor: schedule.color }}
              >
                {schedule.currentOnCall.avatar}
              </div>
              <div>
                <p className="font-medium text-text-primary">{schedule.currentOnCall.name}</p>
                <p className="text-xs text-text-muted">
                  Until {new Date(schedule.shiftEnd).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Week View */}
      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">This Week</h3>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-text-secondary">
              {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
            </span>
            <Button variant="ghost" size="sm">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {weekSchedule.map((day) => (
            <div
              key={day.date}
              className={cn(
                'p-3 rounded-lg border text-center transition-colors',
                day.isToday
                  ? 'border-accent-primary bg-accent-primary/5'
                  : 'border-glass-border hover:border-accent-primary/50'
              )}
            >
              <p className="text-xs text-text-muted uppercase">{day.dayName}</p>
              <p className={cn(
                'text-lg font-bold',
                day.isToday ? 'text-accent-primary' : 'text-text-primary'
              )}>
                {day.dayNumber}
              </p>
              <div
                className="w-8 h-8 rounded-full mx-auto mt-2 flex items-center justify-center text-xs font-bold text-white bg-accent-secondary"
              >
                {day.onCall}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Team Filter */}
      <Card padding="md">
        <div className="flex items-center gap-4 mb-4">
          <h3 className="text-lg font-semibold text-text-primary">Team Schedules</h3>
          <select
            className="bg-glass-bg border border-glass-border rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-primary"
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
          >
            <option value="all">All Teams</option>
            {schedules.map((s) => (
              <option key={s.id} value={s.team}>
                {s.team}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-4">
          {filteredSchedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="border border-glass-border rounded-lg overflow-hidden">
                {/* Team Header */}
                <div
                  className="p-4 flex items-center justify-between"
                  style={{ backgroundColor: `${schedule.color}10` }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: schedule.color }}
                    />
                    <div>
                      <h4 className="font-semibold text-text-primary">{schedule.team}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {schedule.platforms.map((platformCode) => {
                          const platform = PLATFORMS.find((p) => p.code === platformCode);
                          return platform ? (
                            <Badge
                              key={platformCode}
                              size="sm"
                              style={{ backgroundColor: `${platform.color}20`, color: platform.color }}
                            >
                              {platform.name.replace('INFRA', '').trim()}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" size="sm">
                      <Clock className="h-3 w-3 mr-1" />
                      {schedule.rotation}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Current & Next On-Call */}
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4 p-3 bg-glass-bg rounded-lg">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
                      style={{ backgroundColor: schedule.color }}
                    >
                      {schedule.currentOnCall.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-muted">Current On-Call</p>
                      <p className="font-semibold text-text-primary">{schedule.currentOnCall.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          {schedule.currentOnCall.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {schedule.currentOnCall.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-glass-bg/50 rounded-lg">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white bg-gray-500">
                      {schedule.nextOnCall.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-text-muted">Next On-Call</p>
                      <p className="font-semibold text-text-primary">{schedule.nextOnCall.name}</p>
                      <p className="text-xs text-text-muted mt-1">
                        Starts {new Date(schedule.shiftEnd).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Escalation Policy */}
                <div className="px-4 pb-4">
                  <p className="text-xs text-text-muted mb-2">Escalation Policy</p>
                  <div className="flex items-center gap-2">
                    {schedule.escalationPolicy.map((level, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-glass-bg rounded-lg">
                          <Badge variant={i === 0 ? 'danger' : i === 1 ? 'warning' : 'default'} size="sm">
                            L{level.level}
                          </Badge>
                          <span className="text-xs text-text-secondary">{level.target.name}</span>
                          <span className="text-xs text-text-muted">({level.delay}m)</span>
                        </div>
                        {i < schedule.escalationPolicy.length - 1 && (
                          <ChevronRight className="h-4 w-4 text-text-muted" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
