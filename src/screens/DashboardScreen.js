import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';
import { jobs, craftsmanBuilds, STATUS } from '../data/mockData';
import JobCard from '../components/JobCard';

function StatCard({ num, label, numColor }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNum, numColor && { color: numColor }]}>{num}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function FlagCard({ note, jobName }) {
  return (
    <View style={styles.flagCard}>
      <View style={styles.flagDot} />
      <View style={{ flex: 1 }}>
        <Text style={styles.flagText}>{note}</Text>
        <Text style={styles.flagJob}>{jobName}</Text>
      </View>
    </View>
  );
}

export default function DashboardScreen() {
  const activeJobs = jobs.filter(j => j.status !== STATUS.DONE);
  const flaggedJobs = jobs.filter(j => j.flagged);
  const blockedJobs = jobs.filter(j => j.status === STATUS.BLOCKED);
  const dueToday = jobs.filter(j => j.dueDate === 'Apr 7');

  const allFlags = [
    ...flaggedJobs.map(j => ({ note: j.flagNote, label: `${j.name} · ${j.stageIndex}` })),
    ...craftsmanBuilds.filter(b => b.flagged).map(b => ({ note: b.flagNote, label: b.name })),
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.logo}>Bench<Text style={styles.logoAccent}>Mark</Text></Text>
        <Text style={styles.sub}>europa cabinets · shop floor</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Stats row */}
        <View style={styles.statRow}>
          <StatCard num={activeJobs.length} label="active" />
          <StatCard num={allFlags.length} label="flagged" numColor={colors.amber} />
          <StatCard num={blockedJobs.length} label="blocked" numColor={colors.red} />
        </View>

        {/* Flags */}
        {allFlags.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Active Flags</Text>
            {allFlags.map((f, i) => (
              <FlagCard key={i} note={f.note} jobName={f.label} />
            ))}
          </>
        )}

        {/* Due today */}
        <Text style={styles.sectionLabel}>Jobs Due Today</Text>
        {dueToday.length > 0
          ? dueToday.map(j => <JobCard key={j.id} job={j} />)
          : <Text style={styles.empty}>No jobs due today.</Text>
        }

        {/* All active */}
        <Text style={styles.sectionLabel}>All Active Jobs</Text>
        {activeJobs.map(j => <JobCard key={j.id} job={j} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.bgHeader,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSub,
  },
  logo: { fontSize: 22, fontWeight: '700', color: colors.textPrimary, letterSpacing: -0.5 },
  logoAccent: { color: colors.amber },
  sub: { fontSize: 11, color: colors.textDim, marginTop: 2, fontFamily: 'monospace', letterSpacing: 0.5 },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  statRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  statNum: { fontSize: 24, fontWeight: '700', color: colors.textPrimary },
  statLabel: { fontSize: 10, color: colors.textDim, marginTop: 2, fontFamily: 'monospace' },
  sectionLabel: {
    fontSize: 10,
    color: colors.textDim,
    fontFamily: 'monospace',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 16,
  },
  flagCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: '#2A1A12',
    borderWidth: 0.5,
    borderColor: '#5A2A18',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  flagDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.red, marginTop: 4 },
  flagText: { fontSize: 12, color: '#C4806A', lineHeight: 18 },
  flagJob: { fontSize: 10, color: '#8A5040', fontFamily: 'monospace', marginTop: 2 },
  empty: { fontSize: 13, color: colors.textDim, fontStyle: 'italic' },
});
