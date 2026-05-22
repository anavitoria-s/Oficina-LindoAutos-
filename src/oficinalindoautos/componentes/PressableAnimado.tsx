import React, { useRef } from 'react';
import { Animated, Pressable, ViewStyle, StyleProp, GestureResponderEvent } from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export default function PressableAnimado({ children, onPress, style, disabled }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    if (disabled) return;
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    if (disabled) return;
    Animated.spring(animatedValue, {
      toValue: 0,
      useNativeDriver: true,
      tension: 150,
      friction: 8,
    }).start();
  };

  const translateY = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 3],
  });

  const scale = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.96],
  });

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={disabled}
      style={{ flex: style && (style as any).flex !== undefined ? (style as any).flex : undefined }}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ translateY }, { translateX }, { scale }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
