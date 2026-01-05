// src/screens/trip/TripDetailScreen.tsx

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { DeliveryStatus } from '@/models/Delivery/DeliveryEnum';
import { TripStatus } from '@/models/Trip/TripEnum';
import { canCompleteTrip, canStartTrip } from '@/models/Trip/TripModel';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { setDeliveries } from '@/store/slices/deliverySlice';
import { acceptTrip, completeTrip, fetchTripById, rejectTrip, startTrip } from '@/store/slices/tripSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Linking, Platform, ScrollView, useWindowDimensions, View } from 'react-native';

// VoltRide components
import { Badge, BottomSheetComponent, Button, Card, Divider, ProgressBar } from '@/components';
import Heading from '@/components/content/Heading';
import Text from '@/components/content/Text';
import { TextField } from '@/components/input';
import { useTheme } from '@/hooks/useTheme';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/material-icons';

interface TripDetailScreenProps {
  navigation: any;
  route: {
    params: {
      tripId: string;
      autoStart?: boolean;
    };
  };
}

export const TripDetailScreen: React.FC<TripDetailScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const { tripId, autoStart } = route.params;
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { currentTrip, isLoading, isAccepting, isRejecting, isStarting, isCompleting } = useAppSelector(
    (state) => state.trip,
  );
  const { currentDriver } = useAppSelector((state) => state.driver);
  const { getCurrentLocation } = useLocationTracking();

  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadTripDetail();
  }, [tripId]);

  useEffect(() => {
    if (currentTrip && autoStart && canStartTrip(currentTrip)) {
      handleStartTrip();
    }
  }, [currentTrip, autoStart]);

  const loadTripDetail = async () => {
    try {
      const trip = await dispatch(fetchTripById(tripId)).unwrap();
      // Set delivery points in delivery slice
      dispatch(setDeliveries(trip.deliveryPoints));
      LoggingService.businessFlow('Loaded trip detail', { tripId });
    } catch (error) {
      LoggingService.error(LogCategory.APP, 'Failed to load trip', error as Error, { tripId });
      Alert.alert('Error', 'Failed to load trip details');
    }
  };

  const handleAcceptTrip = async () => {
    if (!currentTrip) return;

    try {
      await dispatch(
        acceptTrip({
          tripId: currentTrip.id,
          acceptedAt: new Date().toISOString(),
        }),
      ).unwrap();

      LoggingService.businessFlow('Trip accepted', { tripId: currentTrip.id });
      Alert.alert('Success', 'Trip accepted successfully!');
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to accept trip', error as Error);
      Alert.alert('Error', 'Failed to accept trip');
    }
  };

  const handleRejectTrip = async () => {
    if (!currentTrip || !rejectReason.trim()) {
      Alert.alert('Error', 'Please provide a reason for rejection');
      return;
    }

    try {
      await dispatch(
        rejectTrip({
          tripId: currentTrip.id,
          reason: rejectReason,
        }),
      ).unwrap();

      LoggingService.businessFlow('Trip rejected', { tripId: currentTrip.id, reason: rejectReason });
      bottomSheetRef.current?.close();
      navigation.goBack();
      Alert.alert('Trip Rejected', 'You have rejected this trip.');
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to reject trip', error as Error);
      Alert.alert('Error', 'Failed to reject trip');
    }
  };

  const handleStartTrip = async () => {
    if (!currentTrip) return;

    try {
      const location = await getCurrentLocation();

      await dispatch(
        startTrip({
          tripId: currentTrip.id,
          startLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          startTime: new Date().toISOString(),
        }),
      ).unwrap();

      LoggingService.businessFlow('Trip started', { tripId: currentTrip.id });
      navigation.replace('TripNavigation', { tripId: currentTrip.id });
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to start trip', error as Error);
      Alert.alert('Error', 'Failed to start trip');
    }
  };

  const handleCompleteTrip = async () => {
    if (!currentTrip) return;

    if (!canCompleteTrip(currentTrip)) {
      Alert.alert('Cannot Complete', 'Please complete or fail all deliveries before completing the trip.');
      return;
    }

    try {
      const location = await getCurrentLocation();

      await dispatch(
        completeTrip({
          tripId: currentTrip.id,
          endLocation: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          endTime: new Date().toISOString(),
        }),
      ).unwrap();

      LoggingService.businessFlow('Trip completed', {
        tripId: currentTrip.id,
        completedDeliveries: currentTrip.completedDeliveries,
        failedDeliveries: currentTrip.failedDeliveries,
      });

      Alert.alert('Trip Completed!', 'You have successfully completed this trip.', [
        { text: 'OK', onPress: () => navigation.navigate('Dashboard') },
      ]);
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to complete trip', error as Error);
      Alert.alert('Error', 'Failed to complete trip');
    }
  };

  const openGoogleMaps = (latitude: number, longitude: number) => {
    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`,
      android: `google.navigation:q=${latitude},${longitude}&mode=d`,
    });

    Linking.canOpenURL(url!).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
        LoggingService.businessFlow('Opened Google Maps navigation');
      } else {
        Alert.alert('Error', 'Google Maps is not installed');
      }
    });
  };

  const handleDeliveryPointPress = (deliveryPointId: string) => {
    navigation.navigate('DeliveryPoint', { deliveryPointId });
  };

  if (isLoading || !currentTrip) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Trip Header */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <Heading level={3}>Trip #{currentTrip.tripNumber}</Heading>
              <Text variant='caption' style={{ color: colors.textSecondary, marginTop: 4 }}>
                {currentTrip.type} • Priority: {currentTrip.priority}
              </Text>
            </View>
            <Badge
              color={
                currentTrip.status === TripStatus.COMPLETED
                  ? 'success'
                  : currentTrip.status === TripStatus.IN_PROGRESS
                    ? 'primary'
                    : 'default'
              }
              content={currentTrip.status}
            />
          </View>

          {/* Progress */}
          {currentTrip.status === TripStatus.IN_PROGRESS && (
            <>
              <ProgressBar
                progress={(currentTrip.completedDeliveries / currentTrip.totalDeliveries) * 100}
                showLabel
                style={{ marginBottom: 8 }}
              />
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                {currentTrip.completedDeliveries} completed • {currentTrip.failedDeliveries} failed •{' '}
                {currentTrip.totalDeliveries - currentTrip.completedDeliveries - currentTrip.failedDeliveries} pending
              </Text>
            </>
          )}

          {/* Timeline */}
          <Divider style={{ marginVertical: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Estimated Start
              </Text>
              <Text variant='body2'>{new Date(currentTrip.estimatedStartTime).toLocaleString()}</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Estimated End
              </Text>
              <Text variant='body2'>{new Date(currentTrip.estimatedEndTime).toLocaleString()}</Text>
            </View>
          </View>

          {/* Revenue */}
          {currentTrip.totalRevenue > 0 && (
            <>
              <Divider style={{ marginVertical: 16 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name='money' size={20} color={colors.success} />
                <Text variant='subtitle1' style={{ marginLeft: 8, color: colors.success }}>
                  Total Revenue: ${currentTrip.totalRevenue.toFixed(2)}
                </Text>
              </View>
            </>
          )}
        </Card>

        {/* Delivery Points */}
        <Heading level={4} style={{ marginBottom: 12 }}>
          Delivery Points ({currentTrip.deliveryPoints.length})
        </Heading>

        {currentTrip.deliveryPoints
          .sort((a, b) => a.sequence - b.sequence)
          .map((deliveryPoint, index) => (
            <Card
              key={deliveryPoint.id}
              style={{ marginBottom: 12 }}
              onPress={() => handleDeliveryPointPress(deliveryPoint.id)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                {/* Sequence Number */}
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor:
                      deliveryPoint.status === DeliveryStatus.SUCCESS
                        ? colors.success
                        : deliveryPoint.status === DeliveryStatus.FAILED
                          ? colors.error
                          : colors.primary,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{index + 1}</Text>
                </View>

                {/* Delivery Info */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text variant='subtitle2'>{deliveryPoint.recipient.name}</Text>
                    <Badge
                      color={
                        deliveryPoint.status === DeliveryStatus.SUCCESS
                          ? 'success'
                          : deliveryPoint.status === DeliveryStatus.FAILED
                            ? 'error'
                            : 'default'
                      }
                      content={deliveryPoint.status}
                    />
                  </View>

                  <Text variant='caption' style={{ color: colors.textSecondary, marginBottom: 4 }}>
                    {deliveryPoint.address.street}, {deliveryPoint.address.city}
                  </Text>

                  <Text variant='caption' style={{ color: colors.textSecondary }}>
                    {deliveryPoint.packages.length} package(s)
                    {deliveryPoint.requiresCOD && ' • COD Required'}
                  </Text>

                  {/* Navigate Button */}
                  {deliveryPoint.status === DeliveryStatus.PENDING && (
                    <Button
                      title='Navigate'
                      variant='outline'
                      size='sm'
                      onPress={() => openGoogleMaps(deliveryPoint.address.latitude, deliveryPoint.address.longitude)}
                      style={{ marginTop: 8 }}
                      leftIcon='navigation'
                    />
                  )}
                </View>
              </View>
            </Card>
          ))}

        {/* Notes */}
        {currentTrip.notes && (
          <>
            <Heading level={4} style={{ marginTop: 8, marginBottom: 12 }}>
              Trip Notes
            </Heading>
            <Card>
              <Text>{currentTrip.notes}</Text>
            </Card>
          </>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={{ padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
        {/* Assigned - Accept/Reject */}
        {currentTrip.status === TripStatus.ASSIGNED && (
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              title='Reject'
              variant='outline'
              onPress={() => bottomSheetRef.current?.expand()}
              loading={isRejecting}
              style={{ flex: 1 }}
            />
            <Button
              title='Accept Trip'
              variant='primary'
              onPress={handleAcceptTrip}
              loading={isAccepting}
              style={{ flex: 1 }}
            />
          </View>
        )}

        {/* Accepted - Start Trip */}
        {currentTrip.status === TripStatus.ACCEPTED && (
          <Button title='Start Trip' variant='primary' onPress={handleStartTrip} loading={isStarting} leftIcon='play' />
        )}

        {/* In Progress - Navigate/Complete */}
        {currentTrip.status === TripStatus.IN_PROGRESS && (
          <View style={{ gap: 12 }}>
            <Button
              title='Continue Navigation'
              variant='primary'
              onPress={() => navigation.navigate('TripNavigation', { tripId: currentTrip.id })}
              leftIcon='navigation'
            />
            {canCompleteTrip(currentTrip) && (
              <Button
                title='Complete Trip'
                variant='primary'
                onPress={handleCompleteTrip}
                loading={isCompleting}
                leftIcon='check-circle'
              />
            )}
          </View>
        )}
      </View>

      {/* Reject Modal */}
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
        title='Reject Trip'
      >
        <View style={{ padding: 16 }}>
          <Text style={{ marginBottom: 16 }}>Please provide a reason for rejecting this trip:</Text>
          <TextField
            placeholder='Reason for rejection...'
            value={rejectReason}
            onChangeText={setRejectReason}
            multiline
            numberOfLines={4}
            style={{ marginBottom: 16 }}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              title='Cancel'
              variant='outline'
              onPress={() => bottomSheetRef.current?.close()}
              style={{ flex: 1 }}
            />
            <Button
              title='Confirm Reject'
              variant='primary'
              onPress={handleRejectTrip}
              loading={isRejecting}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomSheetComponent>
    </View>
  );
};

export default TripDetailScreen;
