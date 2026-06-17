import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskProps {
  text: string;
  updateMode: () => void;
  deleteTask: () => void;
}

const Task: React.FC<TaskProps> = ({ text, updateMode, deleteTask }) => {
  return (
    <View className="mt-4 flex-row items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm">
      <Text className="mr-4 flex-1 text-base text-gray-900">{text}</Text>
      <View className="flex-row gap-3">
        <TouchableOpacity className="rounded-md bg-gray-900 p-2" onPress={updateMode}>
          <Feather name="edit" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity className="rounded-md bg-red-500 p-2" onPress={deleteTask}>
          <AntDesign name="delete" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;
