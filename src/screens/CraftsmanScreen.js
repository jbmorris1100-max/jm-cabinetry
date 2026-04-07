import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Modal, TextInput,
} from 'react-native';
import { colors } from '../theme/colors';
import { craftsmanBuilds as initialBuilds, STATUS } from '../data/mockData';
import Badge from '../components/Badge';

const STATUS_OPTIONS = [
  { label: 'Not Started',    value: STATUS.NOT_STARTED },
  { label: 'In Progress',    value: STATUS.IN_PROGRESS },
  { label: 'Awaiting Parts', value: STATUS.AWAITING_PARTS },
  { label: 'Blocked',        value: STATUS.BLOCKED },
  { label: 'Done',           value: STATUS.DONE },
];

const EMPTY_BUILD = {
  type: '', name: '', assignedTo: '', notes: '',
  startDate: '', dueDate: '', status: STATUS.NOT_STARTED,
};

export default function CraftsmanScreen() {
  const [builds, setBuilds] = useState(initialBuilds);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_BUILD);
  const [editId, setEditId] = useState(null);

  function openNew() {
    setForm(EMPTY_BUILD);
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(build) {
    setForm({ ...build });
    setEditId(build.id);
    setShowModal(true);
  }

  function saveBuild() {
    if (!form.name.trim()) return;
    if (editId) {
      setBuilds(prev => prev.map(b => b.id === editId ? { ...form, id: editId } : b));
    } else {
      setBuilds(prev => [...prev, { ...form, id: `c${Date.now()}` }]);
    }
    setShowModal(false);
  }

  function deleteBuild(id) {
    setBuilds(prev => prev.filter(b => b.id !== id));
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Craftsman</Text>
        <Text style={styles.sub}>specialty builds</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.addBtn} onPress={openNew}>
          <View style={styles.addIcon}><Text style={styles.addIconText}>+</Text></View>
          <Text style={styles.addText}>New specialty build</Text>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>Active Builds ({builds.filter(b => b.status !== STATUS.DONE).length})</Text>
        {builds.filter(b => b.status !== STATUS.DONE).map(build => (
          <BuildCard key={build.id} build={build} onEdit={() => openEdit(build)} onDelete={() => deleteBuild(build.id)} />
        ))}

        {builds.some(b => b.status === STATUS.DONE) && (
          <>
            <Text style={styles.sectionLabel}>Completed</Text>
            {builds.filter(b => b.status === STATUS.DONE).map(build => (
              <BuildCard key={build.id} build={build} onEdit={() => openEdit(build)} onDelete={() => deleteBuild(build.id)} />
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editId ? 'Edit Build' : 'New Specialty Build'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
              <Field label="Build Type" placeholder="e.g. Floating Shelves, Hood Vent, Countertop..."
                value={form.type} onChangeText={t => setForm(f => ({ ...f, type: t }))} />
              <Field label="Project Name" placeholder="e.g. Henderson Living Room Shelving"
                value={form.name} onChangeText={t => setForm(f => ({ ...f, name: t }))} />
              <Field label="Assigned To" placeholder="e.g. Tom B."
                value={form.assignedTo} onChangeText={t => setForm(f => ({ ...f, assignedTo: t }))} />
              <Field label="Notes / Specs" placeholder="Materials, dimensions, finish details, client requests..."
                value={form.notes} onChangeText={t => setForm(f => ({ ...f, notes: t }))} multiline />
              <View style={styles.dateRow}>
                <View style={{ flex: 1 }}>
                  <Field label="Start Date" placeholder="e.g. Apr 5"
                    value={form.startDate} onChangeText={t => setForm(f => ({ ...f, startDate: t }))} />
                </View>
                <View style={{ flex: 1 }}>
                  <Field label="Due Date" placeholder="e.g. Apr 22"
                    value={form.dueDate} onChangeText={t => setForm(f => ({ ...f, dueDate: t }))} />
                </View>
              </View>

              <Text style={styles.fieldLabel}>Status</Text>
              <View style={styles.statusRow}>
                {STATUS_OPTIONS.map(opt => (
                  <TouchableOpacity
                    key={opt.value}
                    style={[styles.statusChip, form.status === opt.value && styles.statusChipActive]}
                    onPress={() => setForm(f => ({ ...f, status: opt.value }))}
                  >
                    <Text style={[styles.statusChipText, form.status === opt.value && styles.statusChipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.btnCancel} onPress={() => setShowModal(false)}>
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnSave, !form.name.trim() && styles.btnDisabled]}
                onPress={saveBuild}
                disabled={!form.name.trim()}
              >
                <Text style={styles.btnSaveText}>Save Build</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function Field({ label, placeholder, value, onChangeText, multiline }) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMulti]}
        placeholder={placeholder}
        placeholderTextColor={colors.textDim}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

function BuildCard({ build, onEdit, onDelete }) {
  return (
    <TouchableOpacity style={styles.buildCard} onPress={onEdit} activeOpacity={0.75}>
      {build.type ? <Text style={styles.buildType}>{build.type.toUpperCase()}</Text> : null}
      <View style={styles.buildTop}>
        <Text style={styles.buildName}>{build.name}</Text>
        <Badge status={build.status} />
      </View>
      {build.assignedTo ? <Text style={styles.buildWho}>{build.assignedTo}</Text> : null}
      {build.notes ? (
        <Text style={styles.buildNotes} numberOfLines={2}>{build.notes}</Text>
      ) : null}
      <View style={styles.buildFooter}>
        <Text style={styles.buildDue}>{build.dueDate ? `Due ${build.dueDate}` : 'No due date'}</Text>
        <TouchableOpacity onPress={onDelete}>
          <Text style={styles.deleteText}>Remove</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.amberBg, borderWidth: 0.5, borderColor: colors.amber,
    borderRadius: 12, padding: 14, marginBottom: 16,
  },
  addIcon: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: colors.amber, alignItems: 'center', justifyContent: 'center',
  },
  addIconText: { fontSize: 18, fontWeight: '700', color: colors.bgHeader },
  addText: { fontSize: 14, color: colors.amber, fontWeight: '500' },
  sectionLabel: {
    fontSize: 10, color: colors.textDim, fontFamily: 'monospace',
    letterSpacing: 1.5, textTransform: 'uppercase',
    marginBottom: 10, marginTop: 4,
  },
  buildCard: {
    backgroundColor: colors.bgCard, borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 12, padding: 14, marginBottom: 10,
  },
  buildType: { fontSize: 10, color: colors.amber, letterSpacing: 1, marginBottom: 4, fontFamily: 'monospace' },
  buildTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  buildName: { fontSize: 15, fontWeight: '500', color: colors.textPrimary, flex: 1, marginRight: 10 },
  buildWho: { fontSize: 11, color: colors.textDim, fontFamily: 'monospace', marginBottom: 8 },
  buildNotes: { fontSize: 12, color: colors.textMuted, lineHeight: 18, borderTopWidth: 0.5, borderTopColor: colors.borderSub, paddingTop: 8, marginTop: 4 },
  buildFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  buildDue: { fontSize: 11, color: colors.textTiny, fontFamily: 'monospace' },
  deleteText: { fontSize: 11, color: colors.red },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalCard: {
    backgroundColor: colors.bgCard, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    padding: 20, borderTopWidth: 0.5, borderTopColor: colors.border,
  },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 17, fontWeight: '700', color: colors.textPrimary },
  modalClose: { fontSize: 16, color: colors.textMuted, padding: 4 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 11, color: colors.textDim, fontFamily: 'monospace', marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: colors.bgInput, borderWidth: 0.5, borderColor: colors.border,
    borderRadius: 10, padding: 12, color: colors.textPrimary, fontSize: 14,
  },
  inputMulti: { minHeight: 80, textAlignVertical: 'top' },
  dateRow: { flexDirection: 'row', gap: 10 },
  statusRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  statusChip: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20,
    borderWidth: 0.5, borderColor: colors.border, backgroundColor: colors.bgCard,
  },
  statusChipActive: { backgroundColor: colors.amberBg, borderColor: colors.amber },
  statusChipText: { fontSize: 12, color: colors.textDim },
  statusChipTextActive: { color: colors.amber, fontWeight: '500' },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 12 },
  btnCancel: {
    flex: 1, padding: 13, borderRadius: 10,
    borderWidth: 0.5, borderColor: colors.border, alignItems: 'center',
  },
  btnCancelText: { fontSize: 14, color: colors.textMuted },
  btnSave: { flex: 1, padding: 13, borderRadius: 10, backgroundColor: colors.amber, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnSaveText: { fontSize: 14, color: '#1C1A17', fontWeight: '600' },
});
