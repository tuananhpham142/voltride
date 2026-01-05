// src/screens/trip/TripNavigationScreen.tsx

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { DeliveryStatus } from '@/models/Delivery/DeliveryEnum';
import { getTripProgress } from '@/models/Trip/TripModel';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { setCurrentDelivery, setDeliveries } from '@/store/slices/deliverySlice';
import { fetchTripById } from '@/store/slices/tripSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { Linking, Platform, ScrollView, useWindowDimensions, View } from 'react-native';

// VoltRide components
import { Badge, Button, Card, ProgressBar } from '@/components';
import Heading from '@/components/content/Heading';
import Text from '@/components/content/Text';
import FloatingButton from '@/components/control/FloatingButton';
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';

interface TripNavigationScreenProps {
  navigation: any;
  route: {
    params: {
      tripId: string;
    };
  };
}

export const TripNavigationScreen: React.FC<TripNavigationScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const { tripId } = route.params;

  const { currentTrip, isLoading } = useAppSelector((state) => state.trip);
  const { currentLocation, isTracking, startTracking } = useLocationTracking();

  const [showCompletedPoints, setShowCompletedPoints] = useState(false);

  useEffect(() => {
    loadTripData();

    // Start location tracking if not already tracking
    if (!isTracking) {
      startTracking();
    }

    LoggingService.businessFlow('Trip navigation screen opened', { tripId });
  }, [tripId]);

  const loadTripData = async () => {
    try {
      const trip = await dispatch(fetchTripById(tripId)).unwrap();
      dispatch(setDeliveries(trip.deliveryPoints));
    } catch (error) {
      LoggingService.error(LogCategory.APP, 'Failed to load trip data', error as Error);
    }
  };

  const getNextDeliveryPoint = () => {
    if (!currentTrip) return null;
    return currentTrip.deliveryPoints
      .sort((a, b) => a.sequence - b.sequence)
      .find((point) => point.status === DeliveryStatus.PENDING || point.status === DeliveryStatus.IN_PROGRESS);
  };

  const handleNavigateToPoint = (deliveryPoint: any) => {
    const { latitude, longitude } = deliveryPoint.address;
    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`,
      android: `google.navigation:q=${latitude},${longitude}&mode=d`,
    });

    Linking.canOpenURL(url!).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
        LoggingService.businessFlow('Opened navigation to delivery point', {
          deliveryPointId: deliveryPoint.id,
        });
      }
    });
  };

  const handleDeliveryPointPress = (deliveryPoint: any) => {
    dispatch(setCurrentDelivery(deliveryPoint));
    navigation.navigate('DeliveryPoint', { deliveryPointId: deliveryPoint.id });
  };

  const getStatusColor = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.SUCCESS:
        return colors.success;
      case DeliveryStatus.FAILED:
        return colors.error;
      case DeliveryStatus.IN_PROGRESS:
        return colors.primary;
      case DeliveryStatus.REQUIRES_SUPPORT:
        return colors.warning;
      default:
        return colors.textSecondary;
    }
  };

  const getStatusIcon = (status: DeliveryStatus) => {
    switch (status) {
      case DeliveryStatus.SUCCESS:
        return 'check-circle';
      case DeliveryStatus.FAILED:
        return 'x-circle';
      case DeliveryStatus.IN_PROGRESS:
        return 'navigation';
      case DeliveryStatus.REQUIRES_SUPPORT:
        return 'alert-circle';
      default:
        return 'circle';
    }
  };

  if (!currentTrip) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading trip...</Text>
      </View>
    );
  }

  const nextDelivery = getNextDeliveryPoint();
  const pendingDeliveries = currentTrip.deliveryPoints.filter((p) => p.status === DeliveryStatus.PENDING);
  const completedDeliveries = currentTrip.deliveryPoints.filter(
    (p) => p.status === DeliveryStatus.SUCCESS || p.status === DeliveryStatus.FAILED,
  );

  // Render methods for mobile and tablet layouts
  const renderMobileLayout = () => (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Map Placeholder - In production, use Mapbox */}
      <View
        style={{
          height: 300,
          backgroundColor: colors.surface,
          justifyContent: 'center',
          alignItems: 'center',
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        }}
      >
        <Icon name='map' size={48} color={colors.textSecondary} />
        <Text variant='caption' style={{ marginTop: 8, color: colors.textSecondary }}>
          Map View (Mapbox Integration)
        </Text>
        {currentLocation && (
          <Text variant='caption' style={{ marginTop: 4, color: colors.textSecondary }}>
            Current: {currentLocation.latitude.toFixed(6)}, {currentLocation.longitude.toFixed(6)}
          </Text>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Trip Progress */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <Heading level={4}>Trip #{currentTrip.tripNumber}</Heading>
            <Badge color='primary' content='IN PROGRESS' />
          </View>

          <ProgressBar progress={getTripProgress(currentTrip)} showLabel style={{ marginBottom: 8 }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Completed
              </Text>
              <Text variant='subtitle1'>{currentTrip.completedDeliveries}</Text>
            </View>
            <View>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Failed
              </Text>
              <Text variant='subtitle1'>{currentTrip.failedDeliveries}</Text>
            </View>
            <View>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Remaining
              </Text>
              <Text variant='subtitle1'>{pendingDeliveries.length}</Text>
            </View>
          </View>
        </Card>

        {/* Next Delivery */}
        {nextDelivery && (
          <Card
            style={{ marginBottom: 16, borderColor: colors.primary, borderWidth: 2 }}
            onPress={() => handleDeliveryPointPress(nextDelivery)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <Icon name='navigation' size={20} color={colors.primary} />
              <Heading level={4} style={{ marginLeft: 8 }}>
                Next Delivery
              </Heading>
            </View>

            <Text variant='subtitle1' style={{ marginBottom: 4 }}>
              {nextDelivery.recipient.name}
            </Text>
            <Text variant='body2' style={{ color: colors.textSecondary, marginBottom: 8 }}>
              {nextDelivery.address.street}
            </Text>
            <Text variant='caption' style={{ color: colors.textSecondary, marginBottom: 12 }}>
              {nextDelivery.packages.length} package(s)
              {nextDelivery.requiresCOD && ' • COD Required'}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                title='Navigate'
                variant='primary'
                leftIcon='navigation'
                onPress={() => handleNavigateToPoint(nextDelivery)}
                style={{ flex: 1 }}
              />
              <Button
                title='View Details'
                variant='outline'
                onPress={() => handleDeliveryPointPress(nextDelivery)}
                style={{ flex: 1 }}
              />
            </View>
          </Card>
        )}

        {/* Pending Deliveries */}
        {pendingDeliveries.length > 0 && (
          <>
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
            >
              <Heading level={4}>Upcoming ({pendingDeliveries.length})</Heading>
            </View>

            {pendingDeliveries
              .sort((a, b) => a.sequence - b.sequence)
              .map((point, index) => (
                <Card key={point.id} style={{ marginBottom: 12 }} onPress={() => handleDeliveryPointPress(point)}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: colors.surface,
                        borderWidth: 2,
                        borderColor: colors.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 12,
                      }}
                    >
                      <Text style={{ fontWeight: 'bold', color: colors.primary }}>{point.sequence}</Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text variant='subtitle2' style={{ marginBottom: 2 }}>
                        {point.recipient.name}
                      </Text>
                      <Text variant='caption' style={{ color: colors.textSecondary, marginBottom: 4 }}>
                        {point.address.street}
                      </Text>
                      <Text variant='caption' style={{ color: colors.textSecondary }}>
                        {point.packages.length} package(s)
                      </Text>
                    </View>

                    <Icon name='chevron-right' size={20} color={colors.textSecondary} />
                  </View>
                </Card>
              ))}
          </>
        )}

        {/* Completed/Failed Deliveries (Collapsible) */}
        {completedDeliveries.length > 0 && (
          <>
            <Button
              title={`${showCompletedPoints ? 'Hide' : 'Show'} Completed (${completedDeliveries.length})`}
              variant='outline'
              leftIcon={showCompletedPoints ? 'chevron-up' : 'chevron-down'}
              onPress={() => setShowCompletedPoints(!showCompletedPoints)}
              style={{ marginBottom: 12 }}
            />

            {showCompletedPoints &&
              completedDeliveries
                .sort((a, b) => a.sequence - b.sequence)
                .map((point) => (
                  <Card key={point.id} style={{ marginBottom: 12, opacity: 0.7 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                      <Icon
                        name={getStatusIcon(point.status) as any}
                        size={24}
                        color={getStatusColor(point.status)}
                        style={{ marginRight: 12 }}
                      />

                      <View style={{ flex: 1 }}>
                        <Text variant='subtitle2' style={{ marginBottom: 2 }}>
                          {point.recipient.name}
                        </Text>
                        <Text variant='caption' style={{ color: colors.textSecondary }}>
                          {point.address.street}
                        </Text>
                        <Badge
                          color={point.status === DeliveryStatus.SUCCESS ? 'success' : 'error'}
                          content={point.status}
                          style={{ marginTop: 4 }}
                        />
                      </View>
                    </View>
                  </Card>
                ))}
          </>
        )}
      </ScrollView>

      {/* Floating Trip Summary Button */}
      <FloatingButton
        icon='list'
        onPress={() => navigation.navigate('TripDetail', { tripId: currentTrip.id })}
        style={{ position: 'absolute', bottom: 80, right: 16 }}
      />
    </View>
  );

  const renderTabletLayout = () => (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.background }}>
      {/* Left: Delivery List */}
      <View style={{ width: '40%', borderRightWidth: 1, borderRightColor: colors.border }}>
        <View
          style={{
            padding: 16,
            backgroundColor: colors.surface,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <Heading level={3}>Trip #{currentTrip.tripNumber}</Heading>
          <ProgressBar progress={getTripProgress(currentTrip)} showLabel style={{ marginTop: 12 }} />
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
          {/* Same delivery list as mobile */}
          {pendingDeliveries.length > 0 && (
            <>
              <Heading level={4} style={{ marginBottom: 12 }}>
                Upcoming ({pendingDeliveries.length})
              </Heading>
              {pendingDeliveries
                .sort((a, b) => a.sequence - b.sequence)
                .map((point) => (
                  <Card key={point.id} style={{ marginBottom: 12 }} onPress={() => handleDeliveryPointPress(point)}>
                    {/* Same content as mobile */}
                  </Card>
                ))}
            </>
          )}
        </ScrollView>
      </View>

      {/* Right: Map */}
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Icon name='map' size={64} color={colors.textSecondary} />
          <Text variant='body1' style={{ marginTop: 16, color: colors.textSecondary }}>
            Map View (Mapbox Integration)
          </Text>
        </View>
      </View>
    </View>
  );

  return isTablet ? renderTabletLayout() : renderMobileLayout();
};

export default TripNavigationScreen;
