// src/screens/trip/TripListScreen.tsx

import { TripStatus } from '@/models/Trip/TripEnum';
import { getTripProgress } from '@/models/Trip/TripModel';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { fetchAssignedTrips, fetchCompletedTrips } from '@/store/slices/tripSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, useWindowDimensions, View } from 'react-native';

// VoltRide components
import { Badge, Button, Card, EmptyState, ProgressBar, Tabs } from '@/components';
import Text from '@/components/content/Text';
import { Skeleton } from '@/components/extra';
import Header from '@/components/Header';
import AppLayout from '@/components/layout/AppLayout';
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';

interface TripListScreenProps {
  navigation: any;
}

export const TripListScreen: React.FC<TripListScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;

  const [activeTab, setActiveTab] = useState<'assigned' | 'current' | 'completed'>('assigned');
  const [refreshing, setRefreshing] = useState(false);

  const { currentDriver } = useAppSelector((state) => state.driver);
  const { currentTrip, assignedTrips, completedTrips, isLoading, pagination } = useAppSelector((state) => state.trip);

  useEffect(() => {
    loadTrips();
    LoggingService.businessFlow('Trip list screen mounted', { activeTab });
  }, [activeTab]);

  const loadTrips = async () => {
    if (!currentDriver) return;

    try {
      if (activeTab === 'assigned') {
        await dispatch(fetchAssignedTrips(currentDriver.id)).unwrap();
      } else if (activeTab === 'completed') {
        await dispatch(fetchCompletedTrips({ driverId: currentDriver.id, page: 1, limit: 20 })).unwrap();
      }
    } catch (error) {
      LoggingService.error(LogCategory.APP, 'Failed to load trips', error as Error, { activeTab });
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadTrips();
    setRefreshing(false);
  };

  const handleTripPress = (tripId: string) => {
    navigation.navigate('TripDetail', { tripId });
    LoggingService.businessFlow('Opened trip detail', { tripId });
  };

  const handleLoadMore = () => {
    if (pagination.hasNextPage && !isLoading && activeTab === 'completed') {
      dispatch(
        fetchCompletedTrips({
          driverId: currentDriver!.id,
          page: pagination.page + 1,
          limit: 20,
        }),
      );
    }
  };

  const renderTripCard = (trip: any) => (
    <Card key={trip.id} style={{ marginBottom: 16 }} onPress={() => handleTripPress(trip.id)}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
        <View style={{ flex: 1 }}>
          <Text variant='subtitle1'>Trip #{trip.tripNumber}</Text>
          <Text variant='caption' style={{ color: colors.textSecondary, marginTop: 4 }}>
            {trip.deliveryPoints.length} stops • {trip.totalDeliveries} deliveries
          </Text>
        </View>
        <Badge color={trip.status === TripStatus.COMPLETED ? 'success' : 'primary'} content={trip.status} />
      </View>

      {/* Progress Bar */}
      {trip.status === TripStatus.IN_PROGRESS && (
        <View style={{ marginBottom: 12 }}>
          <ProgressBar progress={getTripProgress(trip)} showLabel color={colors.primary} />
          <Text variant='caption' style={{ marginTop: 4 }}>
            {trip.completedDeliveries} of {trip.totalDeliveries} completed
          </Text>
        </View>
      )}

      {/* Info Row */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <Icon name='lock-clock' size={16} color={colors.textSecondary} />
        <Text variant='caption' style={{ marginLeft: 8, color: colors.textSecondary }}>
          {new Date(trip.estimatedStartTime).toLocaleString()}
        </Text>
      </View>

      {/* Revenue */}
      {trip.totalRevenue > 0 && (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <Icon name='money' size={16} color={colors.success} />
          <Text variant='body2' style={{ marginLeft: 8, color: colors.success }}>
            ${trip.totalRevenue.toFixed(2)}
          </Text>
        </View>
      )}

      {/* Action Button */}
      {trip.status === TripStatus.ASSIGNED && (
        <Button title='View Details' variant='outline' size='sm' onPress={() => handleTripPress(trip.id)} />
      )}
      {trip.status === TripStatus.ACCEPTED && (
        <Button
          title='Start Trip'
          variant='primary'
          size='sm'
          onPress={() => navigation.navigate('TripDetail', { tripId: trip.id, autoStart: true })}
        />
      )}
      {trip.status === TripStatus.IN_PROGRESS && (
        <Button
          title='Continue Trip'
          variant='primary'
          size='sm'
          onPress={() => navigation.navigate('TripNavigation', { tripId: trip.id })}
        />
      )}
    </Card>
  );

  const renderEmptyState = () => {
    const emptyMessages = {
      assigned: {
        title: 'No Assigned Trips',
        description: 'You have no trips assigned at the moment. Check back later.',
        icon: 'inbox',
      },
      current: {
        title: 'No Active Trip',
        description: "You don't have any active trip right now.",
        icon: 'alert-circle',
      },
      completed: {
        title: 'No Completed Trips',
        description: 'Your completed trips will appear here.',
        icon: 'check-circle',
      },
    };

    const message = emptyMessages[activeTab];

    return (
      <EmptyState
        icon={message.icon}
        title={message.title}
        description={message.description}
        style={{ marginTop: 60 }}
      />
    );
  };

  if (isLoading && assignedTrips.length === 0 && completedTrips.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, padding: 16 }}>
        <Skeleton variant='rect' height={150} style={{ marginBottom: 16 }} />
        <Skeleton variant='rect' height={150} style={{ marginBottom: 16 }} />
        <Skeleton variant='rect' height={150} />
      </View>
    );
  }

  return (
    <AppLayout>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header */}
        <Header title={'My Trips'} onBack={() => {}} onSearch={() => {}} />

        {/* Tabs */}
        <Tabs
          items={[
            { key: 'assigned', title: 'Assigned', badge: assignedTrips.length },
            { key: 'current', title: 'Current', badge: currentTrip ? 1 : 0 },
            { key: 'completed', title: 'Completed', badge: pagination.total },
          ]}
          selectedKey={activeTab}
          onChange={(tab) => setActiveTab(tab as any)}
        />

        {/* Content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onScroll={({ nativeEvent }) => {
            const { layoutMeasurement, contentOffset, contentSize } = nativeEvent;
            const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
            if (isCloseToBottom) {
              handleLoadMore();
            }
          }}
          scrollEventThrottle={400}
        >
          {/* Assigned Trips */}
          {activeTab === 'assigned' && (
            <>{assignedTrips.length === 0 ? renderEmptyState() : assignedTrips.map(renderTripCard)}</>
          )}

          {/* Current Trip */}
          {activeTab === 'current' && <>{currentTrip ? renderTripCard(currentTrip) : renderEmptyState()}</>}

          {/* Completed Trips */}
          {activeTab === 'completed' && (
            <>
              {completedTrips.length === 0 ? renderEmptyState() : completedTrips.map(renderTripCard)}

              {/* Loading More Indicator */}
              {isLoading && completedTrips.length > 0 && (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <Text variant='caption' style={{ color: colors.textSecondary }}>
                    Loading more trips...
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </AppLayout>
  );
};

export default TripListScreen;
