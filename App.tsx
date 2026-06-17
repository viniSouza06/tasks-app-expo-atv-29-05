import './global.css';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, StatusBar as RNStatusBar, Image, ActivityIndicator, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { config } from '@gluestack-ui/config';
import { GluestackUIProvider } from '@gluestack-ui/themed/build/components/Provider';
import { Button, ButtonText } from '@gluestack-ui/themed/build/components/Button';
import { Input, InputField } from '@gluestack-ui/themed/build/components/Input';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
} from '@gluestack-ui/themed/build/components/AlertDialog';
import { Heading } from '@gluestack-ui/themed/build/components/Heading';
import { Text as GluestackText } from '@gluestack-ui/themed/build/components/Text';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';
import { globalStyles } from './src/styles/global';
import AboutScreen from './src/components/AboutScreen';
import LoginScreen from './src/components/LoginScreen';
import SignupScreen from './src/components/SignupScreen';
import { AuthProvider, useAuth } from './src/context/AuthContext';

function AppContent() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState<string | null>(null);
  const [deleteMode, setDeleteMode] = useState<'task' | 'all' | null>(null);
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  const { session: token, signOut: logout, loading: authLoading } = useAuth();
  const [screen, setScreen] = useState<'login' | 'signup'>('login');

  useEffect(() => {
    if (token) {
      getAllTasks(setTasks, setLoading);
    }
  }, [token]);

  const handleLogout = async () => {
    await logout();
    setTasks([]);
  };

  const resetForm = () => {
    setText("");
    setCompleted(false);
    setDueDate(null);
    setPriority('Baixa');
    setIsUpdating(false);
    setTaskId("");
    setModalVisible(false);
  };

  const updateMode = (task: TaskItem) => {
    setIsUpdating(true);
    setTaskId(task._id);
    setText(task.text);
    setCompleted(!!task.completed);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  const handleSave = () => {
    const formattedDate = dueDate ? dueDate.toISOString() : null;
    if (isUpdating) {
      updateTask(taskId, text, completed, formattedDate, setTasks, resetForm);
    } else {
      addTask(text, completed, formattedDate, setTasks, resetForm);
    }
  };

  const openDeleteDialog = (id: string) => {
    setTaskIdToDelete(id);
    setDeleteMode('task');
  };

  const openDeleteAllDialog = () => {
    setTaskIdToDelete(null);
    setDeleteMode('all');
  };

  const closeDeleteDialog = () => {
    setTaskIdToDelete(null);
    setDeleteMode(null);
  };

  const confirmDeleteTask = () => {
    if (deleteMode === 'all') {
      setTasks([]);
    } else if (taskIdToDelete) {
      deleteTask(taskIdToDelete, setTasks);
    }
    closeDeleteDialog();
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  if (authLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-100" style={styles.safeAreaInset}>
        <ActivityIndicator size="large" color="#000000" />
      </SafeAreaView>
    );
  }

  if (!token) {
    if (screen === 'login') {
      return <LoginScreen onNavigateToSignup={() => setScreen('signup')} />;
    }
    return <SignupScreen onNavigateToLogin={() => setScreen('login')} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100" style={styles.safeAreaInset}>
      <View className="flex-1 w-full max-w-[600px] self-center px-4">
        <View style={styles.headerContainer}>
          {logoError ? (
            <Text style={styles.header}>Gerenciador de Tarefas</Text>
          ) : (
            <Image 
              source={require('./assets/task-app-banner.png')} 
              style={styles.logo} 
              onError={() => setLogoError(true)}
            />
          )}
          {!logoError && <Text style={styles.header}>Tarefas</Text>}
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutBtnText}>Sair</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>Total de Tarefas: {tasks.length}</Text>
        </View>

        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'all' ? styles.filterButtonActive : styles.filterButtonInactive]} 
            onPress={() => setFilter('all')}
          >
            <Text style={filter === 'all' ? styles.filterTextActive : styles.filterTextInactive}>Todas</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'completed' ? styles.filterButtonActive : styles.filterButtonInactive]} 
            onPress={() => setFilter('completed')}
          >
            <Text style={filter === 'completed' ? styles.filterTextActive : styles.filterTextInactive}>Concluídas</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, filter === 'pending' ? styles.filterButtonActive : styles.filterButtonInactive]} 
            onPress={() => setFilter('pending')}
          >
            <Text style={filter === 'pending' ? styles.filterTextActive : styles.filterTextInactive}>Pendentes</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <Button
            style={[styles.actionButton, styles.actionButtonAdd]}
            onPress={() => setModalVisible(true)}
          >
            <ButtonText style={styles.actionButtonText}>Nova Tarefa</ButtonText>
          </Button>

          <Button
            style={[styles.actionButton, styles.deleteButton]}
            onPress={openDeleteAllDialog} 
          >
            <ButtonText style={styles.actionButtonText}>Excluir todas</ButtonText>
          </Button>
        </View>

        <View style={styles.aboutButtonContainer}>
          <Button action="secondary" variant="outline" onPress={() => setAboutModalVisible(true)}>
            <ButtonText>Sobre o App</ButtonText>
          </Button>
        </View>

        <TaskList 
          tasks={tasks.filter(t => {
            if (filter === 'completed') return t.completed;
            if (filter === 'pending') return !t.completed;
            return true;
          })} 
          onUpdate={updateMode} 
          onDelete={openDeleteDialog} 
        />

        {loading && (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        )}
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={resetForm}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{isUpdating ? "Editar Tarefa" : "Nova Tarefa"}</Text>
            
            <Input style={styles.modalInput}>
              <InputField
                style={styles.modalInputField}
                placeholder="Nome da tarefa..."
                value={text}
                maxLength={50}
                onChangeText={setText}
              />
            </Input>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Data limite:</Text>
              {Platform.OS === 'web' ? (
                <input 
                  type="date"
                  value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                  onChange={(e: any) => {
                    const val = e.target.value;
                    if (val) {
                      const parts = val.split('-');
                      setDueDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                    } else {
                      setDueDate(null);
                    }
                  }}
                  style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
                />
              ) : (
                <View style={{ flex: 1, marginLeft: 16, alignItems: 'flex-start' }}>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                    <Text>{dueDate ? dueDate.toLocaleDateString() : "Selecionar Data"}</Text>
                  </TouchableOpacity>
                  {showDatePicker && (
                    <DateTimePicker
                      value={dueDate || new Date()}
                      mode="date"
                      display="default"
                      onChange={onChangeDate}
                    />
                  )}
                </View>
              )}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Concluída:</Text>
              <View style={styles.checkboxContainer}>
                <Checkbox
                  value={completed}
                  onValueChange={setCompleted}
                  color={completed ? '#000' : undefined}
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Prioridade:</Text>
              <View style={styles.priorityContainer}>
                {['Baixa', 'Média', 'Alta'].map((p) => (
                  <TouchableOpacity 
                    key={p} 
                    style={[
                      styles.priorityButton, 
                      priority === p && { 
                        backgroundColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
                        borderColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336'
                      }
                    ]}
                    onPress={() => setPriority(p as any)}
                  >
                    <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.modalActions}>
              <Button variant="link" style={styles.modalCancelBtn} onPress={resetForm}>
                <ButtonText style={styles.modalCancelText}>Cancelar</ButtonText>
              </Button>
              <Button
                style={[styles.modalSaveBtn, !text.trim() && styles.modalSaveBtnDisabled]} 
                onPress={handleSave}
                isDisabled={!text.trim()}
              >
                <ButtonText style={styles.modalSaveText}>Salvar</ButtonText>
              </Button>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={aboutModalVisible}
        animationType="slide"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <AboutScreen onClose={() => setAboutModalVisible(false)} />
      </Modal>

      <AlertDialog isOpen={deleteMode !== null} onClose={closeDeleteDialog}>
        <AlertDialogBackdrop />
        <AlertDialogContent style={styles.alertDialogContent}>
          <AlertDialogHeader>
            <Heading size="md">{deleteMode === 'all' ? 'Excluir todas' : 'Excluir tarefa'}</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <GluestackText>
              {deleteMode === 'all'
                ? 'Tem certeza que deseja excluir todas as tarefas?'
                : 'Tem certeza que deseja excluir esta tarefa?'}
            </GluestackText>
          </AlertDialogBody>
          <AlertDialogFooter style={styles.alertDialogFooter}>
            <Button variant="outline" action="secondary" style={styles.alertDialogButton} onPress={closeDeleteDialog}>
              <ButtonText>Cancelar</ButtonText>
            </Button>
            <Button action="negative" style={styles.alertDialogButton} onPress={confirmDeleteTask}>
              <ButtonText>Excluir</ButtonText>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <GluestackUIProvider config={config}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  safeAreaInset: {
    paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    position: 'relative',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
  },
  logoutBtn: {
    position: 'absolute',
    right: 0,
    top: 10,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#ff4d4d',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  logoutBtnText: {
    color: '#ff4d4d',
    fontWeight: 'bold',
    fontSize: 12,
  },
  counterContainer: {
    marginTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterText: {
    fontSize: globalStyles.bodyFontSize,
    color: '#666',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 12,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  filterButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: '#000',
  },
  filterTextActive: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  filterTextInactive: {
    color: '#000',
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  aboutButtonContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  actionButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flex: 1,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  actionButtonAdd: {
    backgroundColor: globalStyles.primaryColor,
    shadowColor: globalStyles.primaryColor,
  },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    shadowColor: '#ff0000',
  },
  loaderContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    zIndex: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 24,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginBottom: 16,
  },
  modalInputField: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkboxContainer: {
    marginLeft: 16,
  },
  priorityContainer: {
    flexDirection: 'row',
    flex: 1,
    marginLeft: 16,
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  priorityText: {
    color: '#333',
  },
  priorityTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  datePickerBtn: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
  },
  modalCancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  modalCancelText: {
    color: '#666',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalSaveBtn: {
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  modalSaveBtnDisabled: {
    backgroundColor: '#ccc',
  },
  modalSaveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  alertDialogContent: {
    width: '90%',
    maxWidth: 360,
    borderRadius: 8,
    padding: 20,
  },
  alertDialogFooter: {
    gap: 12,
    marginTop: 8,
  },
  alertDialogButton: {
    minWidth: 96,
  },
});
