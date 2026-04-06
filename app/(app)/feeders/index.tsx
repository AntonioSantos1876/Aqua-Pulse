// app/(app)/feeders/index.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useFeederStore } from '../../../store/feederStore';
import FeederCard from '../../../components/feeder/FeederCard';
import EmptyState from '../../../components/ui/EmptyState';
import SectionHeader from '../../../components/ui/SectionHeader';
import { Colors, Spacing, FontSize, BorderRadius, TabletColumns } from '../../../constants/theme';
import IconButton from '../../../components/ui/IconButton';

export default function FeedersScreen() {
  const router = useRouter();
  const feeders = useFeederStore(s => s.feeders);
  const [search, setSearch] = useState('');

  const filteredFeeder = feeders.filter(f => 
    f.name.toLowerCase().includes(search.toLowerCase()) || 
    (f.locationName && f.locationName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Fleet Overview</Text>
        <IconButton 
          icon="add" 
          onPress={() => router.push('/modals/add-feeder')} 
          bgColor={Colors.accentMuted} 
          color={Colors.accent}
        />
      </View>

      <View style={styles.searchWrap}>
        <Ionicons name="search" size={20} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or zone..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          selectionColor={Colors.accent}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredFeeder}
        keyExtractor={f => f.id}
        numColumns={TabletColumns.feederGrid}
        key={`grid-${TabletColumns.feederGrid}`}
        columnWrapperStyle={TabletColumns.feederGrid > 1 ? styles.gridRow : undefined}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <FeederCard 
            feeder={item} 
            onPress={() => router.push(`/(app)/feeders/${item.id}`)} 
          />
        )}
        ListEmptyComponent={
          <EmptyState 
            icon="fish-outline" 
            title="No Feeders Found" 
            description="Try a different search term or add a new feeder."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    height: 48,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: FontSize.md,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xxxl,
    gap: Spacing.md,
  },
  gridRow: {
    gap: Spacing.md,
  },
});
