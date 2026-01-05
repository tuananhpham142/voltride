// src/screens/delivery/CODPaymentScreen.tsx

import { PaymentMethod, PaymentStatus } from '@/models/Delivery/DeliveryEnum';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import { processCODPayment } from '@/store/slices/deliverySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, View } from 'react-native';
import { launchCamera } from 'react-native-image-picker';

// VoltRide components
import { Badge, Button, Card } from '@/components';
import QRCode from '@/components/assets/QRCode';
import Heading from '@/components/content/Heading';
import Text from '@/components/content/Text';
import { TextField } from '@/components/input';
import RadioGroup from '@/components/input/RadioGroup';
import { useTheme } from '@/hooks/useTheme';
import Icon from '@react-native-vector-icons/material-icons';

interface CODPaymentScreenProps {
  navigation: any;
  route: {
    params: {
      deliveryPointId: string;
    };
  };
}

export const CODPaymentScreen: React.FC<CODPaymentScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { deliveryPointId } = route.params;

  const { currentDelivery, isLoading } = useAppSelector((state) => state.delivery);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.VIETQR);
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [notes, setNotes] = useState('');

  const codPayment = currentDelivery?.codPayment;

  useEffect(() => {
    LoggingService.businessFlow('Opened COD payment screen', { deliveryPointId });
  }, []);

  const handleTakeProof = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
    });

    if (result.assets && result.assets[0]) {
      setPaymentProof(result.assets[0].uri!);
      LoggingService.businessFlow('Captured payment proof');
    }
  };

  const handleProcessPayment = async () => {
    if (!codPayment || !currentDelivery) return;

    // Validation
    if (paymentMethod === PaymentMethod.VIETQR && !transactionId.trim()) {
      Alert.alert('Missing Information', 'Please enter the transaction ID');
      return;
    }

    if (paymentMethod === PaymentMethod.CASH && !paymentProof) {
      Alert.alert('Missing Proof', 'Please take a photo of the cash received');
      return;
    }

    try {
      await dispatch(
        processCODPayment({
          deliveryPointId,
          paymentMethod,
          amount: codPayment.amount,
          transactionId: transactionId.trim() || undefined,
          paymentProof: paymentProof ? { uri: paymentProof, localPath: paymentProof } : undefined,
          notes: notes.trim() || undefined,
        }),
      ).unwrap();

      LoggingService.businessFlow('COD payment processed', {
        deliveryPointId,
        amount: codPayment.amount,
        method: paymentMethod,
      });

      Alert.alert('Payment Confirmed', 'COD payment has been recorded successfully.', [
        {
          text: 'OK',
          onPress: () => {
            // Return to POD capture or complete delivery
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to process COD payment', error as Error);
      Alert.alert('Error', 'Failed to process payment. Please try again.');
    }
  };

  if (!currentDelivery || !codPayment) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text>COD payment information not found</Text>
      </View>
    );
  }

  const paymentCompleted = codPayment.status === PaymentStatus.COMPLETED;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>
        <Heading level={3} style={{ marginBottom: 16 }}>
          COD Payment
        </Heading>

        {/* Payment Amount */}
        <Card style={{ marginBottom: 16 }}>
          <View style={{ alignItems: 'center', paddingVertical: 16 }}>
            <Text variant='caption' style={{ color: colors.textSecondary, marginBottom: 8 }}>
              Amount to Collect
            </Text>
            <Heading level={1} style={{ color: colors.primary }}>
              ${codPayment.amount.toFixed(2)}
            </Heading>
            <Text variant='caption' style={{ color: colors.textSecondary, marginTop: 4 }}>
              {codPayment.currency}
            </Text>
          </View>

          {paymentCompleted && (
            <View
              style={{
                marginTop: 16,
                padding: 12,
                backgroundColor: '#E6F9F0',
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Icon name='check-circle' size={20} color={colors.success} />
              <Text style={{ marginLeft: 8, color: colors.success, fontWeight: 'bold' }}>Payment Completed</Text>
            </View>
          )}
        </Card>

        {!paymentCompleted && (
          <>
            {/* Payment Method Selection */}
            <Card style={{ marginBottom: 16 }}>
              <Heading level={4} style={{ marginBottom: 12 }}>
                Payment Method
              </Heading>

              <RadioGroup
                options={[
                  {
                    label: 'VietQR',
                    value: PaymentMethod.VIETQR,
                    description: 'Customer scans QR code to pay',
                  },
                  {
                    label: 'Cash',
                    value: PaymentMethod.CASH,
                    description: 'Collect cash payment',
                  },
                  {
                    label: 'Card',
                    value: PaymentMethod.CARD,
                    description: 'Card payment terminal',
                  },
                ]}
                value={paymentMethod}
                onChange={(value) => setPaymentMethod(value as PaymentMethod)}
              />
            </Card>

            {/* VietQR Payment */}
            {paymentMethod === PaymentMethod.VIETQR && (
              <Card style={{ marginBottom: 16 }}>
                <Heading level={4} style={{ marginBottom: 12 }}>
                  VietQR Code
                </Heading>

                <Text variant='body2' style={{ marginBottom: 16, color: colors.textSecondary }}>
                  Show this QR code to the customer to complete payment
                </Text>

                {codPayment.qrCodeData ? (
                  <View style={{ alignItems: 'center', marginBottom: 16 }}>
                    <QRCode value={codPayment.qrCodeData} size={200} />

                    {codPayment.qrCodeUrl && (
                      <Image
                        source={{ uri: codPayment.qrCodeUrl }}
                        style={{ width: 200, height: 200, marginTop: 8 }}
                        resizeMode='contain'
                      />
                    )}
                  </View>
                ) : (
                  <View
                    style={{
                      padding: 32,
                      backgroundColor: colors.surface,
                      borderRadius: 8,
                      alignItems: 'center',
                      marginBottom: 16,
                    }}
                  >
                    <Icon name='qr-code' size={48} color={colors.textSecondary} />
                    <Text variant='caption' style={{ marginTop: 8, color: colors.textSecondary }}>
                      QR Code not available
                    </Text>
                  </View>
                )}

                <TextField
                  label='Transaction ID *'
                  placeholder='Enter transaction ID after payment'
                  value={transactionId}
                  onChangeText={setTransactionId}
                />
              </Card>
            )}

            {/* Cash Payment */}
            {paymentMethod === PaymentMethod.CASH && (
              <Card style={{ marginBottom: 16 }}>
                <Heading level={4} style={{ marginBottom: 12 }}>
                  Cash Payment
                </Heading>

                <Text variant='body2' style={{ marginBottom: 16, color: colors.textSecondary }}>
                  Collect ${codPayment.amount.toFixed(2)} in cash from the customer
                </Text>

                {/* Payment Proof Photo */}
                <View style={{ marginBottom: 12 }}>
                  <Text variant='subtitle2' style={{ marginBottom: 8 }}>
                    Payment Proof *
                  </Text>

                  {paymentProof ? (
                    <View>
                      <Image
                        source={{ uri: paymentProof }}
                        style={{
                          width: '100%',
                          height: 200,
                          backgroundColor: colors.surface,
                          borderRadius: 8,
                          marginBottom: 12,
                        }}
                        resizeMode='cover'
                      />
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        <Button title='Retake' variant='outline' onPress={handleTakeProof} style={{ flex: 1 }} />
                        <Button
                          title='Remove'
                          variant='outline'
                          onPress={() => setPaymentProof(null)}
                          style={{ flex: 1 }}
                        />
                      </View>
                    </View>
                  ) : (
                    <Button title='Take Photo of Cash' variant='outline' leftIcon='camera' onPress={handleTakeProof} />
                  )}
                </View>
              </Card>
            )}

            {/* Card Payment */}
            {paymentMethod === PaymentMethod.CARD && (
              <Card style={{ marginBottom: 16 }}>
                <Heading level={4} style={{ marginBottom: 12 }}>
                  Card Payment
                </Heading>

                <Text variant='body2' style={{ marginBottom: 16, color: colors.textSecondary }}>
                  Process card payment using your payment terminal
                </Text>

                <TextField
                  label='Transaction ID *'
                  placeholder='Enter transaction ID from terminal'
                  value={transactionId}
                  onChangeText={setTransactionId}
                />

                {/* Payment Proof Photo */}
                <View style={{ marginTop: 12 }}>
                  <Text variant='subtitle2' style={{ marginBottom: 8 }}>
                    Receipt Photo (Optional)
                  </Text>

                  {paymentProof ? (
                    <View>
                      <Image
                        source={{ uri: paymentProof }}
                        style={{
                          width: '100%',
                          height: 200,
                          backgroundColor: colors.surface,
                          borderRadius: 8,
                          marginBottom: 12,
                        }}
                        resizeMode='cover'
                      />
                      <View style={{ flexDirection: 'row', gap: 12 }}>
                        <Button title='Retake' variant='outline' onPress={handleTakeProof} style={{ flex: 1 }} />
                        <Button
                          title='Remove'
                          variant='outline'
                          onPress={() => setPaymentProof(null)}
                          style={{ flex: 1 }}
                        />
                      </View>
                    </View>
                  ) : (
                    <Button
                      title='Take Photo of Receipt'
                      variant='outline'
                      leftIcon='camera'
                      onPress={handleTakeProof}
                    />
                  )}
                </View>
              </Card>
            )}

            {/* Notes */}
            <Card style={{ marginBottom: 16 }}>
              <Heading level={4} style={{ marginBottom: 12 }}>
                Notes (Optional)
              </Heading>
              <TextField
                placeholder='Add any notes about the payment...'
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
            </Card>

            {/* Instructions */}
            <Card style={{ marginBottom: 16, backgroundColor: '#E6F3FF', borderColor: '#007AFF', borderWidth: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <Icon name='info' size={20} color='#007AFF' style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text variant='subtitle2' style={{ color: '#007AFF', marginBottom: 4 }}>
                    Payment Instructions
                  </Text>
                  <Text variant='caption' style={{ color: '#007AFF' }}>
                    {paymentMethod === PaymentMethod.VIETQR &&
                      'Have the customer scan the QR code with their banking app. Enter the transaction ID after payment is confirmed.'}
                    {paymentMethod === PaymentMethod.CASH &&
                      'Collect the exact amount in cash. Take a photo of the cash received as proof.'}
                    {paymentMethod === PaymentMethod.CARD &&
                      'Process the payment using your card terminal. Enter the transaction ID from the receipt.'}
                  </Text>
                </View>
              </View>
            </Card>
          </>
        )}

        {/* Payment History */}
        {codPayment.paidAt && (
          <Card style={{ marginBottom: 16 }}>
            <Heading level={4} style={{ marginBottom: 12 }}>
              Payment Details
            </Heading>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  Status
                </Text>
                <Badge color='success' content={codPayment.status} />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  Method
                </Text>
                <Text variant='body2'>{codPayment.method}</Text>
              </View>
              {codPayment.transactionId && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text variant='caption' style={{ color: colors.textSecondary }}>
                    Transaction ID
                  </Text>
                  <Text variant='body2'>{codPayment.transactionId}</Text>
                </View>
              )}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  Paid At
                </Text>
                <Text variant='body2'>{new Date(codPayment.paidAt).toLocaleString()}</Text>
              </View>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      {!paymentCompleted && (
        <View
          style={{ padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}
        >
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button title='Cancel' variant='outline' onPress={() => navigation.goBack()} style={{ flex: 1 }} />
            <Button
              title='Confirm Payment'
              variant='primary'
              onPress={handleProcessPayment}
              loading={isLoading}
              disabled={
                (paymentMethod === PaymentMethod.VIETQR && !transactionId.trim()) ||
                (paymentMethod === PaymentMethod.CASH && !paymentProof)
              }
              style={{ flex: 1 }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default CODPaymentScreen;
