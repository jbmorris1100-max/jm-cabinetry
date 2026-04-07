import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Modal, TextInput, Alert,
} from 'react-native';
import { colors } from '../theme/colors';
import { jobs as initialJobs, PIPELINE_STAGES, STATUS } from '../data/mockData';
import Badge from '../components/Badge';

const STATUS_CYCLE = [
  STATUS.NOT_STARTED,
  STATUS.IN_PROGRESS,
  STATUS.AWAITING_PARTS,
  STATUS.BLOCKED,
  STATUS.DONE,
];

export default function ProductionScreen() {
  const [jobs, setJobs] = useState(initialJobs);
  const [flagModal, setFlagModal] = useState(null); // job id
  const [flagNote, setFlagNote] = useState('');

  function getJobsAtStage(stageIndex) {
    return jobs.filter(j => j.stageIndex === stageIndex);
  }

  function advanceJob(jobId) {
    setJobs(prev => prev.map(j => {
      if (j.id !== jobId) return j;
      const next = Math.min(j.stageIndex + 1, PIPELINE_STAGES.length - 1);
      return { ...j, stageIndex: next, status: STATUS.IN_PROGRESS, flagged: false, flagNote: undefined };
    }));
  }

  function openFlagModal(jobId) {
    setFlagNote('');
    setFlagModal(jobId);
  }

  function submitFlag() {
    setJobs(prev => prev.map(j =>
      j.id === flagModal
        ? { ...j, flagged: true, status: STATUS.BLOCKED, flagNote }
        : j
    ));
    setFlagModal(null);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Production</Text>
        <Text style={styles.sub}>CNC → delivery pipeline</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {PIPELINE_STAGES.map((stage, stageIdx) => {
          const stageJobs = getJobsAtStage(stageIdx);
          return (
            <View key={stage} style={styles.stageCard}>
              <View style={styles.stageHead}>
                <View style={styles.stageLeft}>
                  <Text style={styles.stageName}>{stage}</Text>
                  <View style={[styles.stagePip, { backgroundColor: stageIdx < 3 ? colors.amber : stageIdx < 5 ? colors.gold : colors.green }]} />
                </View>
                <Text style={styles.stageCount}>
                  {stageJobs.length} {stageJobs.length === 1 ? 'job' : 'jobs'}
                </Text>
              </View>

              {stageJobs.length === 0 ? (
                <View style={styles.emptyStage}>
                  <Text style={styles.emptyText}>No jobs at this stage</Text>
                </View>
              ) : (
                stageJobs.map(job => (
                  <View key={job.id} style={styles.jobRow}>
                    <View style={styles.jobInfo}>
                      <Text style={styles.jobName}>{job.name}</Text>
                      <Text style={styles.jobWho}>{job.assignedTo}</Text>
                      {job.flagNote ? (
                        <Text style={styles.jobFlag} numberOfLines={1}>{job.flagNote}</Text>
                      ) : null}
                    </View>
                    <View style={styles.jobActions}>
                      <Badge status={job.status} />
                      <View style={styles.actionRow}>
                        <TouchableOpacity
                          style={styles.btnFlag}
                          onPress={() => openFlagModal(job.id)}
                        >
                          <Text style={styles.btnFlagText}>Flag</Text>
                        </TouchableOpacity>
                        {stageIdx < PIPELINE_STAGES.length - 1 && (
                          <TouchableOpacity
                            style={styles.btnAdvance}
                            onPress={() => advanceJob(job.id)}
                          >
                            <Text style={styles.btnAdvanceText}>Next →</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))
              )}
            </View>
          );
        })}
      </ScrollView>

      {/* Flag modal */}
      <Modal visible={flagModal !== null} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Flag This Job</Text>
            <Text style={styles.modalSub}>Describe the issue so the team knows what's happening.</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Machine down, awaiting parts..."
              placeholderTextColor={colors.textDim}
              value={flagNote}
              onChangeText={setFlagNote}
              multiline
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setFlagModal(null)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSubmit, !flagNote && styles.btnDisabled]}
                onPress={submitFlag}
                disabled={!flagNote}
              >
                <Text style={styles.btnSubmitText}>Flag Job</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: { fontSize: 20, fontWeight: '700', color: colors.textPrimary },
  sub: { fontSize: 11, color: colors.textDim, marginTop: 2, fontFamily: 'monospace' },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, gap: 10 },
  stageCard: {
    backgroundColor: colors.bgCard,
    borderWidth: 0.5,
    borderColor: colors.border,
    borderRadius: 12,
    overflow: 'hidden',
  },
  stageHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderSub,
  },
  stageLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stageName: { fontSize: 13, fontWeight: '500', color: colors.textPrimary },
  stagePip: { width: 6, height: 6, borderRadius: 3 },
  stageCount: { fontSize: 11, color: colors.textDim, fontFamily: 'monospace' },
  emptyStage: { padding: 12 },
  emptyText: { fontSize: 12, color: colors.textTiny, fontStyle: 'italic' },
  jobRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderSub,
    gap: 10,
  },
  jobInfo: { flex: 1 },
  jobName: { fontSize: 13, color: colors.textSecondary, fontWeight: '500' },
  jobWho: { fontSize: 11, color: colors.textTiny, fontFamily: 'monospace', marginTop: 2 },
  jobFlag: { fontSize: 11, color: colors.red, fontFamily: 'monospace', marginTop: 3 },
  jobActions: { alignItems: 'flex-end', gap: 6 },
  actionRow: { flexDirection: 'row', gap: 6, marginTop: 4 },
  btnFlag: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6, borderWidth: 0.5, borderColor: colors.border,
  },
  btnFlagText: { fontSize: 11, color: colors.textDim },
  btnAdvance: {
    paddingHorizontal: 8, paddingVertical: 4,
    borderRadius: 6, backgroundColor: colors.amberBg,
    borderWidth: 0.5, borderColor: colors.amber,
  },
  btnAdvanceText: { fontSize: 11, color: colors.amber, fontWeight: '500' },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: colors.bgCard,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 24, gap: 12,
    borderTopWidth: 0.5, borderTopColor: colors.border,
  },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  modalSub: { fontSize: 13, color: colors.textMuted, lineHeight: 18 },
  input: {
    backgroundColor: colors.bgInput,
    borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 10, padding: 12,
    color: colors.textPrimary, fontSize: 14,
    minHeight: 80, textAlignVertical: 'top',
  },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btnCancel: {
    flex: 1, padding: 13, borderRadius: 10,
    borderWidth: 0.5, borderColor: colors.border, alignItems: 'center',
  },
  btnCancelText: { fontSize: 14, color: colors.textMuted },
  btnSubmit: {
    flex: 1, padding: 13, borderRadius: 10,
    backgroundColor: colors.red, alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnSubmitText: { fontSize: 14, color: '#fff', fontWeight: '600' },
});
