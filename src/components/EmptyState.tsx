import React from 'react';
import { View } from 'react-native';
import { Heading } from '@gluestack-ui/themed/build/components/Heading';
import { Text } from '@gluestack-ui/themed/build/components/Text';

const EmptyState = () => {
  return (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <Heading size="lg" textAlign="center" color="$textDark900">
        Nenhuma tarefa por aqui
      </Heading>
      <Text size="md" textAlign="center" color="$textLight600" mt="$2">
        Adicione uma nova tarefa para começar sua lista.
      </Text>
    </View>
  );
};

export default EmptyState;
