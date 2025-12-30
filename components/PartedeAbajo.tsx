import { View, Pressable, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Link, usePathname } from "expo-router";

type TabItemProps = {
  href: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
};

const TabItem = ({ href, icon, label, active }: TabItemProps) => {
  return (
    <Link href={href} asChild>
      <Pressable>
        {({ pressed }) => (
          <View
            className={`
              mb-1 rounded-xl p-1
              ${pressed ? "bg-white/5" : ""}
              ${active ? "bg-[#A855F7]/20" : ""}
            `}
          >
            <Ionicons
              name={icon}
              size={26}
              color={active ? "#A855F7" : "#A0A0A0"}
            />

            <Text
              className={`
                mx-auto text-[12px] font-semibold
                ${active ? "text-[#A855F7]" : "text-[#8e8ea0]"}
              `}
            >
              {label}
            </Text>
          </View>
        )}
      </Pressable>
    </Link>
  );
};

export const ParteDeAbajo = () => {
  const pathname = usePathname();

  return (
    <View>
      <View className="flex-row items-center justify-center gap-10 mb-[15%] mt-1">

        <TabItem
          href="/history"
          icon="time-outline"
          label="Latest"
          active={pathname === "/history"}
        />

        <TabItem
          href="/about"
          icon="add"
          label="New"
          active={pathname === "/about"}
        />

        <TabItem
          href="/person"
          icon="person-outline"
          label="Profile"
          active={pathname === "/person"}
        />

      </View>
    </View>
  );
};
