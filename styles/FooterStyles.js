// src/styles/FooterStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  footer: {
    height: 100,
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 5,
    borderColor: "#272b45",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4, // Android Shadow
  },
  iconRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  iconContainer: {
    alignItems: "center",
  },
  iconText: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 4,
  },
});
