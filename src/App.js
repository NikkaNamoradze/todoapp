import React, { useState } from "react";
import styled from "styled-components";
import MoonIcon from "../src/assets/Moon.svg";
import SunIcon from "../src/assets/Sun.svg";
import DropDownIcon from "../src/assets/DropDown.svg";
import AddIcon from "../src/assets/Add.svg";
import SearchIcon from "../src/assets/Search.svg";
import EditIcon from "../src/assets/Edit.svg";
import DeleteIcon from "../src/assets/Delete.svg";
import CheckedIcon from "../src/assets/Check.svg";
import { Modal, ModalContainer } from "./components/Modal";
import EmptyTodos from "../src/assets/Empty.svg";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filterOption, setFilterOption] = useState("All");
  const [editTodoIndex, setEditTodoIndex] = useState(null);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleModal = () => {
    setIsModalVisible((prev) => !prev);
  };

  const saveTodo = () => {
    if (newTodoText.trim() !== "") {
      if (editTodoIndex !== null) {
        const updatedTodos = todos.map((todo, index) =>
          index === editTodoIndex ? { ...todo, todoText: newTodoText } : todo
        );
        setTodos(updatedTodos);
        setEditTodoIndex(null);
      } else {
        setTodos([
          ...todos,
          { isChecked: false, todoText: newTodoText, index: todos.length },
        ]);
      }
      setNewTodoText("");
      toggleModal();
    }
  };

  const handleInputChange = (event) => {
    setNewTodoText(event.target.value);
  };

  const handleCheckboxChange = (index) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo, i) =>
        i === index ? { ...todo, isChecked: !todo.isChecked } : todo
      )
    );
  };

  const deleteTodo = (index) => {
    const updatedTodos = todos.filter((todo, i) => i !== index);
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    const matchesSearch = todo.todoText
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (filterOption === "All") {
      return matchesSearch;
    } else if (filterOption === "Completed") {
      return todo.isChecked && matchesSearch;
    } else if (filterOption === "Incomplete") {
      return !todo.isChecked && matchesSearch;
    }

    return true;
  });

  const handleSearchInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleFilterOption = (option) => {
    setFilterOption(option);
    setShowDropdown(false);
  };

  const openEditModal = (index) => {
    setEditTodoIndex(index);
    setNewTodoText(todos[index].todoText);
    toggleModal();
  };

  return (
    <Container isDarkMode={isDarkMode}>
      <ModalContainer />
      <HeaderTitle isDarkMode={isDarkMode}>TODO LIST</HeaderTitle>
      <Row>
        <SearchContainer>
          <Input
            isDarkMode={isDarkMode}
            placeholder="Search note..."
            value={searchTerm}
            onChange={handleSearchInputChange}
          />
          <SearchIconContainer>
            <img src={SearchIcon} alt="Search Icon" />
          </SearchIconContainer>
        </SearchContainer>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <DropdownButton onClick={toggleDropdown}>
            <AllText>{filterOption}</AllText>
            <img src={DropDownIcon} alt="Dropdown Icon" />
          </DropdownButton>
          {showDropdown && (
            <DropdownMenu>
              <DropdownOption onClick={() => handleFilterOption("All")}>
                All
              </DropdownOption>
              <DropdownOption onClick={() => handleFilterOption("Completed")}>
                Completed
              </DropdownOption>
              <DropdownOption onClick={() => handleFilterOption("Incomplete")}>
                Incomplete
              </DropdownOption>
            </DropdownMenu>
          )}
        </div>

        <IconButton onClick={toggleDarkMode}>
          <img src={isDarkMode ? SunIcon : MoonIcon} alt="Mode Icon" />
        </IconButton>
      </Row>

      {filteredTodos.length === 0 ? (
        <EmptyTodoContainer>
          <EmptyTodoImage src={EmptyTodos} alt="Empty Todos" />
          <EmptyTodoText isDarkMode={isDarkMode}>Empty ...</EmptyTodoText>
        </EmptyTodoContainer>
      ) : (
        filteredTodos.map((todo, index) => (
          <>
            <ToDoRow key={index}>
              <CheckBoxTextWrapper onClick={() => handleCheckboxChange(index)}>
                <CheckBox
                  type="checkbox"
                  checked={todo.isChecked}
                  onChange={() => handleCheckboxChange(index)}
                />
                <CheckBoxWrapper isChecked={todo.isChecked}>
                  {todo.isChecked && (
                    <img src={CheckedIcon} alt="Checked Icon" />
                  )}
                </CheckBoxWrapper>
                <ToDoText isChecked={todo.isChecked} isDarkMode={isDarkMode}>
                  {`${todo.todoText} #${index + 1}`}
                </ToDoText>
              </CheckBoxTextWrapper>
              <IconWrapper>
                <img
                  src={EditIcon}
                  alt="Edit Icon"
                  onClick={() => openEditModal(index)}
                />
                <img
                  src={DeleteIcon}
                  alt="Delete Icon"
                  onClick={() => deleteTodo(index)}
                />
              </IconWrapper>
            </ToDoRow>
            <SeparatorLine />
          </>
        ))
      )}

      <AddButtonContainer>
        <AddButton onClick={toggleModal}>
          <img src={AddIcon} alt="Add Icon" />
        </AddButton>
      </AddButtonContainer>

      <Modal visible={isModalVisible || editTodoIndex !== null}>
        <NoteComponent>
          <Title>New Note</Title>
          <InputModal
            type="text"
            placeholder="Enter your note"
            value={newTodoText}
            onChange={handleInputChange}
          />
          <ButtonWrapper>
            <Button onClick={toggleModal}>Cancel</Button>
            <Button primary onClick={saveTodo}>
              Save
            </Button>
          </ButtonWrapper>
        </NoteComponent>
      </Modal>
    </Container>
  );
}

