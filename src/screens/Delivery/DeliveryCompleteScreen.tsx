// src/screens/delivery/DeliveryCompleteScreen.tsx

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { FailureReason } from '@/models/Delivery/DeliveryEnum';
import { canCompleteDelivery, requiresPayment } from '@/models/Delivery/DeliveryModel';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { clearPODCapture, completeDelivery, failDelivery } from '@/store/slices/deliverySlice';
import { updateTripDeliveryProgress } from '@/store/slices/tripSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

// VoltRide components
import { Badge, BottomSheetComponent, Button, Card } from '@/components';
import Heading from '@/components/content/Heading';
import Text from '@/components/content/Text';
import { TextArea } from '@/components/input';
import RadioGroup from '@/components/input/RadioGroup';
import { useTheme } from '@/hooks/useTheme';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/material-icons';

interface DeliveryCompleteScreenProps {
  navigation: any;
  route: {
    params: {
      deliveryPointId: string;
    };
  };
}

export const DeliveryCompleteScreen: React.FC<DeliveryCompleteScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { deliveryPointId } = route.params;
  const bottomSheetRef = useRef<BottomSheet>(null);

  const { currentDelivery, isCompleting, isFailingDelivery } = useAppSelector((state) => state.delivery);
  const { currentTrip } = useAppSelector((state) => state.trip);
  const { getCurrentLocation } = useLocationTracking();

  const [failureReason, setFailureReason] = useState<FailureReason>(FailureReason.RECIPIENT_NOT_AVAILABLE);
  const [failureNotes, setFailureNotes] = useState('');

  const proofOfDelivery = currentDelivery?.proofOfDelivery;

  useEffect(() => {
    LoggingService.businessFlow('Delivery complete screen opened', { deliveryPointId });
  }, []);

  const handleCompleteDelivery = async () => {
    if (!currentDelivery || !proofOfDelivery) {
      Alert.alert('Error', 'Proof of delivery is missing');
      return;
    }

    // Check if COD payment is required
    if (requiresPayment(currentDelivery)) {
      Alert.alert('Payment Required', 'Please collect COD payment before completing delivery.', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Process Payment',
          onPress: () => navigation.navigate('CODPayment', { deliveryPointId }),
        },
      ]);
      return;
    }

    // Validate POD
    if (!canCompleteDelivery(currentDelivery, proofOfDelivery)) {
      Alert.alert('Incomplete POD', 'Please ensure all required proof of delivery items are captured.');
      return;
    }

    Alert.alert('Complete Delivery', 'Are you sure you want to complete this delivery?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Complete',
        style: 'default',
        onPress: async () => {
          try {
            const location = await getCurrentLocation();

            await dispatch(
              completeDelivery({
                deliveryPointId,
                proofOfDeliveryId: proofOfDelivery.id,
                completedAt: new Date().toISOString(),
                location: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
              }),
            ).unwrap();

            // Update trip progress
            if (currentTrip) {
              dispatch(
                updateTripDeliveryProgress({
                  completed: currentTrip.completedDeliveries + 1,
                  failed: currentTrip.failedDeliveries,
                }),
              );
            }

            // Clear POD capture state
            dispatch(clearPODCapture());

            LoggingService.businessFlow('Delivery completed successfully', { deliveryPointId });

            Alert.alert('Delivery Completed!', 'The delivery has been completed successfully.', [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate back to trip navigation or detail
                  if (currentTrip) {
                    navigation.navigate('TripNavigation', { tripId: currentTrip.id });
                  } else {
                    navigation.navigate('Dashboard');
                  }
                },
              },
            ]);
          } catch (error) {
            LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to complete delivery', error as Error);
            Alert.alert('Error', 'Failed to complete delivery. Please try again.');
          }
        },
      },
    ]);
  };

  const handleFailDelivery = async () => {
    if (!failureNotes.trim()) {
      Alert.alert('Missing Information', 'Please provide notes about why the delivery failed');
      return;
    }

    try {
      const location = await getCurrentLocation();

      await dispatch(
        failDelivery({
          deliveryPointId,
          failureReason,
          notes: failureNotes,
          failedAt: new Date().toISOString(),
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        }),
      ).unwrap();

      // Update trip progress
      if (currentTrip) {
        dispatch(
          updateTripDeliveryProgress({
            completed: currentTrip.completedDeliveries,
            failed: currentTrip.failedDeliveries + 1,
          }),
        );
      }

      // Clear POD capture state
      dispatch(clearPODCapture());

      LoggingService.businessFlow('Delivery marked as failed', {
        deliveryPointId,
        reason: failureReason,
      });

      bottomSheetRef.current?.close();

      Alert.alert('Delivery Failed', 'The delivery has been marked as failed. Support will be notified.', [
        {
          text: 'OK',
          onPress: () => {
            if (currentTrip) {
              navigation.navigate('TripNavigation', { tripId: currentTrip.id });
            } else {
              navigation.navigate('Dashboard');
            }
          },
        },
      ]);
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to mark delivery as failed', error as Error);
      Alert.alert('Error', 'Failed to update delivery status. Please try again.');
    }
  };

  if (!currentDelivery) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Delivery not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Success Header */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: '#E6F9F0',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Icon name='check-circle' size={48} color={colors.success} />
          </View>
          <Heading level={2} style={{ textAlign: 'center' }}>
            Ready to Complete
          </Heading>
          <Text variant='body2' style={{ textAlign: 'center', color: colors.textSecondary, marginTop: 8 }}>
            Review the delivery details before completing
          </Text>
        </View>

        {/* Delivery Summary */}
        <Card style={{ marginBottom: 16 }}>
          <Heading level={4} style={{ marginBottom: 12 }}>
            Delivery Summary
          </Heading>

          <View style={{ gap: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Recipient
              </Text>
              <Text variant='body2'>{currentDelivery.recipient.name}</Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Address
              </Text>
              <Text variant='body2' style={{ flex: 1, textAlign: 'right' }}>
                {currentDelivery.address.street}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                Packages
              </Text>
              <Text variant='body2'>{currentDelivery.packages.length} item(s)</Text>
            </View>
          </View>
        </Card>

        {/* POD Checklist */}
        <Card style={{ marginBottom: 16 }}>
          <Heading level={4} style={{ marginBottom: 12 }}>
            Proof of Delivery
          </Heading>

          <View style={{ gap: 12 }}>
            {/* Photos */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={proofOfDelivery?.photos && proofOfDelivery.photos.length > 0 ? 'check-circle' : 'circle'}
                size={20}
                color={
                  proofOfDelivery?.photos && proofOfDelivery.photos.length > 0 ? colors.success : colors.textSecondary
                }
              />
              <Text variant='body2' style={{ marginLeft: 12, flex: 1 }}>
                Photos ({proofOfDelivery?.photos?.length || 0})
              </Text>
              {proofOfDelivery?.photos && proofOfDelivery.photos.length > 0 && (
                <Badge color='success' content='Captured' />
              )}
            </View>

            {/* Signature */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={proofOfDelivery?.signature ? 'check-circle' : 'circle'}
                size={20}
                color={proofOfDelivery?.signature ? colors.success : colors.textSecondary}
              />
              <Text variant='body2' style={{ marginLeft: 12, flex: 1 }}>
                Signature
              </Text>
              {proofOfDelivery?.signature && <Badge color='success' content='Captured' />}
            </View>

            {/* Recipient Info */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={proofOfDelivery?.recipientInfo ? 'check-circle' : 'circle'}
                size={20}
                color={proofOfDelivery?.recipientInfo ? colors.success : colors.textSecondary}
              />
              <Text variant='body2' style={{ marginLeft: 12, flex: 1 }}>
                Recipient Info
              </Text>
              {proofOfDelivery?.recipientInfo && <Badge color='success' content='Added' />}
            </View>

            {/* Notes */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon
                name={proofOfDelivery?.notes ? 'check-circle' : 'circle'}
                size={20}
                color={proofOfDelivery?.notes ? colors.success : colors.textSecondary}
              />
              <Text variant='body2' style={{ marginLeft: 12, flex: 1 }}>
                Notes
              </Text>
              {proofOfDelivery?.notes && <Badge color='success' content='Added' />}
            </View>
          </View>
        </Card>

        {/* COD Payment Status */}
        {currentDelivery.requiresCOD && (
          <Card style={{ marginBottom: 16 }}>
            <Heading level={4} style={{ marginBottom: 12 }}>
              COD Payment
            </Heading>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Icon
                  name={currentDelivery.codPayment?.status === 'COMPLETED' ? 'check-circle' : 'warning'}
                  size={20}
                  color={currentDelivery.codPayment?.status === 'COMPLETED' ? colors.success : colors.warning}
                />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text variant='body2'>
                    ${currentDelivery.codPayment?.amount.toFixed(2)} {currentDelivery.codPayment?.currency}
                  </Text>
                  <Text variant='caption' style={{ color: colors.textSecondary }}>
                    {currentDelivery.codPayment?.method}
                  </Text>
                </View>
              </View>

              {currentDelivery.codPayment?.status === 'COMPLETED' ? (
                <Badge color='success' content='Paid' />
              ) : (
                <Button
                  title='Collect Payment'
                  variant='outline'
                  size='sm'
                  onPress={() => navigation.navigate('CODPayment', { deliveryPointId })}
                />
              )}
            </View>
          </Card>
        )}

        {/* Warning if incomplete */}
        {!canCompleteDelivery(currentDelivery, proofOfDelivery) && (
          <Card style={{ marginBottom: 16, backgroundColor: '#FFF9E6', borderColor: '#FFB800', borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
              <Icon name='warning' size={20} color='#FFB800' style={{ marginTop: 2 }} />
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text variant='subtitle2' style={{ color: '#FFB800', marginBottom: 4 }}>
                  Incomplete Proof of Delivery
                </Text>
                <Text variant='caption' style={{ color: '#FFB800' }}>
                  Please capture all required proof of delivery items before completing.
                </Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={{ padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
        <View style={{ gap: 12 }}>
          <Button
            title='Complete Delivery'
            variant='primary'
            onPress={handleCompleteDelivery}
            loading={isCompleting}
            disabled={!canCompleteDelivery(currentDelivery, proofOfDelivery) || requiresPayment(currentDelivery)}
            leftIcon='check-circle'
          />

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button title='Edit POD' variant='outline' onPress={() => navigation.goBack()} style={{ flex: 1 }} />
            <Button
              title='Mark as Failed'
              variant='outline'
              onPress={() => bottomSheetRef.current?.expand()}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>

      {/* Fail Delivery Modal */}
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
        title='Mark Delivery as Failed'
      >
        <View style={{ padding: 16 }}>
          <Text style={{ marginBottom: 16 }}>Please provide details about why the delivery failed:</Text>

          <RadioGroup
            options={[
              { label: 'Recipient Not Available', value: FailureReason.RECIPIENT_NOT_AVAILABLE },
              { label: 'Wrong Address', value: FailureReason.WRONG_ADDRESS },
              { label: 'Refused Delivery', value: FailureReason.REFUSED_DELIVERY },
              { label: 'Damaged Goods', value: FailureReason.DAMAGED_GOODS },
              { label: 'Payment Issue', value: FailureReason.PAYMENT_ISSUE },
              { label: 'Other', value: FailureReason.OTHER },
            ]}
            value={failureReason}
            onChange={(value) => setFailureReason(value as FailureReason)}
            style={{ marginBottom: 16 }}
          />

          <TextArea
            placeholder='Additional notes...'
            value={failureNotes}
            onChangeText={setFailureNotes}
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
              title='Confirm'
              variant='primary'
              backgroundColor={colors.error}
              onPress={handleFailDelivery}
              loading={isFailingDelivery}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomSheetComponent>
    </View>
  );
};

export default DeliveryCompleteScreen;
