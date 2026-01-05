// src/screens/driver/DashboardScreen.tsx

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { fetchDriverPerformance, fetchDriverProfile } from '@/store/slices/driverSlice';
import { fetchAssignedTrips, fetchTripById } from '@/store/slices/tripSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, useWindowDimensions, View } from 'react-native';

// Import atomic components from VoltRide
import { Avatar, Badge, Button, Card, ProgressBar, StatCard } from '@/components';
import QRCode from '@/components/assets/QRCode';
import Heading from '@/components/content/Heading';
import Text from '@/components/content/Text';
import { Skeleton } from '@/components/extra';
import { useTheme } from '@/hooks/useTheme';

interface DashboardScreenProps {
  navigation: any;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  // Check if tablet (width > 768)
  const isTablet = width > 768;

  // Redux state
  const { currentDriver, performanceMetrics, isLoading } = useAppSelector((state) => state.driver);
  const { currentTrip, assignedTrips } = useAppSelector((state) => state.trip);
  const { isOnline, statistics } = useAppSelector((state) => state.sync);

  // Location tracking
  const { isTracking, startTracking, stopTracking } = useLocationTracking();

  useEffect(() => {
    loadDashboardData();
    LoggingService.businessFlow('Dashboard screen mounted');
  }, []);

  const loadDashboardData = async () => {
    if (!currentDriver) return;

    try {
      await Promise.all([
        dispatch(fetchDriverProfile(currentDriver.id)).unwrap(),
        dispatch(fetchDriverPerformance(currentDriver.id)).unwrap(),
        dispatch(fetchAssignedTrips(currentDriver.id)).unwrap(),
      ]);
    } catch (error) {
      LoggingService.error(LogCategory.APP, 'Failed to load dashboard data', error as Error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const handleViewTrip = (tripId: string) => {
    dispatch(fetchTripById(tripId));
    navigation.navigate('TripDetail', { tripId });
    LoggingService.businessFlow('Viewed trip details', { tripId });
  };

  const handleToggleTracking = () => {
    if (isTracking) {
      stopTracking();
      LoggingService.businessFlow('Stopped location tracking');
    } else {
      startTracking();
      LoggingService.businessFlow('Started location tracking');
    }
  };

  if (isLoading && !currentDriver) {
    return <DashboardSkeleton />;
  }

  // Mobile layout
  if (!isTablet) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        <View style={{ padding: 16 }}>
          {/* Driver Profile Card */}
          <Card style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Avatar source={currentDriver?.photo?.url} size='lg' style={{ marginRight: 16 }} />
              <View style={{ flex: 1 }}>
                <Heading level={3}>
                  {currentDriver?.firstName} {currentDriver?.lastName}
                </Heading>
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  ID: {currentDriver?.id}
                </Text>
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <Badge
                    color={currentDriver?.isOnline ? 'success' : 'default'}
                    content={currentDriver?.isOnline ? 'Online' : 'Offline'}
                  />
                  {!isOnline && <Badge color='warning' content='No Internet' style={{ marginLeft: 8 }} />}
                  {statistics.totalPending > 0 && (
                    <Badge
                      color='warning'
                      content={`${statistics.totalPending} pending sync`}
                      style={{ marginLeft: 8 }}
                    />
                  )}
                </View>
              </View>
            </View>

            {/* QR Code */}
            {currentDriver?.qrCode && (
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <QRCode value={currentDriver.qrCode} size={150} />
                <Text variant='caption' style={{ marginTop: 8, color: colors.textSecondary }}>
                  Driver Identification Code
                </Text>
              </View>
            )}

            {/* Vehicle Info */}
            {currentDriver?.assignedVehicle && (
              <View style={{ padding: 12, backgroundColor: colors.surface, borderRadius: 8 }}>
                <Text variant='subtitle2' style={{ marginBottom: 4 }}>
                  Current Vehicle
                </Text>
                <Text>
                  {currentDriver.assignedVehicle.make} {currentDriver.assignedVehicle.model} (
                  {currentDriver.assignedVehicle.licensePlate})
                </Text>
              </View>
            )}
          </Card>

          {/* Performance Metrics */}
          <Heading level={4} style={{ marginBottom: 12 }}>
            Performance
          </Heading>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
            <StatCard
              label='Total Income'
              value={`$${performanceMetrics?.totalIncome?.toFixed(2) || '0.00'}`}
              style={{ width: '48%', marginRight: '4%', marginBottom: 12 }}
            />
            <StatCard
              label='Completed Trips'
              value={performanceMetrics?.completedTrips?.toString() || '0'}
              style={{ width: '48%', marginBottom: 12 }}
            />
            <StatCard
              label='Success Rate'
              value={`${performanceMetrics?.onTimeDeliveryRate?.toFixed(1) || '0'}%`}
              style={{ width: '48%', marginRight: '4%' }}
            />
            <StatCard
              label='Average Rating'
              value={performanceMetrics?.averageRating?.toFixed(1) || '0.0'}
              style={{ width: '48%' }}
            />
          </View>

          {/* Current Active Trip */}
          {currentTrip && (
            <>
              <Heading level={4} style={{ marginBottom: 12 }}>
                Current Trip
              </Heading>
              <Card style={{ marginBottom: 16 }} onPress={() => handleViewTrip(currentTrip.id)}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                  <View>
                    <Text variant='subtitle1'>Trip #{currentTrip.tripNumber}</Text>
                    <Text variant='caption' style={{ color: colors.textSecondary }}>
                      {currentTrip.deliveryPoints.length} delivery points
                    </Text>
                  </View>
                  <Badge color='primary' content={currentTrip.status} />
                </View>

                <ProgressBar
                  progress={(currentTrip.completedDeliveries / currentTrip.totalDeliveries) * 100}
                  showLabel
                  style={{ marginBottom: 8 }}
                />

                <Text variant='caption'>
                  {currentTrip.completedDeliveries} of {currentTrip.totalDeliveries} deliveries completed
                </Text>

                <Button
                  title='Continue Trip'
                  onPress={() => handleViewTrip(currentTrip.id)}
                  style={{ marginTop: 12 }}
                />
              </Card>
            </>
          )}

          {/* Assigned Trips (for gig drivers) */}
          {assignedTrips.length > 0 && !currentTrip && (
            <>
              <Heading level={4} style={{ marginBottom: 12 }}>
                Available Trips
              </Heading>
              {assignedTrips.map((trip) => (
                <Card key={trip.id} style={{ marginBottom: 12 }} onPress={() => handleViewTrip(trip.id)}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text variant='subtitle1'>Trip #{trip.tripNumber}</Text>
                      <Text variant='caption' style={{ color: colors.textSecondary }}>
                        {trip.deliveryPoints.length} stops • ${trip.totalRevenue}
                      </Text>
                    </View>
                    <Button title='View' size='sm' onPress={() => handleViewTrip(trip.id)} />
                  </View>
                </Card>
              ))}
            </>
          )}

          {/* Location Tracking Control */}
          <Card style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View>
                <Text variant='subtitle1'>Location Tracking</Text>
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  {isTracking ? 'Tracking enabled' : 'Tracking disabled'}
                </Text>
              </View>
              <Button
                title={isTracking ? 'Stop' : 'Start'}
                variant={isTracking ? 'secondary' : 'primary'}
                onPress={handleToggleTracking}
              />
            </View>
          </Card>
        </View>
      </ScrollView>
    );
  }

  // Tablet layout - Split view
  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
      {/* Left panel - Driver info and controls */}
      <View style={{ width: '40%', borderRightWidth: 1, borderRightColor: colors.border }}>
        <ScrollView
          style={{ flex: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
          <View style={{ padding: 24 }}>
            {/* Same content as mobile but in left panel */}
            {/* Driver Profile Card */}
            <Card style={{ marginBottom: 20 }}>{/* ... same driver info ... */}</Card>

            {/* Performance Metrics */}
            <Heading level={4} style={{ marginBottom: 16 }}>
              Performance
            </Heading>
            <View style={{ flexWrap: 'wrap', marginBottom: 20 }}>{/* ... same performance cards ... */}</View>

            {/* Location Tracking Control */}
            <Card>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text variant='subtitle1'>Location Tracking</Text>
                  <Text variant='caption' style={{ color: colors.textSecondary }}>
                    {isTracking ? 'Tracking enabled' : 'Tracking disabled'}
                  </Text>
                </View>
                <Button
                  title={isTracking ? 'Stop' : 'Start'}
                  variant={isTracking ? 'secondary' : 'primary'}
                  onPress={handleToggleTracking}
                />
              </View>
            </Card>
          </View>
        </ScrollView>
      </View>

      {/* Right panel - Trip list and map */}
      <View style={{ flex: 1 }}>
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 24 }}>
            {/* Current Trip */}
            {currentTrip && (
              <>
                <Heading level={3} style={{ marginBottom: 16 }}>
                  Current Trip
                </Heading>
                <Card style={{ marginBottom: 24 }}>{/* ... same trip card ... */}</Card>
              </>
            )}

            {/* Assigned Trips */}
            {assignedTrips.length > 0 && !currentTrip && (
              <>
                <Heading level={3} style={{ marginBottom: 16 }}>
                  Available Trips
                </Heading>
                {assignedTrips.map((trip) => (
                  <Card key={trip.id} style={{ marginBottom: 16 }}>
                    {/* ... same trip cards ... */}
                  </Card>
                ))}
              </>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

// Loading skeleton for dashboard
const DashboardSkeleton: React.FC = () => {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Skeleton variant='rect' height={200} style={{ marginBottom: 16 }} />
      <Skeleton variant='rect' height={100} style={{ marginBottom: 16 }} />
      <Skeleton variant='rect' height={150} />
    </View>
  );
};

export default DashboardScreen;
