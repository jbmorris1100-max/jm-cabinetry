import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';
import { PIPELINE_STAGES, STATUS } from '../data/mockData';
import Badge from './Badge';

export default function JobCard({ job, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.top}>
        <View style={styles.info}>
          <Text style={styles.name}>{job.name}</Text>
          <Text style={styles.client}>{job.client}</Text>
        </View>
        <Badge status={job.status} />
      </View>

      {/* Stage progress pips */}
      <View style={styles.pips}>
        {PIPELINE_STAGES.map((_, i) => {
          let pipColor = colors.borderSub;
          if (i < job.stageIndex) pipColor = colors.green;
          else if (i === job.stageIndex) {
            pipColor = job.status === STATUS.BLOCKED ? colors.red
              : job.status === STATUS.AWAITING_PARTS ? colors.gold
              : colors.amber;
          }
          return <View key={i} style={[styles.pip, { backgroundColor: pipColor }]} />;
        })}
      </View>

      <View style={styles.footer}>
        <Text style={styles.stage}>
          {PIPELINE_STAGES[job.stageIndex]}
          {job.assignedTo ? ` · ${job.assignedTo}` : ''}
        </Text>
        {job.flagNote ? (
          <Text style={styles.flagNote} numberOfLines={1}>{job.flagNote}</Text>
        ) : (
          <Text style={styles.due}>Due {job.dueDate}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  info: { flex: 1, marginRight: 10 },
  name: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  client: {
    fontSize: 11,
    color: colors.textDim,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  pips: {
    flexDirection: 'row',
    gap: 3,
    marginBottom: 8,
  },
  pip: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  footer: {
    gap: 2,
  },
  stage: {
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: 'monospace',
  },
  flagNote: {
    fontSize: 11,
    color: colors.red,
    fontFamily: 'monospace',
  },
  due: {
    fontSize: 11,
    color: colors.textTiny,
    fontFamily: 'monospace',
  },
});