export default App;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 20px;
  width: 100%;
  height: 100vh; /* Set height to 100% of the viewport height */
  background-color: ${(props) => (props.isDarkMode ? "#252525" : "white")};
  color: ${(props) => (props.isDarkMode ? "white" : "#252525")};
  overflow: auto; /* Enable scrolling if content overflows */
`;

const Row = styled.div`
  width: 70%;
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
  align-items: flex-start;
`;

const DropdownButton = styled.button`
  position: relative; /* Added position relative */
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  background-color: #6c63ff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 38px;
`;

const IconButton = styled.button`
  padding: 10px;
  background-color: #6c63ff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  height: 38px;
  width: 38px;
  justify-content: center;
  align-items: center;
  display: flex;
`;

const AllText = styled.span`
  font-size: 18px;
`;

const AddButtonContainer = styled.div`
  display: flex;
  width: 70%;
  justify-content: flex-end;
  position: absolute;
  bottom: 50px;
`;

const AddButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #6c63ff;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-top: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  border: 1px solid #6c63ff; /* Updated border color */
  border-radius: 5px;
  padding: 8px 16px;
  width: 50%;
  height: 20px;
`;

const Input = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background-color: ${(props) => (props.isDarkMode ? "#252525" : "white")};
`;

const SearchIconContainer = styled.div`
  padding: 4px;
  cursor: pointer;
`;

const HeaderTitle = styled.p`
  color: "black";
  font-size: 26px;
  font-weight: 500;
  line-height: 38.87px;
`;

const ToDoRow = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  width: 50%;
  justify-content: space-between;
`;

const CheckBoxTextWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const CheckBoxWrapper = styled.label`
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => (props.isChecked ? "#6c63ff" : "#6c63ff")};
  border-radius: 4px;
  padding: 6px;
  height: 16px;
  width: 16px;
  transition: border-color 0.3s ease;

  &:hover {
    background-color: ${(props) => (props.isChecked ? "#6c63ff" : "#6c63ff")};
    border-color: ${(props) => (props.isChecked ? "#6c63ff" : "#6c63ff")};
  }
`;

const CheckBox = styled.input`
  display: none;

  &:checked + ${CheckBoxWrapper} {
    background-color: #6c63ff;
  }
`;

const ToDoText = styled.p`
  margin: 0 10px;
  font-size: 20px;
  font-weight: 500;
  color: ${(props) =>
    props.isChecked ? "#ccc" : props.isDarkMode ? "white" : "black"};
  text-decoration: ${(props) => (props.isChecked ? "line-through" : "none")};
  transition: color 0.3s ease, text-decoration 0.3s ease;
`;

const IconWrapper = styled.div`
  display: flex;
  gap: 5px; /* Adjust space between icons */
`;

const SeparatorLine = styled.hr`
  border: none;
  border-top: 1px solid #6c63ff; /* Separator line style */
  width: 50%;
`;

const NoteComponent = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  margin-top: 20px;
`;

const InputModal = styled.input`
  padding: 10px;
  border: 1px solid #6c63ff;
  border-radius: 5px;
  width: -webkit-fill-available;
  margin: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  width: -webkit-fill-available;
  margin: 20px;
  justify-content: space-between;
`;

const Button = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  border-width: 1px;
  border-color: #6c63ff;
  background-color: ${({ primary }) => (primary ? "#6c63ff" : "white")};
  color: ${({ primary }) => (primary ? "white" : "#6c63ff")};
  font-size: 18px;
  font-weight: 500;
`;

const DropdownMenu = styled.div`
  background-color: #fff; /* Dropdown background color */
  border: 1px solid #ccc; /* Dropdown border color */
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  min-width: 100px; /* Adjust width as needed */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Optional shadow effect */
`;

const DropdownOption = styled.div`
  padding: 8px 16px;
  cursor: pointer;
  color: #6c63ff;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const EmptyTodoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
`;

const EmptyTodoImage = styled.img`
  max-width: 200px; /* Adjust the size as needed */
`;

const EmptyTodoText = styled.p`
  font-size: 18px;
  background-color: ${(props) => (props.isDarkMode ? "#252525" : "white")};
  margin-top: 20px;
  font-weight: 400;
`;
