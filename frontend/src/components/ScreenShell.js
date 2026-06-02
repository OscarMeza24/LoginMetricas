import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { colors, spacing, typography } from '../theme/tokens';

const ScreenShell = ({
  title,
  subtitle,
  children,
  scrollable = true,
  keyboardAware = false,
  headerAction,
  contentStyle,
}) => {
  const Header = () => (
    <View style={styles.header}>
      <View style={styles.headerText}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {headerAction}
    </View>
  );

  const body = (
    <>
      {(title || subtitle) && <Header />}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </>
  );

  if (keyboardAware) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <KeyboardAwareScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
        >
          {body}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  if (scrollable) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {body}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, styles.flex]} edges={['top', 'left', 'right']}>
      {body}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.size.xl,
    color: colors.ink,
    lineHeight: typography.size.xl * typography.lineHeight.tight,
  },
  subtitle: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.size.sm,
    color: colors.inkMuted,
    marginTop: spacing.xs,
    lineHeight: typography.size.sm * typography.lineHeight.relaxed,
  },
  content: {
    flex: 1,
  },
});

export default ScreenShell;
