import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api, type RouterOutputs } from "../src/utils/api";

const MessageBubble: React.FC<{
  message: RouterOutputs["message"]["all"][number];
}> = ({ message }) => {
  return (
    <View className={`flex ${message.fromUser ? "items-end" : ""}`}>
      <View className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
        <Text
          className={`inline-block rounded-lg rounded-bl-none px-4 py-2 text-gray-600 ${
            message.fromUser ? "bg-blue-300" : "bg-gray-300"
          }`}
        >
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const CreateMessage: React.FC = () => {
  const utils = api.useContext();

  const [text, setText] = React.useState("");

  const { mutate: userMutate, error } =
    api.message.createUserMessage.useMutation({
      async onSuccess() {
        setText("");
        await utils.message.all.invalidate();
      },
    });
  const { mutate: botMutate } = api.message.createBotMessage.useMutation();

  return (
    <View>
      <TextInput
        className="mb-2 rounded bg-gray-300 p-2 text-black"
        value={text}
        onChangeText={setText}
      />
      {error?.data?.zodError?.fieldErrors.title && (
        <Text className="mb-2 text-red-500">
          {error.data.zodError.fieldErrors.title}
        </Text>
      )}
      <TouchableOpacity
        className="rounded bg-pink-400 p-2"
        onPress={() => {
          userMutate({
            content: text,
          });
          botMutate({
            content: text,
          });
        }}
      >
        <Text className="font-semibold text-white">Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const Index = () => {
  const messageQuery = api.message.all.useQuery();

  const { mutate: deleteAllMutate } = api.message.deleteAll.useMutation({
    onSettled: () => messageQuery.refetch(),
  });

  return (
    <SafeAreaView className="bg-[#ffffff]">
      <Stack.Screen options={{ title: "Promptable Chat" }} />
      <View className="h-full w-full p-4">
        <Button
          onPress={() => void deleteAllMutate()}
          title="Reset chat"
          color={"#f472b6"}
        />

        <FlashList
          data={messageQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(m) => <MessageBubble message={m.item} />}
        />

        <CreateMessage />
      </View>
    </SafeAreaView>
  );
};

export default Index;
