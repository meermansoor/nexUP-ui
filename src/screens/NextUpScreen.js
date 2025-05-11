import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView
} from 'react-native';

const NextUpScreen = ({ navigation }) => {
  const [task, setTask] = useState('');
  const [description, setDescription] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Add New Task</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Task Title"
            value={task}
            onChangeText={setTask}
            autoCapitalize="none"
          />
          
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Task Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
          
          <TouchableOpacity 
            style={styles.button}
            onPress={() => {
              // Handle task creation
              console.log('Task created:', { task, description });
            }}
          >
            <Text style={styles.buttonText}>Add Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  inputContainer: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NextUpScreen; 