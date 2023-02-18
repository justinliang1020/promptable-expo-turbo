import React from "react";
import { View } from "react-native";

const Header = () => {
  return (
    <View className="flex h-16 flex-row items-center bg-green-900">
      <View className="flex h-16 w-full flex-row items-center justify-between bg-green-900 p-2">
        <h1>hello</h1>
      </View>
    </View>
  );
};

export default Header;
