// src/screens/delivery/DeliveryPointScreen.tsx

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { DeliveryStatus } from '@/models/Delivery/DeliveryEnum';
import { canStartDelivery } from '@/models/Delivery/DeliveryModel';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { setCurrentDelivery, startDelivery } from '@/store/slices/deliverySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect } from 'react';
import { Alert, Linking, Platform, ScrollView, View } from 'react-native';

// VoltRide components
import { Badge, Button, Card, Divider } from '@/components';
import Heading from '@/components/content/Heading';
import Text from '@/components/content/Text';
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';

interface DeliveryPointScreenProps {
  navigation: any;
  route: {
    params: {
      deliveryPointId: string;
    };
  };
}

export const DeliveryPointScreen: React.FC<DeliveryPointScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { deliveryPointId } = route.params;

  const { deliveries, isLoading } = useAppSelector((state) => state.delivery);
  const { getCurrentLocation } = useLocationTracking();

  const deliveryPoint = deliveries.find((d) => d.id === deliveryPointId);

  useEffect(() => {
    if (deliveryPoint) {
      dispatch(setCurrentDelivery(deliveryPoint));
      LoggingService.businessFlow('Viewed delivery point', { deliveryPointId });
    }
  }, [deliveryPointId]);

  const handleStartDelivery = async () => {
    if (!deliveryPoint || !canStartDelivery(deliveryPoint)) return;

    try {
      const location = await getCurrentLocation();

      await dispatch(
        startDelivery({
          deliveryPointId: deliveryPoint.id,
          startTime: new Date().toISOString(),
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          },
        }),
      ).unwrap();

      LoggingService.businessFlow('Started delivery', { deliveryPointId: deliveryPoint.id });

      // Navigate to POD capture
      navigation.navigate('PODCapture', { deliveryPointId: deliveryPoint.id });
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to start delivery', error as Error);
      Alert.alert('Error', 'Failed to start delivery');
    }
  };

  const openGoogleMaps = () => {
    if (!deliveryPoint) return;

    const { latitude, longitude } = deliveryPoint.address;
    const url = Platform.select({
      ios: `comgooglemaps://?daddr=${latitude},${longitude}&directionsmode=driving`,
      android: `google.navigation:q=${latitude},${longitude}&mode=d`,
    });

    Linking.canOpenURL(url!).then((supported) => {
      if (supported) {
        Linking.openURL(url!);
        LoggingService.businessFlow('Opened navigation to delivery point');
      } else {
        Alert.alert('Error', 'Google Maps is not installed');
      }
    });
  };

  const handleCallRecipient = () => {
    if (!deliveryPoint) return;

    const phoneUrl = `tel:${deliveryPoint.recipient.phoneNumber}`;
    Linking.canOpenURL(phoneUrl).then((supported) => {
      if (supported) {
        Linking.openURL(phoneUrl);
        LoggingService.businessFlow('Called recipient');
      } else {
        Alert.alert('Error', 'Cannot make phone calls');
      }
    });
  };

  if (!deliveryPoint) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Delivery point not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        {/* Status Badge */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Heading level={3}>Delivery Details</Heading>
          <Badge
            color={
              deliveryPoint.status === DeliveryStatus.SUCCESS
                ? 'success'
                : deliveryPoint.status === DeliveryStatus.FAILED
                  ? 'error'
                  : deliveryPoint.status === DeliveryStatus.IN_PROGRESS
                    ? 'primary'
                    : 'default'
            }
            content={deliveryPoint.status}
          />
        </View>

        {/* Recipient Information */}
        <Card style={{ marginBottom: 16 }}>
          <Heading level={4} style={{ marginBottom: 12 }}>
            Recipient
          </Heading>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Icon name='people' size={20} color={colors.primary} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text variant='subtitle1'>{deliveryPoint.recipient.name}</Text>
              <Text variant='caption' style={{ color: colors.textSecondary }}>
                {deliveryPoint.recipient.phoneNumber}
              </Text>
            </View>
            <Button title='Call' variant='outline' size='sm' leftIcon='phone' onPress={handleCallRecipient} />
          </View>

          {deliveryPoint.recipient.email && (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name='mail' size={20} color={colors.textSecondary} />
              <Text variant='body2' style={{ marginLeft: 12 }}>
                {deliveryPoint.recipient.email}
              </Text>
            </View>
          )}
        </Card>

        {/* Delivery Address */}
        <Card style={{ marginBottom: 16 }}>
          <Heading level={4} style={{ marginBottom: 12 }}>
            Delivery Address
          </Heading>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 }}>
            <Icon name='location-pin' size={20} color={colors.primary} style={{ marginTop: 2 }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text variant='body1'>{deliveryPoint.address.street}</Text>
              <Text variant='body2' style={{ marginTop: 4 }}>
                {deliveryPoint.address.city}, {deliveryPoint.address.zipCode}
              </Text>
              {deliveryPoint.address.additionalInfo && (
                <Text variant='caption' style={{ marginTop: 4, color: colors.textSecondary }}>
                  Note: {deliveryPoint.address.additionalInfo}
                </Text>
              )}
            </View>
          </View>

          <Button title='Navigate to Location' variant='primary' leftIcon='navigation' onPress={openGoogleMaps} />
        </Card>

        {/* Packages */}
        <Card style={{ marginBottom: 16 }}>
          <Heading level={4} style={{ marginBottom: 12 }}>
            Packages ({deliveryPoint.packages.length})
          </Heading>

          {deliveryPoint.packages.map((pkg, index) => (
            <View key={pkg.id}>
              {index > 0 && <Divider style={{ marginVertical: 12 }} />}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text variant='subtitle2'>{pkg.description}</Text>
                  <Text variant='caption' style={{ color: colors.textSecondary, marginTop: 4 }}>
                    Tracking: {pkg.trackingNumber}
                  </Text>
                </View>
                {pkg.isFragile && <Badge color='warning' content='FRAGILE' />}
              </View>

              <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                <View>
                  <Text variant='caption' style={{ color: colors.textSecondary }}>
                    Weight
                  </Text>
                  <Text variant='body2'>{pkg.weight} kg</Text>
                </View>
                {pkg.dimensions && (
                  <View>
                    <Text variant='caption' style={{ color: colors.textSecondary }}>
                      Dimensions
                    </Text>
                    <Text variant='body2'>
                      {pkg.dimensions.length} × {pkg.dimensions.width} × {pkg.dimensions.height} cm
                    </Text>
                  </View>
                )}
                {pkg.value && (
                  <View>
                    <Text variant='caption' style={{ color: colors.textSecondary }}>
                      Value
                    </Text>
                    <Text variant='body2'>${pkg.value.toFixed(2)}</Text>
                  </View>
                )}
              </View>

              {pkg.specialInstructions && (
                <View style={{ marginTop: 8, padding: 8, backgroundColor: colors.surface, borderRadius: 4 }}>
                  <Text variant='caption' style={{ fontStyle: 'italic' }}>
                    {pkg.specialInstructions}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </Card>

        {/* COD Payment Info */}
        {deliveryPoint.requiresCOD && (
          <Card style={{ marginBottom: 16, backgroundColor: '#FFF9E6', borderColor: '#FFB800', borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Icon name='warning' size={20} color='#FFB800' />
              <Text variant='subtitle1' style={{ marginLeft: 8, color: '#FFB800' }}>
                COD Payment Required
              </Text>
            </View>

            {deliveryPoint.codPayment && (
              <>
                <Text variant='body1' style={{ fontWeight: 'bold', marginBottom: 8 }}>
                  Amount: ${deliveryPoint.codPayment.amount.toFixed(2)} {deliveryPoint.codPayment.currency}
                </Text>
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  Payment must be collected before completing delivery
                </Text>
              </>
            )}
          </Card>
        )}

        {/* Scheduled Time */}
        {deliveryPoint.scheduledTime && (
          <Card style={{ marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name='lock-clock' size={20} color={colors.textSecondary} />
              <View style={{ marginLeft: 12 }}>
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  Scheduled Time
                </Text>
                <Text variant='body1'>{new Date(deliveryPoint.scheduledTime).toLocaleString()}</Text>
              </View>
            </View>
          </Card>
        )}

        {/* High Priority Indicator */}
        {deliveryPoint.isHighPriority && (
          <Card style={{ marginBottom: 16, backgroundColor: '#FFE6E6', borderColor: '#FF3B30', borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name='warning' size={20} color='#FF3B30' />
              <Text variant='subtitle1' style={{ marginLeft: 8, color: '#FF3B30' }}>
                High Priority Delivery
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Action Button */}
      <View style={{ padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
        {deliveryPoint.status === DeliveryStatus.PENDING && (
          <Button
            title='Start Delivery'
            variant='primary'
            onPress={handleStartDelivery}
            loading={isLoading}
            leftIcon='play-circle'
          />
        )}

        {deliveryPoint.status === DeliveryStatus.IN_PROGRESS && (
          <Button
            title='Capture Proof of Delivery'
            variant='primary'
            onPress={() => navigation.navigate('PODCapture', { deliveryPointId: deliveryPoint.id })}
            leftIcon='camera'
          />
        )}

        {deliveryPoint.status === DeliveryStatus.SUCCESS && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='check-circle' size={24} color={colors.success} />
            <Text variant='subtitle1' style={{ marginLeft: 8, color: colors.success }}>
              Delivery Completed
            </Text>
          </View>
        )}

        {deliveryPoint.status === DeliveryStatus.FAILED && (
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name='close' size={24} color={colors.error} />
            <Text variant='subtitle1' style={{ marginLeft: 8, color: colors.error }}>
              Delivery Failed
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DeliveryPointScreen;
