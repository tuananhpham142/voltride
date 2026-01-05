// src/screens/delivery/PODCaptureScreen.tsx

import { useLocationTracking } from '@/hooks/useLocationTracking';
import { requiresPayment } from '@/models/Delivery/DeliveryModel';
import { LogCategory, LoggingService } from '@/services/logging/loggingService';
import {
  addCapturedPhoto,
  clearPODCapture,
  createPOD,
  removeCapturedPhoto,
  setCapturedNotes,
  setCapturedSignature,
  setRecipientInfo,
} from '@/store/slices/deliverySlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useRef, useState } from 'react';
import { Alert, Image, ScrollView, useWindowDimensions, View } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

// VoltRide components
import { Badge, BottomSheetComponent, Button, Card } from '@/components';
import Heading from '@/components/content/Heading';
import ImageGrid from '@/components/content/ImageGrid';
import Text from '@/components/content/Text';
import { TextArea, TextField } from '@/components/input';
import { useTheme } from '@/hooks/useTheme';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/material-icons';

interface PODCaptureScreenProps {
  navigation: any;
  route: {
    params: {
      deliveryPointId: string;
    };
  };
}

export const PODCaptureScreen: React.FC<PODCaptureScreenProps> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const isTablet = width > 768;
  const { deliveryPointId } = route.params;

  const { currentDelivery, capturedPhotos, capturedSignature, capturedNotes, recipientInfo, isCapturing } =
    useAppSelector((state) => state.delivery);

  const { getCurrentLocation } = useLocationTracking();
  const signaturePadRef = useRef<any>(null);
  const bottomSheetSignaturePadRef = useRef<BottomSheet>(null);
  const bottomSheetRecipientRef = useRef<BottomSheet>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [recipientName, setRecipientName] = useState(recipientInfo?.name || '');
  const [recipientPhone, setRecipientPhone] = useState(recipientInfo?.phoneNumber || '');
  const [recipientId, setRecipientId] = useState(recipientInfo?.idNumber || '');

  const handleTakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
    });

    if (result.assets && result.assets[0]) {
      dispatch(addCapturedPhoto(result.assets[0].uri!));
      LoggingService.businessFlow('Captured delivery photo');
    }

    bottomSheetRef.current?.close();
  };

  const handlePickPhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1920,
      maxHeight: 1080,
      selectionLimit: 5,
    });

    if (result.assets) {
      result.assets.forEach((asset) => {
        if (asset.uri) {
          dispatch(addCapturedPhoto(asset.uri));
        }
      });
      LoggingService.businessFlow('Selected delivery photos', { count: result.assets.length });
    }

    bottomSheetRef.current?.close();
  };

  const handleRemovePhoto = (index: number) => {
    Alert.alert('Remove Photo', 'Are you sure you want to remove this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          dispatch(removeCapturedPhoto(index));
          LoggingService.businessFlow('Removed delivery photo');
        },
      },
    ]);
  };

  const handleSaveSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.readSignature();
    }
  };

  const onSignatureEnd = (signature: string) => {
    dispatch(setCapturedSignature(signature));
    bottomSheetSignaturePadRef.current?.close();
    LoggingService.businessFlow('Captured signature');
  };

  const handleClearSignature = () => {
    dispatch(setCapturedSignature(null));
  };

  const handleSaveRecipientInfo = () => {
    if (!recipientName.trim()) {
      Alert.alert('Error', 'Please enter recipient name');
      return;
    }

    dispatch(
      setRecipientInfo({
        name: recipientName,
        phoneNumber: recipientPhone,
        idNumber: recipientId,
      }),
    );

    bottomSheetRecipientRef.current?.close();
    LoggingService.businessFlow('Saved recipient info');
  };

  const handleScanQR = () => {
    // Navigate to QR scanner
    navigation.navigate('QRScanner', {
      deliveryPointId,
      onScan: (qrData: string) => {
        // Parse QR data and auto-fill recipient info
        // This would depend on your QR code format
        LoggingService.businessFlow('Scanned recipient QR', { qrData });
      },
    });
  };

  const handleSubmitPOD = async () => {
    // Validation
    if (capturedPhotos.length === 0) {
      Alert.alert('Missing Photos', 'Please capture at least one photo of the delivery.');
      return;
    }

    if (!currentDelivery) return;

    // Check if COD payment is required but not completed
    if (requiresPayment(currentDelivery)) {
      Alert.alert(
        'Payment Required',
        'This delivery requires COD payment. Please collect payment before completing delivery.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Process Payment',
            onPress: () => navigation.navigate('CODPayment', { deliveryPointId }),
          },
        ],
      );
      return;
    }

    try {
      const location = await getCurrentLocation();

      // Create POD
      await dispatch(
        createPOD({
          deliveryPointId,
          photos: capturedPhotos.map((uri, index) => ({
            uri,
            type: index === 0 ? 'PACKAGE' : 'LOCATION',
            localPath: uri,
          })),
          signature: capturedSignature ? { uri: capturedSignature, localPath: capturedSignature } : undefined,
          notes: capturedNotes || undefined,
          recipientInfo: recipientInfo || undefined,
          location: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
          },
          timestamp: new Date().toISOString(),
        }),
      ).unwrap();

      LoggingService.businessFlow('POD created successfully', { deliveryPointId });

      // Navigate to completion screen
      navigation.replace('DeliveryComplete', { deliveryPointId });
    } catch (error) {
      LoggingService.error(LogCategory.BUSINESS_FLOW, 'Failed to create POD', error as Error);
      Alert.alert('Error', 'Failed to save proof of delivery. Please try again.');
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
        <Heading level={3} style={{ marginBottom: 16 }}>
          Proof of Delivery
        </Heading>

        {/* Photos Section */}
        <Card style={{ marginBottom: 16 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
          >
            <Heading level={4}>Photos *</Heading>
            <Badge content={`${capturedPhotos.length}`} />
          </View>

          <Text variant='caption' style={{ color: colors.textSecondary, marginBottom: 12 }}>
            Take photos of the package, delivery location, and recipient
          </Text>

          {capturedPhotos.length > 0 && (
            <ImageGrid
              images={capturedPhotos}
              columns={isTablet ? 4 : 3}
              onImagePress={(index) => {
                // Show full image
              }}
              onImageLongPress={handleRemovePhoto}
              style={{ marginBottom: 12 }}
            />
          )}

          <Button title='Add Photos' variant='outline' leftIcon='camera' onPress={() => setShowPhotoOptions(true)} />
        </Card>

        {/* Signature Section */}
        <Card style={{ marginBottom: 16 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
          >
            <Heading level={4}>Signature (Optional)</Heading>
            {capturedSignature && <Badge content='Captured' color='success' />}
          </View>

          {capturedSignature ? (
            <View>
              <Image
                source={{ uri: capturedSignature }}
                style={{
                  width: '100%',
                  height: 150,
                  backgroundColor: colors.surface,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
                resizeMode='contain'
              />
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Button
                  title='Retake'
                  variant='outline'
                  onPress={() => bottomSheetSignaturePadRef.current?.expand()}
                  style={{ flex: 1 }}
                />
                <Button title='Remove' variant='outline' onPress={handleClearSignature} style={{ flex: 1 }} />
              </View>
            </View>
          ) : (
            <Button
              title='Capture Signature'
              variant='outline'
              leftIcon='edit'
              onPress={() => bottomSheetSignaturePadRef.current?.expand()}
            />
          )}
        </Card>

        {/* Recipient Information */}
        <Card style={{ marginBottom: 16 }}>
          <View
            style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}
          >
            <Heading level={4}>Recipient Info (Optional)</Heading>
            {recipientInfo && <Badge content='Added' color='success' />}
          </View>

          {recipientInfo ? (
            <View style={{ marginBottom: 12 }}>
              <Text variant='body1'>{recipientInfo.name}</Text>
              {recipientInfo.phoneNumber && (
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  {recipientInfo.phoneNumber}
                </Text>
              )}
              {recipientInfo.idNumber && (
                <Text variant='caption' style={{ color: colors.textSecondary }}>
                  ID: {recipientInfo.idNumber}
                </Text>
              )}
            </View>
          ) : null}

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <Button
              title={recipientInfo ? 'Edit' : 'Add Manually'}
              variant='outline'
              leftIcon='user'
              onPress={() => bottomSheetRecipientRef.current?.expand()}
              style={{ flex: 1 }}
            />
            <Button title='Scan QR' variant='outline' leftIcon='qr-code' onPress={handleScanQR} style={{ flex: 1 }} />
          </View>
        </Card>

        {/* Notes Section */}
        <Card style={{ marginBottom: 16 }}>
          <Heading level={4} style={{ marginBottom: 12 }}>
            Notes (Optional)
          </Heading>
          <TextArea
            placeholder='Add any additional notes about the delivery...'
            value={capturedNotes || ''}
            onChangeText={(text) => dispatch(setCapturedNotes(text))}
            numberOfLines={4}
          />
        </Card>

        {/* COD Warning */}
        {requiresPayment(currentDelivery) && (
          <Card style={{ marginBottom: 16, backgroundColor: '#FFF9E6', borderColor: '#FFB800', borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name='warning' size={20} color='#FFB800' />
              <Text style={{ marginLeft: 8, color: '#FFB800' }}>
                Remember to collect COD payment before completing delivery
              </Text>
            </View>
          </Card>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <View style={{ padding: 16, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border }}>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <Button
            title='Cancel'
            variant='outline'
            onPress={() => {
              Alert.alert('Discard Changes?', 'Are you sure you want to discard this proof of delivery?', [
                { text: 'Keep Editing', style: 'cancel' },
                {
                  text: 'Discard',
                  style: 'destructive',
                  onPress: () => {
                    dispatch(clearPODCapture());
                    navigation.goBack();
                  },
                },
              ]);
            }}
            style={{ flex: 1 }}
          />
          <Button
            title='Continue'
            variant='primary'
            onPress={handleSubmitPOD}
            loading={isCapturing}
            disabled={capturedPhotos.length === 0}
            style={{ flex: 1 }}
          />
        </View>
      </View>

      {/* Photo Options Modal */}
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        onClose={() => bottomSheetRef.current?.close()}
        title='Add Photos'
      >
        <View style={{ padding: 16, gap: 12 }}>
          <Button title='Take Photo' variant='primary' leftIcon='camera' onPress={handleTakePhoto} />
          <Button title='Choose from Gallery' variant='outline' leftIcon='image' onPress={handlePickPhoto} />
          <Button title='Cancel' variant='outline' onPress={() => bottomSheetRef.current?.close()} />
        </View>
      </BottomSheetComponent>

      {/* Signature Pad Modal */}
      {/* <BottomSheetComponent
     bottomSheetRef={bottomSheetSignaturePadRef}
        onClose={() => bottomSheetSignaturePadRef.current?.close()}
        title="Capture Signature"
        
      >
        <View style={{ flex: 1, padding: 16 }}>
          <SignaturePad
            ref={signaturePadRef}
            onSignatureEnd={onSignatureEnd}
            style={{ flex: 1, backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }}
          />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
            <Button
              title="Clear"
              variant="outline"
              onPress={() => signaturePadRef.current?.clearSignature()}
              style={{ flex: 1 }}
            />
            <Button
              title="Save"
              variant="primary"
              onPress={handleSaveSignature}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </BottomSheetComponent> */}

      {/* Recipient Info Form Modal */}
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRecipientRef}
        onClose={() => bottomSheetRecipientRef.current?.close()}
        title='Recipient Information'
      >
        <View style={{ padding: 16, gap: 12 }}>
          <TextField
            label='Name *'
            placeholder='Enter recipient name'
            value={recipientName}
            onChangeText={setRecipientName}
          />
          <TextField
            label='Phone Number'
            placeholder='Enter phone number'
            value={recipientPhone}
            onChangeText={setRecipientPhone}
            keyboardType='phone-pad'
          />
          <TextField
            label='ID Number'
            placeholder='Enter ID number'
            value={recipientId}
            onChangeText={setRecipientId}
          />
          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Button
              title='Cancel'
              variant='outline'
              onPress={() => bottomSheetRecipientRef.current?.close()}
              style={{ flex: 1 }}
            />
            <Button title='Save' variant='primary' onPress={handleSaveRecipientInfo} style={{ flex: 1 }} />
          </View>
        </View>
      </BottomSheetComponent>
    </View>
  );
};

export default PODCaptureScreen;
