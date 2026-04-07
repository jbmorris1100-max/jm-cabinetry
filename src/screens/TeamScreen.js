import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
} from 'react-native';
import { colors } from '../theme/colors';
import { teamMembers } from '../data/mockData';

export default function TeamScreen() {
  const online = teamMembers.filter(m => m.online);
  const offline = teamMembers.filter(m => !m.online);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Team</Text>
        <Text style={styles.sub}>{online.length} on shift · {teamMembers.length} total</Text>
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>On Shift ({online.length})</Text>
        {online.map(m => <CrewCard key={m.id} member={m} />)}

        {offline.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>Off Shift ({offline.length})</Text>
            {offline.map(m => <CrewCard key={m.id} member={m} />)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CrewCard({ member }) {
  const jobCount = (member.activeJobs || 0) + (member.activeBuilds || 0);
  return (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: member.avatarBg }]}>
        <Text style={[styles.avatarText, { color: member.avatarText }]}>{member.initials}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{member.name}</Text>
        <Text style={styles.role}>{member.role}</Text>
        <Text style={styles.work}>{jobCount > 0 ? `${jobCount} active · ${member.currentWork}` : 'No active jobs'}</Text>
      </View>
      <View style={[styles.onlineDot, { backgroundColor: member.online ? colors.green : colors.borderSub }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  header: {
    backgroundColor: colors.bgHeader,
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 14,
    borderBottomWidth: 1, borderBottomColor: colors.borderSub,
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: 11, color: colors.textDim, marginTop: 2, fontFamily: 'monospace' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  sectionLabel: {
    fontSize: 10, color: colors.textDim, fontFamily: 'monospace',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginBottom: 10, marginTop: 4,
  },
  card: {
    backgroundColor: colors.bgCard, borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 12, padding: 14, marginBottom: 8,
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  avatarText: { fontSize: 14, fontWeight: '700' },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '500', color: colors.textPrimary },
  role: { fontSize: 11, color: colors.textDim, fontFamily: 'monospace', marginTop: 2 },
  work: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
  onlineDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
});
