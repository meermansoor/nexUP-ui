import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
  Modal
} from 'react-native';
import { Calendar as RNCalendar } from 'react-native-calendars';

const API_URL = 'http://192.168.1.6:5500/api/projects';

const NextUpScreen = ({ navigation }) => {
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showStartCalendar, setShowStartCalendar] = useState(false);
  const [showEndCalendar, setShowEndCalendar] = useState(false);

  const handleAddProject = async () => {
    if (!projectName.trim()) {
      Alert.alert('Error', 'Please enter a project name');
      return;
    }

    if (!startDate || !endDate) {
      Alert.alert('Error', 'Please select both start and end dates');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      Alert.alert('Error', 'End date cannot be before start date');
      return;
    }

    setIsLoading(true);
    try {
      console.log('Attempting to connect to:', `${API_URL}/create`);
      console.log('Sending data:', {
        name: projectName,
        description: description,
        startDate: startDate,
        endDate: endDate,
        status: 'active'
      });

      const response = await fetch(`${API_URL}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: projectName,
          description: description,
          startDate: startDate,
          endDate: endDate,
          status: 'active'
        }),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (response.status === 201) {
        Alert.alert('Success', 'Project created successfully');
        setProjectName('');
        setDescription('');
        setStartDate('');
        setEndDate('');
      } else {
        Alert.alert('Error', data.message || 'Failed to create project');
      }
    } catch (error) {
      console.error('Add project error details:', error);
      Alert.alert(
        'Connection Error',
        'Failed to connect to server. Please check:\n\n' +
        '1. Server is running on port 5500\n' +
        '2. API endpoint is correct\n' +
        '3. Network connection is stable'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateSelect = (date, type) => {
    const formattedDate = date.dateString;
    
    if (type === 'start') {
      // If end date exists and is before the new start date, clear it
      if (endDate && new Date(endDate) < new Date(formattedDate)) {
        setEndDate('');
      }
      setStartDate(formattedDate);
      setShowStartCalendar(false);
    } else {
      // Validate that end date is not before start date
      if (startDate && new Date(formattedDate) < new Date(startDate)) {
        Alert.alert('Error', 'End date cannot be before start date');
        return;
      }
      setEndDate(formattedDate);
      setShowEndCalendar(false);
    }
  };

  const getMarkedDates = () => {
    const marked = {};
    if (startDate) {
      marked[startDate] = { selected: true, selectedColor: '#007AFF', startingDay: true };
    }
    if (endDate) {
      marked[endDate] = { selected: true, selectedColor: '#007AFF', endingDay: true };
    }
    return marked;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Create New Project</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={projectName}
            onChangeText={setProjectName}
            autoCapitalize="none"
          />
          
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Project Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity 
            style={[styles.dateInput, startDate && styles.dateInputSelected]}
            onPress={() => setShowStartCalendar(true)}
          >
            <Text style={[styles.dateInputText, startDate && styles.dateInputTextSelected]}>
              {startDate || 'Select Start Date'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.dateInput, endDate && styles.dateInputSelected]}
            onPress={() => setShowEndCalendar(true)}
          >
            <Text style={[styles.dateInputText, endDate && styles.dateInputTextSelected]}>
              {endDate || 'Select End Date'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleAddProject}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? 'Creating...' : 'Create Project'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showStartCalendar}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <RNCalendar
              onDayPress={(date) => handleDateSelect(date, 'start')}
              markedDates={getMarkedDates()}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                todayTextColor: '#007AFF',
                arrowColor: '#007AFF',
                dotColor: '#007AFF',
                selectedDayBackgroundColor: '#007AFF',
              }}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowStartCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showEndCalendar}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.calendarContainer}>
            <RNCalendar
              onDayPress={(date) => handleDateSelect(date, 'end')}
              markedDates={getMarkedDates()}
              minDate={startDate || new Date().toISOString().split('T')[0]}
              theme={{
                todayTextColor: '#007AFF',
                arrowColor: '#007AFF',
                dotColor: '#007AFF',
                selectedDayBackgroundColor: '#007AFF',
              }}
            />
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setShowEndCalendar(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  dateInput: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    justifyContent: 'center',
  },
  dateInputSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  dateInputText: {
    fontSize: 16,
    color: '#666',
  },
  dateInputTextSelected: {
    color: '#007AFF',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  calendarContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '90%',
    maxWidth: 400,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NextUpScreen; 