import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TaskItem as TaskType } from '../utils/handle-api';

interface TaskItemProps {
  task: TaskType;
  updateMode: () => void;
  deleteTask: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, updateMode, deleteTask }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <View className="mt-3 flex-row items-center justify-between rounded-lg bg-white px-5 py-4 shadow-sm">
      <View className="mr-3 flex-1">
        <Text className={`text-base ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
          {task.text}
        </Text>
        {task.dueDate && (
          <Text className={`mt-1 text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
            Até: {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View className="flex-row gap-3">
        <TouchableOpacity className="rounded-md bg-gray-900 p-2" onPress={updateMode} accessibilityRole="button">
          <Feather name="edit" size={18} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity className="rounded-md bg-red-500 p-2" onPress={deleteTask} accessibilityRole="button">
          <AntDesign name="delete" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskItem;
