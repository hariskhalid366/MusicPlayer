import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LucideIcon, Eye, EyeOff } from 'lucide-react-native';

interface CustomInputProps extends TextInputProps {
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  onRightIconPress?: () => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
  error?: string;
  placeholderTextColor?: string;
}

const Input: React.FC<CustomInputProps> = ({
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconPress,
  containerStyle,
  inputStyle,
  secureTextEntry,
  iconColor = '#64748b',
  iconSize = 20,
  placeholderTextColor = '#000000',
  error,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const renderRightIcon = () => {
    if (secureTextEntry) {
      const Icon = showPassword ? EyeOff : Eye;
      return (
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconContainer}
        >
          <Icon color={iconColor} size={iconSize} />
        </TouchableOpacity>
      );
    }

    if (RightIcon) {
      return (
        <TouchableOpacity
          onPress={onRightIconPress}
          disabled={!onRightIconPress}
          style={styles.iconContainer}
        >
          <RightIcon color={iconColor} size={iconSize} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  return (
    <View style={[styles.outerContainer, containerStyle]}>
      <View style={[styles.inputWrapper, error && styles.errorBorder]}>
        {LeftIcon && (
          <View style={styles.leftIconContainer}>
            <LeftIcon color={iconColor} size={iconSize} />
          </View>
        )}

        <TextInput
          {...props}
          style={[styles.input, inputStyle]}
          placeholderTextColor={placeholderTextColor}
          secureTextEntry={secureTextEntry && !showPassword}
        />

        {renderRightIcon()}
      </View>

      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 52,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#1e293b',
    paddingHorizontal: 8,
  },
  leftIconContainer: {
    paddingRight: 4,
  },
  iconContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBorder: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },
});

export default Input;