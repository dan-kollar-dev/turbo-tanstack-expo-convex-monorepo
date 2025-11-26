import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ScrollView,
  Switch,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@repo/convex-client/api';
import { Id } from '@repo/convex-client/dataModel';
import { Link } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function TasksScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const tasks = useQuery(api.tasks.listTasks);
  const createTask = useMutation(api.tasks.createTask);
  const updateTask = useMutation(api.tasks.updateTask);
  const deleteTask = useMutation(api.tasks.deleteTask);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await createTask({
        title: title.trim(),
        description: description.trim() || undefined,
      });
      setTitle('');
      setDescription('');
    } catch (error) {
      Alert.alert('Error', 'Failed to create task');
    }
  };

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      await updateTask({
        id: id as Id<'tasks'>,
        completed: !completed,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const startEdit = (task: {
    _id: string;
    title: string;
    description?: string;
  }) => {
    setEditingId(task._id);
    setEditTitle(task.title);
    setEditDescription(task.description || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    try {
      await updateTask({
        id: id as Id<'tasks'>,
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      });
      cancelEdit();
    } catch (error) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Task', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTask({ id: id as Id<'tasks'> });
          } catch (error) {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  };

  const theme = Colors[colorScheme ?? 'light'];

  if (tasks === undefined) {
    return (
      <ThemedView
        style={[styles.container, { paddingTop: Math.max(insets.top, 16) }]}
      >
        <ThemedText type="title" style={styles.title}>
          Tasks
        </ThemedText>
        <ThemedText>Loading tasks...</ThemedText>
      </ThemedView>
    );
  }

  const renderTask = ({ item: task }: { item: (typeof tasks)[0] }) => {
    if (editingId === task._id) {
      return (
        <ThemedView style={styles.taskCard}>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.tabIconDefault },
            ]}
            value={editTitle}
            onChangeText={setEditTitle}
            placeholder="Task title"
            placeholderTextColor={theme.tabIconDefault}
          />
          <TextInput
            style={[
              styles.textArea,
              { color: theme.text, borderColor: theme.tabIconDefault },
            ]}
            value={editDescription}
            onChangeText={setEditDescription}
            placeholder="Description (optional)"
            placeholderTextColor={theme.tabIconDefault}
            multiline
            numberOfLines={3}
          />
          <View style={styles.editActions}>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={() => handleSaveEdit(task._id)}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={cancelEdit}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ThemedView>
      );
    }

    return (
      <ThemedView style={styles.taskCard}>
        <View style={styles.taskHeader}>
          <View style={styles.taskContent}>
            <Switch
              value={task.completed}
              onValueChange={() =>
                handleToggleComplete(task._id, task.completed)
              }
              trackColor={{ false: theme.tabIconDefault, true: theme.tint }}
              thumbColor={theme.background}
            />
            <View style={styles.taskTextContainer}>
              <Text
                style={[
                  styles.taskTitle,
                  {
                    color: task.completed ? theme.tabIconDefault : theme.text,
                    textDecorationLine: task.completed
                      ? 'line-through'
                      : 'none',
                  },
                ]}
              >
                {task.title}
              </Text>
              {task.description && (
                <Text
                  style={[
                    styles.taskDescription,
                    {
                      color: theme.tabIconDefault,
                      textDecorationLine: task.completed
                        ? 'line-through'
                        : 'none',
                    },
                  ]}
                >
                  {task.description}
                </Text>
              )}
              <Text style={[styles.taskDate, { color: theme.tabIconDefault }]}>
                {new Date(task._creationTime).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.taskActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: theme.tint }]}
            onPress={() => startEdit(task)}
          >
            <Text style={styles.actionButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#ef4444' }]}
            onPress={() => handleDelete(task._id)}
          >
            <Text style={styles.actionButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: Math.max(insets.top, 16) },
        ]}
      >
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            Tasks
          </ThemedText>
          <Link href="/">
            <ThemedText type="link">Back to Home</ThemedText>
          </Link>
        </View>

        {/* Create Task Form */}
        <ThemedView style={styles.formCard}>
          <ThemedText type="subtitle" style={styles.formTitle}>
            Create New Task
          </ThemedText>
          <TextInput
            style={[
              styles.input,
              { color: theme.text, borderColor: theme.tabIconDefault },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Task title *"
            placeholderTextColor={theme.tabIconDefault}
          />
          <TextInput
            style={[
              styles.textArea,
              { color: theme.text, borderColor: theme.tabIconDefault },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Description (optional)"
            placeholderTextColor={theme.tabIconDefault}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[
              styles.button,
              styles.createButton,
              { backgroundColor: theme.tint },
            ]}
            onPress={handleCreate}
          >
            <Text style={styles.buttonText}>Create Task</Text>
          </TouchableOpacity>
        </ThemedView>

        {/* Tasks List */}
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          All Tasks ({tasks.length})
        </ThemedText>

        {tasks.length === 0 ? (
          <ThemedView style={styles.emptyState}>
            <ThemedText style={styles.emptyText}>
              No tasks yet. Create your first task above!
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={tasks}
            renderItem={renderTask}
            keyExtractor={(item) => item._id}
            scrollEnabled={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  formCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
  },
  formTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  createButton: {
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 20,
    fontWeight: '600',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  emptyText: {
    textAlign: 'center',
    opacity: 0.6,
  },
  listContent: {
    gap: 12,
  },
  taskCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  taskHeader: {
    marginBottom: 12,
  },
  taskContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  taskTextContainer: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    marginBottom: 4,
  },
  taskDate: {
    fontSize: 12,
    marginTop: 4,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#22c55e',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#6b7280',
  },
});
