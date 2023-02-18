import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api, type RouterOutputs } from "../src/utils/api";

// const PostCard: React.FC<{
//   post: RouterOutputs["post"]["all"][number];
//   onDelete: () => void;
// }> = ({ post, onDelete }) => {
//   const router = useRouter();

//   return (
//     <View className="flex flex-row rounded-lg bg-white/10 p-4">
//       <View className="flex-grow">
//         <TouchableOpacity onPress={() => router.push(`/post/${post.id}`)}>
//           <Text className="text-xl font-semibold text-pink-400">
//             {post.title}
//           </Text>
//           <Text className="mt-2 text-white">{post.content}</Text>
//         </TouchableOpacity>
//       </View>
//       <TouchableOpacity onPress={onDelete}>
//         <Text className="font-bold uppercase text-pink-400">Delete</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

const MessageBubble: React.FC<{
  message: RouterOutputs["message"]["all"][number];
}> = ({ message }) => {
  return (
    <View className={`flex ${message.fromUser ? "items-end" : ""}`}>
      <View className="order-2 mx-2 flex max-w-xs flex-col items-start space-y-2 text-xs">
        <Text className="inline-block rounded-lg rounded-bl-none bg-gray-300 px-4 py-2 text-gray-600">
          {message.content}
        </Text>
      </View>
    </View>
  );
};

const CreateMessage: React.FC = () => {
  const utils = api.useContext();

  const [text, setText] = React.useState("");

  const { mutate, error } = api.message.create.useMutation({
    async onSuccess() {
      setText("");
      await utils.message.all.invalidate();
    },
  });

  return (
    <View>
      <TextInput
        className="mb-2 rounded bg-white/10 p-2 text-white"
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
          mutate({
            content: text,
            fromUser: true,
          });
        }}
      >
        <Text className="font-semibold text-white">Send Message</Text>
      </TouchableOpacity>
    </View>
  );
};

const Index = () => {
  const postQuery = api.post.all.useQuery();
  const messageQuery = api.message.all.useQuery();

  // const deleteMessageMutation = api.message.delete.useMutation({
  //   onSettled: () => postQuery.refetch(),
  // });

  return (
    <SafeAreaView className="bg-[#1F104A]">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full p-4">
        <Text className="mx-auto pb-2 text-5xl font-bold text-white">
          Create <Text className="text-pink-400">T3</Text> Turbo
        </Text>

        {/* delete */}
        <Button
          onPress={() => void postQuery.refetch()}
          title="Refresh posts"
          color={"#f472b6"}
        />

        <FlashList
          data={messageQuery.data}
          estimatedItemSize={20}
          ItemSeparatorComponent={() => <View className="h-2" />}
          renderItem={(m) => <MessageBubble message={m.item} />}
        />

        {/* <CreatePost /> */}
        <CreateMessage />
      </View>
    </SafeAreaView>
  );
};

export default Index;
