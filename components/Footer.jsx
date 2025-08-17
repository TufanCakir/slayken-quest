import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Ionicons,
  FontAwesome6,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import styles from "../styles/FooterStyles";

const Footer = () => {
  const navigation = useNavigation();

  const buttons = [
    {
      iconSet: Ionicons,
      iconName: "home-outline",
      label: "Home",
      screen: "HomeScreen",
    },
    {
      iconSet: FontAwesome6,
      iconName: "add",
      label: "Add",
      screen: "BattleScreen",
    },
    {
      iconSet: MaterialCommunityIcons,
      iconName: "face-man-profile",
      label: "Profile",
      screen: "CreateCharacterScreen",
    },
    {
      iconSet: Ionicons,
      iconName: "settings-outline",
      label: "Settings",
      screen: "CharacterSelectionScreen",
    },
  ];

  return (
    <View style={styles.footer}>
      <View style={styles.iconRow}>
        {buttons.map((btn, index) => {
          const Icon = btn.iconSet;
          return (
            <TouchableOpacity
              key={index}
              style={styles.iconContainer}
              onPress={() => navigation.navigate(btn.screen)}
            >
              <Icon name={btn.iconName} size={22} color="#fff" />
              <Text style={styles.iconText}>{btn.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Footer;
