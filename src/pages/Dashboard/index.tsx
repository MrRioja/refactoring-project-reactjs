import { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import api from "../../services/api";
import { Food, IFood } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";
import { FoodsContainer } from "./styles";

const Dashboard = (): JSX.Element => {
  const [foods, setFoods] = useState<IFood[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<IFood>({} as IFood);

  async function handleAddFood(food: IFood) {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods((prevState) => [...prevState, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: IFood) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen((prevState) => !prevState);
  }

  function toggleEditModal() {
    setEditModalOpen((prevState) => !prevState);
  }

  function handleEditFood(food: IFood) {
    toggleEditModal();
    setEditingFood(food);
  }

  useEffect(() => {
    async function loadFoods() {
      const response = await api.get("/foods");

      setFoods(response.data);
    }

    loadFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export { Dashboard };
