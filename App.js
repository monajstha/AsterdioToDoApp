/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import type {Node} from 'react';
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CheckBox from '@react-native-community/checkbox';

/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's
 * LTI update could not be added via codemod */
const Section = ({children, title}): Node => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [toDoList, setToDoList] = useState([]);
  const [listInput, setListInput] = useState('');
  const [editedText, setEditedText] = useState('');
  const [editId, setEditId] = useState(0);

  console.log('actual list', toDoList);

  let asyncList;
  useEffect(() => {
    const getAsyncValue = async () => {
      try {
        const response = await AsyncStorage.getItem('list');
        if (response !== null) {
          asyncList = JSON.parse(response);
          setToDoList(asyncList);
          console.log('response', asyncList);
        }
      } catch (err) {
        console.log('async', err);
      }
    };
    getAsyncValue();
  }, []);

  const addToTheList = item => {
    if (listInput !== '') {
      let listObj = {};
      (listObj.value = item), (listObj.completed = false);
      listObj.id = listInput.length + 1;
      let list = [...toDoList, listObj];
      setToDoList([...toDoList, listObj]);
      let writeInAsync = AsyncStorage.setItem('list', JSON.stringify(list));
      setListInput('');
    }
  };

  const deleteFromList = id => {
    let modifiedList = toDoList.filter(item => item.id !== id);
    console.log('modified', modifiedList);
    let writeInAsync = AsyncStorage.setItem(
      'list',
      JSON.stringify(modifiedList),
    );
    setToDoList(modifiedList);
  };

  const editFromList = id => {
    setEditId(id);
    // setToDoList([...toDoList, ])
  };

  const saveEdit = id => {
    let index = toDoList.findIndex(item => item.id === id);
    let nonEditingItem = toDoList.filter(item => item.id !== id);
    setToDoList(prevstate => [
      (prevstate[index] = {
        ...prevstate[index],
        value: editedText,
      }),
      ...nonEditingItem,
    ]);
    // toDoList[index].value = editedText
    // console.log('id', id);
    // let toBeEdited = toDoList.filter(item => item.id === id);
    // let nonEditingItem = toDoList.filter(item => item.id !== id);
    // console.log('editing', toBeEdited, nonEditingItem);
    // toBeEdited[0].value = editedText;
    // let index = toDoList.findIndex(item => item.id === id);
    // let finalArr = [
    //   ...nonEditingItem,
    //   ...(toDoList[index] = toBeEdited.flat()),
    // ];
    setEditId(0);
    // setToDoList(finalArr);
    // const writeInAsync = AsyncStorage.setItem('list', JSON.stringify(finalArr));
  };

  const listCompleted = (id, value) => {
    let index = toDoList.findIndex(item => item.id === id);
    let nonEditingItem = toDoList.filter(item => item.id !== id);
    setToDoList(prevstate => [
      (prevstate[index] = {
        ...prevstate[index],
        completed: true,
      }),
      ...toDoList,
    ]);
    let newArr = toDoList;

    newArr[index] = {
      ...newArr[index],
      completed: true,
    };
    const writeInAsync = AsyncStorage.setItem('list', JSON.stringify(finalArr));
  };

  const backgroundStyle = {
    backgroundColor: Colors.lighter,
  };

  const renderList = ({item, index}) => {
    console.log('index', item, index);
    return (
      <View style={styles.itemView}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <CheckBox
            disabled={false}
            value={item.completed}
            onValueChange={newValue => listCompleted(item.id, newValue)}
          />
          {editId === item.id ? (
            <TextInput
              editable={true}
              placeholder={item.value}
              value={editedText || item.value}
              onChangeText={text => setEditedText(text)}
              style={styles.itemText}
            />
          ) : (
            <Text style={{color: 'black'}}>{item.value}</Text>
          )}
        </View>
        <View style={styles.buttonWrapper}>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => editFromList(item.id)}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>

          {editId === item.id ? (
            <TouchableOpacity
              style={styles.editBtn}
              onPress={() => saveEdit(item.id)}>
              <Text style={styles.editBtnText}>Save</Text>
            </TouchableOpacity>
          ) : (
            void 0
          )}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => deleteFromList(item.id)}>
            <Text style={styles.editBtnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        {/* <Header /> */}
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}></View>
        <TextInput
          style={[
            styles.textInput,
            {
              color: isDarkMode ? 'white' : 'black',
            },
          ]}
          value={listInput}
          placeholder="Enter your to do title"
          placeholderTextColor="#8F8F8F"
          onChangeText={text => setListInput(text)}
        />
        <View style={{width: '100%', alignItems: 'center', marginBottom: 15}}>
          <TouchableOpacity
            style={[styles.addBtn, {backgroundColor: '#E3E3E3'}]}
            onPress={() => addToTheList(listInput)}>
            <Text
              style={{
                color: 'black',
              }}>
              Add Item
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={toDoList}
          renderItem={renderList}
          keyExtractor={item => item.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  textInput: {
    borderColor: '#E3E3E3',
    borderWidth: 1,
    paddingLeft: 16,
    borderRadius: 4,
    height: 50,
  },
  addBtn: {
    width: '80%',
    height: 46,
    alignItems: 'center',
    borderRadius: 30,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  itemView: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'black',
    // backgroundColor: 'red',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginVertical: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    color: 'black',
  },
  editBtn: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    marginHorizontal: 3,
  },
  editBtnText: {
    color: 'black',
  },
  buttonWrapper: {
    flexDirection: 'row',
  },
});

export default App;
