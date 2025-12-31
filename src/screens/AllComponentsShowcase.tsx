// src/screens/AllComponentsShowcase.tsx
import {
  Accordion,
  ActionSheet,
  // Assets
  Avatar,
  Badge,
  Banner,
  // Advanced
  BottomSheetComponent,
  // Control
  Button,
  Calendar,
  // Content
  Card,
  Carousel,
  // Input
  Checkbox,
  ChipInput,
  ColorPicker,
  ConfirmationModal,
  ContentSwitcher,
  Divider,
  Dropdown,
  EmptyState,
  EnhancedModal,
  FilePicker,
  FormBottomSheet,
  ImagePicker,
  ImagePlaceholder,
  ImageViewerModal,
  ListBottomSheet,
  ListItem,
  ListTitle,
  Loader,
  LoadingModal,
  LocationPin,
  // Map
  Map,
  // Chat
  MessageBubble,
  MessageInput,
  NavBar,
  NotificationBadge,
  NumberInput,
  OTPInput,
  // Device
  Overlay,
  PaginationDots,
  // Extra
  PopupMenu,
  ProgressBar,
  RadioButton,
  RatingReview,
  SearchBar,
  SearchBottomSheet,
  ShoppingCartItem,
  Skeleton,
  SkeletonGroup,
  Slider,
  SpeedDial,
  StarRating,
  // Progress
  Stepper,
  SwipeableCard,
  // Navigation
  TabBar,
  Tabs,
  Tag,
  TextArea,
  TextField,
  Timeline,
  // Informative
  Toggle,
  Tooltip,
  VideoPlaceholder
} from '@/components';
import { ToastProvider } from '@/components/Toast/ToastProvider';
import { useToast } from '@/components/Toast/useToast';
import { useTheme } from '@/hooks/useTheme';
import BottomSheet from '@gorhom/bottom-sheet';
import Icon from '@react-native-vector-icons/material-icons';
import React, { useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

/**
 * Complete Component Showcase
 * 
 * All 78 components in one screen:
 * - Core Components (43)
 * - Advanced Components (20)
 * - Extra Components (15)
 */
const ShowcaseContent = () => {
  const { colors, isDark, toggle } = useTheme();
  const toast = useToast()
  // State Management
  const [activeTab, setActiveTab] = useState('');
  const [checked, setChecked] = useState(false);
  const [radioValue, setRadioValue] = useState(false);
  const [toggleValue, setToggleValue] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [rating, setRating] = useState(4);
  const [sliderValue, setSliderValue] = useState(50);
  const [numberValue, setNumberValue] = useState(0);
  const [dropdownValue, setDropdownValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [chatMessage, setChatMessage] = useState('');
  const [cartQuantity, setCartQuantity] = useState(1);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [otpValue, setOtpValue] = useState('');
  const [chips, setChips] = useState<string[]>(['React', 'TypeScript']);
  const [notifCount, setNotifCount] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [stepperStep, setStepperStep] = useState(1);
  const [progressValue, setProgressValue] = useState(65);
  
  // Bottom Sheet refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const listSheetRef = useRef<BottomSheet>(null);
  const formSheetRef = useRef<BottomSheet>(null);
  const searchSheetRef = useRef<BottomSheet>(null);

  // Section Component
  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: colors.border }}>
      <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, marginBottom: 16 }}>
        {title}
      </Text>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ padding: 20, alignItems: 'center', backgroundColor: colors.primary }}>
          <Text style={{ fontSize: 32, fontWeight: '700', color: '#FFFFFF' }}>
            All Components
          </Text>
          <Text style={{ fontSize: 16, color: '#FFFFFF', marginTop: 8, opacity: 0.9 }}>
            78 Production-Ready Components
          </Text>
          <Button
            title={`${isDark ? 'Light' : 'Dark'} Mode`}
            variant="outline"
            size="sm"
            leftIcon={isDark ? 'light-mode' : 'dark-mode'}
            onPress={toggle}
            style={{ marginTop: 16 }}
            backgroundColor="#FFFFFF"
            textColor={colors.primary}
          />
        </View>

        {/* ASSETS (3) */}
        <Section title="Assets (3)">
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            <Avatar source="https://i.pravatar.cc/150?img=1" size="lg" />
            <Avatar size="lg" />
            <ImagePlaceholder width={100} height={100} />
            <VideoPlaceholder width={100} height={100} />
          </View>
        </Section>

        {/* CONTROL (5) */}
        <Section title="Control (5)">
          <View style={{ gap: 12 }}>
            <Button title="Primary Button" variant="primary" onPress={() => {}} />
            <Button title="Outline Button" variant="outline" onPress={() => {}} />
            
            <ContentSwitcher
              items={[{
                key: 'Option_1',
                title:'Option 1'
              }, {
                key: 'Option_2',
                title:'Option 2'
              }, {
                key: 'Option_3',
                title:'Option 3'
              }]}
              selectedKey={activeTab}
              onChange={setActiveTab}
            />
            
            <Tabs
              items={[
                { key: 'tab1', title: 'Tab 1' },
                { key: 'tab2', title: 'Tab 2' },
                { key: 'tab3', title: 'Tab 3' },
              ]}
              selectedKey="tab1"
              onChange={setActiveTab}
            />
            
            <Button
              title="Show Action Sheet"
              variant="outline"
              onPress={() => setShowActionSheet(true)}
            />
            
          </View>
        </Section>

        {/* INPUT (10) */}
        <Section title="Input (10)">
          <View style={{ gap: 16 }}>
            <Checkbox
              checked={checked}
              onChange={setChecked}
              label="Checkbox Example"
            />
            
            <RadioButton
              selected={radioValue}
              onSelect={() => setRadioValue(old => !old)}
            />
            
            <Toggle value={toggleValue} onValueChange={setToggleValue}  />
            
            <TextField
              label="Text Field"
              value={textValue}
              onChangeText={setTextValue}
              placeholder="Enter text..."
            />
            
            <TextArea
              label="Text Area"
              value={textValue}
              onChangeText={setTextValue}
              placeholder="Enter multiple lines..."
            />
            
            <View>
              <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>
                Star Rating: {rating}/5
              </Text>
              <StarRating rating={rating} onChange={setRating} size={32} />
            </View>
            
            <View>
              <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>
                Slider: {sliderValue}
              </Text>
              <Slider value={sliderValue} onChange={setSliderValue} min={0} max={100} />
            </View>
            
            <NumberInput
              label="Number Input"
              value={numberValue}
              onChange={setNumberValue}
            />
            
            <Dropdown
              label="Dropdown"
              value={dropdownValue}
              onChange={setDropdownValue}
              options={[
                { label: 'Option 1', value: 'opt1' },
                { label: 'Option 2', value: 'opt2' },
              ]}
            />
            
            <SearchBar
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="Search..."
            />
          </View>
        </Section>

        {/* INFORMATIVE (5) */}
        <Section title="Informative (5)">
          <View style={{ gap: 12 }}>
            <Button title="Show Toast" variant="outline" onPress={() => setShowToast(true)} />
            
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Badge content="New" color="primary" />
              <Badge content="5" color="error" />
              <Badge content="Pro" color="success" />
            </View>
            
                      <Banner
                          visible
              description="This is an info banner"
              type="info"
              onDismiss={() => {}}
            />
            
            <Button title="Show Dialog" variant="outline" onPress={() => setShowDialog(true)} />
            
            <Tooltip content="This is a tooltip" position="top">
              <Button title="Hover Me" variant="outline" />
            </Tooltip>
          </View>
        </Section>

        {/* CONTENT (7) */}
        <Section title="Content (7)">
          <View style={{ gap: 16 }}>
            <Card
                          title="Card Title"
                          description="This is a card description with some content."
                          image={{
                              uri:'https://picsum.photos/400/200'
                          }}
            />
            
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
              <Tag label="React Native" variant="filled" />
              <Tag label="TypeScript" variant="outlined" />
              <Tag label="Removable" variant="filled" onRemove={() => {}} />
            </View>
            
            <ListTitle title="List Section" subtitle="With subtitle" />
            
            <ListItem
              title="List Item"
              subtitle="With subtitle"
              leftIcon="star"
              rightIcon="chevron-right"
              onPress={() => {}}
            />
            
            <Accordion
              title="Accordion Title"
              initiallyExpanded={true}
            >
              <Text style={{ color: colors.text }}>Accordion content here</Text>
            </Accordion>
            
            <Divider />
            
            <Calendar
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </View>
        </Section>

        {/* NAVIGATION (2) */}
        <Section title="Navigation (2)">
          <View style={{ gap: 16 }}>
            <TabBar
              items={[
                { key: 'home', label: 'Home', icon: 'home',onPress: () => {} },
                { key: 'search', label: 'Search', icon: 'search',onPress: () => {} },
                { key: 'profile', label: 'Profile', icon: 'person',onPress: () => {} },
              ]}
              activeKey="home"
            />
            
            <NavBar
                title="Navigation Bar"
                leftControl={{
                    onPress: () => {},
                    icon: 'menu'
                }}
                rightControl={{
                    onPress: () => {},
                    icon: 'more-vert'
                }}
            />
          </View>
        </Section>

        {/* PROGRESS (4) */}
        <Section title="Progress (4)">
          <View style={{ gap: 16 }}>
            <Stepper
                steps={[
                    {
                    label: 'Step 1',
                    completed:true,
                    },
                    {
                    label: 'Step 2',
                    completed:false,
                    },
                    {
                    label: 'Step 3',
                    completed:false,
                    },
                    {
                    label: 'Step 4',
                    completed:false,
                    }
                ]}
              currentStep={stepperStep}
              orientation="horizontal"
            />
            
            <View>
              <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>
                Progress: {progressValue}%
              </Text>
              <ProgressBar progress={progressValue} height={8} />
            </View>
            
            <View style={{ alignItems: 'center', padding: 20 }}>
              <Loader size="large" variant="spinner" />
            </View>
            
            <View style={{ alignItems: 'center' }}>
              <PaginationDots total={5} current={currentPage} />
            </View>
          </View>
        </Section>

        {/* CHAT (2) */}
        <Section title="Chat (2)">
          <View style={{ gap: 12 }}>
            <MessageBubble
              message="Hello! This is a received message."
              timestamp="10:30 AM"
              senderName="John"
            />
            
            <MessageBubble
              message="This is my sent message!"
              timestamp="10:31 AM"
              status="read"
            />
            
            <MessageInput
              value={chatMessage}
              onChangeText={setChatMessage}
              onSend={() => {
                console.log('Send:', chatMessage);
                setChatMessage('');
              }}
              placeholder="Type a message..."
            />
          </View>
        </Section>

        {/* MAP (3) */}
        <Section title="Map & Commerce (3)">
          <View style={{ gap: 16 }}>
            <Map
              center={{ latitude: 37.78825, longitude: -122.4324 }}
              zoom={12}
              style={{ height: 200 }}
            />
            
            <LocationPin
              title="San Francisco"
              description="Golden Gate Bridge"
              coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
            />
            
            <ShoppingCartItem
              image={'https://picsum.photos/100'}
              name="Product Name"
              price={29.99}
              quantity={cartQuantity}
              onIncreaseQuantity={() => setCartQuantity((old) => old++)}
              onDecreaseQuantity={() => setCartQuantity((old) => old--)}
              onRemove={() => {}}
            />
          </View>
        </Section>

        {/* DEVICE (2) */}
        <Section title="Device (2)">
          <View style={{ gap: 12 }}>
            <Button
              title="Show Overlay"
              variant="outline"
              onPress={() => setShowOverlay(true)}
            />
            
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              KeyboardAvoidingWrapper: Wraps content to avoid keyboard
            </Text>
          </View>
        </Section>

        {/* ADVANCED - BOTTOM SHEETS (4) */}
        <Section title="Advanced - Bottom Sheets (4)">
          <View style={{ gap: 12 }}>
            <Button
              title="Standard Bottom Sheet"
              variant="secondary"
              onPress={() => bottomSheetRef.current?.expand()}
            />
            <Button
              title="List Bottom Sheet"
              variant="secondary"
              onPress={() => listSheetRef.current?.expand()}
            />
            <Button
              title="Form Bottom Sheet"
              variant="secondary"
              onPress={() => formSheetRef.current?.expand()}
            />
            <Button
              title="Search Bottom Sheet"
              variant="secondary"
              onPress={() => searchSheetRef.current?.expand()}
            />
          </View>
        </Section>

        {/* ADVANCED - MODALS (4) */}
        <Section title="Advanced - Modals (4)">
          <View style={{ gap: 12 }}>
            <Button
              title="Standard Modal"
              variant="secondary"
              onPress={() => setShowModal(true)}
            />
            <Button
              title="Confirmation Modal"
              variant="secondary"
              onPress={() => setShowConfirmModal(true)}
            />
            <Button
              title="Loading Modal (2s)"
              variant="secondary"
              onPress={() => {
                setShowLoadingModal(true);
                setTimeout(() => setShowLoadingModal(false), 2000);
              }}
            />
            <Button
              title="Image Viewer"
              variant="secondary"
              onPress={() => setShowImageModal(true)}
            />
          </View>
        </Section>

        {/* ADVANCED - TOAST SYSTEM (3) */}
        <Section title="Advanced - Toast System (3)">
          <View style={{ gap: 12 }}>
            <Button
              title="Success Toast"
              variant="outline"
              onPress={() => toast.showToast({
                type: 'success',
                title: 'Success',
                message: 'Operation completed!',
              })}
            />
            <Button
              title="Error Toast"
              variant="outline"
              onPress={() => toast.showToast({
                type: 'error',
                title: 'Error',
                message: 'Something went wrong',
              })}
            />
            <Button
              title="Show Snackbar"
              variant="outline"
              onPress={() => setShowSnackbar(true)}
            />
          </View>
        </Section>

        {/* ADVANCED - PICKERS (4) */}
        <Section title="Advanced - Pickers (4)">
          <View style={{ gap: 16 }}>
            <ImagePicker
              images={selectedImages}
              onImagesSelected={setSelectedImages}
              maxImages={3}
            />
            
            <FilePicker
              files={selectedFiles}
              onFilesSelected={setSelectedFiles}
              maxFiles={2}
            />
            
            <ColorPicker
              color={selectedColor}
              onChange={setSelectedColor}
              showInput
            />
            
            <View>
              <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>
                OTP Input:
              </Text>
              <OTPInput
                length={6}
                value={otpValue}
                onChange={setOtpValue}
                autoFocus={false}
              />
            </View>
          </View>
        </Section>

        {/* EXTRA - MENU & FAB (4) */}
        <Section title="Extra - Menu & FAB (4)">
          <View style={{ gap: 12 }}>
            <PopupMenu
              items={[
                { key: 'edit', title: 'Edit', icon: 'edit', onPress: () => {} },
                { key: 'delete', title: 'Delete', icon: 'delete', destructive: true, onPress: () => {} },
              ]}
            >
              <Button title="Show Popup Menu" variant="outline" />
            </PopupMenu>
            
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              FAB & SpeedDial: Shown in bottom-right corner
            </Text>
          </View>
        </Section>

        {/* EXTRA - ANIMATIONS (5) */}
        <Section title="Extra - Animations (5)">
          <View style={{ gap: 16 }}>
            <Skeleton width="100%" height={20} />
            <Skeleton width="80%" height={20} />
            
            <SkeletonGroup lines={3} avatar />
            
            <SwipeableCard
              onSwipeLeft={() => console.log('Left')}
              onSwipeRight={() => console.log('Right')}
              leftActionIcon={<Icon name="check" size={32} color="#FFF" />}
              rightActionIcon={<Icon name="delete" size={32} color="#FFF" />}
            >
              <View style={{ padding: 20, backgroundColor: colors.surface, borderRadius: 12 }}>
                <Text style={{ color: colors.text }}>Swipe me!</Text>
              </View>
            </SwipeableCard>
            
            <Carousel
              data={[
                { id: 1, color: colors.primary },
                { id: 2, color: colors.success },
                { id: 3, color: colors.warning },
              ]}
              renderItem={(item) => (
                <View style={{
                  height: 150,
                  backgroundColor: item.color,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{ color: '#FFF', fontSize: 20, fontWeight: '700' }}>
                    Slide {item.id}
                  </Text>
                </View>
              )}
              showPagination
            />
          </View>
        </Section>

        {/* EXTRA - UTILITIES (6) */}
        <Section title="Extra - Utilities (6)">
          <View style={{ gap: 16 }}>
            <EmptyState
              icon="inbox"
              title="Empty State"
              description="No items found"
            />
            
            <RatingReview
              rating={4.5}
              totalReviews={234}
              showBreakdown
              breakdown={[100, 80, 30, 15, 9]}
            />
            
            <Timeline
              items={[
                { key: '1', title: 'Completed', status: 'completed', icon: 'check' },
                { key: '2', title: 'In Progress', status: 'active', icon: 'hourglass-empty' },
                { key: '3', title: 'Pending', status: 'pending', icon: 'schedule' },
              ]}
            />
            
            <ChipInput
              chips={chips}
              onChange={setChips}
              placeholder="Add tag..."
            />
            
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              <NotificationBadge count={notifCount}>
                <Icon name="notifications" size={32} color={colors.text} />
              </NotificationBadge>
              
              <Button
                title="Reset Badge"
                variant="outline"
                size="sm"
                onPress={() => setNotifCount(0)}
              />
            </View>
          </View>
        </Section>

        {/* Footer */}
        <View style={{ padding: 40, alignItems: 'center' }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: colors.text }}>
            🎉 All 78 Components!
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginTop: 8 }}>
            Production-Ready • TypeScript • Dark Mode
          </Text>
        </View>

        {/* Spacer for FAB */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Sheets */}
      <BottomSheetComponent
        bottomSheetRef={bottomSheetRef}
        snapPoints={['25%', '50%']}
        title="Standard Bottom Sheet"
        showCloseButton
        onClose={() => bottomSheetRef.current?.close()}
      >
        <Text style={{ color: colors.text }}>Bottom sheet content</Text>
      </BottomSheetComponent>

      <ListBottomSheet
        bottomSheetRef={listSheetRef}
        title="Select Option"
        showCloseButton
        onClose={() => listSheetRef.current?.close()}
        items={[
          { key: '1', title: 'Edit', icon: 'edit', onPress: () => {} },
          { key: '2', title: 'Share', icon: 'share', onPress: () => {} },
        ]}
      />

      <FormBottomSheet
        bottomSheetRef={formSheetRef}
        title="Form Sheet"
        showCloseButton
        onClose={() => formSheetRef.current?.close()}
        primaryButtonText="Submit"
        secondaryButtonText="Cancel"
        onPrimaryPress={() => formSheetRef.current?.close()}
        onSecondaryPress={() => formSheetRef.current?.close()}
      >
        <Text style={{ color: colors.text }}>Form content</Text>
      </FormBottomSheet>

      <SearchBottomSheet
        bottomSheetRef={searchSheetRef}
        title="Search"
        showCloseButton
        onClose={() => searchSheetRef.current?.close()}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      >
        <Text style={{ color: colors.text }}>Search results</Text>
      </SearchBottomSheet>

      {/* Modals */}
      <EnhancedModal
        visible={showModal}
        onDismiss={() => setShowModal(false)}
        title="Modal"
        showCloseButton
      >
        <Text style={{ color: colors.text }}>Modal content</Text>
      </EnhancedModal>

      <ConfirmationModal
        visible={showConfirmModal}
        onDismiss={() => setShowConfirmModal(false)}
        title="Confirm"
        description="Are you sure?"
        confirmText="Yes"
        cancelText="No"
        onConfirm={() => {}}
      />

      <LoadingModal visible={showLoadingModal} message="Loading..." />

      <ImageViewerModal
        visible={showImageModal}
        onDismiss={() => setShowImageModal(false)}
        imageUri="https://picsum.photos/800"
      />

      {/* Overlay */}
      {showOverlay && (
        <Overlay visible={showOverlay} onDismiss={() => setShowOverlay(false)}>
          <View style={{ padding: 20, backgroundColor: colors.surface, borderRadius: 12 }}>
            <Text style={{ color: colors.text, fontSize: 18, marginBottom: 12 }}>
              Overlay Content
            </Text>
            <Button title="Close" onPress={() => setShowOverlay(false)} />
          </View>
        </Overlay>
      )}

      {/* Action Sheet */}
      <ActionSheet
        visible={showActionSheet}
        onDismiss={() => setShowActionSheet(false)}
        items={[
          { key: 'option1', title: 'Option 1', onPress: () => {} },
          { key: 'option2', title: 'Option 2', onPress: () => {} },
        ]}
      />

      {/* FAB */}
      <SpeedDial
        icon="add"
        position="bottom-right"
        actions={[
          { key: 'photo', label: 'Photo', icon: 'photo-camera', onPress: () => {} },
          { key: 'video', label: 'Video', icon: 'videocam', onPress: () => {} },
        ]}
      />
    </SafeAreaView>
  );
};

/**
 * Main Export with Providers
 */
export const AllComponentsShowcase = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        <ShowcaseContent />
      </ToastProvider>
    </GestureHandlerRootView>
  );
};

export default AllComponentsShowcase;
