import { View, TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons, FontAwesome6, FontAwesome5 } from "@expo/vector-icons";
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
      iconName: "people-arrows",
      label: "Create",
      screen: "CreateCharacterScreen",
    },
    {
      iconSet: FontAwesome6,
      iconName: "people-roof",
      label: "Selection",
      screen: "CharacterSelectionScreen",
    },
    {
      iconSet: FontAwesome5,
      iconName: "question-circle",
      label: "Quest",
      screen: "QuestScreen",
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
