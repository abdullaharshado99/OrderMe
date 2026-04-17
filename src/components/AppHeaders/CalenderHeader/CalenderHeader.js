import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { moderateScale } from "react-native-size-matters";
import NativeText from "../../AppTexts/NativeText";
import { styles } from "./styles";

const VIEWS = [
  { key: "day", label: "calenderScreen.day" },
  { key: "week", label: "calenderScreen.week" },
  { key: "month", label: "calenderScreen.month" },
];

const CalenderHeader = ({
  activeView = "day",
  onViewChange,
  currentDateLabel = "",
  onPrevDate,
  onNextDate,
  totalEvents = 0,
  needConfirmation = 0,
  onAdd,
}) => {
  const android16 = Platform.Version > 34;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topRow,
          { marginTop: android16 ? moderateScale(30) : Platform.OS === 'ios' ? moderateScale(35) : 0 },
        ]}
      >
        <View style={styles.titleRow}>
          <View style={{ width: 24, height: 24 }} />
          <NativeText value="calenderScreen.title" style={styles.title} />
        </View>
        <TouchableOpacity onPress={onAdd} style={styles.addBtn}>
          <View style={{ width: 24, height: 24 }} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabRow}>
        {VIEWS.map(({ key, label }) => (
          <TouchableOpacity
            key={key}
            onPress={() => onViewChange && onViewChange(key)}
            style={[
              styles.tabBtn,
              activeView === key ? styles.tabBtnActive : styles.tabBtnInactive,
            ]}
          >
            <NativeText
              value={label}
              style={[
                styles.tabLabel,
                activeView === key && styles.tabLabelActive,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.dateNavRow}>
        <TouchableOpacity onPress={onPrevDate} style={styles.arrowBtn}>
          <View style={[styles.arrowLeft, { width: 24, height: 24 }]} />
        </TouchableOpacity>
        <NativeText style={styles.dateLabel}>{currentDateLabel}</NativeText>
        <TouchableOpacity onPress={onNextDate} style={styles.arrowBtn}>
          <View style={[styles.arrowRight, { width: 24, height: 24 }]} />
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <NativeText style={styles.statsText}>{`${totalEvents} `}</NativeText>
        <NativeText
          value="calenderScreen.totalEvents"
          style={styles.statsText}
        />
        <NativeText style={styles.statsDot}>{" \u2022 "}</NativeText>
        <NativeText style={styles.statsText}>
          {`${needConfirmation} `}
        </NativeText>
        <NativeText
          value="calenderScreen.needConfirmation"
          style={styles.statsText}
        />
      </View>
    </View>
  );
};

export default CalenderHeader;
