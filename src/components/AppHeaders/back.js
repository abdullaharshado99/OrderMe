import React from "react";
import { TouchableOpacity, View } from "react-native";
function BackHeader({ onBack,marginleft ,margintop}) {
  return (
    <View style={{ padding: 10, flexDirection: "row", alignItems: "center" ,marginLeft:marginleft,marginTop:margintop}}>
      <TouchableOpacity onPress={onBack}>
        <View style={{ width: 24, height: 24 }} />
      </TouchableOpacity>
    </View>
  );
}

export default BackHeader;
