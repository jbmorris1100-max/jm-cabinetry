import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { STATUS } from '../data/mockData';

const BADGE_STYLES = {
  [STATUS.IN_PROGRESS]: {
    bg: colors.greenBg, text: colors.green, border: colors.greenBord, label: 'In Progress',
  },
  [STATUS.BLOCKED]: {
    bg: colors.redBg, text: colors.red, border: colors.redBord, label: 'Blocked',
  },
  [STATUS.AWAITING_PARTS]: {
    bg: colors.goldBg, text: colors.gold, border: colors.goldBord, label: 'Awaiting Parts',
  },
  [STATUS.DONE]: {
    bg: colors.blueBg, text: colors.blue, border: colors.blueBord, label: 'Done',
  },
  [STATUS.NOT_STARTED]: {
    bg: colors.bgCard, text: colors.textDim, border: colors.border, label: 'Not Started',
  },
};

export default function Badge({ status, label }) {
  const style = BADGE_STYLES[status] || BADGE_STYLES[STATUS.NOT_STARTED];
  return (
    <View style={[styles.badge, { backgroundColor: style.bg, borderColor: style.border }]}>
      <Text style={[styles.label, { color: style.text }]}>
        {label || style.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
});
